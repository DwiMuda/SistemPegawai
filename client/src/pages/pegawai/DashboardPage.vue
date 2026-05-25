<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dashboardApi } from '@/api/dashboard.api';
import { useAuthStore } from '@/stores/auth.store';
import { usePengumumanStore } from '@/stores/pengumuman.store';

const authStore = useAuthStore();
const pengumumanStore = usePengumumanStore();
const isLoading = ref(true);
const data = ref<any>(null);

onMounted(async () => {
  try {
    const res = await dashboardApi.getPegawaiDashboard();
    data.value = res.data.data;
    await pengumumanStore.fetchActive();
  } catch (error) {
    console.error('Failed to fetch dashboard data', error);
  } finally {
    isLoading.value = false;
  }
});

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

const formatCurrency = (val: number) => {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const getBulanName = (m: number) => {
  if (!m) return '';
  return new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' });
};

const openNotif = () => {
  const notifBtn = document.querySelector('[aria-label="Notifikasi"]');
  if (notifBtn) {
    notifBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-surface-200 border-t-primary-600"></div>
    </div>

    <template v-else-if="data">
      <!-- Welcome Card -->
      <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-primary-900/20 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div class="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center overflow-hidden shrink-0">
            <img v-if="data.profil.foto" :src="data.profil.foto" class="w-full h-full object-cover" />
            <span v-else class="text-3xl font-bold">{{ data.profil.namaLengkap.charAt(0) }}</span>
          </div>
          <div class="text-center sm:text-left">
            <h1 class="text-2xl sm:text-3xl font-bold mb-2">{{ getGreeting() }}, {{ data.profil.namaLengkap.split(' ')[0] }}!</h1>
            <p class="text-primary-100 mb-4">{{ data.profil.jabatan }} di {{ data.profil.departemen }}</p>
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              Sisa Cuti: {{ data.profil.sisaCuti }} Hari
            </div>
          </div>
        </div>
      </div>

      <!-- Papan Pengumuman -->
      <div v-if="pengumumanStore.activeList.length > 0" class="card p-6 border border-primary-200 bg-primary-50 dark:bg-primary-900/10 dark:border-primary-800 mb-6">
        <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Papan Pengumuman
        </h2>
        <div class="space-y-4">
          <div v-for="item in pengumumanStore.activeList" :key="item.idPengumuman" class="bg-white dark:bg-surface-800 p-4 rounded-xl shadow-sm border border-surface-100 dark:border-surface-700">
            <h3 class="font-bold text-surface-900 dark:text-white text-lg">{{ item.judul }}</h3>
            <p class="text-xs text-surface-500 mb-2">Dipublikasikan pada {{ new Date(item.tanggalMulai).toLocaleDateString('id-ID') }}</p>
            <p class="text-surface-700 dark:text-surface-300 whitespace-pre-wrap">{{ item.konten }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Absensi Card -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700 flex flex-col justify-between hover:border-primary-300 transition-colors">
          <div>
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 text-primary-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">Absensi Hari Ini</h3>
            <div v-if="data.absensiHariIni">
              <p class="text-2xl font-bold text-surface-900 dark:text-white capitalize">{{ data.absensiHariIni.status }}</p>
              <p class="text-sm text-surface-500 mt-1">Masuk: {{ data.absensiHariIni.jamMasuk || '-' }}</p>
            </div>
            <div v-else>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">Belum Absen</p>
            </div>
          </div>
          <router-link to="/pegawai/absensi" class="text-primary-600 text-sm font-medium hover:underline mt-4 inline-block">Riwayat Absensi &rarr;</router-link>
        </div>

        <!-- Penggajian Card -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700 flex flex-col justify-between hover:border-success-300 transition-colors">
          <div>
            <div class="w-12 h-12 bg-success-100 dark:bg-success-900/40 text-success-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">Penerimaan Terakhir</h3>
            <div v-if="data.gajiTerakhir">
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(data.gajiTerakhir.totalGaji) }}</p>
              <p class="text-sm text-surface-500 mt-1">Periode: {{ getBulanName(data.gajiTerakhir.periodeBulan) }} {{ data.gajiTerakhir.periodeTahun }}</p>
            </div>
            <div v-else>
              <p class="text-lg font-bold text-surface-500">Belum ada data gaji</p>
            </div>
          </div>
          <router-link to="/pegawai/slip-gaji" class="text-success-600 text-sm font-medium hover:underline mt-4 inline-block">Lihat Slip Gaji &rarr;</router-link>
        </div>

        <!-- Notifikasi/Stat Card -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700 flex flex-col justify-between hover:border-warning-300 transition-colors">
          <div>
            <div class="w-12 h-12 bg-warning-100 dark:bg-warning-900/40 text-warning-600 rounded-xl flex items-center justify-center mb-4 relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span v-if="data.statistik.notifikasiUnread > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 rounded-full"></span>
            </div>
            <h3 class="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">Pengumuman & Notifikasi</h3>
            <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ data.statistik.notifikasiUnread }} <span class="text-lg font-normal text-surface-500">Pesan Baru</span></p>
            <p v-if="data.statistik.cutiPending > 0" class="text-sm text-warning-600 mt-2 font-medium">
              * Anda memiliki {{ data.statistik.cutiPending }} pengajuan cuti tertunda
            </p>
          </div>
          <button @click="openNotif" class="text-warning-600 text-sm font-medium hover:underline mt-4 inline-block text-left">Buka Notifikasi &rarr;</button>
        </div>
      </div>
    </template>
  </div>
</template>
