import { prisma } from '../server';
import type { Prisma } from '@prisma/client';

export class DepartemenRepository {
  static async findAll(params: {
    skip?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { skip = 0, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const where: Prisma.DepartemenWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { namaDepartemen: { contains: search } },
              { kodeDepartemen: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.departemen.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          kepala: { select: { idPegawai: true, namaLengkap: true, nip: true } },
          _count: { select: { pegawai: true } },
        },
      }),
      prisma.departemen.count({ where }),
    ]);

    return { data, total };
  }

  static async findById(id: number) {
    return prisma.departemen.findFirst({
      where: { idDepartemen: id, deletedAt: null },
      include: {
        kepala: { select: { idPegawai: true, namaLengkap: true, nip: true } },
        _count: { select: { pegawai: true } },
      },
    });
  }

  static async findByNama(nama: string) {
    return prisma.departemen.findFirst({
      where: { namaDepartemen: nama, deletedAt: null },
    });
  }

  static async findByKode(kode: string) {
    return prisma.departemen.findFirst({
      where: { kodeDepartemen: kode, deletedAt: null },
    });
  }

  static async create(data: Prisma.DepartemenCreateInput) {
    return prisma.departemen.create({ data });
  }

  static async update(id: number, data: Prisma.DepartemenUpdateInput) {
    return prisma.departemen.update({
      where: { idDepartemen: id },
      data,
    });
  }

  static async softDelete(id: number) {
    return prisma.departemen.update({
      where: { idDepartemen: id },
      data: { deletedAt: new Date() },
    });
  }

  static async countPegawaiByDepartemen(id: number) {
    return prisma.pegawai.count({
      where: { idDepartemen: id, deletedAt: null },
    });
  }

  static async getAll() {
    return prisma.departemen.findMany({
      where: { deletedAt: null },
      orderBy: { namaDepartemen: 'asc' },
      include: {
        kepala: { select: { idPegawai: true, namaLengkap: true, nip: true } },
      },
    });
  }
}
