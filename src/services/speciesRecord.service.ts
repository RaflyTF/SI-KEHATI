import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';
import { calculateSpeciesIndex } from '@/services/biodiversityIndex.service';
import { Prisma, RecordStatus } from '@prisma/client';

export async function getSpeciesRecords(filters?: {
  periodId?: string;
  speciesId?: string;
  status?: RecordStatus;
  userId?: string;
  role?: string;
  scope?: string;
}) {
  const where: Prisma.SpeciesRecordWhereInput = {};

  if (filters?.periodId) where.periodId = filters.periodId;
  if (filters?.speciesId) where.speciesId = filters.speciesId;
  if (filters?.status) where.status = filters.status;

  // Jika permintaan berasal dari "Riwayat Data Saya" (scope=mine)
  if (filters?.scope === 'mine' && filters?.userId) {
    where.inputBy = filters.userId;
  } else if (filters?.role === 'petugas_lapangan' && filters?.userId) {
    // Di luar menu data pribadi, petugas lapangan hanya melihat miliknya atau yang sudah published
    where.OR = [
      { inputBy: filters.userId },
      { status: 'published' },
    ];
  }

  return prisma.speciesRecord.findMany({
    where,
    include: {
      species: true,
      period: true,
      index: true,
      inputter: {
        select: { id: true, nama: true, email: true, role: true },
      },
      verifier: {
        select: { id: true, nama: true, email: true },
      },
    },
    orderBy: [
      { period: { tahun: 'desc' } },
      { createdAt: 'desc' },
    ],
  });
}

export async function getSpeciesRecordById(id: string) {
  return prisma.speciesRecord.findUnique({
    where: { id },
    include: {
      species: true,
      period: true,
      index: true,
      inputter: {
        select: { id: true, nama: true, email: true, role: true },
      },
      verifier: {
        select: { id: true, nama: true, email: true },
      },
    },
  });
}

export async function getPublishedSpeciesRecords() {
  return prisma.speciesRecord.findMany({
    where: { status: 'published' },
    include: {
      species: true,
      period: true,
      index: true,
    },
    orderBy: [
      { period: { tahun: 'desc' } },
      { createdAt: 'desc' },
    ],
  });
}

export async function createSpeciesRecord(
  data: {
    speciesId: string;
    periodId: string;
    jumlahIndividu: number;
    status?: RecordStatus;
  },
  userId: string
) {
  const record = await prisma.speciesRecord.create({
    data: {
      speciesId: data.speciesId,
      periodId: data.periodId,
      jumlahIndividu: data.jumlahIndividu,
      status: data.status ?? 'draft',
      inputBy: userId,
    },
    include: {
      species: true,
      period: true,
    },
  });

  await recordAuditLog({
    userId,
    aksi: 'create',
    tabelTerkait: 'species_records',
    dataSesudah: record,
  });

  return record;
}

export async function updateSpeciesRecord(
  id: string,
  data: Partial<{
    speciesId: string;
    periodId: string;
    jumlahIndividu: number;
    status: RecordStatus;
    catatanRevisi: string | null;
  }>,
  userId: string,
  role?: string
) {
  const before = await prisma.speciesRecord.findUnique({ where: { id } });
  if (!before) throw new Error('Data rekaman tidak ditemukan.');

  // Petugas lapangan hanya boleh mengubah data inputannya sendiri
  if (role === 'petugas_lapangan' && before.inputBy !== userId) {
    throw new Error('Tidak memiliki izin untuk mengubah rekaman ini.');
  }

  const after = await prisma.speciesRecord.update({
    where: { id },
    data,
    include: {
      species: true,
      period: true,
      index: true,
    },
  });

  await recordAuditLog({
    userId,
    aksi: 'update',
    tabelTerkait: 'species_records',
    dataSebelum: before,
    dataSesudah: after,
  });

  return after;
}

export async function deleteSpeciesRecord(
  id: string,
  userId: string,
  role?: string
) {
  const before = await prisma.speciesRecord.findUnique({ where: { id } });
  if (!before) throw new Error('Data rekaman tidak ditemukan.');

  // Petugas lapangan hanya boleh menghapus data inputannya sendiri
  if (role === 'petugas_lapangan' && before.inputBy !== userId) {
    throw new Error('Tidak memiliki izin untuk menghapus rekaman ini.');
  }

  await prisma.speciesRecord.delete({ where: { id } });

  await recordAuditLog({
    userId,
    aksi: 'delete',
    tabelTerkait: 'species_records',
    dataSebelum: before,
  });

  return before;
}

export async function submitForVerification(id: string, userId: string) {
  const existing = await prisma.speciesRecord.findUnique({ where: { id } });
  if (!existing) throw new Error('Data rekaman tidak ditemukan.');

  if (existing.inputBy !== userId) {
    throw new Error('Anda hanya dapat mengajukan data yang Anda input sendiri.');
  }

  const updated = await prisma.speciesRecord.update({
    where: { id },
    data: { status: 'pending', catatanRevisi: null },
  });

  await recordAuditLog({
    userId,
    aksi: 'update',
    tabelTerkait: 'species_records',
    dataSebelum: existing,
    dataSesudah: updated,
  });

  return updated;
}

export async function verifyRecord(id: string, verifierId: string) {
  const existing = await prisma.speciesRecord.findUnique({
    where: { id },
    include: { period: true },
  });
  if (!existing) throw new Error('Data rekaman tidak ditemukan.');

  const totalInPeriod = await prisma.speciesRecord.aggregate({
    where: {
      periodId: existing.periodId,
      status: { in: ['pending', 'published'] },
    },
    _sum: { jumlahIndividu: true },
  });

  const totalN = (totalInPeriod._sum.jumlahIndividu ?? 0) || existing.jumlahIndividu;
  const indexCalc = calculateSpeciesIndex(existing.jumlahIndividu, totalN);

  const updated = await prisma.speciesRecord.update({
    where: { id },
    data: {
      status: 'published',
      verifiedBy: verifierId,
      catatanRevisi: null,
      index: {
        upsert: {
          create: {
            pi: indexCalc.pi,
            lnPi: indexCalc.lnPi,
            hValue: indexCalc.hValue,
          },
          update: {
            pi: indexCalc.pi,
            lnPi: indexCalc.lnPi,
            hValue: indexCalc.hValue,
          },
        },
      },
    },
    include: { index: true },
  });

  await recordAuditLog({
    userId: verifierId,
    aksi: 'publish',
    tabelTerkait: 'species_records',
    dataSebelum: existing,
    dataSesudah: updated,
  });

  return updated;
}

export async function rejectRecord(id: string, catatanRevisi: string, verifierId: string) {
  const existing = await prisma.speciesRecord.findUnique({ where: { id } });
  if (!existing) throw new Error('Data rekaman tidak ditemukan.');

  const updated = await prisma.speciesRecord.update({
    where: { id },
    data: {
      status: 'rejected',
      catatanRevisi,
      verifiedBy: verifierId,
    },
  });

  await recordAuditLog({
    userId: verifierId,
    aksi: 'reject',
    tabelTerkait: 'species_records',
    dataSebelum: existing,
    dataSesudah: updated,
  });

  return updated;
}