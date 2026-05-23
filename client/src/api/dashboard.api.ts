import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';

export const dashboardApi = {
  getPegawaiDashboard() {
    return api.get<ApiResponse<any>>('/dashboard/pegawai');
  },
  
  getAdminDashboard() {
    return api.get<ApiResponse<any>>('/dashboard/admin');
  }
};
