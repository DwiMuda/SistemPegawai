import { defineStore } from 'pinia';
import { kasbonApi } from '@/api/kasbon.api';

export const useKasbonStore = defineStore('kasbon', {
  state: () => ({
    list: [] as any[],
    myList: [] as any[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        const res = await kasbonApi.getAll();
        this.list = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchMyKasbon() {
      this.loading = true;
      try {
        const res = await kasbonApi.getMyKasbon();
        this.myList = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async create(data: any) {
      this.loading = true;
      try {
        await kasbonApi.create(data);
        await this.fetchMyKasbon();
        return true;
      } catch (err: any) {
        this.error = err.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async approve(id: number, catatanAdmin?: string) {
      this.loading = true;
      try {
        await kasbonApi.approve(id, { catatanAdmin });
        await this.fetchAll();
        return true;
      } catch (err: any) {
        this.error = err.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async reject(id: number, catatanAdmin: string) {
      this.loading = true;
      try {
        await kasbonApi.reject(id, { catatanAdmin });
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
