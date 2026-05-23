import { z } from 'zod';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // HH:mm format

export const ajukanLemburSchema = z.object({
  body: z.object({
    tanggal: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Format tanggal tidak valid" }),
    jamMulai: z.string().regex(timeRegex, { message: "Format jam mulai harus HH:mm" }),
    jamSelesai: z.string().regex(timeRegex, { message: "Format jam selesai harus HH:mm" }),
    keterangan: z.string().min(3, { message: "Keterangan minimal 3 karakter" })
  })
}).refine(data => {
  // Validate that jamSelesai is after jamMulai (assuming same day)
  const mulaiParts = data.body.jamMulai.split(':').map(Number);
  const selesaiParts = data.body.jamSelesai.split(':').map(Number);
  const mulaiMins = mulaiParts[0] * 60 + mulaiParts[1];
  let selesaiMins = selesaiParts[0] * 60 + selesaiParts[1];
  
  // If finish is earlier than start, assume it crosses midnight
  if (selesaiMins < mulaiMins) {
    selesaiMins += 24 * 60;
  }
  
  return selesaiMins > mulaiMins;
}, { message: "Jam selesai harus setelah jam mulai", path: ['body', 'jamSelesai'] });

export const approveLemburSchema = z.object({
  body: z.object({
    status: z.enum(['disetujui', 'ditolak']),
    tarifPerJam: z.number().min(0).optional(),
    keterangan: z.string().optional().nullable()
  })
});

export const batchApproveLemburSchema = z.object({
  body: z.object({
    ids: z.array(z.number()),
    status: z.enum(['disetujui', 'ditolak'])
  })
});

export const getLemburQuerySchema = z.object({
  query: z.object({
    status: z.enum(['pending', 'disetujui', 'ditolak', '']).optional(),
    idPegawai: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    bulan: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    tahun: z.string().optional().transform(val => val ? parseInt(val) : undefined)
  })
});
