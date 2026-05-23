import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username wajib diisi'),
    password: z.string().min(1, 'Password wajib diisi'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Password lama wajib diisi'),
    newPassword: z.string()
      .min(8, 'Password baru minimal 8 karakter')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password baru harus mengandung kombinasi huruf dan angka'),
  }),
});
