import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';

export const laporanApi = {
  getRekapAbsensi(bulan: number, tahun: number) {
    return api.get<ApiResponse<any>>('/laporan/absensi', { params: { bulan, tahun } });
  },
  
  getRekapPenggajian(bulan: number, tahun: number) {
    return api.get<ApiResponse<any>>('/laporan/penggajian', { params: { bulan, tahun } });
  },

  downloadRekapPenggajian(bulan: number, tahun: number) {
    return api.get('/laporan/penggajian', { 
      params: { bulan, tahun, format: 'excel' },
      responseType: 'blob'
    });
  },

  getExportPegawai() {
    return api.get<ApiResponse<any>>('/laporan/pegawai');
  }
};
