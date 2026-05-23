import type { Jabatan, JabatanForm } from '@/types/jabatan';
import type { PaginationMeta } from '@/types/api';
interface JabatanState {
    list: Jabatan[];
    current: Jabatan | null;
    loading: boolean;
    error: string | null;
    pagination: PaginationMeta | null;
    search: string;
}
export declare const useJabatanStore: import("pinia").StoreDefinition<"jabatan", JabatanState, {}, {
    fetchAll(page?: number): Promise<void>;
    getById(id: number): Promise<{
        id: number;
        namaJabatan: string;
        deskripsi: string | null;
        gajiPokokDefault: number;
        tunjanganDefault: number;
        jumlahPegawai?: number | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    } | null>;
    create(data: JabatanForm): Promise<boolean>;
    update(id: number, data: Partial<JabatanForm>): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    setSearch(search: string): void;
}>;
export {};
//# sourceMappingURL=jabatan.store.d.ts.map