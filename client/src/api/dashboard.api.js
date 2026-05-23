import { api } from '@/utils/api';
export const dashboardApi = {
    getPegawaiDashboard() {
        return api.get('/dashboard/pegawai');
    },
    getAdminDashboard() {
        return api.get('/dashboard/admin');
    }
};
//# sourceMappingURL=dashboard.api.js.map