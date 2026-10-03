// import { speciesRecordRepository } from '@/repositories/speciesRecord.repository';
// import { calculateSpeciesIndex } from '@/services/biodiversityIndex.service';
// import { recordAuditLog } from '@/services/audit.service';
// import { prisma } from '@/lib/prisma';
// import { speciesRecordInputSchema, type SpeciesRecordInput } from '@/lib/validators/speciesRecord.validator';

// // Petugas Lapangan menginput data baru -> selalu berstatus "draft" (FR-02 pada SRS).
// export async function submitSpeciesRecord(input: SpeciesRecordInput, userId: string) {
//   const parsed = speciesRecordInputSchema.parse(input);
//   const record = await speciesRecordRepository.create({ ...parsed, inputBy: userId });

//   await recordAuditLog({
//     userId,
//     aksi: 'create',
//     tabelTerkait: 'species_records',
//     dataSesudah: record,
//   });

//   return record;
// }

// // Admin menyetujui data -> memicu perhitungan ulang Indeks Shannon-Wiener
// // untuk SELURUH data published pada periode yang sama (karena N/total berubah).
// export async function verifySpeciesRecord(recordId: string, adminId: string) {
//   const before = await speciesRecordRepository.findById(recordId);
//   if (!before) throw new Error('Data tidak ditemukan.');

//   await speciesRecordRepository.updateStatus(recordId, 'published', { verifiedBy: adminId });

//   await recalculateIndexForPeriod(before.periodId);

//   const after = await speciesRecordRepository.findById(recordId);

//   await recordAuditLog({
//     userId: adminId,
//     aksi: 'publish',
//     tabelTerkait: 'species_records',
//     dataSebelum: before,
//     dataSesudah: after,
//   });

//   return after;
// }

// export async function rejectSpeciesRecord(recordId: string, adminId: string, catatanRevisi: string) {
//   const before = await speciesRecordRepository.findById(recordId);
//   if (!before) throw new Error('Data tidak ditemukan.');

//   const after = await speciesRecordRepository.updateStatus(recordId, 'rejected', {
//     verifiedBy: adminId,
//     catatanRevisi,
//   });

//   await recordAuditLog({
//     userId: adminId,
//     aksi: 'reject',
//     tabelTerkait: 'species_records',
//     dataSebelum: before,
//     dataSesudah: after,
//   });

//   return after;
// }

// // Menghitung ulang Pi, ln(Pi), dan H' untuk semua data published pada satu periode.
// // Dipanggil setiap kali ada data baru yang dipublikasikan pada periode tersebut,
// // karena total individu (N) berubah dan memengaruhi Pi seluruh spesies di periode itu.
// async function recalculateIndexForPeriod(periodId: string) {
//   const publishedRecords = await prisma.speciesRecord.findMany({
//     where: { periodId, status: 'published' },
//   });

//   const totalN = publishedRecords.reduce(
//     (sum: number, r: (typeof publishedRecords)[number]) => sum + r.jumlahIndividu,
//     0
//   );

//   // $transaction menjalankan seluruh upsert sebagai satu unit atomik --
//   // kalau salah satu gagal, SEMUA dibatalkan, sehingga H' pada periode ini
//   // tidak pernah berada dalam kondisi "sebagian sudah baru, sebagian masih lama".
//   const upserts = publishedRecords.map((record: (typeof publishedRecords)[number]) => {
//     const { pi, lnPi, hValue } = calculateSpeciesIndex(record.jumlahIndividu, totalN);
//     return prisma.biodiversityIndex.upsert({
//       where: { speciesRecordId: record.id },
//       update: { pi, lnPi, hValue, calculatedAt: new Date() },
//       create: { speciesRecordId: record.id, pi, lnPi, hValue },
//     });
//   });

//   await prisma.$transaction(upserts);
// }

// // Dipakai HANYA oleh halaman publik (Status Flora & Fauna).
// export function getPublishedSpeciesRecords() {
//   return speciesRecordRepository.findPublished();
// }

// export function getPendingSpeciesRecords() {
//   return speciesRecordRepository.findByStatus('pending');
// }

// Kode Baru

import { speciesRecordRepository } from '@/repositories/speciesRecord.repository';
import { calculateSpeciesIndex } from '@/services/biodiversityIndex.service';
import { recordAuditLog } from '@/services/audit.service';
import { prisma } from '@/lib/prisma';
import { speciesRecordInputSchema, type SpeciesRecordInput } from '@/lib/validators/speciesRecord.validator';

// Petugas Lapangan menginput data baru -> selalu berstatus "pending" (FR-02 pada SRS).
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

