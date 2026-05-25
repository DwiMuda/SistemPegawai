import { api } from '@/utils/api';

export const reimbursementApi = {
  getAll: () => api.get('/reimbursement'),
  getMyReimbursement: () => api.get('/reimbursement/me'),
  create: (formData: FormData) => api.post('/reimbursement', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approve: (id: number, data: { catatanAdmin?: string }) => api.put(`/reimbursement/${id}/approve`, data),
  reject: (id: number, data: { catatanAdmin: string }) => api.put(`/reimbursement/${id}/reject`, data)
};
