import { Request, Response, NextFunction } from 'express';
import { DepartemenService } from '../services/departemen.service';
import { successResponse } from '../utils/response';

export class DepartemenController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search } = req.pagination!;
      const result = await DepartemenService.list({ page, limit, search: search as string });
      return successResponse(res, 'Daftar departemen berhasil diambil', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DepartemenService.getAll();
      return successResponse(res, 'Semua departemen berhasil diambil', data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await DepartemenService.getById(id);
      return successResponse(res, 'Detail departemen berhasil diambil', data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DepartemenService.create(req.body);
      return successResponse(res, 'Departemen berhasil ditambahkan', data, undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data = await DepartemenService.update(id, req.body);
      return successResponse(res, 'Departemen berhasil diperbarui', data);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await DepartemenService.delete(id);
      return successResponse(res, 'Departemen berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
