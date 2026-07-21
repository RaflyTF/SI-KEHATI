import { z } from 'zod';

export const programInputSchema = z.object({
  nama: z.string().trim().min(3, 'Nama program minimal 3 karakter.').max(150),
  deskripsi: z.string().trim().min(10, 'Deskripsi minimal 10 karakter.'),
  anggaran: z
    .number({ invalid_type_error: 'Anggaran harus berupa angka.' })
    .min(0, 'Anggaran tidak boleh negatif.'),
  status: z.enum(['draft', 'published']).default('draft'),
});

// Untuk update, seluruh field bersifat opsional (partial update).
export const programUpdateSchema = programInputSchema.partial();
