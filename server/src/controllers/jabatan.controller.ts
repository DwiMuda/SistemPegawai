import { Request, Response, NextFunction } from 'express';
import { JabatanService } from '../services/jabatan.service';
import { successResponse } from '../utils/response';

export class JabatanController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search } = req.pagination!;
      const result = await JabatanService.list({ page, limit, search: search as string });
      return successResponse(res, 'Daftar jabatan berhasil diambil', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await JabatanService.getAll();
      return successResponse(res, 'Semua jabatan berhasil diambil', data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await JabatanService.getById(id);
      return successResponse(res, 'Detail jabatan berhasil diambil', data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await JabatanService.create(req.body);
      return successResponse(res, 'Jabatan berhasil ditambahkan', data, undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await JabatanService.update(id, req.body);
      return successResponse(res, 'Jabatan berhasil diperbarui', data);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await JabatanService.delete(id);
      return successResponse(res, 'Jabatan berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
