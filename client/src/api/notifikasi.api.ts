import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';

export const notifikasiApi = {
  getAll(unreadOnly: boolean = false) {
    return api.get<ApiResponse<any[]>>('/notifikasi', { params: { unread: unreadOnly } });
  },
  
  getUnreadCount() {
    return api.get<ApiResponse<{ count: number }>>('/notifikasi/count');
  },
  
  markAsRead(id: number) {
    return api.put<ApiResponse<any>>(`/notifikasi/${id}/read`);
  },

  markAllAsRead() {
    return api.put<ApiResponse<any>>('/notifikasi/read-all');
  }
};
