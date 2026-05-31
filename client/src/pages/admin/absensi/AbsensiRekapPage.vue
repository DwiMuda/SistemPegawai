<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Rekap Absensi</h1>
      <div class="flex gap-2">
        <button class="btn btn-outline">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export Excel
        </button>
      </div>
    </div>

    <!-- Statistik Hari Ini (Optional, can be extracted to a component) -->
    <div v-if="store.statistik" class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <div class="card p-4 text-center">
        <p class="text-xs font-medium text-surface-500 mb-1">Hadir</p>
        <p class="text-2xl font-bold text-success-600">{{ store.statistik.hadir }}</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-xs font-medium text-surface-500 mb-1">Terlambat</p>
        <p class="text-2xl font-bold text-warning-600">{{ store.statistik.terlambat }}</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-xs font-medium text-surface-500 mb-1">Izin</p>
        <p class="text-2xl font-bold text-info-600">{{ store.statistik.izin }}</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-xs font-medium text-surface-500 mb-1">Sakit</p>
        <p class="text-2xl font-bold text-danger-600">{{ store.statistik.sakit }}</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-xs font-medium text-surface-500 mb-1">Alpha</p>
        <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ store.statistik.alpha }}</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-xs font-medium text-surface-500 mb-1">Cuti</p>
        <p class="text-2xl font-bold text-primary-600">{{ store.statistik.cuti }}</p>
      </div>
    </div>

    <div class="card p-6">
      <!-- Filters -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="w-full md:w-48">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Bulan</label>
            <select v-model="filterBulan" @change="applyFilters" class="form-input text-sm">
              <option v-for="m in 12" :key="m" :value="m">{{ getMonthName(m) }}</option>
            </select>
          </div>
          <div class="w-full md:w-32">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tahun</label>
            <select v-model="filterTahun" @change="applyFilters" class="form-input text-sm">
              <option v-for="y in [2024, 2025, 2026]" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <div class="w-full md:w-48">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Departemen</label>
            <select v-model="filterDepartemen" @change="applyFilters" class="form-input text-sm">
              <option value="">Semua Departemen</option>
              <option v-for="dept in departemenList" :key="dept.id" :value="dept.id">
                {{ dept.namaDepartemen }}
              </option>
            </select>
          </div>
        </div>

        <!-- Search -->
        <div class="relative w-full md:w-72">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari..."
            class="form-input pl-10"
            @input="handleSearch"
          />
        </div>
      </div>

      <AppDataTable
        :columns="columns"
        :data="store.rekap"
        :loading="store.loading"
        :show-search="false"
        empty-text="Tidak ada data absensi"
      >
        <template #cell-tanggal="{ row }">
          <span class="text-sm font-medium">{{ formatDate(row.tanggal) }}</span>
        </template>
        
        <template #cell-pegawai="{ row }">
          <div>
            <p class="font-medium text-surface-900 dark:text-white">{{ row.pegawai?.namaLengkap }}</p>
            <p class="text-xs text-surface-500">{{ row.pegawai?.departemen?.namaDepartemen }}</p>
          </div>
        </template>

        <template #cell-jamMasuk="{ row }">
          <span v-if="row.jamMasuk" class="text-sm font-mono" :class="{'text-danger-500 font-bold': row.isLate}">
            {{ row.jamMasuk }}
          </span>
          <span v-else class="text-surface-400">-</span>
        </template>

        <template #cell-jamKeluar="{ row }">
          <span v-if="row.jamKeluar" class="text-sm font-mono">{{ row.jamKeluar }}</span>
          <span v-else class="text-surface-400">-</span>
        </template>

        <template #cell-status="{ row }">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase"
            :class="{
              'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400': row.status === 'hadir' && !row.isLate,
              'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400': row.status === 'hadir' && row.isLate,
              'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-400': row.status === 'izin',
              'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-400': row.status === 'sakit',
              'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400': row.status === 'cuti',
              'bg-surface-100 text-surface-700 dark:bg-surface-500/10 dark:text-surface-400': row.status === 'alpha' || row.status === 'libur',
            }"
          >
            {{ row.status === 'hadir' && row.isLate ? 'Terlambat' : row.status }}
          </span>
        </template>

        <template #cell-isValidated="{ row }">
          <span v-if="row.isValidated" class="text-success-500" title="Divalidasi">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span v-else class="text-surface-300" title="Belum Divalidasi">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </template>

      </AppDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAbsensiStore } from '@/stores/absensi.store';
import AppDataTable from '@/components/common/AppDataTable.vue';
import type { Column } from '@/components/common/AppDataTable.vue';
import { departemenApi } from '@/api/departemen.api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const store = useAbsensiStore();

const filterBulan = ref(new Date().getMonth() + 1);
const filterTahun = ref(new Date().getFullYear());
const filterDepartemen = ref('');
const departemenList = ref<any[]>([]);
const searchQuery = ref('');
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const columns: Column[] = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'pegawai', label: 'Pegawai' },
  { key: 'jamMasuk', label: 'Masuk' },
  { key: 'jamKeluar', label: 'Keluar' },
  { key: 'status', label: 'Status' },
  { key: 'isValidated', label: 'Valid' },
];

onMounted(async () => {
  store.fetchStatistik();
  store.setFilters({ bulan: filterBulan.value, tahun: filterTahun.value });
  store.fetchRekap();

  try {
    const res = await departemenApi.getAllSimple();
    departemenList.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
});

function applyFilters() {
  store.setFilters({
    bulan: filterBulan.value,
    tahun: filterTahun.value,
    idDepartemen: filterDepartemen.value ? Number(filterDepartemen.value) : undefined,
  });
  store.fetchRekap();
}

function handleSearch() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    store.setSearch(searchQuery.value);
    store.fetchRekap();
  }, 300);
}

function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('id-ID', { month: 'long' });
}

function formatDate(dateString: string) {
  if (!dateString) return '-';
  return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
}
</script>
