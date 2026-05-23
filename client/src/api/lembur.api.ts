import { api } from '@/utils/api';
import type { Lembur, AjukanLemburPayload, ApproveLemburPayload, LemburQueryOptions } from '../types/lembur';
import type { ApiResponse } from '../types/api';

export const lemburApi = {
  // Pegawai
  ajukanLembur: async (data: AjukanLemburPayload) => {
    const response = await api.post<ApiResponse<Lembur>>('/lembur', data);
    return response.data;
  },

  getLemburSaya: async (params?: LemburQueryOptions) => {
    const response = await api.get<ApiResponse<Lembur[]>>('/lembur/saya', { params });
    return response.data;
  },

  // Admin
  getAllLembur: async (params?: LemburQueryOptions) => {
    const response = await api.get<ApiResponse<Lembur[]>>('/lembur', { params });
    return response.data;
  },

  approveLembur: async (idLembur: number, data: ApproveLemburPayload) => {
    const response = await api.put<ApiResponse<Lembur>>(`/lembur/${idLembur}/approve`, data);
    return response.data;
  },

  batchApproveLembur: async (ids: number[], status: 'disetujui' | 'ditolak') => {
    const response = await api.post<ApiResponse<Lembur[]>>(`/lembur/batch-approve`, { ids, status });
    return response.data;
  }
};
