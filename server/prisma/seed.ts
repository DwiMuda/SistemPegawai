import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.users.count();
  if (userCount > 0) {
    console.log('Database already seeded. Skipping...');
    return;
  }

  console.log('Menghapus data lama...');
  // Hapus data dari bawah ke atas sesuai relasi untuk menghindari foreign key constraint error
  await prisma.setting.deleteMany();
  await prisma.pengajuanCuti.deleteMany();
  await prisma.absensi.deleteMany();
  await prisma.users.deleteMany({ where: { role: 'pegawai' } });
  await prisma.pegawai.deleteMany();
  await prisma.departemen.deleteMany();
  await prisma.jabatan.deleteMany();
  
  console.log('Seeding database...');

  // 0. Create Settings
  await prisma.setting.createMany({
    data: [
      { key: 'HARI_KERJA_DEFAULT', value: '25', deskripsi: 'Jumlah hari kerja dalam sebulan' },
      { key: 'DIVISOR_LEMBUR', value: '173', deskripsi: 'Pembagi untuk menghitung upah lembur per jam' },
      { key: 'BPJS_RATE', value: '0.03', deskripsi: 'Persentase potongan BPJS dari gaji pokok' },
      { key: 'TUNJANGAN_TRANSPORT', value: '300000', deskripsi: 'Tunjangan transport bulanan default' },
      { key: 'TUNJANGAN_MAKAN', value: '20000', deskripsi: 'Tunjangan makan per hari kehadiran' },
      { key: 'PTKP_DEFAULT', value: '54000000', deskripsi: 'Penghasilan Tidak Kena Pajak (TK/0)' },
    ]
  });
  console.log(`[0] Created default settings`);

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.users.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'admin',
      isActive: true,
    },
  });
  console.log(`[1] Created admin user: admin / admin123`);

  // 2. Create 5 Jabatan
  const dataJabatan = [
    { namaJabatan: 'Direktur', deskripsi: 'Direktur Utama', gajiPokokDefault: 20000000, tunjanganDefault: 5000000 },
    { namaJabatan: 'Manajer', deskripsi: 'Manajer Departemen', gajiPokokDefault: 15000000, tunjanganDefault: 3000000 },
    { namaJabatan: 'Supervisor', deskripsi: 'Supervisor Tim', gajiPokokDefault: 10000000, tunjanganDefault: 2000000 },
    { namaJabatan: 'Staff Senior', deskripsi: 'Staff Berpengalaman', gajiPokokDefault: 8000000, tunjanganDefault: 1000000 },
    { namaJabatan: 'Staff Junior', deskripsi: 'Staff Baru', gajiPokokDefault: 5000000, tunjanganDefault: 500000 },
  ];

  const jabatanMap = new Map();
  for (const j of dataJabatan) {
    const created = await prisma.jabatan.create({ data: j });
    jabatanMap.set(j.namaJabatan, created.idJabatan);
  }
  console.log(`[2] Created 5 Jabatan`);

  // 3. Create 3 Departemen
  const dataDepartemen = [
    { namaDepartemen: 'Information Technology', kodeDepartemen: 'IT' },
    { namaDepartemen: 'Human Resources', kodeDepartemen: 'HR' },
    { namaDepartemen: 'Keuangan', kodeDepartemen: 'FIN' },
  ];

  const deptMap = new Map();
  for (const d of dataDepartemen) {
    const created = await prisma.departemen.create({ data: d });
    deptMap.set(d.kodeDepartemen, created.idDepartemen);
  }
  console.log(`[3] Created 3 Departemen`);

  // 4. Create 10 Pegawai & Users (Password: pegawai123)
  const pegawaiPassword = await bcrypt.hash('pegawai123', 10);
  const dataPegawai = [
    { nip: 'PEG-0001', namaLengkap: 'Budi Santoso', jenisKelamin: 'L', jabatan: 'Direktur', dept: 'IT' },
    { nip: 'PEG-0002', namaLengkap: 'Siti Aminah', jenisKelamin: 'P', jabatan: 'Manajer', dept: 'HR' },
    { nip: 'PEG-0003', namaLengkap: 'Andi Wijaya', jenisKelamin: 'L', jabatan: 'Manajer', dept: 'FIN' },
    { nip: 'PEG-0004', namaLengkap: 'Rina Kartika', jenisKelamin: 'P', jabatan: 'Supervisor', dept: 'IT' },
    { nip: 'PEG-0005', namaLengkap: 'Eko Prasetyo', jenisKelamin: 'L', jabatan: 'Supervisor', dept: 'FIN' },
    { nip: 'PEG-0006', namaLengkap: 'Dewi Lestari', jenisKelamin: 'P', jabatan: 'Staff Senior', dept: 'IT' },
    { nip: 'PEG-0007', namaLengkap: 'Fajar Hidayat', jenisKelamin: 'L', jabatan: 'Staff Senior', dept: 'HR' },
    { nip: 'PEG-0008', namaLengkap: 'Gita Pertiwi', jenisKelamin: 'P', jabatan: 'Staff Senior', dept: 'FIN' },
    { nip: 'PEG-0009', namaLengkap: 'Hendra Saputra', jenisKelamin: 'L', jabatan: 'Staff Junior', dept: 'IT' },
    { nip: 'PEG-0010', namaLengkap: 'Intan Permata', jenisKelamin: 'P', jabatan: 'Staff Junior', dept: 'HR' },
  ];

  const pegawaiIds: number[] = [];

  for (const p of dataPegawai) {
    const tglMasuk = new Date();
    tglMasuk.setFullYear(tglMasuk.getFullYear() - 2);
    
    const pegawai = await prisma.pegawai.create({
      data: {
        nip: p.nip,
        namaLengkap: p.namaLengkap,
        jenisKelamin: p.jenisKelamin,
        tanggalLahir: new Date('1990-01-15'),
        tempatLahir: 'Jakarta',
        alamat: 'Jl. Merdeka No. 1, Jakarta',
        noTelpon: '081234567890',
        email: `${p.namaLengkap.split(' ')[0].toLowerCase()}@example.com`,
        idJabatan: jabatanMap.get(p.jabatan),
        idDepartemen: deptMap.get(p.dept),
        tanggalMasuk: tglMasuk,
        statusPegawai: 'aktif',
      }
    });
    pegawaiIds.push(pegawai.idPegawai);

    // Create user login
    await prisma.users.create({
      data: {
        username: p.nip,
        passwordHash: pegawaiPassword,
        role: 'pegawai',
        idPegawai: pegawai.idPegawai,
        isActive: true,
      }
    });

    // Set Kepala Departemen if Manager or Director
    if (p.jabatan === 'Direktur' || p.jabatan === 'Manajer') {
      await prisma.departemen.update({
        where: { idDepartemen: deptMap.get(p.dept) },
        data: { idKepala: pegawai.idPegawai }
      });
    }
  }
  console.log(`[4] Created 10 Pegawai & User Logins (password: pegawai123)`);

  // 5. Create 30 Hari Absensi untuk semua Pegawai
  console.log(`[5] Creating 30 hari absensi...`);
  const absensiData: any[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0); // Normalize time
    
    const isWeekend = d.getDay() === 0 || d.getDay() === 6; // Sunday or Saturday

    for (const pid of pegawaiIds) {
      if (isWeekend) {
        // Libur
        absensiData.push({
          idPegawai: pid,
          tanggal: d,
          status: 'libur',
          keterangan: 'Akhir Pekan',
          isLate: false,
          isValidated: true,
          idAdmin: admin.idUser
        });
      } else {
        // Hadir (dengan sedikit variasi random izin/sakit/terlambat)
        const rand = Math.random();
        if (rand < 0.05) { // 5% sakit
          absensiData.push({
            idPegawai: pid,
            tanggal: d,
            status: 'sakit',
            keterangan: 'Surat dokter terlampir',
            isLate: false,
            isValidated: true,
            idAdmin: admin.idUser
          });
        } else if (rand < 0.1) { // 5% izin
          absensiData.push({
            idPegawai: pid,
            tanggal: d,
            status: 'izin',
            keterangan: 'Ada keperluan keluarga',
            isLate: false,
            isValidated: true,
            idAdmin: admin.idUser
          });
        } else { // 90% hadir
          const isLate = rand < 0.2; // 10% terlambat
          const jamMasuk = isLate ? '08:15' : '07:45';
          absensiData.push({
            idPegawai: pid,
            tanggal: d,
            status: 'hadir',
            jamMasuk: jamMasuk,
            jamKeluar: '17:15',
            isLate: isLate,
            isValidated: true,
            idAdmin: admin.idUser
          });
        }
      }
    }
  }

  // Gunakan createMany untuk memasukkan semua data absensi sekaligus
  await prisma.absensi.createMany({
    data: absensiData,
  });
  console.log(`[5] Created ${absensiData.length} records absensi (30 hari x 10 pegawai)`);

  // 6. Create 3 Pengajuan Cuti
  const cutiData = [
    {
      idPegawai: pegawaiIds[0], // Budi
      jenisCuti: 'tahunan',
      tanggalMulai: new Date(today.getFullYear(), today.getMonth() + 1, 10),
      tanggalSelesai: new Date(today.getFullYear(), today.getMonth() + 1, 12),
      jumlahHari: 3,
      alasan: 'Liburan keluarga',
      status: 'pending'
    },
    {
      idPegawai: pegawaiIds[1], // Siti
      jenisCuti: 'sakit',
      tanggalMulai: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      tanggalSelesai: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
      jumlahHari: 2,
      alasan: 'Sakit tifus',
      status: 'disetujui',
      idAdmin: admin.idUser,
      catatanAdmin: 'Cepat sembuh'
    },
    {
      idPegawai: pegawaiIds[5], // Dewi
      jenisCuti: 'lainnya',
      tanggalMulai: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      tanggalSelesai: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      jumlahHari: 1,
      alasan: 'Pernikahan saudara',
      status: 'ditolak',
      idAdmin: admin.idUser,
      catatanAdmin: 'Banyak deadline, mohon diundur'
    }
  ];

  for (const c of cutiData) {
    await prisma.pengajuanCuti.create({ data: c });
  }
  console.log(`[6] Created 3 Pengajuan Cuti`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
