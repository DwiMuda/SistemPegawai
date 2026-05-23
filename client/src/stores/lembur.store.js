import { defineStore } from 'pinia';
import { ref } from 'vue';
import { lemburApi } from '../api/lembur.api';
export const useLemburStore = defineStore('lembur', () => {
    const list = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const fetchAll = async (params) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await lemburApi.getAllLembur(params);
            list.value = res.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengambil data lembur';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const fetchSaya = async (params) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await lemburApi.getLemburSaya(params);
            list.value = res.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengambil data lembur';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const ajukan = async (data) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await lemburApi.ajukanLembur(data);
            list.value.unshift(res.data);
            return res;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengajukan lembur';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const approve = async (idLembur, data) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await lemburApi.approveLembur(idLembur, data);
            const index = list.value.findIndex(l => l.idLembur === idLembur);
            if (index !== -1) {
                list.value[index] = res.data;
            }
            return res;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal memproses lembur';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    return {
        list,
        isLoading,
        error,
        fetchAll,
        fetchSaya,
        ajukan,
        approve
    };
});
//# sourceMappingURL=lembur.store.js.map