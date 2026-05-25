import { defineStore } from 'pinia';
import { pengumumanApi } from '@/api/pengumuman.api';

export const usePengumumanStore = defineStore('pengumuman', {
  state: () => ({
    list: [] as any[],
    activeList: [] as any[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const res = await pengumumanApi.getAll();
        this.list = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchActive() {
      this.loading = true;
      try {
        const res = await pengumumanApi.getActive();
        this.activeList = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async create(data: any) {
      this.loading = true;
      try {
        await pengumumanApi.create(data);
        await this.fetchAll();
        return true;
      } catch (err: any) {
        this.error = err.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async update(id: number, data: any) {
      this.loading = true;
      try {
        await pengumumanApi.update(id, data);
        await this.fetchAll();
        return true;
      } catch (err: any) {
        this.error = err.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async delete(id: number) {
      this.loading = true;
      try {
        await pengumumanApi.delete(id);
        await this.fetchAll();
        return true;
      } catch (err: any) {
        this.error = err.message;
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});
