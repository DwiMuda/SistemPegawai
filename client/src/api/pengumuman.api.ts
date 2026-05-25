import { api } from '@/utils/api';

export const pengumumanApi = {
  getAll: () => api.get('/pengumuman'),
  getActive: () => api.get('/pengumuman/active'),
  create: (data: any) => api.post('/pengumuman', data),
  update: (id: number, data: any) => api.put(`/pengumuman/${id}`, data),
  delete: (id: number) => api.delete(`/pengumuman/${id}`)
};
