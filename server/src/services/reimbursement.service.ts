import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { NotifikasiService } from './notifikasi.service';

export const reimbursementService = {
  async getAll() {
    return prisma.reimbursement.findMany({
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
    return prisma.reimbursement.findMany({
      where: { idPegawai },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getById(id: number) {
    return prisma.reimbursement.findUnique({
      where: { idReimburse: id },
      include: { pegawai: true }
    });
  },

  async create(data: any, idPegawai: number, buktiFile?: string) {
    const reimbursement = await prisma.reimbursement.create({
      data: {
        idPegawai,
        jenis: data.jenis,
        jumlah: parseFloat(data.jumlah),
        deskripsi: data.deskripsi,
        tanggal: data.tanggal ? new Date(data.tanggal) : new Date(),
        buktiFile
      }
    });
    
    const pegawai = await prisma.pegawai.findUnique({ where: { idPegawai } });
    await NotifikasiService.sendToAdmin({
      judul: 'Pengajuan Reimbursement Baru',
      pesan: `${pegawai?.namaLengkap || 'Pegawai'} mengajukan reimbursement sebesar Rp${data.jumlah}`,
      tipe: 'info',
      terkaitTabel: 'reimbursement',
      terkaitId: reimbursement.idReimburse
    });
    
    return reimbursement;
  },

  async approve(id: number, idAdmin: number, catatanAdmin?: string) {
    const reimbursement = await prisma.reimbursement.update({
      where: { idReimburse: id },
      data: {
        status: 'disetujui',
        idAdmin,
        catatanAdmin
      }
    });
    
    const user = await prisma.users.findUnique({ where: { idPegawai: reimbursement.idPegawai } });
    if (user) {
      await NotifikasiService.sendToUser(user.idUser, {
        judul: 'Reimbursement Disetujui',
        pesan: `Pengajuan reimbursement Anda sebesar Rp${reimbursement.jumlah} telah disetujui.`,
        tipe: 'success',
        terkaitTabel: 'reimbursement',
        terkaitId: reimbursement.idReimburse
      });
    }
    
    return reimbursement;
  },

  async reject(id: number, idAdmin: number, catatanAdmin: string) {
    const reimbursement = await prisma.reimbursement.update({
      where: { idReimburse: id },
      data: {
        status: 'ditolak',
        idAdmin,
        catatanAdmin
      }
    });
    
    const user = await prisma.users.findUnique({ where: { idPegawai: reimbursement.idPegawai } });
    if (user) {
      await NotifikasiService.sendToUser(user.idUser, {
        judul: 'Reimbursement Ditolak',
        pesan: `Pengajuan reimbursement Anda ditolak: ${catatanAdmin}`,
        tipe: 'danger',
        terkaitTabel: 'reimbursement',
        terkaitId: reimbursement.idReimburse
      });
    }
    
    return reimbursement;
  }
};
