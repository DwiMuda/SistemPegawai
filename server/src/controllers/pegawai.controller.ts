import type { Request, Response, NextFunction } from 'express';
import { PegawaiService } from '../services/pegawai.service';
import { successResponse } from '../utils/response';
import { getPegawaiQuerySchema, createPegawaiSchema, updatePegawaiSchema } from '../validators/pegawai.validator';

export class PegawaiController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getPegawaiQuerySchema.parse(req.query);
      
      const result = await PegawaiService.list({
        page: query.page || 1,
        limit: query.limit || 10,
        search: query.search,
        idDepartemen: query.idDepartemen,
        idJabatan: query.idJabatan,
        statusPegawai: query.statusPegawai,
      });

      successResponse(res, 'Berhasil mengambil data pegawai', result.data, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const pegawai = await PegawaiService.getById(id);
      
      successResponse(res, 'Berhasil mengambil detail pegawai', pegawai);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPegawaiSchema.parse(req.body);
      
      const pegawai = await PegawaiService.create({
        ...data,
        tanggalLahir: new Date(data.tanggalLahir),
        tanggalMasuk: new Date(data.tanggalMasuk),
        email: data.email || undefined,
      });
      
      successResponse(res, 'Pegawai berhasil ditambahkan', pegawai, undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const data = updatePegawaiSchema.parse(req.body);
      
      const updateData: any = { ...data };
      if (data.tanggalLahir) updateData.tanggalLahir = new Date(data.tanggalLahir);
      if (data.tanggalMasuk) updateData.tanggalMasuk = new Date(data.tanggalMasuk);
      if (data.email === '') updateData.email = null;

      const pegawai = await PegawaiService.update(id, updateData);
      
      successResponse(res, 'Data pegawai berhasil diperbarui', pegawai);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      await PegawaiService.delete(id);
      
      successResponse(res, 'Pegawai berhasil dinonaktifkan');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PegawaiService.getAll();
      successResponse(res, 'Berhasil mengambil semua data pegawai', data);
    } catch (error) {
      next(error);
    }
  }
}
