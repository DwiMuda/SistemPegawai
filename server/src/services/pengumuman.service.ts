import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const pengumumanService = {
  async getAll() {
    return prisma.pengumuman.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            username: true,
            pegawai: { select: { namaLengkap: true } }
          }
        }
      }
    });
  },

  async getActive() {
    const now = new Date();
    return prisma.pengumuman.findMany({
      where: {
        tanggalMulai: { lte: now },
        OR: [
          { tanggalSelesai: null },
          { tanggalSelesai: { gte: now } }
        ]
      },
      orderBy: { tanggalMulai: 'desc' }
    });
  },

  async getById(id: number) {
    return prisma.pengumuman.findUnique({
      where: { idPengumuman: id }
    });
  },

  async create(data: any, idAdmin: number) {
    return prisma.pengumuman.create({
      data: {
        judul: data.judul,
        konten: data.konten,
        tanggalMulai: data.tanggalMulai ? new Date(data.tanggalMulai) : new Date(),
        tanggalSelesai: data.tanggalSelesai ? new Date(data.tanggalSelesai) : null,
        idAdmin
      }
    });
  },

  async update(id: number, data: any) {
    return prisma.pengumuman.update({
      where: { idPengumuman: id },
      data: {
        judul: data.judul,
        konten: data.konten,
        tanggalMulai: data.tanggalMulai ? new Date(data.tanggalMulai) : undefined,
        tanggalSelesai: data.tanggalSelesai ? new Date(data.tanggalSelesai) : null
      }
    });
  },

  async delete(id: number) {
    return prisma.pengumuman.delete({
      where: { idPengumuman: id }
    });
  }
};
