import { prisma } from '../server';
import { generateRekapPenggajianExcel } from '../utils/excel';

export class LaporanService {
  static async rekapAbsensi(bulan: number, tahun: number) {
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0, 23, 59, 59);

    const absensi = await prisma.absensi.findMany({
      where: {
        tanggal: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        pegawai: {
          include: {
            departemen: true,
            jabatan: true
          }
        }
      },
      orderBy: [
        { pegawai: { namaLengkap: 'asc' } },
        { tanggal: 'asc' }
      ]
    });

    // Grouping per pegawai
    const rekapMap = new Map<number, any>();
    
    absensi.forEach(a => {
      if (!rekapMap.has(a.idPegawai)) {
        rekapMap.set(a.idPegawai, {
          nip: a.pegawai.nip,
          nama: a.pegawai.namaLengkap,
          departemen: a.pegawai.departemen.namaDepartemen,
          hadir: 0,
          izin: 0,
          sakit: 0,
          alpha: 0,
          totalTerlambatMenit: 0
        });
      }
      
      const record = rekapMap.get(a.idPegawai);
      if (a.status === 'hadir') record.hadir++;
      if (a.status === 'izin') record.izin++;
      if (a.status === 'sakit') record.sakit++;
      if (a.status === 'alpha') record.alpha++;
      if (a.isLate) record.totalTerlambatMenit += 15; // approximate late time or use real time if stored
    });

    return Array.from(rekapMap.values());
  }

  static async rekapPenggajian(bulan: number, tahun: number, format: 'json' | 'excel' = 'json') {
    const gaji = await prisma.penggajian.findMany({
      where: {
        periodeBulan: bulan,
        periodeTahun: tahun,
      },
      include: {
        pegawai: {
          include: {
            departemen: true,
            jabatan: true
          }
        }
      },
      orderBy: { pegawai: { namaLengkap: 'asc' } }
    });

    const data = gaji.map(item => ({
      nip: item.pegawai.nip,
      namaLengkap: item.pegawai.namaLengkap,
      departemen: item.pegawai.departemen.namaDepartemen,
      jabatan: item.pegawai.jabatan.namaJabatan,
      gajiPokok: item.gajiPokok,
      tunjangan: item.tunjanganJabatan + item.tunjanganTransport + item.tunjanganMakan + item.upahLembur + item.bonus,
      potongan: item.potonganAbsensi + item.potonganBpjs + item.potonganPajak + item.potonganLain,
      totalGaji: item.totalGaji,
      status: item.statusBayar
    }));

    if (format === 'excel') {
      const buffer = await generateRekapPenggajianExcel({
        periodeBulan: bulan,
        periodeTahun: tahun,
        data
      });
      return buffer;
    }

    return data;
  }

  static async exportPegawai() {
    const pegawai = await prisma.pegawai.findMany({
      include: {
        departemen: true,
        jabatan: true
      },
      orderBy: { namaLengkap: 'asc' }
    });

    return pegawai.map(p => ({
      nip: p.nip,
      nama: p.namaLengkap,
      email: p.email,
      departemen: p.departemen.namaDepartemen,
      jabatan: p.jabatan.namaJabatan,
      status: p.statusPegawai === 'aktif' ? 'Aktif' : 'Non-Aktif',
      tanggalBergabung: p.tanggalMasuk
    }));
  }
}
