import type { Departemen, DepartemenForm } from '@/types/departemen';
import type { PaginationMeta } from '@/types/api';
interface DepartemenState {
    list: Departemen[];
    current: Departemen | null;
    loading: boolean;
    error: string | null;
    pagination: PaginationMeta | null;
    search: string;
}
export declare const useDepartemenStore: import("pinia").StoreDefinition<"departemen", DepartemenState, {}, {
    fetchAll(page?: number): Promise<void>;
    getById(id: number): Promise<{
        id: number;
        namaDepartemen: string;
        kodeDepartemen: string;
        kepala: {
            id: number;
            nama: string;
            nip: string;
        } | null;
        jumlahPegawai?: number | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    } | null>;
    create(data: DepartemenForm): Promise<boolean>;
    update(id: number, data: Partial<DepartemenForm>): Promise<boolean>;
    delete(id: number): Promise<boolean>;
    setSearch(search: string): void;
}>;
export {};
//# sourceMappingURL=departemen.store.d.ts.map