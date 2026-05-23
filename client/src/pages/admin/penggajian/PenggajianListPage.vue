<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { usePenggajianStore } from '@/stores/penggajian.store';
import { useExport } from '@/composables/useExport';
import { useNotification } from '@/composables/useNotification';
import { penggajianApi } from '@/api/penggajian.api';

const store = usePenggajianStore();
const { isExporting, exportError, handleExport } = useExport();
const { addToast } = useNotification();

const selectedIds = ref<number[]>([]);
const isProcessingBulk = ref(false);

const currentDate = new Date();
const filterBulan = ref(currentDate.getMonth() + 1);
const filterTahun = ref(currentDate.getFullYear());

const fetchData = async () => {
  await store.fetchAll({
    bulan: filterBulan.value,
    tahun: filterTahun.value
  });
};

onMounted(() => {
  fetchData();
});

watch([filterBulan, filterTahun], () => {
  selectedIds.value = [];
  fetchData();
});

const isAllSelected = computed(() => {
  const pendingGaji = store.list.filter(g => g.statusBayar === 'pending');
  return pendingGaji.length > 0 && selectedIds.value.length === pendingGaji.length;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = store.list.filter(g => g.statusBayar === 'pending').map(g => g.idGaji);
  }
};

const handleBulkPay = async () => {
  if (selectedIds.value.length === 0) return;
  
  if (confirm(`Apakah Anda yakin ingin menandai ${selectedIds.value.length} gaji sebagai telah dibayar?`)) {
    isProcessingBulk.value = true;
    try {
      await store.bayarMassal(selectedIds.value);
      selectedIds.value = [];
      addToast({ type: 'success', title: 'Berhasil', message: 'Pembayaran massal berhasil' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Terjadi kesalahan' });
    } finally {
      isProcessingBulk.value = false;
    }
  }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const formatStatus = (status: string) => {
  const map: Record<string, { text: string, class: string }> = {
    pending: { text: 'Menunggu', class: 'bg-warning-100 text-warning-800' },
    dibayar: { text: 'Dibayar', class: 'bg-success-100 text-success-800' },
    batal: { text: 'Dibatalkan', class: 'bg-danger-100 text-danger-800' }
  };
  return map[status] || { text: status, class: 'bg-surface-100 text-surface-800' };
};

const getNamaJabatan = (pegawai: any) => {
  if (!pegawai?.jabatan) return '-';
  if (typeof pegawai.jabatan === 'string') return pegawai.jabatan;
  return pegawai.jabatan.namaJabatan || '-';
};

const totalGajiBulanIni = computed(() => {
  return store.list.reduce((acc, curr) => acc + curr.totalGaji, 0);
});

const handleDownloadExcel = () => {
  const filename = `Rekap_Gaji_${filterBulan.value}_${filterTahun.value}.xlsx`;
  handleExport(() => penggajianApi.downloadExcel({ bulan: filterBulan.value, tahun: filterTahun.value }), filename);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Data Penggajian</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Daftar gaji pegawai berdasarkan periode</p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <select v-model="filterBulan" class="input py-2">
          <option v-for="m in 12" :key="m" :value="m">{{ new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' }) }}</option>
        </select>
        <select v-model="filterTahun" class="input py-2">
          <option v-for="y in 5" :key="y" :value="currentDate.getFullYear() - y + 3">{{ currentDate.getFullYear() - y + 3 }}</option>
        </select>
        
        <router-link to="/admin/penggajian/generate" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Generate Gaji
        </router-link>

        <button @click="handleDownloadExcel" :disabled="isExporting || store.list.length === 0" class="btn btn-outline text-success-600 border-success-600 hover:bg-success-50 dark:hover:bg-success-900/20">
          <svg v-if="isExporting" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>

        <button v-if="selectedIds.length > 0" @click="handleBulkPay" :disabled="isProcessingBulk" class="btn btn-success">
          <svg v-if="isProcessingBulk" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Bayar Terpilih ({{ selectedIds.length }})
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card p-4 border-l-4 border-primary-500">
        <p class="text-sm text-surface-500 dark:text-surface-400">Total Pegawai Digaji</p>
        <p class="text-2xl font-bold text-surface-900 dark:text-white mt-1">{{ store.list.length }}</p>
      </div>
      <div class="card p-4 border-l-4 border-success-500">
        <p class="text-sm text-surface-500 dark:text-surface-400">Total Pembayaran</p>
        <p class="text-2xl font-bold text-surface-900 dark:text-white mt-1">{{ formatCurrency(totalGajiBulanIni) }}</p>
      </div>
      <div class="card p-4 border-l-4 border-warning-500">
        <p class="text-sm text-surface-500 dark:text-surface-400">Belum Dibayar</p>
        <p class="text-2xl font-bold text-surface-900 dark:text-white mt-1">{{ store.list.filter(g => g.statusBayar === 'pending').length }}</p>
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
              <th class="px-4 py-3 font-medium w-10">
                <input 
                  type="checkbox" 
                  class="rounded text-primary-600 focus:ring-primary-500" 
                  :checked="isAllSelected" 
                  @change="toggleSelectAll" 
                  :disabled="store.list.filter(g => g.statusBayar === 'pending').length === 0"
                />
              </th>
              <th class="px-4 py-3 font-medium">Pegawai</th>
              <th class="px-4 py-3 font-medium">Jabatan</th>
              <th class="px-4 py-3 font-medium text-right">Gaji Pokok</th>
              <th class="px-4 py-3 font-medium text-right">Tunjangan</th>
              <th class="px-4 py-3 font-medium text-right">Potongan</th>
              <th class="px-4 py-3 font-medium text-right">Total Gaji</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
              <th class="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-if="store.isLoading && store.list.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-surface-500">
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="store.list.length === 0">
              <td colspan="8" class="px-4 py-8 text-center text-surface-500">
                Belum ada data gaji untuk periode ini. Silakan generate gaji terlebih dahulu.
              </td>
            </tr>
            <tr v-for="item in store.list" :key="item.idGaji" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-3 text-center">
                <input 
                  v-if="item.statusBayar === 'pending'"
                  type="checkbox" 
                  class="rounded text-primary-600 focus:ring-primary-500" 
                  :value="item.idGaji"
                  v-model="selectedIds"
                />
              </td>
              <td class="px-4 py-3">
                <div class="font-medium text-surface-900 dark:text-white">{{ item.pegawai?.namaLengkap }}</div>
                <div class="text-xs text-surface-500">{{ item.pegawai?.nip }}</div>
              </td>
              <td class="px-4 py-3 text-surface-700 dark:text-surface-300">
                {{ getNamaJabatan(item.pegawai) }}
              </td>
              <td class="px-4 py-3 text-right font-medium text-surface-700 dark:text-surface-300">
                {{ formatCurrency(item.gajiPokok) }}
              </td>
              <td class="px-4 py-3 text-right font-medium text-surface-700 dark:text-surface-300">
                {{ formatCurrency(item.tunjanganJabatan + item.tunjanganTransport + item.tunjanganMakan + item.upahLembur + item.bonus) }}
              </td>
              <td class="px-4 py-3 text-right text-danger-600">
                {{ formatCurrency(item.potonganAbsensi + item.potonganBpjs + item.potonganPajak + item.potonganLain) }}
              </td>
              <td class="px-4 py-3 text-right font-bold text-primary-700 dark:text-primary-400">
                {{ formatCurrency(item.totalGaji) }}
              </td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="formatStatus(item.statusBayar).class">
                  {{ formatStatus(item.statusBayar).text }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <router-link :to="`/admin/penggajian/${item.idGaji}`" class="btn btn-sm btn-ghost">
                  Detail
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
