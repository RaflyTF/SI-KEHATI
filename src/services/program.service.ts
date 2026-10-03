// import { prisma } from '@/lib/prisma';
// import { recordAuditLog } from '@/services/audit.service';

// export function getPublishedPrograms() {
//   return prisma.program.findMany({
//     where: { status: 'published' },
//     include: { photos: true },
//     orderBy: { createdAt: 'desc' },
//   });
// }

// export function getProgramById(id: string) {
//   return prisma.program.findUnique({
//     where: { id },
//     include: { photos: true, speciesData: { include: { species: true, period: true } } },
//   });
// }

// export async function createProgram(
//   data: { nama: string; deskripsi: string; anggaran: number; status: 'draft' | 'published' },
//   userId: string
// ) {
//   const program = await prisma.program.create({ data: { ...data, createdBy: userId } });
//   await recordAuditLog({ userId, aksi: 'create', tabelTerkait: 'programs', dataSesudah: program });
//   return program;
// }

// export async function updateProgram(
//   id: string,
//   data: Partial<{ nama: string; deskripsi: string; anggaran: number; status: 'draft' | 'published' }>,
//   userId: string
// ) {
//   const before = await prisma.program.findUnique({ where: { id } });
//   const after = await prisma.program.update({ where: { id }, data });
//   await recordAuditLog({
//     userId,
//     aksi: 'update',
//     tabelTerkait: 'programs',
//     dataSebelum: before,
//     dataSesudah: after,
//   });
//   return after;
// }

// export async function deleteProgram(id: string, userId: string) {
//   const before = await prisma.program.findUnique({ where: { id } });
//   await prisma.program.delete({ where: { id } });
//   await recordAuditLog({ userId, aksi: 'delete', tabelTerkait: 'programs', dataSebelum: before });
// }


// Kode Baru

import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';

export function getPublishedPrograms() {
  return prisma.program.findMany({
    where: { status: 'published' },
    include: { photos: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function getAllPrograms() {
  return prisma.program.findMany({
    include: {
      creator: { select: { nama: true } },
      _count: { select: { photos: true, speciesData: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Dipakai untuk 2 kebutuhan sekaligus: (1) halaman Detail, dan (2) menampilkan
// info transparan sebelum konfirmasi hapus (nama, status, pembuat, jumlah data
// terkait) -- sesuai requirement "Transparansi Data" pada Sprint 2.
export function getProgramById(id: string) {
  return prisma.program.findUnique({
    where: { id },
    include: {
      photos: true,
      speciesData: { include: { species: true, period: true } },
      creator: { select: { nama: true, email: true } },
    },
  });
}

export async function createProgram(
  data: { nama: string; deskripsi: string; anggaran: number; status: 'draft' | 'published' },
  userId: string
) {
  const program = await prisma.program.create({ data: { ...data, createdBy: userId } });
  await recordAuditLog({ userId, aksi: 'create', tabelTerkait: 'programs', dataSesudah: program });
  return program;
}

export async function updateProgram(
  id: string,
  data: Partial<{ nama: string; deskripsi: string; anggaran: number; status: 'draft' | 'published' }>,
  userId: string
) {
  const before = await prisma.program.findUnique({ where: { id } });
  if (!before) throw new Error('Program tidak ditemukan.');
  const after = await prisma.program.update({ where: { id }, data });
  await recordAuditLog({
    userId,
    aksi: 'update',
    tabelTerkait: 'programs',
    dataSebelum: before,
    dataSesudah: after,
  });
  return after;
}

export async function deleteProgram(id: string, userId: string) {
  // Snapshot lengkap (termasuk jumlah data terkait) disimpan ke audit log
  // SEBELUM dihapus, supaya riwayat "apa yang sebenarnya hilang" tetap
  // tertelusuri meskipun row aslinya sudah tidak ada di database.
  const before = await prisma.program.findUnique({
    where: { id },
    include: { _count: { select: { photos: true, speciesData: true } } },
  });
  if (!before) throw new Error('Program tidak ditemukan.');

  // onDelete: Cascade pada skema Prisma akan otomatis menghapus seluruh
  // ProgramPhoto & ProgramSpeciesData terkait dalam satu operasi atomik
  // di level database -- tidak perlu dihapus manual satu per satu di sini.
  await prisma.program.delete({ where: { id } });

  await recordAuditLog({ userId, aksi: 'delete', tabelTerkait: 'programs', dataSebelum: before });
}