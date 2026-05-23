import { defineStore } from 'pinia';
import { ref } from 'vue';
import { cutiApi } from '@/api/cuti.api';
export const useCutiStore = defineStore('cuti', () => {
    const cutiList = ref([]);
    const myCutiList = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const fetchMyCuti = async (params) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await cutiApi.getMyCuti(params);
            myCutiList.value = response.data.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengambil data cuti';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const fetchAllCuti = async (params) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await cutiApi.getAllCuti(params);
            cutiList.value = response.data.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengambil seluruh data cuti';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const ajukanCuti = async (data) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await cutiApi.createPengajuan(data);
            myCutiList.value.unshift(response.data.data);
            return response.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengajukan cuti';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const approveCuti = async (id, data) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await cutiApi.approveCuti(id, data);
            const index = cutiList.value.findIndex(c => c.idCuti === id);
            if (index !== -1) {
                cutiList.value[index] = response.data.data;
            }
            return response.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal menyetujui/menolak cuti';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    return {
        cutiList,
        myCutiList,
        isLoading,
        error,
        fetchMyCuti,
        fetchAllCuti,
        ajukanCuti,
        approveCuti
    };
});
//# sourceMappingURL=cuti.store.js.map