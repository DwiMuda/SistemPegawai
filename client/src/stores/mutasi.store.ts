import { defineStore } from 'pinia';
import { ref } from 'vue';
import { mutasiApi } from '@/api/mutasi.api';
import type { Mutasi, CreateMutasiInput, MutasiQueryOptions } from '@/types/mutasi';

export const useMutasiStore = defineStore('mutasi', () => {
  const mutasiList = ref<Mutasi[]>([]);
  const currentMutasi = ref<Mutasi | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchMutasiList = async (options?: MutasiQueryOptions) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await mutasiApi.getAll(options);
      mutasiList.value = res.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil data mutasi';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getMutasiById = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await mutasiApi.getById(id);
      currentMutasi.value = res.data.data;
      return res.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil detail mutasi';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMutasiByPegawai = async (idPegawai: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await mutasiApi.getByPegawai(idPegawai);
      mutasiList.value = res.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil riwayat mutasi pegawai';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createMutasi = async (data: CreateMutasiInput) => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await mutasiApi.create(data);
      mutasiList.value.unshift(res.data.data);
      return res.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal membuat mutasi';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    mutasiList,
    currentMutasi,
    isLoading,
    error,
    fetchMutasiList,
    getMutasiById,
    fetchMutasiByPegawai,
    createMutasi
  };
});
