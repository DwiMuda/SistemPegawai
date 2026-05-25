import { Request, Response } from 'express';
import { pengumumanService } from '../services/pengumuman.service';

export const pengumumanController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await pengumumanService.getAll();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getActive(req: Request, res: Response) {
    try {
      const data = await pengumumanService.getActive();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data = await pengumumanService.create(req.body, req.user!.userId);
      res.status(201).json({ success: true, data, message: 'Pengumuman berhasil dibuat' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const data = await pengumumanService.update(parseInt(req.params.id as string), req.body);
      res.json({ success: true, data, message: 'Pengumuman berhasil diupdate' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await pengumumanService.delete(parseInt(req.params.id as string));
      res.json({ success: true, message: 'Pengumuman berhasil dihapus' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
