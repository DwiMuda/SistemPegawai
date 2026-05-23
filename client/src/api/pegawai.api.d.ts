import type { ApiResponse } from '@/types/api';
import type { Pegawai, PegawaiForm, PegawaiListParams } from '@/types/pegawai';
export declare const pegawaiApi: {
    getAll(params?: PegawaiListParams): Promise<import("axios").AxiosResponse<ApiResponse<Pegawai[]>, any, {}>>;
    getAllSimple(): Promise<import("axios").AxiosResponse<ApiResponse<Pegawai[]>, any, {}>>;
    getById(id: number): Promise<import("axios").AxiosResponse<ApiResponse<Pegawai>, any, {}>>;
    create(data: PegawaiForm): Promise<import("axios").AxiosResponse<ApiResponse<Pegawai>, any, {}>>;
    update(id: number, data: Partial<PegawaiForm>): Promise<import("axios").AxiosResponse<ApiResponse<Pegawai>, any, {}>>;
    delete(id: number): Promise<import("axios").AxiosResponse<ApiResponse<void>, any, {}>>;
};
//# sourceMappingURL=pegawai.api.d.ts.map