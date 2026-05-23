import type { Pegawai, PegawaiForm } from '@/types/pegawai';
import type { PaginationMeta } from '@/types/api';
interface PegawaiState {
    list: Pegawai[];
    current: Pegawai | null;
    loading: boolean;
    error: string | null;
    pagination: PaginationMeta | null;
    search: string;
    filters: {
        idDepartemen?: number;
        idJabatan?: number;
        statusPegawai?: string;
    };
}
export declare const usePegawaiStore: import("pinia").StoreDefinition<"pegawai", PegawaiState, {}, {
    fetchAll(page?: number): Promise<void>;
    fetchAllSimple(): Promise<Pegawai[]>;
    getById(id: number): Promise<{
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
    } | null>;
    create(data: PegawaiForm): Promise<boolean>;
    update(id: number, data: Partial<PegawaiForm>): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    setSearch(search: string): void;
    setFilters(filters: PegawaiState["filters"]): void;
    clearFilters(): void;
}>;
export {};
//# sourceMappingURL=pegawai.store.d.ts.map