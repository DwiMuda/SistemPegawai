import { prisma } from '../server';
import type { Prisma } from '@prisma/client';

export class AbsensiRepository {
  static async findByUserAndDate(idPegawai: number, tanggal: Date) {
    // Cari data di mana tanggal = (start of day)
    const startOfDay = new Date(tanggal);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(tanggal);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.absensi.findFirst({
      where: {
        idPegawai,
        tanggal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        pegawai: { select: { namaLengkap: true, nip: true } }
      }
    });
  }

  static async findById(id: number) {
    return prisma.absensi.findUnique({
      where: { idAbsensi: id },
      include: {
        pegawai: { select: { namaLengkap: true, nip: true } }
      }
    });
  }

  static async getRekap(params: {
    bulan?: number;
    tahun?: number;
    idDepartemen?: number;
    idPegawai?: number;
  }) {
    const { bulan, tahun, idDepartemen, idPegawai } = params;
    
    let dateFilter: any = {};
    if (bulan && tahun) {
      const startOfMonth = new Date(tahun, bulan - 1, 1);
      const endOfMonth = new Date(tahun, bulan, 0, 23, 59, 59, 999);
      dateFilter = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    } else if (tahun) {
      const startOfYear = new Date(tahun, 0, 1);
      const endOfYear = new Date(tahun, 11, 31, 23, 59, 59, 999);
      dateFilter = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }

    const where: Prisma.AbsensiWhereInput = {
      ...(Object.keys(dateFilter).length > 0 ? { tanggal: dateFilter } : {}),
      ...(idPegawai ? { idPegawai } : {}),
      ...(idDepartemen ? { pegawai: { idDepartemen } } : {}),
    };

    return prisma.absensi.findMany({
      where,
      orderBy: [{ tanggal: 'desc' }, { pegawai: { namaLengkap: 'asc' } }],
      include: {
        pegawai: { 
          select: { 
            namaLengkap: true, 
            nip: true,
            departemen: { select: { namaDepartemen: true } }
          } 
        },
        admin: { select: { username: true } }
      },
    });
  }

  static async getStatistikHariIni() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = new Date(today);
    endToday.setHours(23, 59, 59, 999);

    const data = await prisma.absensi.findMany({
      where: {
        tanggal: {
          gte: today,
          lte: endToday,
        }
      },
      select: {
        status: true,
        isLate: true,
      }
    });

    return {
      hadir: data.filter(d => d.status === 'hadir').length,
      terlambat: data.filter(d => d.status === 'hadir' && d.isLate).length,
      izin: data.filter(d => d.status === 'izin').length,
      sakit: data.filter(d => d.status === 'sakit').length,
      alpha: data.filter(d => d.status === 'alpha').length,
      cuti: data.filter(d => d.status === 'cuti').length,
    };
  }

  static async create(data: Prisma.AbsensiCreateInput) {
    return prisma.absensi.create({
      data,
      include: { pegawai: { select: { namaLengkap: true } } }
    });
  }

  static async update(id: number, data: Prisma.AbsensiUpdateInput) {
    return prisma.absensi.update({
      where: { idAbsensi: id },
      data,
      include: { pegawai: { select: { namaLengkap: true } } }
    });
  }

  static async updateMany(ids: number[], data: Prisma.AbsensiUpdateInput) {
    return prisma.absensi.updateMany({
      where: { idAbsensi: { in: ids } },
      data,
    });
  }
}
