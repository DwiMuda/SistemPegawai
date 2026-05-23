import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { notifikasiApi } from '@/api/notifikasi.api';
import type { Notifikasi } from '@/types/notifikasi';

export const useNotifikasiStore = defineStore('notifikasi', () => {
  const notifications = ref<Notifikasi[]>([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchNotifications = async (unreadOnly: boolean = false) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await notifikasiApi.getAll(unreadOnly);
      notifications.value = res.data.data;
      unreadCount.value = notifications.value.filter(n => !n.isRead).length;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil notifikasi';
      console.error(error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const getUnreadCount = async () => {
    try {
      const res = await notifikasiApi.getUnreadCount();
      unreadCount.value = res.data.data.count;
    } catch (err: any) {
      console.error('Failed to get unread count:', err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notifikasiApi.markAsRead(id);
      const notif = notifications.value.find(n => n.idNotifikasi === id);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notifikasiApi.markAllAsRead();
      notifications.value.forEach(n => n.isRead = true);
      unreadCount.value = 0;
    } catch (err: any) {
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
