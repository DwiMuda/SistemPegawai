import { prisma } from '../server';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { PajakService } from './pajak.service';
import { PenggajianRepository } from '../repositories/penggajian.repository';
import { SettingService } from './setting.service';
import { NotifikasiService } from './notifikasi.service';

export interface GeneratePenggajianInput {
  bulan: number;
  tahun: number;
}

export interface UpdateKomponenInput {
  bonus?: number;
  potonganLain?: number;
  keterangan?: string | null;
}

export interface PenggajianQueryOptions {
  bulan?: number;
  tahun?: number;
  idPegawai?: number;
  idDepartemen?: number;
  status?: string;
}

export class PenggajianService {
  static async generate(data: GeneratePenggajianInput, idAdmin: number) {
    const { bulan, tahun } = data;

    // 1. Ambil semua pegawai aktif beserta jabatannya
    const pegawaiAktif = await prisma.pegawai.findMany({
      where: { statusPegawai: 'aktif' },
      include: { jabatan: true }
    });

    if (pegawaiAktif.length === 0) {
      throw new ValidationError('Tidak ada pegawai aktif untuk digenerate gajinya');
    }

    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0, 23, 59, 59);

    // Ambil setting finansial sekali di luar loop
    const hariKerjaDefault = await SettingService.getNumber('HARI_KERJA_DEFAULT', 25);
    const bpjsRate = await SettingService.getNumber('BPJS_RATE', 0.03);
    const settingTunjanganTransport = await SettingService.getNumber('TUNJANGAN_TRANSPORT', 300000);
    const settingTunjanganMakan = await SettingService.getNumber('TUNJANGAN_MAKAN', 20000);
    const ptkpDefault = await SettingService.getNumber('PTKP_DEFAULT', 54000000);

    let generatedCount = 0;

    // 2. Loop per pegawai dan hitung gajinya
    for (const p of pegawaiAktif) {
      // Ambil absensi dalam bulan ini
      const absensi = await prisma.absensi.findMany({
        where: {
          idPegawai: p.idPegawai,
          tanggal: { gte: startDate, lte: endDate }
        }
      });

      let hariHadir = 0;
      let hariAlpha = 0;

      for (const a of absensi) {
        if (a.status === 'hadir' || a.status === 'terlambat') {
          hariHadir++;
        } else if (a.status === 'alpha') {
          hariAlpha++;
        }
      }

      // Hitung Lembur Bulan Ini (yang disetujui)
      const lemburBulanIni = await prisma.lembur.findMany({
        where: {
          idPegawai: p.idPegawai,
          status: 'disetujui',
          tanggal: { gte: startDate, lte: endDate }
        }
      });
      const upahLembur = lemburBulanIni.reduce((sum, item) => sum + item.totalUpah, 0);

      // Hitung Kasbon (yang disetujui, siap dipotong)
      const kasbonList = await prisma.kasbon.findMany({
        where: {
          idPegawai: p.idPegawai,
          status: 'disetujui'
        }
      });
      const potonganKasbon = kasbonList.reduce((sum, item) => sum + item.jumlah, 0);

      // Hitung Reimbursement (yang disetujui, siap ditambahkan)
      const reimburseList = await prisma.reimbursement.findMany({
        where: {
          idPegawai: p.idPegawai,
          status: 'disetujui'
        }
      });
      const tambahanReimburse = reimburseList.reduce((sum, item) => sum + item.jumlah, 0);

      // Komponen Dasar
      const gajiPokok = p.jabatan.gajiPokokDefault;
      const tunjanganJabatan = p.jabatan.tunjanganDefault;
      
      // Asumsi setting dari DB atau konstanta (disini pakai konstanta default)
      const tunjanganTransport = settingTunjanganTransport;
      const tunjanganMakanPerHari = settingTunjanganMakan;
      const tunjanganMakan = hariHadir * tunjanganMakanPerHari;
      const bonus = tambahanReimburse; // Masukkan reimburse ke bonus default

      // Potongan
      // Asumsi 1 hari alpha memotong = (gajiPokok / 25)
      const potonganAbsensi = Math.round(hariAlpha * (gajiPokok / hariKerjaDefault));
      
      // BPJS 3% dari Gaji Pokok
      const potonganBpjs = Math.round(gajiPokok * bpjsRate);

      // PPh 21 dari Gaji Sebulan Bruto (Pokok + Tunjangan + Lembur)
      const totalBruto = gajiPokok + tunjanganJabatan + tunjanganTransport + tunjanganMakan + bonus + upahLembur;
      const potonganPajak = PajakService.hitungPPh21Bulanan(totalBruto, ptkpDefault);

      const potonganLain = potonganKasbon; // Masukkan kasbon ke potongan lain

      // Total Gaji
      const totalGaji = Math.round(totalBruto - (potonganAbsensi + potonganBpjs + potonganPajak + potonganLain));

      // 3. Simpan ke database (Upsert)
      await PenggajianRepository.upsert(bulan, tahun, p.idPegawai, {
          gajiPokok,
          tunjanganJabatan,
          tunjanganTransport,
          tunjanganMakan,
          bonus,
          upahLembur,
          potonganAbsensi,
          potonganBpjs,
          potonganPajak,
          potonganLain,
          totalGaji,
          statusBayar: 'pending',
          idAdmin
      });

      generatedCount++;
    }

