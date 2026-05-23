import type { PengajuanCuti, CutiForm, CutiApproveForm, CutiQueryParams } from '@/types/cuti';
export declare const useCutiStore: import("pinia").StoreDefinition<"cuti", Pick<{
    cutiList: import("vue").Ref<{
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[], PengajuanCuti[] | {
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[]>;
    myCutiList: import("vue").Ref<{
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[], PengajuanCuti[] | {
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[]>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchMyCuti: (params?: CutiQueryParams) => Promise<void>;
    fetchAllCuti: (params?: CutiQueryParams) => Promise<void>;
    ajukanCuti: (data: CutiForm) => Promise<import("../types/api").ApiResponse<PengajuanCuti>>;
    approveCuti: (id: number, data: CutiApproveForm) => Promise<import("../types/api").ApiResponse<PengajuanCuti>>;
}, "error" | "isLoading" | "cutiList" | "myCutiList">, Pick<{
    cutiList: import("vue").Ref<{
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[], PengajuanCuti[] | {
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[]>;
    myCutiList: import("vue").Ref<{
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[], PengajuanCuti[] | {
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[]>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchMyCuti: (params?: CutiQueryParams) => Promise<void>;
    fetchAllCuti: (params?: CutiQueryParams) => Promise<void>;
    ajukanCuti: (data: CutiForm) => Promise<import("../types/api").ApiResponse<PengajuanCuti>>;
    approveCuti: (id: number, data: CutiApproveForm) => Promise<import("../types/api").ApiResponse<PengajuanCuti>>;
}, never>, Pick<{
    cutiList: import("vue").Ref<{
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[], PengajuanCuti[] | {
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[]>;
    myCutiList: import("vue").Ref<{
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[], PengajuanCuti[] | {
        idCuti: number;
        idPegawai: number;
        jenisCuti: "tahunan" | "sakit" | "melahirkan" | "lainnya";
        tanggalMulai: string;
        tanggalSelesai: string;
        jumlahHari: number;
        alasan: string;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin: number | null;
        catatanAdmin: string | null;
        createdAt: string;
        pegawai?: {
            id?: number | undefined;
            idPegawai?: number | undefined;
            nip?: string | undefined;
            namaLengkap?: string | undefined;
            jenisKelamin?: string | undefined;
            tanggalLahir?: string | undefined;
            tempatLahir?: string | undefined;
            alamat?: string | undefined;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan?: number | undefined;
            idDepartemen?: number | undefined;
            tanggalMasuk?: string | undefined;
            statusPegawai?: string | undefined;
            foto?: string | null | undefined;
            sisaCuti?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
            jabatan?: string | {
                idJabatan: number;
                namaJabatan: string;
            } | undefined;
            departemen?: string | {
                idDepartemen: number;
                namaDepartemen: string;
            } | undefined;
        } | undefined;
        admin?: {
            username: string;
        } | undefined;
    }[]>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchMyCuti: (params?: CutiQueryParams) => Promise<void>;
    fetchAllCuti: (params?: CutiQueryParams) => Promise<void>;
    ajukanCuti: (data: CutiForm) => Promise<import("../types/api").ApiResponse<PengajuanCuti>>;
    approveCuti: (id: number, data: CutiApproveForm) => Promise<import("../types/api").ApiResponse<PengajuanCuti>>;
}, "fetchMyCuti" | "fetchAllCuti" | "ajukanCuti" | "approveCuti">>;
//# sourceMappingURL=cuti.store.d.ts.map