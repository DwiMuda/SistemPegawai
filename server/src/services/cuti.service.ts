import { prisma } from '../server';
import { ValidationError, NotFoundError } from '../utils/AppError';
import { CutiRepository } from '../repositories/cuti.repository';
import { NotifikasiService } from './notifikasi.service';

export interface CreateCutiInput {
  jenisCuti: 'tahunan' | 'sakit' | 'melahirkan' | 'lainnya';
  tanggalMulai: string;
  tanggalSelesai: string;
  jumlahHari: number;
  alasan: string;
}

export interface ApproveCutiInput {
  status: 'disetujui' | 'ditolak';
  catatanAdmin?: string;
}

export interface CutiQueryOptions {
  status?: 'pending' | 'disetujui' | 'ditolak';
  idPegawai?: number;
  bulan?: number;
  tahun?: number;
}

export class CutiService {
  static async createPengajuan(idPegawai: number, data: CreateCutiInput) {
    const pegawai = await prisma.pegawai.findUnique({
      where: { idPegawai }
    });

    if (!pegawai) {
      throw new NotFoundError('Pegawai tidak ditemukan');
    }

    // Jika cuti tahunan, cek sisa cuti
    if (data.jenisCuti === 'tahunan' && data.jumlahHari > pegawai.sisaCuti) {
      throw new ValidationError(`Sisa cuti tahunan tidak mencukupi. Sisa cuti Anda: ${pegawai.sisaCuti} hari.`);
    }

    // Cek apakah ada pengajuan cuti yang overlap dan masih pending/disetujui
    const tanggalMulai = new Date(data.tanggalMulai);
    const tanggalSelesai = new Date(data.tanggalSelesai);

    const overlapCuti = await CutiRepository.findOverlapping(idPegawai, tanggalMulai, tanggalSelesai);

    if (overlapCuti) {
      throw new ValidationError('Anda sudah memiliki pengajuan cuti pada rentang tanggal tersebut');
    }

    const cuti = await CutiRepository.create({
      idPegawai,
      jenisCuti: data.jenisCuti,
      tanggalMulai,
      tanggalSelesai,
      jumlahHari: data.jumlahHari,
      alasan: data.alasan,
      status: 'pending'
    });

    return cuti;
  }

  static async getMyCuti(idPegawai: number, options?: CutiQueryOptions) {
    let whereClause: any = { idPegawai };

    if (options?.status) {
      whereClause.status = options.status;
    }

    if (options?.tahun) {
      const startDate = new Date(options.tahun, (options.bulan || 1) - 1, 1);
      const endDate = new Date(options.tahun, options.bulan ? options.bulan : 12, 0);
      whereClause.tanggalMulai = {
        gte: startDate,
        lte: endDate
      };
    }

    return await CutiRepository.findAll(whereClause, false);
  }

  static async getAllCuti(options?: CutiQueryOptions) {
    let whereClause: any = {};

    if (options?.status) {
      whereClause.status = options.status;
    }

    if (options?.idPegawai) {
      whereClause.idPegawai = options.idPegawai;
    }

    if (options?.tahun) {
      const startDate = new Date(options.tahun, (options.bulan || 1) - 1, 1);
      const endDate = new Date(options.tahun, options.bulan ? options.bulan : 12, 0);
      whereClause.tanggalMulai = {
        gte: startDate,
        lte: endDate
      };
    }

    return await CutiRepository.findAll(whereClause, true);
  }

  static async approveCuti(idCuti: number, idAdmin: number, data: ApproveCutiInput) {
    const cuti = await CutiRepository.findById(idCuti);

    if (!cuti) {
      throw new NotFoundError('Data pengajuan cuti tidak ditemukan');
    }

    if (cuti.status !== 'pending') {
      throw new ValidationError(`Pengajuan cuti ini sudah ${cuti.status}`);
    }

    return await prisma.$transaction(async (tx) => {
      // Jika disetujui dan jenis cuti tahunan, kurangi sisa cuti
      if (data.status === 'disetujui' && cuti.jenisCuti === 'tahunan') {
        if (cuti.pegawai.sisaCuti < cuti.jumlahHari) {
          throw new ValidationError('Sisa cuti pegawai tidak mencukupi untuk disetujui');
        }

        await tx.pegawai.update({
          where: { idPegawai: cuti.idPegawai },
          data: {
            sisaCuti: {
              decrement: cuti.jumlahHari
            }
          }
        });
      }

      // Update status cuti
      const updatedCuti = await tx.pengajuanCuti.update({
        where: { idCuti },
        data: {
          status: data.status,
          idAdmin,
          catatanAdmin: data.catatanAdmin
        },
        include: {
          pegawai: {
            select: {
              namaLengkap: true,
              nip: true,
              sisaCuti: true
            }
          }
        }
      });

      const judul = data.status === 'disetujui' ? 'Cuti Disetujui' : 'Cuti Ditolak';
      const pesan = `Pengajuan cuti ${cuti.jenisCuti} Anda selama ${cuti.jumlahHari} hari telah ${data.status}. ${data.catatanAdmin ? `Catatan: ${data.catatanAdmin}` : ''}`;
      
      const user = await tx.users.findFirst({ where: { idPegawai: cuti.idPegawai } });
      if (user) {
        await NotifikasiService.sendToUser(user.idUser, {
          judul,
          pesan,
          tipe: data.status === 'disetujui' ? 'success' : 'danger',
          terkaitTabel: 'pengajuan_cuti',
          terkaitId: updatedCuti.idCuti
        });
      }

      return updatedCuti;
    });
  }

  static async batalCuti(idCuti: number, idPegawai: number) {
    const cuti = await CutiRepository.findById(idCuti);

    if (!cuti) {
      throw new NotFoundError('Data pengajuan cuti tidak ditemukan');
    }

    if (cuti.idPegawai !== idPegawai) {
      throw new ValidationError('Anda tidak berhak membatalkan cuti ini');
    }

    if (cuti.status !== 'pending') {
      throw new ValidationError(`Pengajuan cuti ini sudah ${cuti.status} dan tidak dapat dibatalkan`);
    }

    // Bisa langsung dihapus atau diubah statusnya menjadi batal.
    // Karena di skema kita cuma ada status: pending, disetujui, ditolak, 
    // kita akan menghapus barisnya saja atau update jadi 'ditolak' tapi catatan 'Dibatalkan oleh user'.
    // Lebih baik kita update status menjadi 'ditolak' dan catatanAdmin = 'Dibatalkan oleh pegawai'.
    // Atau kalau mau konsisten, tambah enum 'batal' di schema/validator, tapi untuk kemudahan kita delete saja atau reject.
    // Mari kita delete saja pengajuan yang pending jika dibatalkan oleh user.
    return await prisma.pengajuanCuti.delete({
      where: { idCuti }
    });
  }

  static async resetTahunan() {
    // Reset sisa cuti semua pegawai aktif menjadi 12
    const result = await prisma.pegawai.updateMany({
      where: { statusPegawai: 'aktif' },
      data: { sisaCuti: 12 }
    });

    return result;
  }
}
