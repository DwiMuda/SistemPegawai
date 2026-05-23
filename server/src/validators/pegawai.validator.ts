import { z } from 'zod';

export const getPegawaiQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().transform(Number),
  limit: z.string().regex(/^\d+$/).optional().transform(Number),
  search: z.string().optional(),
  idDepartemen: z.string().regex(/^\d+$/).optional().transform(Number),
  idJabatan: z.string().regex(/^\d+$/).optional().transform(Number),
  statusPegawai: z.string().optional(),
});

export const createPegawaiSchema = z.object({
  nip: z.string().min(3, 'NIP minimal 3 karakter').max(50, 'NIP maksimal 50 karakter'),
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
  jenisKelamin: z.enum(['L', 'P'], { required_error: 'Jenis kelamin harus L atau P' }),
  tanggalLahir: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Format tanggal lahir tidak valid' }),
  tempatLahir: z.string().min(3, 'Tempat lahir minimal 3 karakter'),
  alamat: z.string().min(5, 'Alamat minimal 5 karakter'),
  noTelpon: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  idJabatan: z.number({ required_error: 'Jabatan harus diisi' }).int().positive(),
  idDepartemen: z.number({ required_error: 'Departemen harus diisi' }).int().positive(),
  tanggalMasuk: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Format tanggal masuk tidak valid' }),
  statusPegawai: z.enum(['aktif', 'cuti', 'nonaktif']).optional(),
  foto: z.string().optional(),
  buatAkun: z.boolean().optional(),
});

export const updatePegawaiSchema = createPegawaiSchema.partial();
