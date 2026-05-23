import type { Lembur, AjukanLemburPayload, ApproveLemburPayload, LemburQueryOptions } from '../types/lembur';
import type { ApiResponse } from '../types/api';
export declare const lemburApi: {
    ajukanLembur: (data: AjukanLemburPayload) => Promise<ApiResponse<Lembur>>;
    getLemburSaya: (params?: LemburQueryOptions) => Promise<ApiResponse<Lembur[]>>;
    getAllLembur: (params?: LemburQueryOptions) => Promise<ApiResponse<Lembur[]>>;
    approveLembur: (idLembur: number, data: ApproveLemburPayload) => Promise<ApiResponse<Lembur>>;
};
//# sourceMappingURL=lembur.api.d.ts.map