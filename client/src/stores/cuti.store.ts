import { defineStore } from 'pinia';
import { ref } from 'vue';
import { cutiApi } from '@/api/cuti.api';
import type { PengajuanCuti, CutiForm, CutiApproveForm, CutiQueryParams } from '@/types/cuti';

export const useCutiStore = defineStore('cuti', () => {
  const cutiList = ref<PengajuanCuti[]>([]);
  const myCutiList = ref<PengajuanCuti[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchMyCuti = async (params?: CutiQueryParams) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cutiApi.getMyCuti(params);
      myCutiList.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil data cuti';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllCuti = async (params?: CutiQueryParams) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cutiApi.getAllCuti(params);
      cutiList.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil seluruh data cuti';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const ajukanCuti = async (data: CutiForm) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cutiApi.createPengajuan(data);
      myCutiList.value.unshift(response.data.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengajukan cuti';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const approveCuti = async (id: number, data: CutiApproveForm) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await cutiApi.approveCuti(id, data);
      const index = cutiList.value.findIndex(c => c.idCuti === id);
      if (index !== -1) {
        cutiList.value[index] = response.data.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal menyetujui/menolak cuti';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const batalkanCuti = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      await cutiApi.batalkanCuti(id);
      myCutiList.value = myCutiList.value.filter(c => c.idCuti !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal membatalkan cuti';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetTahunan = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      await cutiApi.resetTahunan();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mereset sisa cuti';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    cutiList,
    myCutiList,
    isLoading,
    error,
    fetchMyCuti,
    fetchAllCuti,
    ajukanCuti,
    approveCuti,
    batalkanCuti,
    resetTahunan
  };
});
