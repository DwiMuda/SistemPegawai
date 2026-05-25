import { defineStore } from 'pinia';
import { reimbursementApi } from '@/api/reimbursement.api';

export const useReimbursementStore = defineStore('reimbursement', {
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
        const res = await reimbursementApi.getAll();
        this.list = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchMyReimbursement() {
      this.loading = true;
      try {
        const res = await reimbursementApi.getMyReimbursement();
        this.myList = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async create(formData: FormData) {
      this.loading = true;
      try {
        await reimbursementApi.create(formData);
        await this.fetchMyReimbursement();
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
        await reimbursementApi.approve(id, { catatanAdmin });
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
        await reimbursementApi.reject(id, { catatanAdmin });
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
