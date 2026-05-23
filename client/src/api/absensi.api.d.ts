import type { ApiResponse } from '@/types/api';
import type { Absensi, AbsensiRekapParams, AbsensiManualForm, AbsensiValidasiForm, AbsensiStatistik } from '@/types/absensi';
export declare const absensiApi: {
    clockIn(): Promise<import("axios").AxiosResponse<ApiResponse<Absensi>, any, {}>>;
    clockOut(): Promise<import("axios").AxiosResponse<ApiResponse<Absensi>, any, {}>>;
    getMyRiwayat(params?: {
        bulan?: number;
        tahun?: number;
    }): Promise<import("axios").AxiosResponse<ApiResponse<Absensi[]>, any, {}>>;
    getRekap(params?: AbsensiRekapParams): Promise<import("axios").AxiosResponse<ApiResponse<Absensi[]>, any, {}>>;
    getStatistik(): Promise<import("axios").AxiosResponse<ApiResponse<AbsensiStatistik>, any, {}>>;
    manualInput(data: AbsensiManualForm): Promise<import("axios").AxiosResponse<ApiResponse<Absensi>, any, {}>>;
    validasi(id: number, data: AbsensiValidasiForm): Promise<import("axios").AxiosResponse<ApiResponse<Absensi>, any, {}>>;
    validasiMassal(ids: number[]): Promise<import("axios").AxiosResponse<ApiResponse<void>, any, {}>>;
};
//# sourceMappingURL=absensi.api.d.ts.map