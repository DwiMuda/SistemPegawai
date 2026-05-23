<script setup lang="ts">
import { ref } from 'vue';
import { laporanApi } from '@/api/laporan.api';
import { useExport } from '@/composables/useExport';

const { isExporting, exportError, handleExport } = useExport();

const currentDate = new Date();
const filterBulan = ref(currentDate.getMonth() + 1);
const filterTahun = ref(currentDate.getFullYear());

const activeTab = ref('penggajian'); // 'penggajian' | 'absensi' | 'pegawai'
const dataPreview = ref<any[]>([]);
const isLoading = ref(false);

const fetchData = async () => {
  isLoading.value = true;
  dataPreview.value = [];
  try {
    if (activeTab.value === 'penggajian') {
      const res = await laporanApi.getRekapPenggajian(filterBulan.value, filterTahun.value);
      dataPreview.value = res.data.data;
    } else if (activeTab.value === 'absensi') {
      const res = await laporanApi.getRekapAbsensi(filterBulan.value, filterTahun.value);
      dataPreview.value = res.data.data;
    } else if (activeTab.value === 'pegawai') {
      const res = await laporanApi.getExportPegawai();
      dataPreview.value = res.data.data;
    }
  } catch (error) {
    console.error('Gagal mengambil data preview', error);
  } finally {
    isLoading.value = false;
  }
};

