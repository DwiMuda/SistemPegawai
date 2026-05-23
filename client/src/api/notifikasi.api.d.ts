import type { ApiResponse } from '@/types/api';
export declare const notifikasiApi: {
    getAll(unreadOnly?: boolean): Promise<import("axios").AxiosResponse<ApiResponse<any[]>, any, {}>>;
    getUnreadCount(): Promise<import("axios").AxiosResponse<ApiResponse<{
        count: number;
    }>, any, {}>>;
    markAsRead(id: number): Promise<import("axios").AxiosResponse<ApiResponse<any>, any, {}>>;
    markAllAsRead(): Promise<import("axios").AxiosResponse<ApiResponse<any>, any, {}>>;
};
//# sourceMappingURL=notifikasi.api.d.ts.map