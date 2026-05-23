import { api } from '@/utils/api';
export const absensiApi = {
    // Pegawai
    clockIn() {
        return api.post('/absensi/clock-in');
    },
    clockOut() {
        return api.post('/absensi/clock-out');
    },
    getMyRiwayat(params) {
        return api.get('/absensi/me', { params });
    },
    // Admin
    getRekap(params) {
        return api.get('/absensi/rekap', { params });
    },
    getStatistik() {
        return api.get('/absensi/statistik');
    },
    manualInput(data) {
        return api.post('/absensi/manual', data);
    },
    validasi(id, data) {
        return api.put(`/absensi/${id}/validasi`, data);
    },
    validasiMassal(ids) {
        return api.put('/absensi/validasi-massal', { ids });
    }
};
//# sourceMappingURL=absensi.api.js.map