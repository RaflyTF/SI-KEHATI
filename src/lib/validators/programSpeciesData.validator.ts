import { z } from 'zod';

// Validasi input "Data Pendukung" program (ProgramSpeciesData) -- setiap
// baris merepresentasikan 1 spesies pada 1 periode/tahun untuk 1 program
// tertentu. "programId" SENGAJA tidak disertakan di sini -- nilainya selalu
// datang dari parameter URL (/api/programs/[id]/species-data), bukan dari
// body yang dikirim client, supaya tidak ada 2 sumber kebenaran yang bisa
// tidak sinkron. Duplikasi kombinasi programId+speciesId+periodId sudah
// dicegah di level database lewat @@unique pada schema.prisma (Tahap 1).
export const programSpeciesDataInputSchema = z.object({
  speciesId: z.string().uuid({ message: 'Spesies wajib dipilih.' }),
  periodId: z.string().uuid({ message: 'Periode/tahun wajib dipilih.' }),
  jumlahIndividu: z
    .number({ invalid_type_error: 'Jumlah individu harus berupa angka.' })
    .int('Jumlah individu harus bilangan bulat.')
    .min(0, 'Jumlah individu tidak boleh negatif.'),
});

// Untuk edit: hanya jumlahIndividu yang bisa diubah -- speciesId/periodId
// SENGAJA tidak diizinkan ikut berubah lewat endpoint update. Alasan:
// mengubah spesies/periode pada baris yang sudah ada secara konsep sama
// dengan "membuat data baru", bukan mengoreksi data lama (beda dari
// mengoreksi jumlahIndividu yang salah ketik). Kalau admin memang perlu
// mengganti spesies/periode, alurnya: hapus baris lama, tambah baris baru --
// supaya jejak audit tetap jelas ("baris X dihapus" + "baris Y dibuat"),
// bukan "baris X diam-diam berubah jadi merepresentasikan spesies lain".
export const programSpeciesDataUpdateSchema = z.object({
  jumlahIndividu: z
    .number({ invalid_type_error: 'Jumlah individu harus berupa angka.' })
    .int('Jumlah individu harus bilangan bulat.')
    .min(0, 'Jumlah individu tidak boleh negatif.'),
});