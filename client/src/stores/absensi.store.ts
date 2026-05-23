import { defineStore } from 'pinia';
import { absensiApi } from '@/api/absensi.api';
import type { Absensi, AbsensiRekapParams, AbsensiManualForm, AbsensiValidasiForm, AbsensiStatistik } from '@/types/absensi';

interface AbsensiState {
  myRiwayat: Absensi[];
  rekap: Absensi[];
  statistik: AbsensiStatistik | null;
  loading: boolean;
  error: string | null;
  filters: AbsensiRekapParams;
}

export const useAbsensiStore = defineStore('absensi', {
  state: (): AbsensiState => ({
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
    async fetchMyRiwayat(params?: { bulan?: number; tahun?: number }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await absensiApi.getMyRiwayat(params);
        this.myRiwayat = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil riwayat absensi';
      } finally {
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
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal melakukan absen masuk';
        return false;
      } finally {
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
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal melakukan absen keluar';
        return false;
      } finally {
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
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil data rekap absensi';
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistik() {
      try {
        const response = await absensiApi.getStatistik();
        this.statistik = response.data.data;
      } catch (error: any) {
        console.error('Gagal mengambil statistik absensi', error);
      }
    },

    async manualInput(data: AbsensiManualForm) {
      this.loading = true;
      this.error = null;
      try {
        await absensiApi.manualInput(data);
        await this.fetchRekap();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal menyimpan absensi manual';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async validasi(id: number, data: AbsensiValidasiForm) {
      this.loading = true;
      this.error = null;
      try {
        await absensiApi.validasi(id, data);
        await this.fetchRekap();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal memvalidasi absensi';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async validasiMassal(ids: number[]) {
      this.loading = true;
      this.error = null;
      try {
        await absensiApi.validasiMassal(ids);
        await this.fetchRekap();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal memvalidasi absensi massal';
        return false;
      } finally {
        this.loading = false;
      }
    },

    setFilters(filters: Partial<AbsensiRekapParams>) {
      this.filters = { ...this.filters, ...filters };
    }
  },
});
