import { Request, Response } from 'express';
import { kasbonService } from '../services/kasbon.service';
import { prisma } from '../server';

export const kasbonController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await kasbonService.getAll();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getMyKasbon(req: Request, res: Response) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      if (!user?.idPegawai) {
        res.status(403).json({ success: false, message: 'Bukan pegawai' });
        return;
      }
      const data = await kasbonService.getByPegawai(user.idPegawai);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      if (!user?.idPegawai) {
        res.status(403).json({ success: false, message: 'Bukan pegawai' });
        return;
      }
      const data = await kasbonService.create(req.body, user.idPegawai);
      res.status(201).json({ success: true, data, message: 'Pengajuan kasbon berhasil' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async approve(req: Request, res: Response) {
    try {
      const data = await kasbonService.approve(parseInt(req.params.id as string), req.user!.userId, req.body.catatanAdmin);
      res.json({ success: true, data, message: 'Kasbon disetujui' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async reject(req: Request, res: Response) {
    try {
      const data = await kasbonService.reject(parseInt(req.params.id as string), req.user!.userId, req.body.catatanAdmin);
      res.json({ success: true, data, message: 'Kasbon ditolak' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
