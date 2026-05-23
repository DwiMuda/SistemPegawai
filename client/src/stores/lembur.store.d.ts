import type { Lembur, AjukanLemburPayload, ApproveLemburPayload, LemburQueryOptions } from '../types/lembur';
export declare const useLemburStore: import("pinia").StoreDefinition<"lembur", Pick<{
    list: import("vue").Ref<{
        idLembur: number;
        idPegawai: number;
        tanggal: string;
        jamMulai: string;
        jamSelesai: string;
        totalJam: number;
        tarifPerJam: number;
        totalUpah: number;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin?: number | null | undefined;
        keterangan?: string | null | undefined;
        createdAt: string;
        pegawai?: {
            id: number;
            idPegawai?: number | undefined;
            nip: string;
            namaLengkap: string;
            jenisKelamin: string;
            tanggalLahir: string;
            tempatLahir: string;
            alamat: string;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan: number;
            idDepartemen: number;
            tanggalMasuk: string;
            statusPegawai: string;
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
    }[], Lembur[] | {
        idLembur: number;
        idPegawai: number;
        tanggal: string;
        jamMulai: string;
        jamSelesai: string;
        totalJam: number;
        tarifPerJam: number;
        totalUpah: number;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin?: number | null | undefined;
        keterangan?: string | null | undefined;
        createdAt: string;
        pegawai?: {
            id: number;
            idPegawai?: number | undefined;
            nip: string;
            namaLengkap: string;
            jenisKelamin: string;
            tanggalLahir: string;
            tempatLahir: string;
            alamat: string;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan: number;
            idDepartemen: number;
            tanggalMasuk: string;
            statusPegawai: string;
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
    fetchAll: (params?: LemburQueryOptions) => Promise<void>;
    fetchSaya: (params?: LemburQueryOptions) => Promise<void>;
    ajukan: (data: AjukanLemburPayload) => Promise<import("../types/api").ApiResponse<Lembur>>;
    approve: (idLembur: number, data: ApproveLemburPayload) => Promise<import("../types/api").ApiResponse<Lembur>>;
}, "error" | "list" | "isLoading">, Pick<{
    list: import("vue").Ref<{
        idLembur: number;
        idPegawai: number;
        tanggal: string;
        jamMulai: string;
        jamSelesai: string;
        totalJam: number;
        tarifPerJam: number;
        totalUpah: number;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin?: number | null | undefined;
        keterangan?: string | null | undefined;
        createdAt: string;
        pegawai?: {
            id: number;
            idPegawai?: number | undefined;
            nip: string;
            namaLengkap: string;
            jenisKelamin: string;
            tanggalLahir: string;
            tempatLahir: string;
            alamat: string;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan: number;
            idDepartemen: number;
            tanggalMasuk: string;
            statusPegawai: string;
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
    }[], Lembur[] | {
        idLembur: number;
        idPegawai: number;
        tanggal: string;
        jamMulai: string;
        jamSelesai: string;
        totalJam: number;
        tarifPerJam: number;
        totalUpah: number;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin?: number | null | undefined;
        keterangan?: string | null | undefined;
        createdAt: string;
        pegawai?: {
            id: number;
            idPegawai?: number | undefined;
            nip: string;
            namaLengkap: string;
            jenisKelamin: string;
            tanggalLahir: string;
            tempatLahir: string;
            alamat: string;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan: number;
            idDepartemen: number;
            tanggalMasuk: string;
            statusPegawai: string;
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
    fetchAll: (params?: LemburQueryOptions) => Promise<void>;
    fetchSaya: (params?: LemburQueryOptions) => Promise<void>;
    ajukan: (data: AjukanLemburPayload) => Promise<import("../types/api").ApiResponse<Lembur>>;
    approve: (idLembur: number, data: ApproveLemburPayload) => Promise<import("../types/api").ApiResponse<Lembur>>;
}, never>, Pick<{
    list: import("vue").Ref<{
        idLembur: number;
        idPegawai: number;
        tanggal: string;
        jamMulai: string;
        jamSelesai: string;
        totalJam: number;
        tarifPerJam: number;
        totalUpah: number;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin?: number | null | undefined;
        keterangan?: string | null | undefined;
        createdAt: string;
        pegawai?: {
            id: number;
            idPegawai?: number | undefined;
            nip: string;
            namaLengkap: string;
            jenisKelamin: string;
            tanggalLahir: string;
            tempatLahir: string;
            alamat: string;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan: number;
            idDepartemen: number;
            tanggalMasuk: string;
            statusPegawai: string;
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
    }[], Lembur[] | {
        idLembur: number;
        idPegawai: number;
        tanggal: string;
        jamMulai: string;
        jamSelesai: string;
        totalJam: number;
        tarifPerJam: number;
        totalUpah: number;
        status: "pending" | "disetujui" | "ditolak";
        idAdmin?: number | null | undefined;
        keterangan?: string | null | undefined;
        createdAt: string;
        pegawai?: {
            id: number;
            idPegawai?: number | undefined;
            nip: string;
            namaLengkap: string;
            jenisKelamin: string;
            tanggalLahir: string;
            tempatLahir: string;
            alamat: string;
            noTelpon?: string | null | undefined;
            email?: string | null | undefined;
            idJabatan: number;
            idDepartemen: number;
            tanggalMasuk: string;
            statusPegawai: string;
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
    fetchAll: (params?: LemburQueryOptions) => Promise<void>;
    fetchSaya: (params?: LemburQueryOptions) => Promise<void>;
    ajukan: (data: AjukanLemburPayload) => Promise<import("../types/api").ApiResponse<Lembur>>;
    approve: (idLembur: number, data: ApproveLemburPayload) => Promise<import("../types/api").ApiResponse<Lembur>>;
}, "fetchAll" | "fetchSaya" | "ajukan" | "approve">>;
//# sourceMappingURL=lembur.store.d.ts.map