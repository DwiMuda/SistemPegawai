import { prisma } from '../server';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { LemburRepository } from '../repositories/lembur.repository';
import { SettingService } from './setting.service';
import { NotifikasiService } from './notifikasi.service';

export interface AjukanLemburInput {
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  keterangan: string;
}

export interface ApproveLemburInput {
  status: 'disetujui' | 'ditolak';
  tarifPerJam?: number;
  keterangan?: string | null;
}

export interface LemburQueryOptions {
  status?: string;
  idPegawai?: number;
  bulan?: number;
  tahun?: number;
}

export class LemburService {
  static hitungTotalJam(jamMulai: string, jamSelesai: string): number {
    const [mulaiH, mulaiM] = jamMulai.split(':').map(Number);
    const [selesaiH, selesaiM] = jamSelesai.split(':').map(Number);
    
    let mins = (selesaiH * 60 + selesaiM) - (mulaiH * 60 + mulaiM);
    if (mins < 0) mins += 24 * 60; // Lintas hari
    
    // Konversi menit ke jam desimal (misal 1 jam 30 menit = 1.5)
    return Math.round((mins / 60) * 100) / 100;
  }

  static async ajukanLembur(idPegawai: number, data: AjukanLemburInput) {
    const tanggal = new Date(data.tanggal);
    tanggal.setHours(0, 0, 0, 0);

    // Cek apakah sudah ada pengajuan lembur di tanggal yang sama
    const existing = await prisma.lembur.findFirst({
      where: {
        idPegawai,
        tanggal,
        status: { in: ['pending', 'disetujui'] }
      }
    });

    if (existing) {
      throw new ValidationError('Anda sudah memiliki pengajuan lembur pada tanggal tersebut');
    }

    const totalJam = this.hitungTotalJam(data.jamMulai, data.jamSelesai);

    // Hitung tarif default (Gaji Pokok / 173)
    const pegawai = await prisma.pegawai.findUnique({
      where: { idPegawai },
      include: { jabatan: true }
    });

    if (!pegawai) throw new NotFoundError('Pegawai tidak ditemukan');

    const divisorLembur = await SettingService.getNumber('DIVISOR_LEMBUR', 173);
    const tarifPerJamDefault = Math.round(pegawai.jabatan.gajiPokokDefault / divisorLembur);
    const totalUpahDefault = Math.round(totalJam * tarifPerJamDefault);

    const lembur = await LemburRepository.create({
      idPegawai,
      tanggal: tanggal,
      jamMulai: data.jamMulai,
      jamSelesai: data.jamSelesai,
      keterangan: data.keterangan,
      status: 'pending',
      totalJam,
      tarifPerJam: tarifPerJamDefault,
      totalUpah: totalUpahDefault
    });

    return lembur;
  }

  static async approveLembur(idLembur: number, idAdmin: number, data: ApproveLemburInput) {
    const lembur = await LemburRepository.findById(idLembur);

    if (!lembur) throw new NotFoundError('Data lembur tidak ditemukan');
    if (lembur.status !== 'pending') throw new ValidationError('Lembur ini sudah diproses');

    let tarifPerJam = lembur.tarifPerJam;
    let totalUpah = lembur.totalUpah;

    if (data.status === 'disetujui' && data.tarifPerJam !== undefined) {
      tarifPerJam = data.tarifPerJam;
      totalUpah = Math.round(lembur.totalJam * tarifPerJam);
    } else if (data.status === 'ditolak') {
      totalUpah = 0;
    }

    const updated = await LemburRepository.update(idLembur, {
      status: data.status,
      tarifPerJam,
      totalUpah,
      idAdmin,
      keterangan: data.keterangan || lembur.keterangan
    });

    // Notifikasi ke pegawai
    const judul = data.status === 'disetujui' ? 'Lembur Disetujui' : 'Lembur Ditolak';
    const pesan = `Pengajuan lembur Anda pada tanggal ${lembur.tanggal.toLocaleDateString('id-ID')} telah ${data.status}. ${data.keterangan ? `Catatan: ${data.keterangan}` : ''}`;
    
    const user = await prisma.users.findFirst({ where: { idPegawai: lembur.idPegawai } });
    if (user) {
      await NotifikasiService.sendToUser(user.idUser, {
        judul,
        pesan,
        tipe: data.status === 'disetujui' ? 'success' : 'danger',
        terkaitTabel: 'lembur',
        terkaitId: lembur.idLembur
      });
    }

    return updated;
  }

  static async batchApproveLembur(idLemburs: number[], idAdmin: number, status: 'disetujui' | 'ditolak') {
    return await prisma.$transaction(async (tx) => {
      const results = [];
      for (const id of idLemburs) {
        const lembur = await tx.lembur.findUnique({ where: { idLembur: id } });
        if (!lembur || lembur.status !== 'pending') continue;

        let totalUpah = lembur.totalUpah;
        if (status === 'ditolak') totalUpah = 0;

        const updated = await tx.lembur.update({
          where: { idLembur: id },
          data: {
            status,
            totalUpah,
            idAdmin,
            keterangan: status === 'disetujui' ? 'Disetujui massal' : 'Ditolak massal'
          }
        });

        // Notifikasi ke pegawai
        const judul = status === 'disetujui' ? 'Lembur Disetujui' : 'Lembur Ditolak';
        const pesan = `Pengajuan lembur Anda pada tanggal ${lembur.tanggal.toLocaleDateString('id-ID')} telah ${status}.`;
        
        const user = await tx.users.findFirst({ where: { idPegawai: lembur.idPegawai } });
        if (user) {
          await NotifikasiService.sendToUser(user.idUser, {
            judul,
            pesan,
            tipe: status === 'disetujui' ? 'success' : 'danger',
            terkaitTabel: 'lembur',
            terkaitId: lembur.idLembur
          });
        }

        results.push(updated);
      }
      return results;
    });
  }

  static async getAll(options?: LemburQueryOptions) {
    let whereClause: any = {};

    if (options?.status) whereClause.status = options.status;
    if (options?.idPegawai) whereClause.idPegawai = options.idPegawai;
    
    if (options?.bulan && options?.tahun) {
      const startDate = new Date(options.tahun, options.bulan - 1, 1);
      const endDate = new Date(options.tahun, options.bulan, 0, 23, 59, 59);
      whereClause.tanggal = { gte: startDate, lte: endDate };
    }

    return await LemburRepository.findAll(whereClause);
  }
}
