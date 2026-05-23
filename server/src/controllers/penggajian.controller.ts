import type { Request, Response, NextFunction } from 'express';
import '../types/express';
import { PenggajianService } from '../services/penggajian.service';
import { successResponse } from '../utils/response';
import { generatePenggajianSchema, updateKomponenSchema, getPenggajianQuerySchema, bayarGajiSchema, bayarMassalSchema } from '../validators/penggajian.validator';
import { generateSlipGajiPDF } from '../utils/pdf';
import { generateRekapPenggajianExcel } from '../utils/excel';

export class PenggajianController {
  static async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.userId;
      const data = generatePenggajianSchema.parse({ body: req.body }).body;
      
      const result = await PenggajianService.generate(data, adminId);
      
      successResponse(res, `Berhasil meng-generate gaji untuk ${result.generatedCount} pegawai`, result, undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getPenggajianQuerySchema.parse({ query: req.query }).query;
      const data = await PenggajianService.getAll(query);
      
      successResponse(res, 'Berhasil mengambil daftar penggajian', data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const data = await PenggajianService.getById(id);
      
      successResponse(res, 'Berhasil mengambil detail penggajian', data);
    } catch (error) {
      next(error);
    }
  }

  static async updateKomponen(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const adminId = req.user!.userId;
      const data = updateKomponenSchema.parse({ body: req.body }).body;
      
      const result = await PenggajianService.updateKomponen(id, adminId, data);
      
      successResponse(res, 'Komponen penggajian berhasil diperbarui', result);
    } catch (error) {
      next(error);
    }
  }

  static async bayarGaji(req: Request, res: Response, next: NextFunction) {
    try {
      const idGaji = parseInt(req.params.id as string);
      const idAdmin = req.user!.userId;
      const { tanggalPembayaran } = bayarGajiSchema.parse({ body: req.body }).body;

      const result = await PenggajianService.bayarGaji(idGaji, idAdmin, tanggalPembayaran);
      
      successResponse(res, 'Gaji berhasil dibayarkan', result);
    } catch (error) {
      next(error);
    }
  }

  static async bayarMassal(req: Request, res: Response, next: NextFunction) {
    try {
      const idAdmin = req.user!.userId;
      const { ids, tanggalPembayaran } = bayarMassalSchema.parse({ body: req.body }).body;

      const result = await PenggajianService.bayarMassal(ids, idAdmin, tanggalPembayaran);
      
      successResponse(res, `${result.updatedCount} gaji berhasil dibayarkan`, result);
    } catch (error) {
      next(error);
    }
  }

  static async batalBayar(req: Request, res: Response, next: NextFunction) {
    try {
      const idGaji = parseInt(req.params.id as string);
      const idAdmin = req.user!.userId;

      const result = await PenggajianService.batalBayar(idGaji, idAdmin);
      
      successResponse(res, 'Pembayaran gaji dibatalkan', result);
    } catch (error) {
      next(error);
    }
  }

  static async downloadPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const gaji = await PenggajianService.getById(id);

      const pdfBuffer = await generateSlipGajiPDF({
        periodeBulan: gaji.periodeBulan,
        periodeTahun: gaji.periodeTahun,
        pegawai: {
          nip: gaji.pegawai.nip,
          namaLengkap: gaji.pegawai.namaLengkap,
          jabatan: gaji.pegawai.jabatan.namaJabatan,
          departemen: gaji.pegawai.departemen.namaDepartemen
        },
        pendapatan: {
          gajiPokok: gaji.gajiPokok,
          tunjanganJabatan: gaji.tunjanganJabatan,
          tunjanganTransport: gaji.tunjanganTransport,
          tunjanganMakan: gaji.tunjanganMakan,
          upahLembur: gaji.upahLembur,
          bonus: gaji.bonus,
          total: gaji.gajiPokok + gaji.tunjanganJabatan + gaji.tunjanganTransport + gaji.tunjanganMakan + gaji.upahLembur + gaji.bonus
        },
        potongan: {
          absensi: gaji.potonganAbsensi,
          bpjs: gaji.potonganBpjs,
          pajak: gaji.potonganPajak,
          lainLain: gaji.potonganLain,
          total: gaji.potonganAbsensi + gaji.potonganBpjs + gaji.potonganPajak + gaji.potonganLain
        },
        totalGaji: gaji.totalGaji,
        statusBayar: gaji.statusBayar,
        tanggalBayar: gaji.tanggalBayar
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=SlipGaji_${gaji.pegawai.nip}_${gaji.periodeBulan}_${gaji.periodeTahun}.pdf`);
      
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  static async downloadExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getPenggajianQuerySchema.parse({ query: req.query }).query;
      
      // Butuh minimal bulan dan tahun untuk rekap
      if (!query.bulan || !query.tahun) {
        res.status(400).json({ success: false, message: 'Bulan dan tahun diperlukan untuk export rekap' });
        return;
      }

      const list = await PenggajianService.getAll(query);

      const excelData = {
        periodeBulan: query.bulan as number,
        periodeTahun: query.tahun as number,
        data: list.map(item => ({
          nip: item.pegawai.nip,
          namaLengkap: item.pegawai.namaLengkap,
          departemen: item.pegawai.departemen.namaDepartemen,
          jabatan: item.pegawai.jabatan.namaJabatan,
          gajiPokok: item.gajiPokok,
          tunjangan: item.tunjanganJabatan + item.tunjanganTransport + item.tunjanganMakan + item.upahLembur + item.bonus,
          potongan: item.potonganAbsensi + item.potonganBpjs + item.potonganPajak + item.potonganLain,
          totalGaji: item.totalGaji,
          status: item.statusBayar
        }))
      };

      const excelBuffer = await generateRekapPenggajianExcel(excelData);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=RekapGaji_${query.bulan}_${query.tahun}.xlsx`);
      
      res.send(excelBuffer);
    } catch (error) {
      next(error);
    }
  }
}
