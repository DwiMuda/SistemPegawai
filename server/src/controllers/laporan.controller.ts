import type { Request, Response, NextFunction } from 'express';
import { LaporanService } from '../services/laporan.service';
import { successResponse } from '../utils/response';

export class LaporanController {
  static async rekapAbsensi(req: Request, res: Response, next: NextFunction) {
    try {
      const bulan = parseInt(req.query.bulan as string) || new Date().getMonth() + 1;
      const tahun = parseInt(req.query.tahun as string) || new Date().getFullYear();

      const data = await LaporanService.rekapAbsensi(bulan, tahun);
      successResponse(res, 'Berhasil mengambil rekap absensi', data);
    } catch (error) {
      next(error);
    }
  }

  static async rekapPenggajian(req: Request, res: Response, next: NextFunction) {
    try {
      const bulan = parseInt(req.query.bulan as string) || new Date().getMonth() + 1;
      const tahun = parseInt(req.query.tahun as string) || new Date().getFullYear();
      const format = req.query.format as 'json' | 'excel' || 'json';

      if (format === 'excel') {
        const buffer = await LaporanService.rekapPenggajian(bulan, tahun, 'excel') as Buffer;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=RekapGaji_${bulan}_${tahun}.xlsx`);
        res.send(buffer);
        return;
      }

      const data = await LaporanService.rekapPenggajian(bulan, tahun, 'json');
      successResponse(res, 'Berhasil mengambil rekap penggajian', data);
    } catch (error) {
      next(error);
    }
  }

  static async exportPegawai(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await LaporanService.exportPegawai();
      successResponse(res, 'Berhasil mengambil data pegawai', data);
    } catch (error) {
      next(error);
    }
  }
}
