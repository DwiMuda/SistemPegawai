import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';
import type { PengajuanCuti, CutiForm, CutiApproveForm, CutiQueryParams } from '@/types/cuti';

export const cutiApi = {
  // Pegawai
  createPengajuan(data: CutiForm) {
    return api.post<ApiResponse<PengajuanCuti>>('/cuti', data);
  },
  
  getMyCuti(params?: CutiQueryParams) {
    return api.get<ApiResponse<PengajuanCuti[]>>('/cuti/me', { params });
  },

  batalkanCuti(id: number) {
    return api.put<ApiResponse<any>>(`/cuti/${id}/batal`);
  },

  // Admin
  getAllCuti(params?: CutiQueryParams) {
    return api.get<ApiResponse<PengajuanCuti[]>>('/cuti', { params });
  },
  
  approveCuti(id: number, data: CutiApproveForm) {
    return api.put<ApiResponse<PengajuanCuti>>(`/cuti/${id}/approve`, data);
  },

  resetTahunan() {
    return api.post<ApiResponse<any>>('/cuti/reset-tahunan');
  }
};
