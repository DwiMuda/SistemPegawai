import type { ApiResponse } from '@/types/api';
import type { Jabatan, JabatanForm } from '@/types/jabatan';
export declare const jabatanApi: {
    getAll(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<import("axios").AxiosResponse<ApiResponse<Jabatan[]>, any, {}>>;
    getAllSimple(): Promise<import("axios").AxiosResponse<ApiResponse<Jabatan[]>, any, {}>>;
    getById(id: number): Promise<import("axios").AxiosResponse<ApiResponse<Jabatan>, any, {}>>;
    create(data: JabatanForm): Promise<import("axios").AxiosResponse<ApiResponse<Jabatan>, any, {}>>;
    update(id: number, data: Partial<JabatanForm>): Promise<import("axios").AxiosResponse<ApiResponse<Jabatan>, any, {}>>;
    delete(id: number): Promise<import("axios").AxiosResponse<ApiResponse<void>, any, {}>>;
};
//# sourceMappingURL=jabatan.api.d.ts.map