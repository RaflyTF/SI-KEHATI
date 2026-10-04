import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';

export async function createProgramSpeciesData(
  programId: string,
  data: { speciesId: string; periodId: string; jumlahIndividu: number },
  actorId: string
) {
  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (!program) throw new Error('Program tidak ditemukan.');

  const species = await prisma.species.findUnique({ where: { id: data.speciesId } });
  if (!species) throw new Error('Spesies tidak ditemukan.');

  const period = await prisma.monitoringPeriod.findUnique({ where: { id: data.periodId } });
  if (!period) throw new Error('Periode monitoring tidak ditemukan.');

  const existing = await prisma.programSpeciesData.findUnique({
    where: {
      programId_speciesId_periodId: { programId, speciesId: data.speciesId, periodId: data.periodId },
    },
  });
  if (existing) {
    throw new Error(
      `Data untuk spesies "${species.namaLokal}" pada periode ini sudah ada. Edit baris yang sudah ada, bukan menambah baru.`
    );
  }

  const created = await prisma.programSpeciesData.create({
    data: { programId, speciesId: data.speciesId, periodId: data.periodId, jumlahIndividu: data.jumlahIndividu },
    include: { species: true, period: true },
  });

  await recordAuditLog({
    userId: actorId,
    aksi: 'create',
    tabelTerkait: 'program_species_data',
    dataSesudah: created,
  });

  return created;
}

export async function updateProgramSpeciesData(id: string, jumlahIndividu: number, actorId: string) {
  const before = await prisma.programSpeciesData.findUnique({
    where: { id },
    include: { species: true, period: true },
  });
  if (!before) throw new Error('Data tidak ditemukan.');

  const after = await prisma.programSpeciesData.update({
    where: { id },
    data: { jumlahIndividu },
    include: { species: true, period: true },
  });

  await recordAuditLog({
    userId: actorId,
    aksi: 'update',
    tabelTerkait: 'program_species_data',
    dataSebelum: before,
    dataSesudah: after,
  });

  return after;
}

// Dipakai juga oleh dialog konfirmasi hapus di frontend (Tahap 6) untuk
// menampilkan info transparan (nama spesies, periode, jumlah) SEBELUM
// admin menekan konfirmasi -- meski di kasus ini frontend biasanya sudah
// punya data barisnya di memori (dari tabel yang sedang ditampilkan),
// fungsi ini tetap disediakan sebagai sumber kebenaran resmi jika suatu
// saat dibutuhkan pengecekan ulang dari server.
export function getProgramSpeciesDataById(id: string) {
  return prisma.programSpeciesData.findUnique({
    where: { id },
    include: { species: true, period: true, program: { select: { id: true, nama: true } } },
  });
}

export async function deleteProgramSpeciesData(id: string, actorId: string) {
  const before = await prisma.programSpeciesData.findUnique({
    where: { id },
    include: { species: true, period: true },
  });
  if (!before) throw new Error('Data tidak ditemukan.');

  await prisma.programSpeciesData.delete({ where: { id } });

  await recordAuditLog({
    userId: actorId,
    aksi: 'delete',
    tabelTerkait: 'program_species_data',
    dataSebelum: before,
  });
}