import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';
import type { Departemen, DepartemenForm } from '@/types/departemen';

export const departemenApi = {
  getAll(params?: { page?: number; limit?: number; search?: string }) {
    return api.get<ApiResponse<Departemen[]>>('/departemen', { params });
  },

  getAllSimple() {
    return api.get<ApiResponse<Departemen[]>>('/departemen/all');
  },

  getById(id: number) {
    return api.get<ApiResponse<Departemen>>(`/departemen/${id}`);
  },

  create(data: DepartemenForm) {
    return api.post<ApiResponse<Departemen>>('/departemen', data);
  },

  update(id: number, data: Partial<DepartemenForm>) {
    return api.put<ApiResponse<Departemen>>(`/departemen/${id}`, data);
  },

  delete(id: number) {
    return api.delete<ApiResponse<void>>(`/departemen/${id}`);
  },
};
