<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePenggajianStore } from '@/stores/penggajian.store';
import { useAuthStore } from '@/stores/auth.store';
import { useExport } from '@/composables/useExport';
import { penggajianApi } from '@/api/penggajian.api';

const store = usePenggajianStore();
const authStore = useAuthStore();
const { isExporting, exportError, handleExport } = useExport();

const currentDate = new Date();
const filterTahun = ref(currentDate.getFullYear());

const fetchData = async () => {
  if (!authStore.user?.pegawai?.idPegawai) return;
  
  await store.fetchAll({
    tahun: filterTahun.value,
    idPegawai: authStore.user.pegawai.idPegawai
  });
};

onMounted(() => {
  fetchData();
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const formatStatus = (status: string) => {
  const map: Record<string, { text: string, class: string }> = {
    pending: { text: 'Diproses', class: 'bg-warning-100 text-warning-800' },
    dibayar: { text: 'Diterima', class: 'bg-success-100 text-success-800' },
    batal: { text: 'Dibatalkan', class: 'bg-danger-100 text-danger-800' }
  };
  return map[status] || { text: status, class: 'bg-surface-100 text-surface-800' };
};

const getBulanName = (m: number) => {
  return new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' });
};

const downloadPdf = (idGaji: number, bulan: number, tahun: number) => {
  const filename = `SlipGaji_${getBulanName(bulan)}_${tahun}.pdf`;
  handleExport(() => penggajianApi.downloadPdf(idGaji), filename);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Slip Gaji</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Riwayat penerimaan gaji Anda</p>
      </div>
      
      <div class="flex items-center gap-3">
        <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Tahun:</label>
        <select v-model="filterTahun" @change="fetchData" class="input py-2">
          <option v-for="y in 5" :key="y" :value="currentDate.getFullYear() - y + 3">{{ currentDate.getFullYear() - y + 3 }}</option>
        </select>
      </div>
    </div>

    <div v-if="exportError" class="p-4 bg-danger-50 text-danger-600 rounded-lg text-sm">
      {{ exportError }}
    </div>

    <!-- Table -->
    <div class="card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th class="px-4 py-3 font-medium">Periode</th>
              <th class="px-4 py-3 font-medium text-right">Pendapatan Bersih</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
              <th class="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-if="store.isLoading && store.list.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-surface-500">
                Memuat riwayat slip gaji...
              </td>
            </tr>
            <tr v-else-if="store.list.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-surface-500">
                Belum ada data slip gaji untuk tahun ini.
              </td>
            </tr>
            <tr v-for="item in store.list" :key="item.idGaji" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-3 font-medium text-surface-900 dark:text-white">
                {{ getBulanName(item.periodeBulan) }} {{ item.periodeTahun }}
              </td>
              <td class="px-4 py-3 text-right font-bold text-primary-700 dark:text-primary-400">
                {{ formatCurrency(item.totalGaji) }}
              </td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="formatStatus(item.statusBayar).class">
                  {{ formatStatus(item.statusBayar).text }}
                </span>
                <div v-if="item.tanggalBayar" class="text-[10px] text-surface-500 mt-1">
                  {{ new Date(item.tanggalBayar).toLocaleDateString('id-ID') }}
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <button 
                  @click="downloadPdf(item.idGaji, item.periodeBulan, item.periodeTahun)" 
                  class="btn btn-sm btn-outline text-primary-600 border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  :disabled="isExporting"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Unduh PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
