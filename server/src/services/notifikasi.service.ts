import { NotifikasiRepository } from '../repositories/notifikasi.repository';
import { prisma } from '../server';

export class NotifikasiService {
  static async getUserNotifications(idUser: number, unreadOnly: boolean = false) {
    return NotifikasiRepository.findByUser(idUser, unreadOnly);
  }

  static async getUnreadCount(idUser: number) {
    return NotifikasiRepository.countUnread(idUser);
  }

  static async markAsRead(idNotifikasi: number, idUser: number) {
    return NotifikasiRepository.markAsRead(idNotifikasi, idUser);
  }

  static async markAllAsRead(idUser: number) {
    return NotifikasiRepository.markAllAsRead(idUser);
  }

  // System methods to send notifications
  static async sendToUser(idUser: number, payload: {
    judul: string;
    pesan: string;
    tipe?: 'info' | 'success' | 'warning' | 'danger';
    terkaitTabel?: string;
    terkaitId?: number;
  }) {
    return NotifikasiRepository.create({
      idUser,
      judul: payload.judul,
      pesan: payload.pesan,
      tipe: payload.tipe || 'info',
      terkaitTabel: payload.terkaitTabel,
      terkaitId: payload.terkaitId
    });
  }

  static async sendToAdmin(payload: {
    judul: string;
    pesan: string;
    tipe?: 'info' | 'success' | 'warning' | 'danger';
    terkaitTabel?: string;
    terkaitId?: number;
  }) {
    // Find all admin users
    const admins = await prisma.users.findMany({
      where: { role: 'admin', isActive: true },
      select: { idUser: true }
    });

    const notifData = admins.map(admin => ({
      idUser: admin.idUser,
      judul: payload.judul,
      pesan: payload.pesan,
      tipe: payload.tipe || 'info',
      terkaitTabel: payload.terkaitTabel,
      terkaitId: payload.terkaitId
    }));

    if (notifData.length > 0) {
      return NotifikasiRepository.createMany(notifData);
    }
    return null;
  }
}
