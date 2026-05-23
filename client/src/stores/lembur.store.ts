import { defineStore } from 'pinia';
import { ref } from 'vue';
import { lemburApi } from '../api/lembur.api';
import type { Lembur, AjukanLemburPayload, ApproveLemburPayload, LemburQueryOptions } from '../types/lembur';

export const useLemburStore = defineStore('lembur', () => {
  const list = ref<Lembur[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (params?: LemburQueryOptions) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await lemburApi.getAllLembur(params);
      list.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil data lembur';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSaya = async (params?: LemburQueryOptions) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await lemburApi.getLemburSaya(params);
      list.value = res.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil data lembur';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const ajukan = async (data: AjukanLemburPayload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await lemburApi.ajukanLembur(data);
      list.value.unshift(res.data);
      return res;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengajukan lembur';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const approve = async (idLembur: number, data: ApproveLemburPayload) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await lemburApi.approveLembur(idLembur, data);
      const index = list.value.findIndex(l => l.idLembur === idLembur);
      if (index !== -1) {
        list.value[index] = res.data;
      }
      return res;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal memproses lembur';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const batchApprove = async (ids: number[], status: 'disetujui' | 'ditolak') => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await lemburApi.batchApproveLembur(ids, status);
      // Fetch all to ensure list is perfectly sync after batch update
      await fetchAll();
      return res;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal memproses lembur massal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    list,
    isLoading,
    error,
    fetchAll,
    fetchSaya,
    ajukan,
    approve,
    batchApprove
  };
});
