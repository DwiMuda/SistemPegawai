import { z } from 'zod';

export const generatePenggajianSchema = z.object({
  body: z.object({
    bulan: z.number().min(1).max(12),
    tahun: z.number().min(2000).max(2100)
  })
});

export const updateKomponenSchema = z.object({
  body: z.object({
    bonus: z.number().min(0).optional(),
    potonganLain: z.number().min(0).optional(),
    keterangan: z.string().optional().nullable()
  })
});

export const bayarGajiSchema = z.object({
  body: z.object({
    tanggalPembayaran: z.string().datetime()
  })
});

export const bayarMassalSchema = z.object({
  body: z.object({
    ids: z.array(z.number()).min(1),
    tanggalPembayaran: z.string().datetime()
  })
});

export const getPenggajianQuerySchema = z.object({
  query: z.object({
    bulan: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    tahun: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    idPegawai: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    idDepartemen: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    status: z.enum(['pending', 'dibayar', 'batal', '']).optional()
  })
});
