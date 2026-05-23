import { prisma } from '../server';
import type { Prisma } from '@prisma/client';

export class JabatanRepository {
  static async findAll(params: {
    skip?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { skip = 0, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const where: Prisma.JabatanWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { namaJabatan: { contains: search } },
              { deskripsi: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.jabatan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { pegawai: true } },
        },
      }),
      prisma.jabatan.count({ where }),
    ]);

    return { data, total };
  }

  static async findById(id: number) {
    return prisma.jabatan.findFirst({
      where: { idJabatan: id, deletedAt: null },
      include: {
        _count: { select: { pegawai: true } },
      },
    });
  }

  static async findByNama(nama: string) {
    return prisma.jabatan.findFirst({
      where: { namaJabatan: nama, deletedAt: null },
    });
  }

  static async create(data: Prisma.JabatanCreateInput) {
    return prisma.jabatan.create({ data });
  }

  static async update(id: number, data: Prisma.JabatanUpdateInput) {
    return prisma.jabatan.update({
      where: { idJabatan: id },
      data,
    });
  }

  static async softDelete(id: number) {
    return prisma.jabatan.update({
      where: { idJabatan: id },
      data: { deletedAt: new Date() },
    });
  }

  static async countPegawaiByJabatan(id: number) {
    return prisma.pegawai.count({
      where: { idJabatan: id, deletedAt: null },
    });
  }

  static async getAll() {
    return prisma.jabatan.findMany({
      where: { deletedAt: null },
      orderBy: { namaJabatan: 'asc' },
    });
  }
}
