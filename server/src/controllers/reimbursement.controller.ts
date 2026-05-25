import { Request, Response } from 'express';
import { reimbursementService } from '../services/reimbursement.service';
import { prisma } from '../server';

export const reimbursementController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await reimbursementService.getAll();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getMyReimbursement(req: Request, res: Response) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      if (!user?.idPegawai) {
        res.status(403).json({ success: false, message: 'Bukan pegawai' });
        return;
      }
      const data = await reimbursementService.getByPegawai(user.idPegawai);
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
      const file = req.file;
      const buktiFile = file ? `/uploads/${file.filename}` : undefined;
      
      const data = await reimbursementService.create(req.body, user.idPegawai, buktiFile);
      res.status(201).json({ success: true, data, message: 'Pengajuan reimbursement berhasil' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async approve(req: Request, res: Response) {
    try {
      const data = await reimbursementService.approve(parseInt(req.params.id as string), req.user!.userId, req.body.catatanAdmin);
      res.json({ success: true, data, message: 'Reimbursement disetujui' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async reject(req: Request, res: Response) {
    try {
      const data = await reimbursementService.reject(parseInt(req.params.id as string), req.user!.userId, req.body.catatanAdmin);
      res.json({ success: true, data, message: 'Reimbursement ditolak' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
