import { prisma } from '../server';

export class MutasiRepository {
  static async findAll(filters?: { search?: string, jenisMutasi?: string }) {
    const where: any = {};
    if (filters?.search) {
      where.pegawai = { namaLengkap: { contains: filters.search } };
    }
    if (filters?.jenisMutasi) {
      where.jenisMutasi = filters.jenisMutasi;
    }

    return prisma.mutasi.findMany({
      where,
      include: {
        pegawai: {
          include: {
            jabatan: true,
            departemen: true
          }
        },
        admin: {
          include: {
            pegawai: true
          }
        }
      },
      orderBy: { tanggal: 'desc' }
    });
  }

  static async findById(id: number) {
    return prisma.mutasi.findUnique({
      where: { idMutasi: id },
      include: {
        pegawai: {
          include: {
            jabatan: true,
            departemen: true
          }
        },
        admin: {
          include: {
            pegawai: true
          }
        }
      }
    });
  }

  static async findByPegawai(idPegawai: number) {
    return prisma.mutasi.findMany({
      where: { idPegawai },
      include: {
        admin: {
          include: {
            pegawai: true
          }
        }
      },
      orderBy: { tanggal: 'desc' }
    });
  }
}
