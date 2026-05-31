import { z } from 'zod';

export const getRekapQuerySchema = z.object({
  bulan: z.string().regex(/^\d+$/).optional().transform(Number),
  tahun: z.string().regex(/^\d+$/).optional().transform(Number),
  idDepartemen: z.string().regex(/^\d+$/).optional().transform(Number),
  idPegawai: z.string().regex(/^\d+$/).optional().transform(Number),
  search: z.string().optional(),
});

export const manualInputSchema = z.object({
  idPegawai: z.number({ required_error: 'Pegawai harus dipilih' }).int().positive(),
  tanggal: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Format tanggal tidak valid' }),
  status: z.enum(['hadir', 'izin', 'sakit', 'cuti', 'alpha', 'libur'], { required_error: 'Status harus diisi' }),
  jamMasuk: z.string().optional().nullable(),
  jamKeluar: z.string().optional().nullable(),
  keterangan: z.string().optional().nullable(),
});

export const validasiSchema = z.object({
  status: z.enum(['hadir', 'izin', 'sakit', 'cuti', 'alpha', 'libur']).optional(),
  jamMasuk: z.string().optional().nullable(),
  jamKeluar: z.string().optional().nullable(),
  keterangan: z.string().optional().nullable(),
  isValidated: z.boolean().optional(),
});

export const validasiMassalSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, 'Pilih minimal satu data absensi'),
});
