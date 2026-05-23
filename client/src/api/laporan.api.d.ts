import type { ApiResponse } from '@/types/api';
export declare const laporanApi: {
    getRekapAbsensi(bulan: number, tahun: number): Promise<import("axios").AxiosResponse<ApiResponse<any>, any, {}>>;
    getRekapPenggajian(bulan: number, tahun: number): Promise<import("axios").AxiosResponse<ApiResponse<any>, any, {}>>;
    downloadRekapPenggajian(bulan: number, tahun: number): Promise<import("axios").AxiosResponse<any, any, {}>>;
    getExportPegawai(): Promise<import("axios").AxiosResponse<ApiResponse<any>, any, {}>>;
};
//# sourceMappingURL=laporan.api.d.ts.map