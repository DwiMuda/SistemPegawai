import { defineStore } from 'pinia';
import { departemenApi } from '@/api/departemen.api';
import type { Departemen, DepartemenForm } from '@/types/departemen';
import type { PaginationMeta } from '@/types/api';

interface DepartemenState {
  list: Departemen[];
  current: Departemen | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  search: string;
}

export const useDepartemenStore = defineStore('departemen', {
  state: (): DepartemenState => ({
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
        const response = await departemenApi.getAll({ page, limit: 10, search: this.search || undefined });
        this.list = response.data.data;
        this.pagination = response.data.meta ?? null;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil data departemen';
      } finally {
        this.loading = false;
      }
    },

    async getById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await departemenApi.getById(id);
        this.current = response.data.data;
        return this.current;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil detail departemen';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async create(data: DepartemenForm) {
      this.loading = true;
      this.error = null;
      try {
        await departemenApi.create(data);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal menambahkan departemen';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async update(id: number, data: Partial<DepartemenForm>) {
      this.loading = true;
      this.error = null;
      try {
        await departemenApi.update(id, data);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal memperbarui departemen';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async delete(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await departemenApi.delete(id);
        await this.fetchAll();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal menghapus departemen';
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
