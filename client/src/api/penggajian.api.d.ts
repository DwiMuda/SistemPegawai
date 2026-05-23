import type { ApiResponse } from '@/types/api';
import type { Penggajian, PenggajianGenerateForm, PenggajianKomponenForm, PenggajianQueryParams } from '@/types/penggajian';
export declare const penggajianApi: {
    getAll(params?: PenggajianQueryParams): Promise<import("axios").AxiosResponse<ApiResponse<Penggajian[]>, any, {}>>;
    getById(id: number): Promise<import("axios").AxiosResponse<ApiResponse<Penggajian>, any, {}>>;
    generate(data: PenggajianGenerateForm): Promise<import("axios").AxiosResponse<ApiResponse<{
        generatedCount: number;
    }>, any, {}>>;
    updateKomponen(id: number, data: PenggajianKomponenForm): Promise<import("axios").AxiosResponse<ApiResponse<Penggajian>, any, {}>>;
    bayar(id: number): Promise<import("axios").AxiosResponse<ApiResponse<Penggajian>, any, {}>>;
    downloadPdf(id: number): Promise<import("axios").AxiosResponse<any, any, {}>>;
    downloadExcel(params?: PenggajianQueryParams): Promise<import("axios").AxiosResponse<any, any, {}>>;
};
//# sourceMappingURL=penggajian.api.d.ts.map