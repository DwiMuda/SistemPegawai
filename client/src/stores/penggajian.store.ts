import { defineStore } from 'pinia';
import { ref } from 'vue';
import { penggajianApi } from '@/api/penggajian.api';
import type { Penggajian, PenggajianGenerateForm, PenggajianKomponenForm, PenggajianQueryParams } from '@/types/penggajian';

export const usePenggajianStore = defineStore('penggajian', () => {
  const list = ref<Penggajian[]>([]);
  const current = ref<Penggajian | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (params?: PenggajianQueryParams) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await penggajianApi.getAll(params);
      list.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil data penggajian';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchById = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await penggajianApi.getById(id);
      current.value = response.data.data;
      return current.value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal mengambil detail penggajian';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const generate = async (data: PenggajianGenerateForm) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await penggajianApi.generate(data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal meng-generate penggajian';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateKomponen = async (id: number, data: PenggajianKomponenForm) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await penggajianApi.updateKomponen(id, data);
      
      // Update data di list
      const index = list.value.findIndex(p => p.idGaji === id);
      if (index !== -1) {
        list.value[index] = response.data.data;
      }

      // Update current jika id sama
      if (current.value?.idGaji === id) {
        current.value = response.data.data;
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal memperbarui komponen gaji';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const bayar = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await penggajianApi.bayar(id);
      
      // Update data di list
      const index = list.value.findIndex(p => p.idGaji === id);
      if (index !== -1) {
        list.value[index] = response.data.data;
      }

      // Update current jika id sama
      if (current.value?.idGaji === id) {
        current.value = response.data.data;
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal memproses pembayaran';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const bayarMassal = async (ids: number[]) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await penggajianApi.bayarMassal(ids);
      // Refresh list after bulk update
      if (list.value.length > 0) {
        const first = list.value[0];
        await fetchAll({ bulan: first.periodeBulan, tahun: first.periodeTahun });
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal memproses pembayaran massal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const batal = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await penggajianApi.batal(id);
      
      const index = list.value.findIndex(p => p.idGaji === id);
      if (index !== -1) {
        list.value[index] = response.data.data;
      }

      if (current.value?.idGaji === id) {
        current.value = response.data.data;
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal membatalkan pembayaran';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    list,
    current,
    isLoading,
    error,
    fetchAll,
    fetchById,
    generate,
    updateKomponen,
    bayar,
    bayarMassal,
    batal
  };
});
