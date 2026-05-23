import type { Penggajian, PenggajianGenerateForm, PenggajianKomponenForm, PenggajianQueryParams } from '@/types/penggajian';
export declare const usePenggajianStore: import("pinia").StoreDefinition<"penggajian", Pick<{
    list: import("vue").Ref<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    }[], Penggajian[] | {
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    current: import("vue").Ref<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    } | null, Penggajian | {
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    } | null>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchAll: (params?: PenggajianQueryParams) => Promise<void>;
    fetchById: (id: number) => Promise<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    }>;
    generate: (data: PenggajianGenerateForm) => Promise<import("../types/api").ApiResponse<{
        generatedCount: number;
    }>>;
    updateKomponen: (id: number, data: PenggajianKomponenForm) => Promise<import("../types/api").ApiResponse<Penggajian>>;
    bayar: (id: number) => Promise<import("../types/api").ApiResponse<Penggajian>>;
}, "error" | "list" | "isLoading" | "current">, Pick<{
    list: import("vue").Ref<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    }[], Penggajian[] | {
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    current: import("vue").Ref<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    } | null, Penggajian | {
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    } | null>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchAll: (params?: PenggajianQueryParams) => Promise<void>;
    fetchById: (id: number) => Promise<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    }>;
    generate: (data: PenggajianGenerateForm) => Promise<import("../types/api").ApiResponse<{
        generatedCount: number;
    }>>;
    updateKomponen: (id: number, data: PenggajianKomponenForm) => Promise<import("../types/api").ApiResponse<Penggajian>>;
    bayar: (id: number) => Promise<import("../types/api").ApiResponse<Penggajian>>;
}, never>, Pick<{
    list: import("vue").Ref<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    }[], Penggajian[] | {
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    current: import("vue").Ref<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    } | null, Penggajian | {
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    } | null>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchAll: (params?: PenggajianQueryParams) => Promise<void>;
    fetchById: (id: number) => Promise<{
        idGaji: number;
        idPegawai: number;
        periodeBulan: number;
        periodeTahun: number;
        gajiPokok: number;
        tunjanganJabatan: number;
        tunjanganTransport: number;
        tunjanganMakan: number;
        bonus: number;
        upahLembur: number;
        potonganAbsensi: number;
        potonganBpjs: number;
        potonganPajak: number;
        potonganLain: number;
        totalGaji: number;
        statusBayar: "pending" | "dibayar" | "batal";
        tanggalBayar: string | null;
        idAdmin: number | null;
        keterangan: string | null;
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
    }>;
    generate: (data: PenggajianGenerateForm) => Promise<import("../types/api").ApiResponse<{
        generatedCount: number;
    }>>;
    updateKomponen: (id: number, data: PenggajianKomponenForm) => Promise<import("../types/api").ApiResponse<Penggajian>>;
    bayar: (id: number) => Promise<import("../types/api").ApiResponse<Penggajian>>;
}, "fetchAll" | "fetchById" | "generate" | "updateKomponen" | "bayar">>;
//# sourceMappingURL=penggajian.store.d.ts.map