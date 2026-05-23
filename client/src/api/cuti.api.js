import { api } from '@/utils/api';
export const cutiApi = {
    // Pegawai
    createPengajuan(data) {
        return api.post('/cuti', data);
    },
    getMyCuti(params) {
        return api.get('/cuti/me', { params });
    },
    // Admin
    getAllCuti(params) {
        return api.get('/cuti', { params });
    },
    approveCuti(id, data) {
        return api.put(`/cuti/${id}/approve`, data);
    }
};
//# sourceMappingURL=cuti.api.js.map