// Edit data monitoring -- aturan akses BERBEDA tergantung role (dicek di sini,
// bukan cuma di API route, supaya aturan bisnis tidak bisa dilewati kalau
// service ini suatu saat dipanggil dari tempat lain):
// - Petugas Lapangan: HANYA boleh edit data MILIK SENDIRI, dan HANYA selama
//   status masih "pending" atau "rejected" (belum/tidak lagi published).
//   Mengedit data "rejected" otomatis mengembalikan status ke "pending"
//   (alur pengajuan ulang setelah revisi).
// - Admin/Super Admin: boleh edit data siapa pun, status apa pun -- tapi
//   kalau datanya sudah "published", Indeks Shannon-Wiener periode terkait
//   WAJIB dihitung ulang karena jumlahIndividu bisa berubah.
export async function updateSpeciesRecord(
  id: string,
  data: Partial<{ speciesId: string; periodId: string; jumlahIndividu: number }>,
  actorId: string,
  actorRole: string
) {
  const before = await speciesRecordRepository.findById(id);
  if (!before) throw new Error('Data tidak ditemukan.');

  if (actorRole === 'petugas_lapangan') {
    if (before.inputBy !== actorId) throw new Error('Anda hanya dapat mengedit data milik sendiri.');
    if (before.status !== 'pending' && before.status !== 'rejected') {
      throw new Error('Data yang sudah diverifikasi tidak dapat diedit oleh Petugas Lapangan.');
    }
  }

  const resetToPending = actorRole === 'petugas_lapangan' && before.status === 'rejected';
  const wasPublished = before.status === 'published';

  await speciesRecordRepository.update(id, data);
  if (resetToPending) {
    await speciesRecordRepository.updateStatus(id, 'pending', { verifiedBy: null, catatanRevisi: null });
  }

  if (wasPublished) {
    await recalculateIndexForPeriod(before.periodId);
  }

  const after = await speciesRecordRepository.findById(id);

  await recordAuditLog({
    userId: actorId,
    aksi: 'update',
    tabelTerkait: 'species_records',
    dataSebelum: before,
    dataSesudah: after,
  });

  return after;
}

// Hapus data monitoring -- BERBEDA dengan updateSpeciesRecord: hak hapus
// sengaja dibatasi lebih ketat daripada hak edit, karena menghapus adalah
// aksi paling final (meski sudah ada cascade & audit log, datanya tetap
// hilang dari tabel utama).
// - Petugas Lapangan: HANYA data MILIK SENDIRI, HANYA status "pending"/"rejected".
// - Admin: TIDAK BOLEH menghapus (hanya boleh verifikasi/tolak/edit).
// - Super Admin: boleh menghapus data siapa pun, status apa pun.
export async function deleteSpeciesRecord(id: string, actorId: string, actorRole: string) {
  const before = await speciesRecordRepository.findById(id);
  if (!before) throw new Error('Data tidak ditemukan.');

  if (actorRole === 'petugas_lapangan') {
    if (before.inputBy !== actorId) throw new Error('Anda hanya dapat menghapus data milik sendiri.');
    if (before.status !== 'pending' && before.status !== 'rejected') {
      throw new Error('Data yang sudah diverifikasi tidak dapat dihapus oleh Petugas Lapangan.');
    }
  } else if (actorRole !== 'super_admin') {
    throw new Error('Hanya Super Admin yang dapat menghapus data monitoring.');
  }

  const wasPublished = before.status === 'published';
  const periodId = before.periodId;

  // onDelete: Cascade pada BiodiversityIndex akan otomatis menghapus baris
  // indeks terkait dalam satu operasi atomik di level database.
  await speciesRecordRepository.delete(id);

  if (wasPublished) {
    await recalculateIndexForPeriod(periodId);
  }

  await recordAuditLog({ userId: actorId, aksi: 'delete', tabelTerkait: 'species_records', dataSebelum: before });
}

// Menghitung ulang Pi, ln(Pi), dan H' untuk semua data published pada satu periode.
// Dipanggil setiap kali ada data yang dipublikasikan/diubah/dihapus pada periode
// tersebut, karena total individu (N) berubah dan memengaruhi Pi seluruh spesies
// di periode itu.
async function recalculateIndexForPeriod(periodId: string) {
  const publishedRecords = await prisma.speciesRecord.findMany({
    where: { periodId, status: 'published' },
  });

  const totalN = publishedRecords.reduce(
    (sum: number, r: (typeof publishedRecords)[number]) => sum + r.jumlahIndividu,
    0
  );

  if (totalN === 0) return;

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

export function getSpeciesRecordById(id: string) {
  return speciesRecordRepository.findById(id);
}

// Riwayat submission MILIK SATU pengguna (dipakai halaman Data Monitoring),
// lintas semua status -- ini memperbaiki bug lama di mana Petugas Lapangan
// tidak bisa melihat submission-nya sendiri karena endpoint status=pending
// khusus dibatasi untuk Admin/Super Admin.
export function getMySpeciesRecords(userId: string, status?: 'draft' | 'pending' | 'published' | 'rejected') {
  return speciesRecordRepository.findByOwner(userId, status);
}

// Dipakai HANYA oleh halaman publik (Status Flora & Fauna).
export function getPublishedSpeciesRecords() {
  return speciesRecordRepository.findPublished();
}

// Dipakai HANYA oleh halaman Verifikasi (Admin/Super Admin) -- menampilkan
// SELURUH data pending lintas pengguna, bukan cuma milik sendiri.
export function getPendingSpeciesRecords() {
  return speciesRecordRepository.findByStatus('pending');
}