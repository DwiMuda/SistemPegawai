import { api } from '@/utils/api';
export const laporanApi = {
    getRekapAbsensi(bulan, tahun) {
        return api.get('/laporan/absensi', { params: { bulan, tahun } });
    },
    getRekapPenggajian(bulan, tahun) {
        return api.get('/laporan/penggajian', { params: { bulan, tahun } });
    },
    downloadRekapPenggajian(bulan, tahun) {
        return api.get('/laporan/penggajian', {
            params: { bulan, tahun, format: 'excel' },
            responseType: 'blob'
        });
    },
    getExportPegawai() {
        return api.get('/laporan/pegawai');
    }
};
//# sourceMappingURL=laporan.api.js.map