const handleDownload = () => {
  if (activeTab.value === 'penggajian') {
    handleExport(
      () => laporanApi.downloadRekapPenggajian(filterBulan.value, filterTahun.value),
      `Rekap_Penggajian_${filterBulan.value}_${filterTahun.value}.xlsx`
    );
  } else if (activeTab.value === 'absensi') {
    // Absensi and Pegawai exports are not fully implemented with Excel yet
    alert('Export excel untuk Absensi segera hadir');
  } else if (activeTab.value === 'pegawai') {
    alert('Export excel untuk Data Pegawai segera hadir');
  }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Laporan & Rekapitulasi</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Pusat data laporan komprehensif sistem</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-surface-200 dark:border-surface-700">
      <button 
        @click="activeTab = 'penggajian'; fetchData()" 
        class="px-6 py-3 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === 'penggajian' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'"
      >
        Rekap Penggajian
      </button>
      <button 
        @click="activeTab = 'absensi'; fetchData()" 
        class="px-6 py-3 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === 'absensi' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'"
      >
        Rekap Absensi
      </button>
      <button 
        @click="activeTab = 'pegawai'; fetchData()" 
        class="px-6 py-3 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === 'pegawai' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'"
      >
        Data Pegawai
      </button>
    </div>

    <!-- Filters & Actions -->
    <div class="card p-4 border border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-4 w-full sm:w-auto" v-if="activeTab !== 'pegawai'">
        <div class="w-full sm:w-auto">
          <label class="block text-xs text-surface-500 mb-1">Bulan</label>
          <select v-model="filterBulan" @change="fetchData" class="input py-2">
            <option v-for="m in 12" :key="m" :value="m">{{ new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' }) }}</option>
          </select>
        </div>
        <div class="w-full sm:w-auto">
          <label class="block text-xs text-surface-500 mb-1">Tahun</label>
          <select v-model="filterTahun" @change="fetchData" class="input py-2">
            <option v-for="y in 5" :key="y" :value="currentDate.getFullYear() - y + 3">{{ currentDate.getFullYear() - y + 3 }}</option>
          </select>
        </div>
      </div>
      <div v-else class="text-sm text-surface-500 italic">
        Data keseluruhan pegawai (tanpa filter bulan)
      </div>

      <button @click="handleDownload" class="btn btn-primary w-full sm:w-auto" :disabled="isExporting || isLoading || dataPreview.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        <span v-if="isExporting">Memproses...</span>
        <span v-else>Download {{ activeTab === 'penggajian' ? 'Excel' : 'Laporan' }}</span>
      </button>
    </div>
    
    <div v-if="exportError" class="p-4 bg-danger-50 text-danger-600 rounded-lg text-sm">
      {{ exportError }}
    </div>

    <!-- Preview Table -->
    <div class="card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div class="p-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 flex justify-between items-center">
        <h3 class="font-bold text-surface-900 dark:text-white">Preview Data</h3>
        <span class="text-xs text-surface-500">{{ dataPreview.length }} baris</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead v-if="activeTab === 'penggajian'" class="bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
            <tr>
              <th class="px-4 py-3 font-medium">NIP</th>
              <th class="px-4 py-3 font-medium">Nama Lengkap</th>
              <th class="px-4 py-3 font-medium text-right">Gaji Pokok</th>
              <th class="px-4 py-3 font-medium text-right">Total Pendapatan</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <thead v-else-if="activeTab === 'absensi'" class="bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
            <tr>
              <th class="px-4 py-3 font-medium">NIP</th>
              <th class="px-4 py-3 font-medium">Nama Lengkap</th>
              <th class="px-4 py-3 font-medium text-center">Hadir</th>
              <th class="px-4 py-3 font-medium text-center">Izin/Sakit</th>
              <th class="px-4 py-3 font-medium text-center">Alpha</th>
              <th class="px-4 py-3 font-medium text-center">Terlambat (m)</th>
            </tr>
          </thead>
          <thead v-else-if="activeTab === 'pegawai'" class="bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
            <tr>
              <th class="px-4 py-3 font-medium">NIP</th>
              <th class="px-4 py-3 font-medium">Nama Lengkap</th>
              <th class="px-4 py-3 font-medium">Departemen</th>
              <th class="px-4 py-3 font-medium">Jabatan</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-if="isLoading">
              <td colspan="6" class="px-4 py-8 text-center text-surface-500">Memuat data...</td>
            </tr>
            <tr v-else-if="dataPreview.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-surface-500">Tidak ada data untuk periode ini</td>
            </tr>
            
            <template v-if="!isLoading && dataPreview.length > 0">
              <template v-if="activeTab === 'penggajian'">
                <tr v-for="item in dataPreview" :key="item.nip" class="hover:bg-surface-50">
                  <td class="px-4 py-3 text-surface-600">{{ item.nip }}</td>
                  <td class="px-4 py-3 font-medium text-surface-900 dark:text-white">{{ item.namaLengkap }}</td>
                  <td class="px-4 py-3 text-right">{{ formatCurrency(item.gajiPokok) }}</td>
                  <td class="px-4 py-3 text-right font-bold text-success-600">{{ formatCurrency(item.totalGaji) }}</td>
                  <td class="px-4 py-3 text-center uppercase text-xs">{{ item.status }}</td>
                </tr>
              </template>
              
              <template v-else-if="activeTab === 'absensi'">
                <tr v-for="item in dataPreview" :key="item.nip" class="hover:bg-surface-50">
                  <td class="px-4 py-3 text-surface-600">{{ item.nip }}</td>
                  <td class="px-4 py-3 font-medium text-surface-900 dark:text-white">{{ item.nama }}</td>
                  <td class="px-4 py-3 text-center text-success-600 font-bold">{{ item.hadir }}</td>
                  <td class="px-4 py-3 text-center text-warning-600">{{ item.izin + item.sakit }}</td>
                  <td class="px-4 py-3 text-center text-danger-600">{{ item.alpha }}</td>
                  <td class="px-4 py-3 text-center">{{ item.totalTerlambatMenit }}</td>
                </tr>
              </template>
              
              <template v-else-if="activeTab === 'pegawai'">
                <tr v-for="item in dataPreview" :key="item.nip" class="hover:bg-surface-50">
                  <td class="px-4 py-3 text-surface-600">{{ item.nip }}</td>
                  <td class="px-4 py-3 font-medium text-surface-900 dark:text-white">{{ item.nama }}</td>
                  <td class="px-4 py-3">{{ item.departemen }}</td>
                  <td class="px-4 py-3">{{ item.jabatan }}</td>
                  <td class="px-4 py-3 text-center">{{ item.status }}</td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
