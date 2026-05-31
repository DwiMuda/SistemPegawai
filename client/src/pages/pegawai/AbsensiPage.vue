<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Absensi Kehadiran</h1>
      <p class="text-surface-600 dark:text-surface-400">Catat waktu masuk dan pulang Anda hari ini.</p>
    </div>

    <!-- Clock Widget -->
    <div class="card p-8 text-center mb-8 bg-gradient-to-br from-primary-50 to-surface-100 dark:from-primary-900/20 dark:to-surface-800">
      <h2 class="text-4xl md:text-6xl font-mono font-bold text-surface-900 dark:text-white mb-2 tracking-wider">
        {{ currentTime }}
      </h2>
      <p class="text-lg text-surface-600 dark:text-surface-400 mb-8">{{ currentDate }}</p>

      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          @click="handleClockIn" 
          class="btn btn-primary btn-lg min-w-[200px] shadow-lg hover:-translate-y-1 transition-transform"
          :disabled="store.loading || hasClockedIn"
        >
          <svg class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          {{ hasClockedIn ? 'Sudah Masuk' : 'Absen Masuk' }}
        </button>

        <button 
          @click="handleClockOut" 
          class="btn btn-lg min-w-[200px] shadow-lg hover:-translate-y-1 transition-transform"
          :class="hasClockedOut || !hasClockedIn ? 'btn-outline opacity-50' : 'bg-surface-900 text-white hover:bg-surface-800'"
          :disabled="store.loading || !hasClockedIn || hasClockedOut"
        >
          <svg class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {{ hasClockedOut ? 'Sudah Pulang' : 'Absen Pulang' }}
        </button>
      </div>

      <div v-if="todayRecord" class="mt-8 p-4 bg-white dark:bg-surface-900 rounded-xl inline-block text-left shadow-sm">
        <h3 class="text-sm font-bold text-surface-500 mb-3 uppercase tracking-wider">Status Hari Ini</h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
          <div class="text-sm text-surface-500">Jam Masuk</div>
          <div class="text-sm font-mono font-medium">{{ todayRecord.jamMasuk || '-' }}</div>
          
          <div class="text-sm text-surface-500">Jam Pulang</div>
          <div class="text-sm font-mono font-medium">{{ todayRecord.jamKeluar || '-' }}</div>
          
          <div class="text-sm text-surface-500">Status</div>
          <div>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase bg-success-50 text-success-700">
              {{ todayRecord.status === 'hadir' && todayRecord.isLate ? 'Terlambat' : todayRecord.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Riwayat -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-surface-900 dark:text-white">Riwayat Absensi</h2>
        <div class="flex gap-2">
          <select v-model="filterBulan" @change="fetchRiwayat" class="form-input text-sm">
            <option v-for="m in 12" :key="m" :value="m">{{ getMonthName(m) }}</option>
          </select>
          <select v-model="filterTahun" @change="fetchRiwayat" class="form-input text-sm">
            <option v-for="y in [2024, 2025, 2026]" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <AppDataTable
        :columns="columns"
        :data="store.myRiwayat"
        :loading="store.loading"
        empty-text="Belum ada riwayat absensi pada bulan ini"
      >
        <template #cell-tanggal="{ row }">
          <span class="text-sm font-medium">{{ formatDate(row.tanggal) }}</span>
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
              'bg-success-50 text-success-700': row.status === 'hadir' && !row.isLate,
              'bg-warning-50 text-warning-700': row.status === 'hadir' && row.isLate,
              'bg-info-50 text-info-700': row.status === 'izin',
              'bg-danger-50 text-danger-700': row.status === 'sakit',
              'bg-primary-50 text-primary-700': row.status === 'cuti',
              'bg-surface-100 text-surface-700': row.status === 'alpha' || row.status === 'libur',
            }"
          >
            {{ row.status === 'hadir' && row.isLate ? 'Terlambat' : row.status }}
          </span>
        </template>
      </AppDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAbsensiStore } from '@/stores/absensi.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import type { Column } from '@/components/common/AppDataTable.vue';
import { format, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

const store = useAbsensiStore();
const { addToast } = useNotification();

const currentTime = ref('');
const currentDate = ref('');
let timer: any = null;

const filterBulan = ref(new Date().getMonth() + 1);
const filterTahun = ref(new Date().getFullYear());

const columns: Column[] = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'jamMasuk', label: 'Masuk' },
  { key: 'jamKeluar', label: 'Keluar' },
  { key: 'status', label: 'Status' },
];

const todayRecord = computed(() => {
  const today = new Date();
  return store.myRiwayat.find(record => isSameDay(new Date(record.tanggal), today));
});

const hasClockedIn = computed(() => !!todayRecord.value?.jamMasuk);
const hasClockedOut = computed(() => !!todayRecord.value?.jamKeluar);

function updateTime() {
  const now = new Date();
  currentTime.value = format(now, 'HH:mm:ss');
  currentDate.value = format(now, 'EEEE, dd MMMM yyyy', { locale: id });
}

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  fetchRiwayat();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function fetchRiwayat() {
  store.fetchMyRiwayat({ bulan: filterBulan.value, tahun: filterTahun.value });
}

async function handleClockIn() {
  const success = await store.clockIn();
  if (success) {
    addToast({ type: 'success', title: 'Berhasil', message: 'Anda telah melakukan absen masuk' });
  } else {
    addToast({ type: 'error', title: 'Gagal', message: store.error || 'Terjadi kesalahan' });
  }
}

async function handleClockOut() {
  const success = await store.clockOut();
  if (success) {
    addToast({ type: 'success', title: 'Berhasil', message: 'Anda telah melakukan absen pulang' });
  } else {
    addToast({ type: 'error', title: 'Gagal', message: store.error || 'Terjadi kesalahan' });
  }
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
