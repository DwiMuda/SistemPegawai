export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta;
    errors?: {
        field: string;
        message: string;
    }[];
    timestamp: string;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
//# sourceMappingURL=api.d.ts.map