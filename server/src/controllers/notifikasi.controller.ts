import type { Request, Response, NextFunction } from 'express';
import { NotifikasiService } from '../services/notifikasi.service';
import { successResponse } from '../utils/response';

export class NotifikasiController {
  static async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user!.userId;
      const unreadOnly = req.query.unread === 'true';
      
      const data = await NotifikasiService.getUserNotifications(idUser, unreadOnly);
      successResponse(res, 'Berhasil mengambil notifikasi', data);
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user!.userId;
      const count = await NotifikasiService.getUnreadCount(idUser);
      successResponse(res, 'Berhasil mengambil jumlah notifikasi baru', { count });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user!.userId;
      const idNotifikasi = parseInt(req.params.id as string);
      
      await NotifikasiService.markAsRead(idNotifikasi, idUser);
      successResponse(res, 'Notifikasi ditandai sudah dibaca');
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const idUser = req.user!.userId;
      await NotifikasiService.markAllAsRead(idUser);
      successResponse(res, 'Semua notifikasi ditandai sudah dibaca');
    } catch (error) {
      next(error);
    }
  }
}
