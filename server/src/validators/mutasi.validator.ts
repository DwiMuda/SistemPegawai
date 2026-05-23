import { z } from 'zod';

export const createMutasiSchema = z.object({
  body: z.object({
    idPegawai: z.number({ required_error: 'Pegawai wajib diisi' }),
    idJabatanBaru: z.number({ required_error: 'Jabatan baru wajib diisi' }),
    idDepartemenBaru: z.number().optional(),
    tanggal: z.string({ required_error: 'Tanggal wajib diisi' }).datetime(),
    alasan: z.string().min(5, 'Alasan minimal 5 karakter'),
    jenisMutasi: z.enum(['promosi', 'demosi', 'rotasi', 'transfer'], { required_error: 'Jenis mutasi wajib dipilih' })
  })
});

export type CreateMutasiInput = z.infer<typeof createMutasiSchema>['body'];
