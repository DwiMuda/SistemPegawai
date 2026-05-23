import type { ApiResponse } from '@/types/api';
export declare const mutasiApi: {
    getAll(params?: {
        search?: string;
        jenisMutasi?: string;
    }): Promise<import("axios").AxiosResponse<ApiResponse<any[]>, any, {}>>;
    getById(id: number): Promise<import("axios").AxiosResponse<ApiResponse<any>, any, {}>>;
    getByPegawai(idPegawai: number): Promise<import("axios").AxiosResponse<ApiResponse<any[]>, any, {}>>;
    create(data: any): Promise<import("axios").AxiosResponse<ApiResponse<any>, any, {}>>;
};
//# sourceMappingURL=mutasi.api.d.ts.map