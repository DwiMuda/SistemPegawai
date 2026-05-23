import { defineStore } from 'pinia';
import { jabatanApi } from '@/api/jabatan.api';
import type { Jabatan, JabatanForm } from '@/types/jabatan';
import type { PaginationMeta } from '@/types/api';

interface JabatanState {
  list: Jabatan[];
  current: Jabatan | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  search: string;
}

export const useJabatanStore = defineStore('jabatan', {
  state: (): JabatanState => ({
    list: [],
    current: null,
    loading: false,
    error: null,
    pagination: null,
    search: '',
  }),

  actions: {
    async fetchAll(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await jabatanApi.getAll({ page, limit: 10, search: this.search || undefined });
        this.list = response.data.data;
        this.pagination = response.data.meta ?? null;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil data jabatan';
      } finally {
        this.loading = false;
      }
    },

    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await jabatanApi.getById(id);
        this.current = response.data.data;
        return this.current;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil detail jabatan';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async create(data: JabatanForm) {
      this.loading = true;
      this.error = null;
      try {
        await jabatanApi.create(data);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal menambahkan jabatan';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async update(id: number, data: Partial<JabatanForm>) {
      this.loading = true;
      this.error = null;
      try {
        await jabatanApi.update(id, data);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal memperbarui jabatan';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async delete(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await jabatanApi.delete(id);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal menghapus jabatan';
        return false;
      } finally {
        this.loading = false;
      }
    },

    setSearch(search: string) {
      this.search = search;
    },
  },
});
