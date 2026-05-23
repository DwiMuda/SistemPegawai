<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dashboardApi } from '@/api/dashboard.api';

const isLoading = ref(true);
const data = ref<any>(null);

onMounted(async () => {
  try {
    const res = await dashboardApi.getAdminDashboard();
    data.value = res.data.data;
  } catch (error) {
    console.error('Failed to fetch admin dashboard', error);
  } finally {
    isLoading.value = false;
  }
});

const formatCurrency = (val: number) => {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Dashboard Admin</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Ringkasan statistik sistem kepegawaian hari ini</p>
      </div>
      <div class="text-sm text-surface-500 font-medium bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-lg">
        {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-surface-200 border-t-primary-600"></div>
    </div>

    <template v-else-if="data">
      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Pegawai Aktif -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 text-primary-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">Total Pegawai Aktif</h3>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ data.statistik.totalPegawai }}</p>
            </div>
          </div>
        </div>

        <!-- Hadir Hari Ini -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700 relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-success-50 dark:bg-success-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="w-12 h-12 bg-success-100 dark:bg-success-900/40 text-success-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">Hadir Hari Ini</h3>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ data.statistik.hadirHariIni }}</p>
              <p class="text-xs text-success-600 font-medium mt-1">Dari {{ data.statistik.totalPegawai }} Pegawai</p>
            </div>
          </div>
        </div>

        <!-- Cuti Pending -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700 relative overflow-hidden group cursor-pointer" @click="$router.push('/admin/cuti')">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-warning-50 dark:bg-warning-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="w-12 h-12 bg-warning-100 dark:bg-warning-900/40 text-warning-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">Cuti Tertunda</h3>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ data.statistik.cutiPending }}</p>
              <p v-if="data.statistik.cutiPending > 0" class="text-xs text-warning-600 font-medium mt-1">Butuh persetujuan segera!</p>
            </div>
          </div>
        </div>

        <!-- Total Gaji -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700 relative overflow-hidden group cursor-pointer" @click="$router.push('/admin/penggajian')">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-danger-50 dark:bg-danger-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="w-12 h-12 bg-danger-100 dark:bg-danger-900/40 text-danger-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">Gaji Dibayar (Bulan Ini)</h3>
              <p class="text-xl font-bold text-surface-900 dark:text-white truncate">{{ formatCurrency(data.statistik.totalGajiBulanIni) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Absensi 7 Hari -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700 lg:col-span-2">
          <h3 class="font-bold text-surface-900 dark:text-white mb-6">Tren Kehadiran (7 Hari Terakhir)</h3>
          <div class="h-64 flex items-end justify-between gap-2">
            <div v-for="item in data.trendAbsensi" :key="item.tanggal" class="flex flex-col items-center flex-1 group">
              <div class="relative w-full flex justify-center h-full items-end pb-2">
                <div 
                  class="w-full max-w-[40px] bg-primary-200 dark:bg-primary-900/30 rounded-t-md transition-all duration-300 group-hover:bg-primary-300 dark:group-hover:bg-primary-800 relative"
                  :style="`height: ${Math.max((item.hadir / Math.max(...data.trendAbsensi.map((t:any) => t.hadir || 1))) * 100, 5)}%`"
                >
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ item.hadir }}
                  </div>
                </div>
              </div>
              <span class="text-xs font-medium text-surface-500 mt-2">{{ item.tanggal }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700">
          <h3 class="font-bold text-surface-900 dark:text-white mb-4">Aksi Cepat</h3>
          <div class="space-y-3">
            <router-link to="/admin/absensi/validasi" class="flex items-center p-3 rounded-lg border border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-surface-900 dark:text-white">Validasi Absensi</p>
                <p class="text-xs text-surface-500">Review jam masuk pegawai</p>
              </div>
            </router-link>
            <router-link to="/admin/penggajian/generate" class="flex items-center p-3 rounded-lg border border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-success-100 text-success-600 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-surface-900 dark:text-white">Generate Gaji</p>
                <p class="text-xs text-surface-500">Hitung payroll bulan ini</p>
              </div>
            </router-link>
            <router-link to="/admin/pegawai" class="flex items-center p-3 rounded-lg border border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-warning-100 text-warning-600 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-surface-900 dark:text-white">Tambah Pegawai</p>
                <p class="text-xs text-surface-500">Registrasi karyawan baru</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
