import type { Request, Response, NextFunction } from 'express';
import { CutiService } from '../services/cuti.service';
import { successResponse } from '../utils/response';
import { createCutiSchema, approveCutiSchema, getCutiQuerySchema } from '../validators/cuti.validator';
import { prisma } from '../server';

export class CutiController {
  static async createPengajuan(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'User tidak tertaut dengan data pegawai' });
        return;
      }

      const data = createCutiSchema.parse(req.body);
      const cuti = await CutiService.createPengajuan(idPegawai, data);
      
      successResponse(res, 'Pengajuan cuti berhasil dibuat', cuti, undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getMyCuti(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'User tidak tertaut dengan data pegawai' });
        return;
      }

      const query = getCutiQuerySchema.parse(req.query);
      const data = await CutiService.getMyCuti(idPegawai, query);
      
      successResponse(res, 'Berhasil mengambil riwayat cuti', data);
    } catch (error) {
      next(error);
    }
  }

  static async getAllCuti(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getCutiQuerySchema.parse(req.query);
      const data = await CutiService.getAllCuti(query);
      
      successResponse(res, 'Berhasil mengambil semua pengajuan cuti', data);
    } catch (error) {
      next(error);
    }
  }

  static async approveCuti(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.userId;
      const idCuti = parseInt(req.params.id as string);
      
      const data = approveCutiSchema.parse(req.body);
      const cuti = await CutiService.approveCuti(idCuti, adminId, data);
      
      successResponse(res, 'Status pengajuan cuti berhasil diperbarui', cuti);
    } catch (error) {
      next(error);
    }
  }

  static async batalCuti(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'User tidak tertaut dengan data pegawai' });
        return;
      }

      const idCuti = parseInt(req.params.id as string);
      await CutiService.batalCuti(idCuti, idPegawai);
      
      successResponse(res, 'Pengajuan cuti berhasil dibatalkan');
    } catch (error) {
      next(error);
    }
  }

  static async resetTahunan(req: Request, res: Response, next: NextFunction) {
    try {
      await CutiService.resetTahunan();
      successResponse(res, 'Sisa cuti semua pegawai aktif berhasil direset menjadi 12 hari');
    } catch (error) {
      next(error);
    }
  }
}
