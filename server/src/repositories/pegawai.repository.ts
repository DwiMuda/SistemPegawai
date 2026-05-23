import { prisma } from '../server';
import type { Prisma } from '@prisma/client';

export class PegawaiRepository {
  static async findAll(params: {
    skip?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    idDepartemen?: number;
    idJabatan?: number;
    statusPegawai?: string;
  }) {
    const { skip = 0, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', idDepartemen, idJabatan, statusPegawai } = params;

    const where: Prisma.PegawaiWhereInput = {
      deletedAt: null,
      ...(idDepartemen ? { idDepartemen } : {}),
      ...(idJabatan ? { idJabatan } : {}),
      ...(statusPegawai ? { statusPegawai } : {}),
      ...(search
        ? {
            OR: [
              { namaLengkap: { contains: search } },
              { nip: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.pegawai.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          jabatan: { select: { idJabatan: true, namaJabatan: true } },
          departemen: { select: { idDepartemen: true, namaDepartemen: true } },
        },
      }),
      prisma.pegawai.count({ where }),
    ]);

    return { data, total };
  }

  static async findById(id: number) {
    return prisma.pegawai.findFirst({
      where: { idPegawai: id, deletedAt: null },
      include: {
        jabatan: { select: { idJabatan: true, namaJabatan: true } },
        departemen: { select: { idDepartemen: true, namaDepartemen: true } },
      },
    });
  }

  static async findByNip(nip: string) {
    return prisma.pegawai.findFirst({
      where: { nip, deletedAt: null },
    });
  }

  static async findByEmail(email: string) {
    return prisma.pegawai.findFirst({
      where: { email, deletedAt: null },
    });
  }

  static async create(data: Prisma.PegawaiCreateInput) {
    return prisma.pegawai.create({ data });
  }

  static async update(id: number, data: Prisma.PegawaiUpdateInput) {
    return prisma.pegawai.update({
      where: { idPegawai: id },
      data,
    });
  }

  static async softDelete(id: number) {
    return prisma.pegawai.update({
      where: { idPegawai: id },
      data: { deletedAt: new Date(), statusPegawai: 'nonaktif' },
    });
  }

  static async getAll() {
    return prisma.pegawai.findMany({
      where: { deletedAt: null },
      orderBy: { namaLengkap: 'asc' },
      include: {
        jabatan: { select: { idJabatan: true, namaJabatan: true } },
        departemen: { select: { idDepartemen: true, namaDepartemen: true } },
      },
    });
  }
}
