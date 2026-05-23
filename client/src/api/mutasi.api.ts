import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';

export const mutasiApi = {
  getAll(params?: { search?: string, jenisMutasi?: string }) {
    return api.get<ApiResponse<any[]>>('/mutasi', { params });
  },
  
  getById(id: number) {
    return api.get<ApiResponse<any>>(`/mutasi/${id}`);
  },

  getByPegawai(idPegawai: number) {
    return api.get<ApiResponse<any[]>>(`/mutasi/pegawai/${idPegawai}`);
  },
  
  create(data: any) {
    return api.post<ApiResponse<any>>('/mutasi', data);
  }
};
