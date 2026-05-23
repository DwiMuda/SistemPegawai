import { defineStore } from 'pinia';
import { pegawaiApi } from '@/api/pegawai.api';
export const usePegawaiStore = defineStore('pegawai', {
    state: () => ({
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
                const params = {
                    page,
                    limit: 10,
                    search: this.search || undefined,
                    ...this.filters,
                };
                const response = await pegawaiApi.getAll(params);
                this.list = response.data.data;
                this.pagination = response.data.meta ?? null;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal mengambil data pegawai';
            }
            finally {
                this.loading = false;
            }
        },
        async fetchAllSimple() {
            try {
                const response = await pegawaiApi.getAllSimple();
                return response.data.data;
            }
            catch (error) {
                console.error('Failed to fetch simple list of pegawai:', error);
                return [];
            }
        },
        async getById(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await pegawaiApi.getById(id);
                this.current = response.data.data;
                return this.current;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal mengambil detail pegawai';
                return null;
            }
            finally {
                this.loading = false;
            }
        },
        async create(data) {
            this.loading = true;
            this.error = null;
            try {
                await pegawaiApi.create(data);
                await this.fetchAll();
                return true;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal menambahkan pegawai';
                return false;
            }
            finally {
                this.loading = false;
            }
        },
        async update(id, data) {
            this.loading = true;
            this.error = null;
            try {
                await pegawaiApi.update(id, data);
                await this.fetchAll();
                return true;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal memperbarui pegawai';
                return false;
            }
            finally {
                this.loading = false;
            }
        },
        async delete(id) {
            this.loading = true;
            this.error = null;
            try {
                await pegawaiApi.delete(id);
                await this.fetchAll();
                return true;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal menghapus pegawai';
                return false;
            }
            finally {
                this.loading = false;
            }
        },
        setSearch(search) {
            this.search = search;
        },
        setFilters(filters) {
            this.filters = { ...this.filters, ...filters };
        },
        clearFilters() {
            this.filters = {};
            this.search = '';
        }
    },
});
//# sourceMappingURL=pegawai.store.js.map