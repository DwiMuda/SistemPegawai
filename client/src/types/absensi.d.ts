export interface AbsensiPegawai {
    namaLengkap: string;
    nip: string;
    departemen?: {
        namaDepartemen: string;
    };
}
export interface AbsensiAdmin {
    username: string;
}
export interface Absensi {
    idAbsensi: number;
    idPegawai: number;
    tanggal: string;
    jamMasuk: string | null;
    jamKeluar: string | null;
    status: 'hadir' | 'izin' | 'sakit' | 'cuti' | 'alpha' | 'libur';
    keterangan: string | null;
    isLate: boolean;
    isValidated: boolean;
    createdAt?: string;
    updatedAt?: string;
    pegawai?: AbsensiPegawai;
    admin?: AbsensiAdmin | null;
}
export interface AbsensiRekapParams {
    bulan?: number;
    tahun?: number;
    idDepartemen?: number;
    idPegawai?: number;
}
export interface AbsensiManualForm {
    idPegawai: number | null;
    tanggal: string;
    status: 'hadir' | 'izin' | 'sakit' | 'cuti' | 'alpha' | 'libur';
    jamMasuk?: string;
    jamKeluar?: string;
    keterangan?: string;
}
export interface AbsensiValidasiForm {
    status?: 'hadir' | 'izin' | 'sakit' | 'cuti' | 'alpha' | 'libur';
    jamMasuk?: string;
    jamKeluar?: string;
    keterangan?: string;
    isValidated?: boolean;
}
export interface AbsensiStatistik {
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpha: number;
    cuti: number;
}
//# sourceMappingURL=absensi.d.ts.map