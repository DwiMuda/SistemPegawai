import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';
import type { Pegawai, PegawaiForm, PegawaiListParams } from '@/types/pegawai';

export const pegawaiApi = {
  getAll(params?: PegawaiListParams) {
    return api.get<ApiResponse<Pegawai[]>>('/pegawai', { params });
  },

  getAllSimple() {
    return api.get<ApiResponse<Pegawai[]>>('/pegawai/all');
  },

  getById(id: number) {
    return api.get<ApiResponse<Pegawai>>(`/pegawai/${id}`);
  },

  create(data: PegawaiForm) {
    return api.post<ApiResponse<Pegawai>>('/pegawai', data);
  },

  update(id: number, data: Partial<PegawaiForm>) {
    return api.put<ApiResponse<Pegawai>>(`/pegawai/${id}`, data);
  },

  delete(id: number) {
    return api.delete<ApiResponse<void>>(`/pegawai/${id}`);
  },
};
