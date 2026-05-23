import type { ApiResponse } from '@/types/api';
export declare const settingApi: {
    getAll(): Promise<import("axios").AxiosResponse<ApiResponse<any[]>, any, {}>>;
    update(key: string, value: string): Promise<import("axios").AxiosResponse<ApiResponse<any>, any, {}>>;
};
//# sourceMappingURL=setting.api.d.ts.map