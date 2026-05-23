import type { ApiResponse } from '@/types/api';
import type { Departemen, DepartemenForm } from '@/types/departemen';
export declare const departemenApi: {
    getAll(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<import("axios").AxiosResponse<ApiResponse<Departemen[]>, any, {}>>;
    getAllSimple(): Promise<import("axios").AxiosResponse<ApiResponse<Departemen[]>, any, {}>>;
    getById(id: number): Promise<import("axios").AxiosResponse<ApiResponse<Departemen>, any, {}>>;
    create(data: DepartemenForm): Promise<import("axios").AxiosResponse<ApiResponse<Departemen>, any, {}>>;
    update(id: number, data: Partial<DepartemenForm>): Promise<import("axios").AxiosResponse<ApiResponse<Departemen>, any, {}>>;
    delete(id: number): Promise<import("axios").AxiosResponse<ApiResponse<void>, any, {}>>;
};
//# sourceMappingURL=departemen.api.d.ts.map