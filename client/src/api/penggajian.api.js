import { api } from '@/utils/api';
export const penggajianApi = {
    getAll(params) {
        return api.get('/penggajian', { params });
    },
    getById(id) {
        return api.get(`/penggajian/${id}`);
    },
    generate(data) {
        return api.post('/penggajian/generate', data);
    },
    updateKomponen(id, data) {
        return api.put(`/penggajian/${id}`, data);
    },
    bayar(id) {
        return api.put(`/penggajian/${id}/bayar`);
    },
    downloadPdf(id) {
        return api.get(`/penggajian/${id}/pdf`, { responseType: 'blob' });
    },
    downloadExcel(params) {
        return api.get('/penggajian/export/excel', { params, responseType: 'blob' });
    }
};
//# sourceMappingURL=penggajian.api.js.map