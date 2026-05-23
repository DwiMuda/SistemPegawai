import { AbsensiRepository } from '../repositories/absensi.repository';
import { PegawaiRepository } from '../repositories/pegawai.repository';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { format } from 'date-fns';

const JAM_MASUK_DEFAULT = '08:00';

export class AbsensiService {
  static async clockIn(idPegawai: number, ipAddress?: string, userAgent?: string) {
    const today = new Date();
    const existing = await AbsensiRepository.findByUserAndDate(idPegawai, today);

    if (existing) {
      throw new ValidationError('Anda sudah melakukan absen masuk hari ini');
    }

    const jamSekarang = format(today, 'HH:mm');
    const isLate = jamSekarang > JAM_MASUK_DEFAULT;

    return AbsensiRepository.create({
      pegawai: { connect: { idPegawai } },
      tanggal: new Date(),
      jamMasuk: jamSekarang,
      status: 'hadir',
      isLate,
      ipAddress,
      userAgent,
    });
  }

  static async clockOut(idPegawai: number, ipAddress?: string, userAgent?: string) {
    const today = new Date();
    const existing = await AbsensiRepository.findByUserAndDate(idPegawai, today);

    if (!existing) {
      throw new ValidationError('Anda belum melakukan absen masuk hari ini');
    }

    if (existing.jamKeluar) {
      throw new ValidationError('Anda sudah melakukan absen keluar hari ini');
    }

    const jamSekarang = format(today, 'HH:mm');

    return AbsensiRepository.update(existing.idAbsensi, {
      jamKeluar: jamSekarang,
      // We can update IP or append it if we want, but for MVP we just overwrite or leave it.
      // We'll leave it as is or update the latest IP used for clock out
    });
  }

  static async getMyRiwayat(idPegawai: number, params: { bulan?: number; tahun?: number }) {
    return AbsensiRepository.getRekap({
      idPegawai,
      bulan: params.bulan,
      tahun: params.tahun,
    });
  }

  static async getRekap(params: {
    bulan?: number;
    tahun?: number;
    idDepartemen?: number;
    idPegawai?: number;
  }) {
    return AbsensiRepository.getRekap(params);
  }

  static async getStatistikHariIni() {
    return AbsensiRepository.getStatistikHariIni();
  }

  static async manualInput(adminId: number, data: {
    idPegawai: number;
    tanggal: string;
    status: string;
    jamMasuk?: string | null;
    jamKeluar?: string | null;
    keterangan?: string | null;
  }) {
    const tanggalInput = new Date(data.tanggal);
    
    // Validasi Pegawai
    const pegawai = await PegawaiRepository.findById(data.idPegawai);
    if (!pegawai) {
      throw new NotFoundError('Pegawai tidak ditemukan');
    }

    // Cek duplikasi
    const existing = await AbsensiRepository.findByUserAndDate(data.idPegawai, tanggalInput);
    if (existing) {
      throw new ValidationError(`Pegawai ini sudah memiliki data absensi pada tanggal ${data.tanggal}`);
    }

    let isLate = false;
    if (data.status === 'hadir' && data.jamMasuk) {
      isLate = data.jamMasuk > JAM_MASUK_DEFAULT;
    }

    return AbsensiRepository.create({
      pegawai: { connect: { idPegawai: data.idPegawai } },
      admin: { connect: { idUser: adminId } },
      tanggal: tanggalInput,
      status: data.status,
      jamMasuk: data.jamMasuk,
      jamKeluar: data.jamKeluar,
      keterangan: data.keterangan,
      isLate,
      isValidated: true, // Manual input by admin is automatically validated
    });
  }

  static async updateValidation(idAbsensi: number, data: {
    status?: string;
    jamMasuk?: string | null;
    jamKeluar?: string | null;
    keterangan?: string | null;
    isValidated?: boolean;
  }) {
    const existing = await AbsensiRepository.findById(idAbsensi);
    if (!existing) {
      throw new NotFoundError('Data absensi tidak ditemukan');
    }

    let isLate = existing.isLate;
    // Recalculate isLate if jamMasuk or status changes
    if (data.status === 'hadir' || (existing.status === 'hadir' && data.status === undefined)) {
      const jamMasuk = data.jamMasuk !== undefined ? data.jamMasuk : existing.jamMasuk;
      isLate = jamMasuk ? jamMasuk > JAM_MASUK_DEFAULT : false;
    } else if (data.status && data.status !== 'hadir') {
      isLate = false;
    }

    return AbsensiRepository.update(idAbsensi, {
      ...data,
      isLate,
      // If admin updates it, we can auto validate it or rely on the flag
      isValidated: data.isValidated !== undefined ? data.isValidated : true,
    });
  }

  static async validasiMassal(ids: number[]) {
    await AbsensiRepository.updateMany(ids, { isValidated: true });
    return { count: ids.length };
  }
}
