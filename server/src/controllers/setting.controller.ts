import type { Request, Response, NextFunction } from 'express';
import { SettingService } from '../services/setting.service';
import { successResponse } from '../utils/response';
import { updateSettingSchema } from '../validators/setting.validator';

export class SettingController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingService.getAll();
      successResponse(res, 'Berhasil mengambil pengaturan', data);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.params.key as string;
      const { value } = updateSettingSchema.parse(req.body);
      
      const data = await SettingService.update(key, value);
      successResponse(res, 'Pengaturan berhasil diperbarui', data);
    } catch (error) {
      next(error);
    }
  }
}
