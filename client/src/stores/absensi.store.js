import { defineStore } from 'pinia';
import { absensiApi } from '@/api/absensi.api';
export const useAbsensiStore = defineStore('absensi', {
    state: () => ({
        myRiwayat: [],
        rekap: [],
        statistik: null,
        loading: false,
        error: null,
        filters: {
            bulan: new Date().getMonth() + 1,
            tahun: new Date().getFullYear(),
        },
    }),
    actions: {
        // Pegawai Actions
        async fetchMyRiwayat(params) {
            this.loading = true;
            this.error = null;
            try {
                const response = await absensiApi.getMyRiwayat(params);
                this.myRiwayat = response.data.data;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal mengambil riwayat absensi';
            }
            finally {
                this.loading = false;
            }
        },
        async clockIn() {
            this.loading = true;
            this.error = null;
            try {
                await absensiApi.clockIn();
                await this.fetchMyRiwayat();
                return true;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal melakukan absen masuk';
                return false;
            }
            finally {
                this.loading = false;
            }
        },
        async clockOut() {
            this.loading = true;
            this.error = null;
            try {
                await absensiApi.clockOut();
                await this.fetchMyRiwayat();
                return true;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal melakukan absen keluar';
                return false;
            }
            finally {
                this.loading = false;
            }
        },
        // Admin Actions
        async fetchRekap() {
            this.loading = true;
            this.error = null;
            try {
                const response = await absensiApi.getRekap(this.filters);
                this.rekap = response.data.data;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal mengambil data rekap absensi';
            }
            finally {
                this.loading = false;
            }
        },
        async fetchStatistik() {
            try {
                const response = await absensiApi.getStatistik();
                this.statistik = response.data.data;
            }
            catch (error) {
                console.error('Gagal mengambil statistik absensi', error);
            }
        },
        async manualInput(data) {
            this.loading = true;
            this.error = null;
            try {
                await absensiApi.manualInput(data);
                await this.fetchRekap();
                return true;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal menyimpan absensi manual';
                return false;
            }
            finally {
                this.loading = false;
            }
        },
        async validasi(id, data) {
            this.loading = true;
            this.error = null;
            try {
                await absensiApi.validasi(id, data);
                await this.fetchRekap();
                return true;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal memvalidasi absensi';
                return false;
            }
            finally {
                this.loading = false;
            }
        },
        async validasiMassal(ids) {
            this.loading = true;
            this.error = null;
            try {
                await absensiApi.validasiMassal(ids);
                await this.fetchRekap();
                return true;
            }
            catch (error) {
                this.error = error.response?.data?.message || 'Gagal memvalidasi absensi massal';
                return false;
            }
            finally {
                this.loading = false;
            }
        },
        setFilters(filters) {
            this.filters = { ...this.filters, ...filters };
        }
    },
});
//# sourceMappingURL=absensi.store.js.map