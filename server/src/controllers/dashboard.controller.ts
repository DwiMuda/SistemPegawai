import type { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { successResponse } from '../utils/response';

export class DashboardController {
  static async getPegawaiDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const data = await DashboardService.getPegawaiDashboard(userId);
      successResponse(res, 'Berhasil mengambil data dashboard pegawai', data);
    } catch (error) {
      next(error);
    }
  }

  static async getAdminDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getAdminDashboard();
      successResponse(res, 'Berhasil mengambil data dashboard admin', data);
    } catch (error) {
      next(error);
    }
  }
}
