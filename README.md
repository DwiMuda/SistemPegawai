# Sistem Pegawai HRIS

Sistem Informasi Kepegawaian (HRIS) modern untuk mengelola data pegawai, departemen, jabatan, absensi, cuti, mutasi, dan penggajian. Dibangun menggunakan arsitektur Client-Server dengan antarmuka yang responsif dan fitur yang lengkap.

## ✨ Fitur Utama

- **Manajemen Pegawai**: Kelola data diri, jabatan, departemen, dan status pegawai.
- **Absensi & Kehadiran**: Pencatatan kehadiran harian dengan status hadir, sakit, izin, dan alpha.
- **Manajemen Cuti**: Pengajuan cuti oleh pegawai dan sistem persetujuan (approval) oleh admin.
- **Mutasi Jabatan**: Pencatatan rotasi, promosi, dan demosi jabatan pegawai secara terstruktur.
- **Manajemen Lembur**: Pengajuan jam lembur dan kalkulasi upah lembur secara otomatis.
- **Penggajian (Payroll)**: Kalkulasi gaji otomatis berdasarkan gaji pokok, absensi, lembur, dan potongan pajak PPh 21. Tersedia fitur ekspor slip gaji (PDF) dan rekap gaji (Excel).
- **Notifikasi**: Sistem notifikasi dalam aplikasi untuk memberi tahu pegawai saat gaji dibayarkan atau cuti disetujui.
- **Dashboard Interaktif**: Statistik informatif terkait jumlah pegawai, persentase kehadiran, dan pengajuan cuti.

## 🛠 Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript, Vite, Vue Router, Pinia, Tailwind CSS.
- **Backend**: Node.js, Express.js, TypeScript, Zod (Validation), bcryptjs, jsonwebtoken.
- **Database**: SQLite dengan Prisma ORM.
- **Lainnya**: Docker, PDFKit (untuk export Slip Gaji), ExcelJS (untuk export Rekap Gaji).

## ⚙️ Persyaratan Sistem

- **Node.js** (v18 atau lebih baru disarankan)
- **npm** atau **yarn**
- **Git**

## 🚀 Instalasi & Menjalankan Aplikasi Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan pengembangan (development):

### 1. Kloning Repository

```bash
git clone https://github.com/DwiMuda/SistemPegawai.git
cd SistemPegawai
```

### 2. Setup Backend (Server)

Buka terminal dan masuk ke folder `server`:
```bash
cd server
```

Install dependensi:
```bash
npm install
```

Salin template variabel environment (secara default akan menggunakan port 5000):
```bash
cp .env.example .env
```

Lakukan migrasi database dan hasilkan Prisma client:
```bash
npx prisma migrate dev --name init
```

Isi database dengan data *dummy* awal (Seeder):
```bash
npm run seed
```

Jalankan server backend:
```bash
npm run dev
```
*Server akan berjalan di http://localhost:5000*

### 3. Setup Frontend (Client)

Buka terminal baru di *root project* dan masuk ke folder `client`:
```bash
cd client
```

Install dependensi:
```bash
npm install
```

Salin template variabel environment:
```bash
cp .env.example .env
```
*(Pastikan `VITE_API_URL` pada file `.env` mengarah ke server backend, misalnya `http://localhost:5000/api/v1`)*

Jalankan aplikasi frontend:
```bash
npm run dev
```
*Aplikasi Vue akan berjalan dan bisa diakses via browser (biasanya di http://localhost:5173)*

## 🔐 Akun Akses Default (Seeder)

Setelah Anda menjalankan perintah `npm run seed`, Anda dapat login ke aplikasi menggunakan kredensial berikut:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Pegawai (Contoh Akses Karyawan):**
- Username: `PEG-0001`
- Password: `pegawai123`
*(Seeder secara otomatis membuat 10 akun pegawai dari NIP `PEG-0001` hingga `PEG-0010` dengan password yang sama).*

## 🐳 Deployment Menggunakan Docker

Proyek ini sudah dilengkapi dengan konfigurasi Docker yang siap untuk *production deployment*.

1. Pastikan Anda berada di root directory project.
2. Pastikan file migrasi prisma (`server/prisma/migrations`) sudah terbentuk. Jika belum, jalankan migrasi di lokal terlebih dahulu.
3. Jalankan perintah docker-compose:

```bash
docker-compose up -d --build
```

- Frontend akan dapat diakses pada port HTTP standar: `http://localhost:80`
- Backend internal akan otomatis di-*proxy* atau dapat diakses via port `5000`.

## 📄 Struktur Proyek

```text
SistemPegawai/
├── client/                 # Vue 3 Frontend
│   ├── src/                # Source code Vue (components, pages, stores, dll)
│   ├── Dockerfile          # Konfigurasi Docker untuk Nginx/Vue
│   └── tailwind.config.ts  # Konfigurasi TailwindCSS
└── server/                 # Express.js Backend
    ├── prisma/             # Schema database Prisma & script Seeder
    ├── src/                # Source code Express (controllers, services, rute)
    └── Dockerfile          # Konfigurasi Docker untuk Node.js backend
```
