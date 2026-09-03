import { z } from 'zod';

export const userInputSchema = z.object({
  nama: z.string().trim().min(3, 'Nama minimal 3 karakter.').max(100),
  email: z.string().trim().email('Format email tidak valid.'),
  // Minimal 8 karakter, mengandung huruf dan angka -- kebijakan password dasar
  // sesuai Security Design pada SDD (menghindari password lemah seperti "123456").
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .regex(/[A-Za-z]/, 'Password harus mengandung huruf.')
    .regex(/[0-9]/, 'Password harus mengandung angka.'),
  role: z.enum(['petugas_lapangan', 'admin', 'super_admin'], {
    errorMap: () => ({ message: 'Role tidak valid.' }),
  }),
});

// Untuk update: nama/email/role saja (password diganti lewat endpoint
// reset-password terpisah, bukan lewat update biasa).
export const userUpdateSchema = z.object({
  nama: z.string().trim().min(3, 'Nama minimal 3 karakter.').max(100).optional(),
  email: z.string().trim().email('Format email tidak valid.').optional(),
  role: z
    .enum(['petugas_lapangan', 'admin', 'super_admin'], { errorMap: () => ({ message: 'Role tidak valid.' }) })
    .optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .regex(/[A-Za-z]/, 'Password harus mengandung huruf.')
    .regex(/[0-9]/, 'Password harus mengandung angka.'),
});