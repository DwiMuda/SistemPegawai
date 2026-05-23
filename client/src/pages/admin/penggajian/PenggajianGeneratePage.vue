<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePenggajianStore } from '@/stores/penggajian.store';
import { useNotification } from '@/composables/useNotification';

const router = useRouter();
const store = usePenggajianStore();
const { addToast } = useNotification();

const currentDate = new Date();
// Default ke bulan lalu jika sekarang awal bulan, atau bulan ini
const defaultMonth = currentDate.getDate() < 15 ? (currentDate.getMonth() === 0 ? 12 : currentDate.getMonth()) : currentDate.getMonth() + 1;
const defaultYear = currentDate.getDate() < 15 && currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

const bulan = ref(defaultMonth);
const tahun = ref(defaultYear);

const isGenerating = ref(false);

const handleGenerate = async () => {
  if (confirm(`Apakah Anda yakin ingin memproses data penggajian untuk periode ${bulan.value}/${tahun.value}? Tindakan ini akan menghitung gaji semua pegawai aktif.`)) {
    isGenerating.value = true;
    try {
      const res = await store.generate({ bulan: bulan.value, tahun: tahun.value });
      addToast({ type: 'success', title: 'Berhasil', message: `Berhasil meng-generate gaji untuk ${res.data.generatedCount} pegawai` });
      router.push('/admin/penggajian');
    } catch (error: any) {
      addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal melakukan generate penggajian' });
    } finally {
      isGenerating.value = false;
    }
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <router-link to="/admin/penggajian" class="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white bg-surface-100 dark:bg-surface-800 rounded-lg transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Generate Penggajian</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Proses perhitungan gaji bulanan secara otomatis</p>
      </div>
    </div>

    <div class="card p-6 border border-surface-200 dark:border-surface-700">
      <div class="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800 mb-6 flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-primary-800 dark:text-primary-300">
          <p class="font-bold mb-1">Informasi Generate Gaji</p>
          <ul class="list-disc pl-4 space-y-1">
            <li>Sistem akan mengambil data kehadiran otomatis untuk periode yang dipilih.</li>
            <li>Potongan absensi (jika ada), BPJS, dan PPh 21 akan dihitung by system.</li>
            <li>Anda masih dapat mengedit komponen (seperti bonus/potongan lain) setelah proses generate selesai.</li>
          </ul>
        </div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Bulan</label>
            <select v-model="bulan" class="input w-full">
              <option v-for="m in 12" :key="m" :value="m">{{ new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' }) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tahun</label>
            <select v-model="tahun" class="input w-full">
              <option v-for="y in 5" :key="y" :value="currentDate.getFullYear() - y + 3">{{ currentDate.getFullYear() - y + 3 }}</option>
            </select>
          </div>
        </div>

        <button @click="handleGenerate" :disabled="isGenerating" class="btn btn-primary w-full justify-center mt-6">
          <svg v-if="isGenerating" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="isGenerating">Memproses...</span>
          <span v-else>Mulai Generate Gaji</span>
        </button>
      </div>
    </div>
  </div>
</template>
