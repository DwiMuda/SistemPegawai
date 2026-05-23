import { api } from '@/utils/api';
export const settingApi = {
    getAll() {
        return api.get('/setting');
    },
    update(key, value) {
        return api.put(`/setting/${key}`, { value });
    }
};
//# sourceMappingURL=setting.api.js.map