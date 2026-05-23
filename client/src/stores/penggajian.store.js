import { defineStore } from 'pinia';
import { ref } from 'vue';
import { penggajianApi } from '@/api/penggajian.api';
export const usePenggajianStore = defineStore('penggajian', () => {
    const list = ref([]);
    const current = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const fetchAll = async (params) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await penggajianApi.getAll(params);
            list.value = response.data.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengambil data penggajian';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const fetchById = async (id) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await penggajianApi.getById(id);
            current.value = response.data.data;
            return current.value;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal mengambil detail penggajian';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const generate = async (data) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await penggajianApi.generate(data);
            return response.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal meng-generate penggajian';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const updateKomponen = async (id, data) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await penggajianApi.updateKomponen(id, data);
            // Update data di list
            const index = list.value.findIndex(p => p.idGaji === id);
            if (index !== -1) {
                list.value[index] = response.data.data;
            }
            // Update current jika id sama
            if (current.value?.idGaji === id) {
                current.value = response.data.data;
            }
            return response.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal memperbarui komponen gaji';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    const bayar = async (id) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await penggajianApi.bayar(id);
            // Update data di list
            const index = list.value.findIndex(p => p.idGaji === id);
            if (index !== -1) {
                list.value[index] = response.data.data;
            }
            // Update current jika id sama
            if (current.value?.idGaji === id) {
                current.value = response.data.data;
            }
            return response.data;
        }
        catch (err) {
            error.value = err.response?.data?.message || 'Gagal memproses pembayaran';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    };
    return {
        list,
        current,
        isLoading,
        error,
        fetchAll,
        fetchById,
        generate,
        updateKomponen,
        bayar
    };
});
//# sourceMappingURL=penggajian.store.js.map