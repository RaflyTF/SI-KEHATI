import { z } from 'zod';

// Validasi input data monitoring — dipakai baik di sisi client (form)
// maupun sisi server (API route), sesuai Security Design pada SDD:
// "validasi server tidak boleh dilewati".
export const speciesRecordInputSchema = z.object({
  speciesId: z.string().uuid({ message: 'Spesies wajib dipilih.' }),
  periodId: z.string().uuid({ message: 'Periode monitoring wajib dipilih.' }),
  jumlahIndividu: z
    .number({ invalid_type_error: 'Jumlah individu harus berupa angka.' })
    .int('Jumlah individu harus bilangan bulat.')
    .min(0, 'Jumlah individu tidak boleh negatif.'),
});

export type SpeciesRecordInput = z.infer<typeof speciesRecordInputSchema>;

export const rejectRecordSchema = z.object({
  catatanRevisi: z.string().min(5, 'Catatan revisi minimal 5 karakter.'),
});
