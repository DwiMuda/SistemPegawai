import { prisma } from '../server';
import { NotFoundError } from '../utils/AppError';

export class DashboardService {
  static async getPegawaiDashboard(userId: number) {
    // 1. Get Pegawai Info
    const user = await prisma.users.findUnique({
      where: { idUser: userId },
      include: {
        pegawai: {
          include: {
            jabatan: true,
            departemen: true
          }
        }
      }
    });

    if (!user || !user.pegawai) {
      throw new NotFoundError('Data pegawai tidak ditemukan');
    }

    const pegawai = user.pegawai;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Absensi Hari Ini
    const absensiHariIni = await prisma.absensi.findFirst({
      where: {
        idPegawai: pegawai.idPegawai,
        tanggal: today
      }
    });

    // 3. Penggajian Terakhir
    const gajiTerakhir = await prisma.penggajian.findFirst({
      where: {
        idPegawai: pegawai.idPegawai,
        statusBayar: 'dibayar'
      },
      orderBy: [
        { periodeTahun: 'desc' },
        { periodeBulan: 'desc' }
      ]
    });

    // 4. Cuti Pending
    const cutiPending = await prisma.pengajuanCuti.count({
      where: {
        idPegawai: pegawai.idPegawai,
        status: 'pending'
      }
    });

    // 5. Notifikasi Unread (Menyusul di Fase Notifikasi, sementara return 0)
    const notifikasiUnread = await prisma.notifikasi.count({
      where: {
        idUser: userId,
        isRead: false
      }
    });

    return {
      profil: {
        namaLengkap: pegawai.namaLengkap,
        nip: pegawai.nip,
        jabatan: pegawai.jabatan.namaJabatan,
        departemen: pegawai.departemen.namaDepartemen,
        sisaCuti: pegawai.sisaCuti,
        foto: pegawai.foto
      },
      absensiHariIni,
      gajiTerakhir,
      statistik: {
        cutiPending,
        notifikasiUnread
      }
    };
  }

  // Admin stats
  static async getAdminDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total Pegawai Aktif
    const totalPegawai = await prisma.pegawai.count({
      where: { statusPegawai: 'aktif' }
    });

    // Hadir Hari Ini
    const hadirHariIni = await prisma.absensi.count({
      where: {
        tanggal: today,
        status: 'hadir'
      }
    });

    // Cuti Pending
    const cutiPending = await prisma.pengajuanCuti.count({
      where: { status: 'pending' }
    });

    // Total Gaji Bulan Ini
    const aggregateGaji = await prisma.penggajian.aggregate({
      where: {
        periodeBulan: today.getMonth() + 1,
        periodeTahun: today.getFullYear(),
        statusBayar: 'dibayar'
      },
      _sum: { totalGaji: true }
    });
    const totalGajiBulanIni = aggregateGaji._sum.totalGaji || 0;

    // Trend Absensi 7 Hari Terakhir
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    const trendAbsensi = await Promise.all(last7Days.map(async (date) => {
      const count = await prisma.absensi.count({
        where: {
          tanggal: date,
          status: 'hadir'
        }
      });
      return { 
        tanggal: date.toLocaleDateString('id-ID', { weekday: 'short' }), 
        hadir: count 
      };
    }));

    return {
      statistik: {
        totalPegawai,
        hadirHariIni,
        cutiPending,
        totalGajiBulanIni
      },
      trendAbsensi
    };
  }
}
