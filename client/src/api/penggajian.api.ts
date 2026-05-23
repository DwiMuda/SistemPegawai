import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';
import type { Penggajian, PenggajianGenerateForm, PenggajianKomponenForm, PenggajianQueryParams } from '@/types/penggajian';

export const penggajianApi = {
  getAll(params?: PenggajianQueryParams) {
    return api.get<ApiResponse<Penggajian[]>>('/penggajian', { params });
  },

  getById(id: number) {
    return api.get<ApiResponse<Penggajian>>(`/penggajian/${id}`);
  },

  generate(data: PenggajianGenerateForm) {
    return api.post<ApiResponse<{ generatedCount: number }>>('/penggajian/generate', data);
  },

  updateKomponen(id: number, data: PenggajianKomponenForm) {
    return api.put<ApiResponse<Penggajian>>(`/penggajian/${id}`, data);
  },

  bayar(id: number) {
    return api.put<ApiResponse<Penggajian>>(`/penggajian/${id}/bayar`, { tanggalPembayaran: new Date().toISOString() });
  },

  bayarMassal(ids: number[]) {
    return api.put<ApiResponse<{ updatedCount: number }>>('/penggajian/bayar-massal', { ids, tanggalPembayaran: new Date().toISOString() });
  },

  batal(id: number) {
    return api.put<ApiResponse<Penggajian>>(`/penggajian/${id}/batal`);
  },

  downloadPdf(id: number) {
    return api.get(`/penggajian/${id}/pdf`, { responseType: 'blob' });
  },

  downloadExcel(params?: PenggajianQueryParams) {
    return api.get('/penggajian/export/excel', { params, responseType: 'blob' });
  }
};
