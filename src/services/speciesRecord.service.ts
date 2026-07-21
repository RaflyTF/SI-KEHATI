import { speciesRecordRepository } from '@/repositories/speciesRecord.repository';
import { calculateSpeciesIndex } from '@/services/biodiversityIndex.service';
import { recordAuditLog } from '@/services/audit.service';
import { prisma } from '@/lib/prisma';
import { speciesRecordInputSchema, type SpeciesRecordInput } from '@/lib/validators/speciesRecord.validator';

// Petugas Lapangan menginput data baru -> selalu berstatus "draft" (FR-02 pada SRS).
export async function submitSpeciesRecord(input: SpeciesRecordInput, userId: string) {
  const parsed = speciesRecordInputSchema.parse(input);
  const record = await speciesRecordRepository.create({ ...parsed, inputBy: userId });

  await recordAuditLog({
    userId,
    aksi: 'create',
    tabelTerkait: 'species_records',
    dataSesudah: record,
  });

  return record;
}

// Admin menyetujui data -> memicu perhitungan ulang Indeks Shannon-Wiener
// untuk SELURUH data published pada periode yang sama (karena N/total berubah).
export async function verifySpeciesRecord(recordId: string, adminId: string) {
  const before = await speciesRecordRepository.findById(recordId);
  if (!before) throw new Error('Data tidak ditemukan.');

  await speciesRecordRepository.updateStatus(recordId, 'published', { verifiedBy: adminId });

  await recalculateIndexForPeriod(before.periodId);

  const after = await speciesRecordRepository.findById(recordId);

  await recordAuditLog({
    userId: adminId,
    aksi: 'publish',
    tabelTerkait: 'species_records',
    dataSebelum: before,
    dataSesudah: after,
  });

  return after;
}

export async function rejectSpeciesRecord(recordId: string, adminId: string, catatanRevisi: string) {
  const before = await speciesRecordRepository.findById(recordId);
  if (!before) throw new Error('Data tidak ditemukan.');

  const after = await speciesRecordRepository.updateStatus(recordId, 'rejected', {
    verifiedBy: adminId,
    catatanRevisi,
  });

  await recordAuditLog({
    userId: adminId,
    aksi: 'reject',
    tabelTerkait: 'species_records',
    dataSebelum: before,
    dataSesudah: after,
  });

  return after;
}

// Menghitung ulang Pi, ln(Pi), dan H' untuk semua data published pada satu periode.
// Dipanggil setiap kali ada data baru yang dipublikasikan pada periode tersebut,
// karena total individu (N) berubah dan memengaruhi Pi seluruh spesies di periode itu.
async function recalculateIndexForPeriod(periodId: string) {
  const publishedRecords = await prisma.speciesRecord.findMany({
    where: { periodId, status: 'published' },
  });

  const totalN = publishedRecords.reduce(
    (sum: number, r: (typeof publishedRecords)[number]) => sum + r.jumlahIndividu,
    0
  );

  // $transaction menjalankan seluruh upsert sebagai satu unit atomik --
  // kalau salah satu gagal, SEMUA dibatalkan, sehingga H' pada periode ini
  // tidak pernah berada dalam kondisi "sebagian sudah baru, sebagian masih lama".
  const upserts = publishedRecords.map((record: (typeof publishedRecords)[number]) => {
    const { pi, lnPi, hValue } = calculateSpeciesIndex(record.jumlahIndividu, totalN);
    return prisma.biodiversityIndex.upsert({
      where: { speciesRecordId: record.id },
      update: { pi, lnPi, hValue, calculatedAt: new Date() },
      create: { speciesRecordId: record.id, pi, lnPi, hValue },
    });
  });

  await prisma.$transaction(upserts);
}

// Dipakai HANYA oleh halaman publik (Status Flora & Fauna).
export function getPublishedSpeciesRecords() {
  return speciesRecordRepository.findPublished();
}

export function getPendingSpeciesRecords() {
  return speciesRecordRepository.findByStatus('pending');
}
