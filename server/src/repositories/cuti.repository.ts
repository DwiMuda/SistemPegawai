import { prisma } from '../server';

export class CutiRepository {
  static async create(data: any) {
    return prisma.pengajuanCuti.create({ data });
  }

  static async findById(idCuti: number) {
    return prisma.pengajuanCuti.findUnique({
      where: { idCuti },
      include: { pegawai: true }
    });
  }

  static async findOverlapping(idPegawai: number, tanggalMulai: Date, tanggalSelesai: Date) {
    return prisma.pengajuanCuti.findFirst({
      where: {
        idPegawai,
        status: { in: ['pending', 'disetujui'] },
        OR: [
          {
            tanggalMulai: { lte: tanggalSelesai },
            tanggalSelesai: { gte: tanggalMulai }
          }
        ]
      }
    });
  }

  static async findAll(whereClause: any, includeRelations: boolean = false) {
    const query: any = {
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    };
    
    if (includeRelations) {
      query.include = {
        pegawai: {
          select: {
            namaLengkap: true,
            nip: true,
            sisaCuti: true,
            departemen: { select: { namaDepartemen: true } },
            jabatan: { select: { namaJabatan: true } }
          }
        },
        admin: {
          select: { username: true }
        }
      };
    }

    return prisma.pengajuanCuti.findMany(query);
  }

  static async update(idCuti: number, data: any) {
    return prisma.pengajuanCuti.update({
      where: { idCuti },
      data
    });
  }
}
