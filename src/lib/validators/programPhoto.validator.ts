import { z } from 'zod';

export const programPhotoInputSchema = z.object({
  fileUrl: z
    .string()
    .trim()
    .min(1, 'Foto wajib diisi.'),

  caption: z
    .string()
    .trim()
    .max(150, 'Caption maksimal 150 karakter.')
    .optional()
    .nullable(),
});