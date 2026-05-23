import { api } from '@/utils/api';
export const lemburApi = {
    // Pegawai
    ajukanLembur: async (data) => {
        const response = await api.post('/lembur', data);
        return response.data;
    },
    getLemburSaya: async (params) => {
        const response = await api.get('/lembur/saya', { params });
        return response.data;
    },
    // Admin
    getAllLembur: async (params) => {
        const response = await api.get('/lembur', { params });
        return response.data;
    },
    approveLembur: async (idLembur, data) => {
        const response = await api.put(`/lembur/${idLembur}/approve`, data);
        return response.data;
    }
};
//# sourceMappingURL=lembur.api.js.map