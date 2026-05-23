-- CreateTable
CREATE TABLE "jabatan" (
    "idJabatan" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaJabatan" TEXT NOT NULL,
    "deskripsi" TEXT,
    "gajiPokokDefault" REAL NOT NULL,
    "tunjanganDefault" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "departemen" (
    "idDepartemen" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaDepartemen" TEXT NOT NULL,
    "kodeDepartemen" TEXT NOT NULL,
    "idKepala" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "departemen_idKepala_fkey" FOREIGN KEY ("idKepala") REFERENCES "pegawai" ("idPegawai") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pegawai" (
    "idPegawai" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nip" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "tanggalLahir" DATETIME NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noTelpon" TEXT,
    "email" TEXT,
    "idJabatan" INTEGER NOT NULL,
    "idDepartemen" INTEGER NOT NULL,
    "tanggalMasuk" DATETIME NOT NULL,
    "statusPegawai" TEXT NOT NULL DEFAULT 'aktif',
    "foto" TEXT,
    "sisaCuti" INTEGER NOT NULL DEFAULT 12,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "pegawai_idJabatan_fkey" FOREIGN KEY ("idJabatan") REFERENCES "jabatan" ("idJabatan") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pegawai_idDepartemen_fkey" FOREIGN KEY ("idDepartemen") REFERENCES "departemen" ("idDepartemen") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "idUser" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "idPegawai" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" DATETIME,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME,
    CONSTRAINT "users_idPegawai_fkey" FOREIGN KEY ("idPegawai") REFERENCES "pegawai" ("idPegawai") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_token_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "penggajian" (
    "idGaji" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idPegawai" INTEGER NOT NULL,
    "periodeBulan" INTEGER NOT NULL,
    "periodeTahun" INTEGER NOT NULL,
    "gajiPokok" REAL NOT NULL,
    "tunjanganJabatan" REAL NOT NULL DEFAULT 0,
    "tunjanganTransport" REAL NOT NULL DEFAULT 0,
    "tunjanganMakan" REAL NOT NULL DEFAULT 0,
    "bonus" REAL NOT NULL DEFAULT 0,
    "upahLembur" REAL NOT NULL DEFAULT 0,
    "potonganAbsensi" REAL NOT NULL DEFAULT 0,
    "potonganBpjs" REAL NOT NULL DEFAULT 0,
    "potonganPajak" REAL NOT NULL DEFAULT 0,
    "potonganLain" REAL NOT NULL DEFAULT 0,
    "totalGaji" REAL NOT NULL,
    "statusBayar" TEXT NOT NULL DEFAULT 'pending',
    "tanggalBayar" DATETIME,
    "idAdmin" INTEGER,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "penggajian_idPegawai_fkey" FOREIGN KEY ("idPegawai") REFERENCES "pegawai" ("idPegawai") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "penggajian_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "users" ("idUser") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "absensi" (
    "idAbsensi" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idPegawai" INTEGER NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "jamMasuk" TEXT,
    "jamKeluar" TEXT,
    "status" TEXT NOT NULL,
    "keterangan" TEXT,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "idAdmin" INTEGER,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "absensi_idPegawai_fkey" FOREIGN KEY ("idPegawai") REFERENCES "pegawai" ("idPegawai") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "absensi_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "users" ("idUser") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pengajuan_cuti" (
    "idCuti" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idPegawai" INTEGER NOT NULL,
    "jenisCuti" TEXT NOT NULL,
    "tanggalMulai" DATETIME NOT NULL,
    "tanggalSelesai" DATETIME NOT NULL,
    "jumlahHari" INTEGER NOT NULL,
    "alasan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "idAdmin" INTEGER,
    "catatanAdmin" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pengajuan_cuti_idPegawai_fkey" FOREIGN KEY ("idPegawai") REFERENCES "pegawai" ("idPegawai") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pengajuan_cuti_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "users" ("idUser") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lembur" (
    "idLembur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idPegawai" INTEGER NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,
    "totalJam" REAL NOT NULL,
    "tarifPerJam" REAL NOT NULL,
    "totalUpah" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "idAdmin" INTEGER,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lembur_idPegawai_fkey" FOREIGN KEY ("idPegawai") REFERENCES "pegawai" ("idPegawai") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "lembur_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "users" ("idUser") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mutasi" (
    "idMutasi" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idPegawai" INTEGER NOT NULL,
    "idJabatanLama" INTEGER NOT NULL,
    "idJabatanBaru" INTEGER NOT NULL,
    "idDepartemenLama" INTEGER,
    "idDepartemenBaru" INTEGER,
    "tanggal" DATETIME NOT NULL,
    "alasan" TEXT NOT NULL,
    "jenisMutasi" TEXT NOT NULL,
    "idAdmin" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mutasi_idPegawai_fkey" FOREIGN KEY ("idPegawai") REFERENCES "pegawai" ("idPegawai") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "mutasi_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "idNotifikasi" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER NOT NULL,
    "idPegawai" INTEGER,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "terkaitTabel" TEXT,
    "terkaitId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifikasi_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users" ("idUser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "notifikasi_idPegawai_fkey" FOREIGN KEY ("idPegawai") REFERENCES "pegawai" ("idPegawai") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_log" (
    "idAuditLog" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER,
    "oldData" TEXT,
    "newData" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_log_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users" ("idUser") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "setting" (
    "idSetting" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "deskripsi" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "jabatan_namaJabatan_key" ON "jabatan"("namaJabatan");

-- CreateIndex
CREATE UNIQUE INDEX "departemen_namaDepartemen_key" ON "departemen"("namaDepartemen");

-- CreateIndex
CREATE UNIQUE INDEX "departemen_kodeDepartemen_key" ON "departemen"("kodeDepartemen");

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_nip_key" ON "pegawai"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_email_key" ON "pegawai"("email");

-- CreateIndex
CREATE INDEX "pegawai_nip_idx" ON "pegawai"("nip");

-- CreateIndex
CREATE INDEX "pegawai_statusPegawai_idx" ON "pegawai"("statusPegawai");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_idPegawai_key" ON "users"("idPegawai");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "refresh_token"("token");

-- CreateIndex
CREATE INDEX "refresh_token_idUser_idx" ON "refresh_token"("idUser");

-- CreateIndex
CREATE INDEX "refresh_token_token_idx" ON "refresh_token"("token");

-- CreateIndex
CREATE INDEX "penggajian_periodeTahun_periodeBulan_idx" ON "penggajian"("periodeTahun", "periodeBulan");

-- CreateIndex
CREATE INDEX "penggajian_statusBayar_idx" ON "penggajian"("statusBayar");

-- CreateIndex
CREATE UNIQUE INDEX "penggajian_idPegawai_periodeBulan_periodeTahun_key" ON "penggajian"("idPegawai", "periodeBulan", "periodeTahun");

-- CreateIndex
CREATE INDEX "absensi_tanggal_idx" ON "absensi"("tanggal");

-- CreateIndex
CREATE INDEX "absensi_idPegawai_tanggal_idx" ON "absensi"("idPegawai", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "absensi_idPegawai_tanggal_key" ON "absensi"("idPegawai", "tanggal");

-- CreateIndex
CREATE INDEX "pengajuan_cuti_idPegawai_idx" ON "pengajuan_cuti"("idPegawai");

-- CreateIndex
CREATE INDEX "pengajuan_cuti_status_idx" ON "pengajuan_cuti"("status");

-- CreateIndex
CREATE INDEX "lembur_idPegawai_idx" ON "lembur"("idPegawai");

-- CreateIndex
CREATE INDEX "lembur_status_idx" ON "lembur"("status");

-- CreateIndex
CREATE UNIQUE INDEX "lembur_idPegawai_tanggal_key" ON "lembur"("idPegawai", "tanggal");

-- CreateIndex
CREATE INDEX "mutasi_idPegawai_idx" ON "mutasi"("idPegawai");

-- CreateIndex
CREATE INDEX "notifikasi_idUser_isRead_idx" ON "notifikasi"("idUser", "isRead");

-- CreateIndex
CREATE INDEX "audit_log_entity_entityId_idx" ON "audit_log"("entity", "entityId");

-- CreateIndex
CREATE INDEX "audit_log_createdAt_idx" ON "audit_log"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "setting_key_key" ON "setting"("key");
