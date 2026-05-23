import { z } from 'zod';

export const createDepartemenSchema = z.object({
  body: z.object({
    namaDepartemen: z
      .string({ required_error: 'Nama departemen wajib diisi' })
      .min(3, 'Nama departemen minimal 3 karakter')
      .max(100, 'Nama departemen maksimal 100 karakter'),
    kodeDepartemen: z
      .string({ required_error: 'Kode departemen wajib diisi' })
      .min(2, 'Kode departemen minimal 2 karakter')
      .max(10, 'Kode departemen maksimal 10 karakter')
      .transform((val) => val.toUpperCase()),
    idKepala: z.number().int().positive().optional().nullable(),
  }),
});

export const updateDepartemenSchema = z.object({
  body: z.object({
    namaDepartemen: z
      .string()
      .min(3, 'Nama departemen minimal 3 karakter')
      .max(100, 'Nama departemen maksimal 100 karakter')
      .optional(),
    kodeDepartemen: z
      .string()
      .min(2, 'Kode departemen minimal 2 karakter')
      .max(10, 'Kode departemen maksimal 10 karakter')
      .transform((val) => val.toUpperCase())
      .optional(),
    idKepala: z.number().int().positive().optional().nullable(),
  }),
});
