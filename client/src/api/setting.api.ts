import { api } from '@/utils/api';
import type { ApiResponse } from '@/types/api';

export const settingApi = {
  getAll() {
    return api.get<ApiResponse<any[]>>('/setting');
  },
  
  update(key: string, value: string) {
    return api.put<ApiResponse<any>>(`/setting/${key}`, { value });
  }
};
