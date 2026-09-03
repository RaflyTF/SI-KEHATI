// import { z } from 'zod';

// export const galleryInputSchema = z.object({
//   judul: z.string().trim().min(3, 'Judul foto minimal 3 karakter.').max(150),
//   fileUrl: z.string().trim().url('URL foto tidak valid.'),
//   categoryId: z.string().uuid('Kategori wajib dipilih.'),
// });

// export const galleryCategoryInputSchema = z.object({
//   namaKategori: z.string().trim().min(2, 'Nama kategori minimal 2 karakter.').max(100),
// });

// Kode Baru

import { z } from 'zod';

export const galleryInputSchema = z.object({
  judul: z.string().trim().min(3, 'Judul foto minimal 3 karakter.').max(150),
  fileUrl: z.string().trim().url('URL foto tidak valid.'),
  categoryId: z.string().uuid('Kategori wajib dipilih.'),
});

// Untuk update: seluruh field opsional (partial update).
export const galleryUpdateSchema = galleryInputSchema.partial();

export const galleryCategoryInputSchema = z.object({
  namaKategori: z.string().trim().min(2, 'Nama kategori minimal 2 karakter.').max(100),
});