import type { Absensi, AbsensiRekapParams, AbsensiManualForm, AbsensiValidasiForm, AbsensiStatistik } from '@/types/absensi';
interface AbsensiState {
    myRiwayat: Absensi[];
    rekap: Absensi[];
    statistik: AbsensiStatistik | null;
    loading: boolean;
    error: string | null;
    filters: AbsensiRekapParams;
}
export declare const useAbsensiStore: import("pinia").StoreDefinition<"absensi", AbsensiState, {}, {
    fetchMyRiwayat(params?: {
        bulan?: number;
        tahun?: number;
    }): Promise<void>;
    clockIn(): Promise<boolean>;
    clockOut(): Promise<boolean>;
    fetchRekap(): Promise<void>;
    fetchStatistik(): Promise<void>;
    manualInput(data: AbsensiManualForm): Promise<boolean>;
    validasi(id: number, data: AbsensiValidasiForm): Promise<boolean>;
    validasiMassal(ids: number[]): Promise<boolean>;
    setFilters(filters: Partial<AbsensiRekapParams>): void;
}>;
export {};
//# sourceMappingURL=absensi.store.d.ts.map