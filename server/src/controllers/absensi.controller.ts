import type { Request, Response, NextFunction } from 'express';
import { AbsensiService } from '../services/absensi.service';
import { successResponse } from '../utils/response';
import { getRekapQuerySchema, manualInputSchema, validasiSchema, validasiMassalSchema } from '../validators/absensi.validator';
import { getClientIp } from '../utils/ip';
import { prisma } from '../server';

export class AbsensiController {
  static async clockIn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'User tidak tertaut dengan data pegawai' });
        return;
      }

      const ipAddress = getClientIp(req);
      const userAgent = req.headers['user-agent'] || '';

      const absensi = await AbsensiService.clockIn(idPegawai, ipAddress, userAgent);
      
      successResponse(res, 'Berhasil absen masuk', absensi, undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  static async clockOut(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'User tidak tertaut dengan data pegawai' });
        return;
      }

      const ipAddress = getClientIp(req);
      const userAgent = req.headers['user-agent'] || '';

      const absensi = await AbsensiService.clockOut(idPegawai, ipAddress, userAgent);
      
      successResponse(res, 'Berhasil absen keluar', absensi);
    } catch (error) {
      next(error);
    }
  }

  static async getMyRiwayat(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'User tidak tertaut dengan data pegawai' });
        return;
      }

      const query = getRekapQuerySchema.parse(req.query);
      const data = await AbsensiService.getMyRiwayat(idPegawai, {
        bulan: query.bulan,
        tahun: query.tahun,
      });
      
      successResponse(res, 'Berhasil mengambil riwayat absensi', data);
    } catch (error) {
      next(error);
    }
  }

  static async getRekap(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getRekapQuerySchema.parse(req.query);
      const data = await AbsensiService.getRekap({
        bulan: query.bulan,
        tahun: query.tahun,
        idDepartemen: query.idDepartemen,
        idPegawai: query.idPegawai,
      });
      
      successResponse(res, 'Berhasil mengambil rekap absensi', data);
    } catch (error) {
      next(error);
    }
  }

  static async getStatistik(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AbsensiService.getStatistikHariIni();
      successResponse(res, 'Berhasil mengambil statistik absensi hari ini', data);
    } catch (error) {
      next(error);
    }
  }

  static async manualInput(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.userId;
      const data = manualInputSchema.parse(req.body);
      
      const absensi = await AbsensiService.manualInput(adminId, data);
      
      successResponse(res, 'Data absensi manual berhasil ditambahkan', absensi, undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  static async validasi(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const data = validasiSchema.parse(req.body);
      
      const absensi = await AbsensiService.updateValidation(id, data);
      
      successResponse(res, 'Data absensi berhasil diperbarui/divalidasi', absensi);
    } catch (error) {
      next(error);
    }
  }

  static async validasiMassal(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validasiMassalSchema.parse(req.body);
      
      const result = await AbsensiService.validasiMassal(data.ids);
      
      successResponse(res, `${result.count} data absensi berhasil divalidasi`);
    } catch (error) {
      next(error);
    }
  }
}
