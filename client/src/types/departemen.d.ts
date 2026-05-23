export interface KepalaDepartemen {
    id: number;
    nama: string;
    nip: string;
}
export interface Departemen {
    id: number;
    namaDepartemen: string;
    kodeDepartemen: string;
    kepala: KepalaDepartemen | null;
    jumlahPegawai?: number;
    createdAt?: string;
    updatedAt?: string;
}
export interface DepartemenForm {
    namaDepartemen: string;
    kodeDepartemen: string;
    idKepala?: number | null;
}
export interface DepartemenListParams {
    page?: number;
    limit?: number;
    search?: string;
}
//# sourceMappingURL=departemen.d.ts.map