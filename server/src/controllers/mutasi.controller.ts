import type { Request, Response, NextFunction } from 'express';
import { MutasiService } from '../services/mutasi.service';
import { successResponse } from '../utils/response';
import { AuthenticationError } from '../utils/AppError';
import { prisma } from '../server';

export class MutasiController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const jenisMutasi = req.query.jenisMutasi as string;
      
      const data = await MutasiService.getAll({ search, jenisMutasi });
      successResponse(res, 'Berhasil mengambil data mutasi', data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const data = await MutasiService.getById(id);
      successResponse(res, 'Berhasil mengambil detail mutasi', data);
    } catch (error) {
      next(error);
    }
  }

  static async getByPegawai(req: Request, res: Response, next: NextFunction) {
    try {
      const idPegawai = parseInt(req.params.idPegawai as string);
      
      if (req.user!.role === 'pegawai') {
        const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
        if (user?.idPegawai !== idPegawai) {
          throw new AuthenticationError('Akses ditolak: Anda hanya dapat melihat data mutasi Anda sendiri');
        }
      }

      const data = await MutasiService.getByPegawai(idPegawai);
      successResponse(res, 'Berhasil mengambil data mutasi pegawai', data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const idAdmin = req.user!.userId;
      const data = await MutasiService.create(req.body, idAdmin);
      successResponse(res, 'Berhasil memproses mutasi pegawai', data);
    } catch (error) {
      next(error);
    }
  }
}
