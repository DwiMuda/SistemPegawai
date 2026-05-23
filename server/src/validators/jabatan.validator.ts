import { z } from 'zod';

export const createJabatanSchema = z.object({
  body: z.object({
    namaJabatan: z
      .string({ required_error: 'Nama jabatan wajib diisi' })
      .min(3, 'Nama jabatan minimal 3 karakter')
      .max(100, 'Nama jabatan maksimal 100 karakter'),
    deskripsi: z.string().optional(),
    gajiPokokDefault: z
      .number({ required_error: 'Gaji pokok wajib diisi' })
      .positive('Gaji pokok harus lebih dari 0'),
    tunjanganDefault: z.number().min(0, 'Tunjangan tidak boleh negatif').default(0),
  }),
});

export const updateJabatanSchema = z.object({
  body: z.object({
    namaJabatan: z
      .string()
      .min(3, 'Nama jabatan minimal 3 karakter')
      .max(100, 'Nama jabatan maksimal 100 karakter')
      .optional(),
    deskripsi: z.string().optional(),
    gajiPokokDefault: z.number().positive('Gaji pokok harus lebih dari 0').optional(),
    tunjanganDefault: z.number().min(0, 'Tunjangan tidak boleh negatif').optional(),
  }),
});
