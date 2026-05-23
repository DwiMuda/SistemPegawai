import { api } from '@/utils/api';
export const notifikasiApi = {
    getAll(unreadOnly = false) {
        return api.get('/notifikasi', { params: { unread: unreadOnly } });
    },
    getUnreadCount() {
        return api.get('/notifikasi/count');
    },
    markAsRead(id) {
        return api.put(`/notifikasi/${id}/read`);
    },
    markAllAsRead() {
        return api.put('/notifikasi/read-all');
    }
};
//# sourceMappingURL=notifikasi.api.js.map