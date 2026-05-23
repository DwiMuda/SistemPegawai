import { prisma } from '../server';

export class PenggajianRepository {
  static async findById(idGaji: number) {
    return prisma.penggajian.findUnique({
      where: { idGaji },
      include: {
        pegawai: {
          include: {
            jabatan: true,
            departemen: true
          }
        },
        admin: {
          select: { username: true }
        }
      }
    });
  }

  static async findUnique(periodeBulan: number, periodeTahun: number, idPegawai: number) {
    return prisma.penggajian.findUnique({
      where: {
        idPegawai_periodeBulan_periodeTahun: {
          idPegawai,
          periodeBulan,
          periodeTahun
        }
      }
    });
  }

  static async findAll(whereClause: any) {
    return prisma.penggajian.findMany({
      where: whereClause,
      include: {
        pegawai: {
          select: {
            namaLengkap: true,
            nip: true,
            jabatan: { select: { namaJabatan: true } },
            departemen: { select: { namaDepartemen: true } }
          }
        }
      },
      orderBy: [
        { periodeTahun: 'desc' },
        { periodeBulan: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  static async upsert(
    periodeBulan: number,
    periodeTahun: number,
    idPegawai: number,
    data: any
  ) {
    return prisma.penggajian.upsert({
      where: {
        idPegawai_periodeBulan_periodeTahun: {
          idPegawai,
          periodeBulan,
          periodeTahun
        }
      },
      update: data,
      create: {
        ...data,
        periodeBulan,
        periodeTahun,
        idPegawai
      }
    });
  }

  static async update(idGaji: number, data: any) {
    return prisma.penggajian.update({
      where: { idGaji },
      data
    });
  }
}
