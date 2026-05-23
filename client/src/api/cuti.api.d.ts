import type { ApiResponse } from '@/types/api';
import type { PengajuanCuti, CutiForm, CutiApproveForm, CutiQueryParams } from '@/types/cuti';
export declare const cutiApi: {
    createPengajuan(data: CutiForm): Promise<import("axios").AxiosResponse<ApiResponse<PengajuanCuti>, any, {}>>;
    getMyCuti(params?: CutiQueryParams): Promise<import("axios").AxiosResponse<ApiResponse<PengajuanCuti[]>, any, {}>>;
    getAllCuti(params?: CutiQueryParams): Promise<import("axios").AxiosResponse<ApiResponse<PengajuanCuti[]>, any, {}>>;
    approveCuti(id: number, data: CutiApproveForm): Promise<import("axios").AxiosResponse<ApiResponse<PengajuanCuti>, any, {}>>;
};
//# sourceMappingURL=cuti.api.d.ts.map