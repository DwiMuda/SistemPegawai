import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';
import type { 
  Absensi, 
  AbsensiRekapParams, 
  AbsensiManualForm, 
  AbsensiValidasiForm,
  AbsensiStatistik 
} from '@/types/absensi';

export const absensiApi = {
  // Pegawai
  clockIn() {
    return api.post<ApiResponse<Absensi>>('/absensi/clock-in');
  },
  
  clockOut() {
    return api.post<ApiResponse<Absensi>>('/absensi/clock-out');
  },
  
  getMyRiwayat(params?: { bulan?: number; tahun?: number }) {
    return api.get<ApiResponse<Absensi[]>>('/absensi/me', { params });
  },

  // Admin
  getRekap(params?: AbsensiRekapParams) {
    return api.get<ApiResponse<Absensi[]>>('/absensi/rekap', { params });
  },
  
  getStatistik() {
    return api.get<ApiResponse<AbsensiStatistik>>('/absensi/statistik');
  },
  
  manualInput(data: AbsensiManualForm) {
    return api.post<ApiResponse<Absensi>>('/absensi/manual', data);
  },
  
  validasi(id: number, data: AbsensiValidasiForm) {
    return api.put<ApiResponse<Absensi>>(`/absensi/${id}/validasi`, data);
  },
  
  validasiMassal(ids: number[]) {
    return api.put<ApiResponse<void>>('/absensi/validasi-massal', { ids });
  }
};