    return { generatedCount };
  }

  static async getAll(options?: PenggajianQueryOptions) {
    let whereClause: any = {};

    if (options?.bulan) whereClause.periodeBulan = options.bulan;
    if (options?.tahun) whereClause.periodeTahun = options.tahun;
    if (options?.idPegawai) whereClause.idPegawai = options.idPegawai;
    if (options?.status) whereClause.statusBayar = options.status;

    if (options?.idDepartemen) {
      whereClause.pegawai = { idDepartemen: options.idDepartemen };
    }

    return await PenggajianRepository.findAll(whereClause);
  }

  static async getById(idPenggajian: number) {
    const data = await PenggajianRepository.findById(idPenggajian);

    if (!data) throw new NotFoundError('Data penggajian tidak ditemukan');
    return data;
  }

  static async updateKomponen(idGaji: number, idAdmin: number, data: UpdateKomponenInput) {
    const gaji = await PenggajianRepository.findById(idGaji);
    if (!gaji) throw new NotFoundError('Data penggajian tidak ditemukan');

    if (gaji.statusBayar === 'dibayar') {
      throw new ValidationError('Tidak dapat mengubah data yang sudah dibayar');
    }

    const bonus = data.bonus !== undefined ? data.bonus : gaji.bonus;
    const potonganLain = data.potonganLain !== undefined ? data.potonganLain : gaji.potonganLain;

    const ptkpDefault = await SettingService.getNumber('PTKP_DEFAULT', 54000000);

    // Rekalkulasi Pajak & Total Gaji
    const totalBruto = gaji.gajiPokok + gaji.tunjanganJabatan + gaji.tunjanganTransport + gaji.tunjanganMakan + bonus + gaji.upahLembur;
    const potonganPajak = Math.round(PajakService.hitungPPh21Bulanan(totalBruto, ptkpDefault));
    const totalGaji = Math.round(totalBruto - (gaji.potonganAbsensi + gaji.potonganBpjs + potonganPajak + potonganLain));

    return await PenggajianRepository.update(idGaji, {
      bonus,
      potonganLain,
      potonganPajak,
      totalGaji,
      keterangan: data.keterangan,
      idAdmin
    });
  }

  static async bayarGaji(idPenggajian: number, idAdmin: number, tanggalPembayaran: string) {
    const penggajian = await PenggajianRepository.findById(idPenggajian);

    if (!penggajian) {
      throw new NotFoundError('Data penggajian tidak ditemukan');
    }

    if (penggajian.statusBayar === 'dibayar') {
      throw new ValidationError('Gaji ini sudah dibayarkan');
    }

    const result = await PenggajianRepository.update(idPenggajian, {
      statusBayar: 'dibayar',
      tanggalBayar: new Date(tanggalPembayaran),
      idAdmin
    });

    // Update status Kasbon jadi lunas
    await prisma.kasbon.updateMany({
      where: { idPegawai: result.idPegawai, status: 'disetujui' },
      data: { status: 'lunas', bulanPotong: result.periodeBulan, tahunPotong: result.periodeTahun, idAdmin }
    });

    // Update status Reimbursement jadi dibayar
    await prisma.reimbursement.updateMany({
      where: { idPegawai: result.idPegawai, status: 'disetujui' },
      data: { status: 'dibayar', bulanBayar: result.periodeBulan, tahunBayar: result.periodeTahun, idAdmin }
    });

    // Kirim notifikasi ke pegawai
    const formatRp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(result.totalGaji);
    const user = await prisma.users.findFirst({ where: { idPegawai: result.idPegawai } });
    if (user) {
      await NotifikasiService.sendToUser(user.idUser, {
        judul: 'Gaji Telah Dibayarkan',
        pesan: `Gaji Anda untuk periode bulan ${result.periodeBulan} tahun ${result.periodeTahun} telah dibayarkan sebesar ${formatRp}. Silakan cek slip gaji Anda.`,
        tipe: 'success',
        terkaitTabel: 'penggajian',
        terkaitId: result.idGaji
      });
    }

    return result;
  }

  static async bayarMassal(ids: number[], idAdmin: number, tanggalPembayaran: string) {
    const date = new Date(tanggalPembayaran);

    const updatedCount = await prisma.$transaction(async (tx) => {
      let count = 0;
      for (const id of ids) {
        const penggajian = await tx.penggajian.findUnique({ where: { idGaji: id } });
        if (penggajian && penggajian.statusBayar !== 'dibayar') {
          const result = await tx.penggajian.update({
            where: { idGaji: id },
            data: {
              statusBayar: 'dibayar',
              tanggalBayar: date,
              idAdmin
            }
          });

          // Update status Kasbon & Reimbursement
          await tx.kasbon.updateMany({
            where: { idPegawai: result.idPegawai, status: 'disetujui' },
            data: { status: 'lunas', bulanPotong: result.periodeBulan, tahunPotong: result.periodeTahun, idAdmin }
          });
          await tx.reimbursement.updateMany({
            where: { idPegawai: result.idPegawai, status: 'disetujui' },
            data: { status: 'dibayar', bulanBayar: result.periodeBulan, tahunBayar: result.periodeTahun, idAdmin }
          });

          // Kirim notifikasi
          try {
            const formatRp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(result.totalGaji);
            const user = await tx.users.findFirst({ where: { idPegawai: result.idPegawai } });
            if (user) {
              await NotifikasiService.sendToUser(user.idUser, {
                judul: 'Gaji Telah Dibayarkan',
                pesan: `Gaji Anda untuk periode bulan ${result.periodeBulan} tahun ${result.periodeTahun} telah dibayarkan sebesar ${formatRp}. Silakan cek slip gaji Anda.`,
                tipe: 'success',
                terkaitTabel: 'penggajian',
                terkaitId: result.idGaji
              });
            }
          } catch (notifErr) {
            console.error(`Gagal mengirim notif gaji untuk idPegawai: ${result.idPegawai}`, notifErr);
          }

          count++;
        }
      }
      return count;
    });

    return { updatedCount };
  }

  static async batalBayar(idPenggajian: number, idAdmin: number) {
    const penggajian = await PenggajianRepository.findById(idPenggajian);

    if (!penggajian) {
      throw new NotFoundError('Data penggajian tidak ditemukan');
    }

    if (penggajian.statusBayar === 'batal') {
      throw new ValidationError('Gaji ini sudah dibatalkan');
    }

    return await PenggajianRepository.update(idPenggajian, {
      statusBayar: 'batal',
      tanggalBayar: null,
      idAdmin
    });
  }
}
