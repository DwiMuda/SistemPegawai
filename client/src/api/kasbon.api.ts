import { api } from '@/utils/api';

export const kasbonApi = {
  getAll: () => api.get('/kasbon'),
  getMyKasbon: () => api.get('/kasbon/me'),
  create: (data: any) => api.post('/kasbon', data),
  approve: (id: number, data: { catatanAdmin?: string }) => api.put(`/kasbon/${id}/approve`, data),
  reject: (id: number, data: { catatanAdmin: string }) => api.put(`/kasbon/${id}/reject`, data)
};
