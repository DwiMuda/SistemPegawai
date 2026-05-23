import { api } from '@/utils/api';
export const mutasiApi = {
    getAll(params) {
        return api.get('/mutasi', { params });
    },
    getById(id) {
        return api.get(`/mutasi/${id}`);
    },
    getByPegawai(idPegawai) {
        return api.get(`/mutasi/pegawai/${idPegawai}`);
    },
    create(data) {
        return api.post('/mutasi', data);
    }
};
//# sourceMappingURL=mutasi.api.js.map