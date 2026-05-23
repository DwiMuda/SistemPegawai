import { api } from '@/utils/api';
export const pegawaiApi = {
    getAll(params) {
        return api.get('/pegawai', { params });
    },
    getAllSimple() {
        return api.get('/pegawai/all');
    },
    getById(id) {
        return api.get(`/pegawai/${id}`);
    },
    create(data) {
        return api.post('/pegawai', data);
    },
    update(id, data) {
        return api.put(`/pegawai/${id}`, data);
    },
    delete(id) {
        return api.delete(`/pegawai/${id}`);
    },
};
//# sourceMappingURL=pegawai.api.js.map