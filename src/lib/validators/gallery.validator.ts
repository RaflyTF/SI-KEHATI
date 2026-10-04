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

// import { z } from 'zod';

// export const galleryInputSchema = z.object({
//   judul: z.string().trim().min(3, 'Judul foto minimal 3 karakter.').max(150),
//   fileUrl: z.string().trim().url('URL foto tidak valid.'),
//   categoryId: z.string().uuid('Kategori wajib dipilih.'),
// });

// // Untuk update: seluruh field opsional (partial update).
// export const galleryUpdateSchema = galleryInputSchema.partial();

// export const galleryCategoryInputSchema = z.object({
//   namaKategori: z.string().trim().min(2, 'Nama kategori minimal 2 karakter.').max(100),
// });


import { z } from 'zod';

export const galleryInputSchema = z.object({
  judul: z
    .string()
    .trim()
    .min(3, 'Judul foto minimal 3 karakter.')
    .max(150),

  fileUrl: z
    .string()
    .trim()
    .refine(
      (value) => {
        // Menerima URL lengkap, misalnya:
        // https://example.com/foto.jpg
        try {
          new URL(value);
          return true;
        } catch {
          // Jika bukan URL lengkap, izinkan path lokal
          // seperti /uploads/gallery/foto.jpg
          return value.startsWith('/uploads/gallery/');
        }
      },
      {
        message: 'URL foto tidak valid.',
      }
    ),

  categoryId: z.string().uuid('Kategori wajib dipilih.'),
});

// Untuk update: seluruh field opsional (partial update).
export const galleryUpdateSchema = galleryInputSchema.partial();

export const galleryCategoryInputSchema = z.object({
  namaKategori: z
    .string()
    .trim()
    .min(2, 'Nama kategori minimal 2 karakter.')
    .max(100),
});