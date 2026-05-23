import type { Request, Response, NextFunction } from 'express';
import { LemburService } from '../services/lembur.service';
import { successResponse } from '../utils/response';
import { ajukanLemburSchema, approveLemburSchema, batchApproveLemburSchema, getLemburQuerySchema } from '../validators/lembur.validator';
import { prisma } from '../server';

export class LemburController {
  static async ajukanLembur(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'Akses ditolak: Bukan pegawai' });
        return;
      }

      const data = ajukanLemburSchema.parse({ body: req.body }).body;
      const result = await LemburService.ajukanLembur(idPegawai, data);
      
      successResponse(res, 'Pengajuan lembur berhasil dibuat', result, undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  static async approveLembur(req: Request, res: Response, next: NextFunction) {
    try {
      const idLembur = parseInt(req.params.id as string);
      const idAdmin = req.user!.userId;
      
      const data = approveLemburSchema.parse({ body: req.body }).body;
      const result = await LemburService.approveLembur(idLembur, idAdmin, data);
      
      successResponse(res, `Pengajuan lembur berhasil ${data.status}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async batchApproveLembur(req: Request, res: Response, next: NextFunction) {
    try {
      const idAdmin = req.user!.userId;
      
      const data = batchApproveLemburSchema.parse({ body: req.body }).body;
      const result = await LemburService.batchApproveLembur(data.ids, idAdmin, data.status);
      
      successResponse(res, `Pengajuan lembur massal berhasil diproses`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getLemburSaya(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'Akses ditolak: Bukan pegawai' });
        return;
      }

      const query = getLemburQuerySchema.parse({ query: req.query }).query;
      const result = await LemburService.getAll({ ...query, idPegawai });
      
      successResponse(res, 'Berhasil mengambil riwayat lembur', result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllLembur(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getLemburQuerySchema.parse({ query: req.query }).query;
      const result = await LemburService.getAll(query);
      
      successResponse(res, 'Berhasil mengambil daftar pengajuan lembur', result);
    } catch (error) {
      next(error);
    }
  }
}
