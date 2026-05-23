export interface PegawaiJabatan {
    idJabatan: number;
    namaJabatan: string;
}
export interface PegawaiDepartemen {
    idDepartemen: number;
    namaDepartemen: string;
}
export interface Pegawai {
    id: number;
    idPegawai?: number;
    nip: string;
    namaLengkap: string;
    jenisKelamin: string;
    tanggalLahir: string;
    tempatLahir: string;
    alamat: string;
    noTelpon?: string | null;
    email?: string | null;
    idJabatan: number;
    idDepartemen: number;
    tanggalMasuk: string;
    statusPegawai: string;
    foto?: string | null;
    sisaCuti?: number;
    createdAt?: string;
    updatedAt?: string;
    jabatan?: PegawaiJabatan | string;
    departemen?: PegawaiDepartemen | string;
}
export interface PegawaiForm {
    nip: string;
    namaLengkap: string;
    jenisKelamin: 'L' | 'P';
    tanggalLahir: string;
    tempatLahir: string;
    alamat: string;
    noTelpon?: string;
    email?: string;
    idJabatan: number | null;
    idDepartemen: number | null;
    tanggalMasuk: string;
    statusPegawai?: string;
    foto?: string;
    buatAkun?: boolean;
}
export interface PegawaiListParams {
    page?: number;
    limit?: number;
    search?: string;
    idDepartemen?: number;
    idJabatan?: number;
    statusPegawai?: string;
}
//# sourceMappingURL=pegawai.d.ts.map