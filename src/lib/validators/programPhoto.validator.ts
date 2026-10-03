import { z } from 'zod';

// Validasi input foto program. "programId" tidak disertakan di sini dengan
// alasan yang sama seperti programSpeciesData.validator.ts -- selalu datang
// dari parameter URL, bukan body.
export const programPhotoInputSchema = z.object({
  fileUrl: z.string().trim().url('URL foto tidak valid.'),
  caption: z.string().trim().max(150, 'Caption maksimal 150 karakter.').optional().nullable(),
});