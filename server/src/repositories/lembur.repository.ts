import { prisma } from '../server';

export class LemburRepository {
  static async create(data: any) {
    return prisma.lembur.create({ data });
  }

  static async findById(idLembur: number) {
    return prisma.lembur.findUnique({
      where: { idLembur },
      include: {
        pegawai: {
          select: {
            namaLengkap: true,
            nip: true,
            jabatan: {
              select: { gajiPokokDefault: true }
            }
          }
        }
      }
    });
  }

  static async findAll(whereClause: any) {
    return prisma.lembur.findMany({
      where: whereClause,
      include: {
        pegawai: {
          select: {
            namaLengkap: true,
            nip: true,
            departemen: { select: { namaDepartemen: true } }
          }
        },
        admin: {
          select: { username: true }
        }
      },
      orderBy: { tanggal: 'desc' }
    });
  }

  static async update(idLembur: number, data: any) {
    return prisma.lembur.update({
      where: { idLembur },
      data,
      include: {
        pegawai: {
          select: { namaLengkap: true, nip: true }
        }
      }
    });
  }
}
