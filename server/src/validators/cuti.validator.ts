import { z } from 'zod';

export const createCutiSchema = z.object({
  jenisCuti: z.enum(['tahunan', 'sakit', 'melahirkan', 'lainnya'], {
    required_error: 'Jenis cuti harus diisi',
    invalid_type_error: 'Jenis cuti tidak valid'
  }),
  tanggalMulai: z.string({ required_error: 'Tanggal mulai harus diisi' }).refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal mulai tidak valid'
  }),
  tanggalSelesai: z.string({ required_error: 'Tanggal selesai harus diisi' }).refine((date) => !isNaN(Date.parse(date)), {
    message: 'Format tanggal selesai tidak valid'
  }),
  jumlahHari: z.number({ required_error: 'Jumlah hari harus diisi' }).min(1, 'Jumlah hari minimal 1'),
  alasan: z.string({ required_error: 'Alasan harus diisi' }).min(5, 'Alasan minimal 5 karakter')
});

export const approveCutiSchema = z.object({
  status: z.enum(['disetujui', 'ditolak'], {
    required_error: 'Status harus diisi',
    invalid_type_error: 'Status tidak valid'
  }),
  catatanAdmin: z.string().optional()
});

export const getCutiQuerySchema = z.object({
  status: z.enum(['pending', 'disetujui', 'ditolak']).optional(),
  idPegawai: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  bulan: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  tahun: z.string().optional().transform(val => val ? parseInt(val) : undefined)
});
