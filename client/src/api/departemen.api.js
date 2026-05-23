import { api } from '@/utils/api';
export const departemenApi = {
    getAll(params) {
        return api.get('/departemen', { params });
    },
    getAllSimple() {
        return api.get('/departemen/all');
    },
    getById(id) {
        return api.get(`/departemen/${id}`);
    },
    create(data) {
        return api.post('/departemen', data);
    },
    update(id, data) {
        return api.put(`/departemen/${id}`, data);
    },
    delete(id) {
        return api.delete(`/departemen/${id}`);
    },
};
//# sourceMappingURL=departemen.api.js.map