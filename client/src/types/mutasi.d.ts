export interface Mutasi {
    idMutasi: number;
    idPegawai: number;
    idJabatanLama: number;
    idJabatanBaru: number;
    idDepartemenLama: number;
    idDepartemenBaru: number;
    tanggal: string;
    jenisMutasi: 'promosi' | 'demosi' | 'rotasi' | 'transfer';
    alasan: string;
    idAdmin: number;
    createdAt: string;
    updatedAt: string;
    pegawai?: any;
    admin?: any;
}
export interface CreateMutasiInput {
    idPegawai: number;
    idJabatanBaru: number;
    idDepartemenBaru: number;
    tanggal: string;
    jenisMutasi: 'promosi' | 'demosi' | 'rotasi' | 'transfer';
    alasan: string;
}
export interface MutasiQueryOptions {
    search?: string;
    jenisMutasi?: string;
}
//# sourceMappingURL=mutasi.d.ts.map