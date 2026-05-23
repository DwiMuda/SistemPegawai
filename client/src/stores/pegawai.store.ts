import { defineStore } from 'pinia';
import { pegawaiApi } from '@/api/pegawai.api';
import type { Pegawai, PegawaiForm, PegawaiListParams } from '@/types/pegawai';
import type { PaginationMeta } from '@/types/api';

interface PegawaiState {
  list: Pegawai[];
  current: Pegawai | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  search: string;
  filters: {
    idDepartemen?: number;
    idJabatan?: number;
    statusPegawai?: string;
  };
}

export const usePegawaiStore = defineStore('pegawai', {
  state: (): PegawaiState => ({
    list: [],
    current: null,
    loading: false,
    error: null,
    pagination: null,
    search: '',
    filters: {},
  }),

  actions: {
    async fetchAll(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const params: PegawaiListParams = {
          page,
          limit: 10,
          search: this.search || undefined,
          ...this.filters,
        };
        const response = await pegawaiApi.getAll(params);
        this.list = response.data.data;
        this.pagination = response.data.meta ?? null;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil data pegawai';
      } finally {
        this.loading = false;
      }
    },

    async fetchAllSimple() {
      try {
        const response = await pegawaiApi.getAllSimple();
        return response.data.data;
      } catch (error: any) {
        console.error('Failed to fetch simple list of pegawai:', error);
        return [];
      }
    },

    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await pegawaiApi.getById(id);
        this.current = response.data.data;
        return this.current;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil detail pegawai';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async create(data: PegawaiForm) {
      this.loading = true;
      this.error = null;
      try {
        await pegawaiApi.create(data);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal menambahkan pegawai';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async update(id: number, data: Partial<PegawaiForm>) {
      this.loading = true;
      this.error = null;
      try {
        await pegawaiApi.update(id, data);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal memperbarui pegawai';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async delete(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await pegawaiApi.delete(id);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal menghapus pegawai';
        return false;
      } finally {
        this.loading = false;
      }
    },

    setSearch(search: string) {
      this.search = search;
    },

    setFilters(filters: PegawaiState['filters']) {
      this.filters = { ...this.filters, ...filters };
    },

    clearFilters() {
      this.filters = {};
      this.search = '';
    }
  },
});
