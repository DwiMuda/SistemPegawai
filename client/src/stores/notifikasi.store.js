import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notifikasiApi } from '@/api/notifikasi.api';
export const useNotifikasiStore = defineStore('notifikasi', () => {
    const notifications = ref([]);
    const unreadCount = ref(0);
    const isLoading = ref(false);
    const error = ref(null);
    const fetchNotifications = async (unreadOnly = false) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await notifikasiApi.getAll(unreadOnly);
            notifications.value = res.data.data;
            unreadCount.value = notifications.value.filter(n => !n.isRead).length;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengambil notifikasi';
            console.error(error.value);
        }
        finally {
            isLoading.value = false;
        }
    };
    const getUnreadCount = async () => {
        try {
            const res = await notifikasiApi.getUnreadCount();
            unreadCount.value = res.data.data.count;
        }
        catch (err) {
            console.error('Failed to get unread count:', err);
        }
    };
    const markAsRead = async (id) => {
        try {
            await notifikasiApi.markAsRead(id);
            const notif = notifications.value.find(n => n.idNotifikasi === id);
            if (notif && !notif.isRead) {
                notif.isRead = true;
                unreadCount.value = Math.max(0, unreadCount.value - 1);
            }
        }
        catch (err) {
            console.error('Failed to mark as read:', err);
            throw err;
        }
    };
    const markAllAsRead = async () => {
        try {
            await notifikasiApi.markAllAsRead();
            notifications.value.forEach(n => n.isRead = true);
            unreadCount.value = 0;
        }
        catch (err) {
            console.error('Failed to mark all as read:', err);
            throw err;
        }
    };
    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        getUnreadCount,
        markAsRead,
        markAllAsRead
    };
});
//# sourceMappingURL=notifikasi.store.js.map