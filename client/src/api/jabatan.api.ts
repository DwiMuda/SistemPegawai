import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';
import type { Jabatan, JabatanForm } from '@/types/jabatan';

export const jabatanApi = {
  getAll(params?: { page?: number; limit?: number; search?: string }) {
    return api.get<ApiResponse<Jabatan[]>>('/jabatan', { params });
  },

  getAllSimple() {
    return api.get<ApiResponse<Jabatan[]>>('/jabatan/all');
  },

  getById(id: number) {
    return api.get<ApiResponse<Jabatan>>(`/jabatan/${id}`);
  },

  create(data: JabatanForm) {
    return api.post<ApiResponse<Jabatan>>('/jabatan', data);
  },

  update(id: number, data: Partial<JabatanForm>) {
    return api.put<ApiResponse<Jabatan>>(`/jabatan/${id}`, data);
  },

  delete(id: number) {
    return api.delete<ApiResponse<void>>(`/jabatan/${id}`);
  },
};
