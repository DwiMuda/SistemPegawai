import { prisma } from '../server';

export class NotifikasiRepository {
  static async findByUser(idUser: number, unreadOnly: boolean = false) {
    const where: any = { idUser };
    if (unreadOnly) {
      where.isRead = false;
    }

    return prisma.notifikasi.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to latest 50 notifications
    });
  }

  static async countUnread(idUser: number) {
    return prisma.notifikasi.count({
      where: {
        idUser,
        isRead: false
      }
    });
  }

  static async markAsRead(idNotifikasi: number, idUser: number) {
    return prisma.notifikasi.updateMany({
      where: {
        idNotifikasi,
        idUser
      },
      data: { isRead: true }
    });
  }

  static async markAllAsRead(idUser: number) {
    return prisma.notifikasi.updateMany({
      where: {
        idUser,
        isRead: false
      },
      data: { isRead: true }
    });
  }

  static async create(data: {
    idUser: number;
    idPegawai?: number;
    judul: string;
    pesan: string;
    tipe: 'info' | 'success' | 'warning' | 'danger';
    terkaitTabel?: string;
    terkaitId?: number;
  }) {
    return prisma.notifikasi.create({ data });
  }

  // Create notifications for multiple users
  static async createMany(data: any[]) {
    return prisma.notifikasi.createMany({ data });
  }
}
