import { api } from '@/utils/api';
export const jabatanApi = {
    getAll(params) {
        return api.get('/jabatan', { params });
    },
    getAllSimple() {
        return api.get('/jabatan/all');
    },
    getById(id) {
        return api.get(`/jabatan/${id}`);
    },
    create(data) {
        return api.post('/jabatan', data);
    },
    update(id, data) {
        return api.put(`/jabatan/${id}`, data);
    },
    delete(id) {
        return api.delete(`/jabatan/${id}`);
    },
};
//# sourceMappingURL=jabatan.api.js.map