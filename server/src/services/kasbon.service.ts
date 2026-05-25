import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { NotifikasiService } from './notifikasi.service';

export const kasbonService = {
  async getAll() {
    return prisma.kasbon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        pegawai: {
          select: { nip: true, namaLengkap: true, departemen: { select: { namaDepartemen: true } } }
        },
        admin: { select: { username: true } }
      }
    });
  },

  async getByPegawai(idPegawai: number) {
    return prisma.kasbon.findMany({
      where: { idPegawai },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getById(id: number) {
    return prisma.kasbon.findUnique({
      where: { idKasbon: id },
      include: { pegawai: true }
    });
  },

  async create(data: any, idPegawai: number) {
    const kasbon = await prisma.kasbon.create({
      data: {
        idPegawai,
        jumlah: data.jumlah,
        alasan: data.alasan,
        tanggal: data.tanggal ? new Date(data.tanggal) : new Date()
      }
    });
    
    const pegawai = await prisma.pegawai.findUnique({ where: { idPegawai } });
    await NotifikasiService.sendToAdmin({
      judul: 'Pengajuan Kasbon Baru',
      pesan: `${pegawai?.namaLengkap || 'Pegawai'} mengajukan kasbon sebesar Rp${data.jumlah}`,
      tipe: 'info',
      terkaitTabel: 'kasbon',
      terkaitId: kasbon.idKasbon
    });
    
    return kasbon;
  },

  async approve(id: number, idAdmin: number, catatanAdmin?: string) {
    const kasbon = await prisma.kasbon.update({
      where: { idKasbon: id },
      data: {
        status: 'disetujui',
        idAdmin,
        catatanAdmin
      }
    });
    
    const user = await prisma.users.findUnique({ where: { idPegawai: kasbon.idPegawai } });
    if (user) {
      await NotifikasiService.sendToUser(user.idUser, {
        judul: 'Kasbon Disetujui',
        pesan: `Pengajuan kasbon Anda sebesar Rp${kasbon.jumlah} telah disetujui.`,
        tipe: 'success',
        terkaitTabel: 'kasbon',
        terkaitId: kasbon.idKasbon
      });
    }
    
    return kasbon;
  },

  async reject(id: number, idAdmin: number, catatanAdmin: string) {
    const kasbon = await prisma.kasbon.update({
      where: { idKasbon: id },
      data: {
        status: 'ditolak',
        idAdmin,
        catatanAdmin
      }
    });
    
    const user = await prisma.users.findUnique({ where: { idPegawai: kasbon.idPegawai } });
    if (user) {
      await NotifikasiService.sendToUser(user.idUser, {
        judul: 'Kasbon Ditolak',
        pesan: `Pengajuan kasbon Anda ditolak: ${catatanAdmin}`,
        tipe: 'danger',
        terkaitTabel: 'kasbon',
        terkaitId: kasbon.idKasbon
      });
    }
    
    return kasbon;
  }
};
