<template>
  <header class="sticky top-0 w-full h-16 z-[250] bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700">
    <div class="h-full flex items-center justify-between px-4 lg:px-6">
      <!-- Left: mobile menu + breadcrumb -->
      <div class="flex items-center gap-3">
        <!-- Mobile menu button -->
        <button
          @click="$emit('toggle-sidebar')"
          class="lg:hidden btn-icon btn-ghost"
          aria-label="Toggle sidebar"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Page title -->
        <div>
          <h1 class="text-lg font-semibold text-surface-900 dark:text-white">
            {{ pageTitle }}
          </h1>
        </div>
      </div>

      <!-- Right: actions -->
      <div class="flex items-center gap-2">
        <!-- Search -->
        <button class="btn-icon btn-ghost hidden sm:flex" aria-label="Cari">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button @click="showNotifMenu = !showNotifMenu" class="btn-icon btn-ghost relative" aria-label="Notifikasi">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <!-- Badge -->
            <span v-if="unreadCount > 0" class="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center px-1 text-[10px] font-bold text-white bg-danger-500 rounded-full border-2 border-white dark:border-surface-900">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>

          <!-- Dropdown -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showNotifMenu"
              class="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-elevated overflow-hidden z-50"
            >
              <div class="px-4 py-3 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between bg-surface-50 dark:bg-surface-800/50">
                <h3 class="font-bold text-surface-900 dark:text-white">Notifikasi</h3>
                <button v-if="unreadCount > 0" @click="markAllAsRead" class="text-xs text-primary-600 hover:text-primary-700 font-medium">Tandai semua dibaca</button>
              </div>
              <div class="max-h-80 overflow-y-auto">
                <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-surface-500 text-sm">
                  Tidak ada notifikasi baru
                </div>
                <div v-for="notif in notifications" :key="notif.idNotifikasi" 
                     class="px-4 py-3 border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer transition-colors"
                     :class="{'bg-primary-50/50 dark:bg-primary-900/10': !notif.isRead}"
                     @click="markAsRead(notif.idNotifikasi)">
                  <div class="flex gap-3">
                    <div class="mt-1 flex-shrink-0">
                      <span class="w-2 h-2 rounded-full inline-block" 
                            :class="{
                              'bg-primary-500': notif.tipe === 'info',
                              'bg-success-500': notif.tipe === 'success',
                              'bg-warning-500': notif.tipe === 'warning',
                              'bg-danger-500': notif.tipe === 'danger'
                            }"></span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-surface-900 dark:text-white" :class="{'font-bold': !notif.isRead}">{{ notif.judul }}</p>
                      <p class="text-xs text-surface-600 dark:text-surface-400 mt-0.5 line-clamp-2">{{ notif.pesan }}</p>
                      <p class="text-[10px] text-surface-400 mt-1">{{ formatTimeAgo(notif.createdAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Dark mode toggle -->
        <button
          @click="toggleDarkMode"
          class="btn-icon btn-ghost"
          :aria-label="isDark ? 'Mode terang' : 'Mode gelap'"
        >
          <svg v-if="isDark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </button>

        <!-- User menu -->
        <div class="relative ml-2">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span class="text-white text-xs font-bold">{{ userInitials }}</span>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-surface-900 dark:text-white">{{ authStore.user?.pegawai?.namaLengkap || authStore.user?.username }}</p>
              <p class="text-xs text-surface-500 capitalize">{{ authStore.user?.role === 'admin' ? 'Administrator' : 'Pegawai' }}</p>
            </div>
            <svg class="w-4 h-4 text-surface-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showUserMenu"
              class="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-elevated py-2"
            >
              <!-- Role-based Profile Action -->
              <router-link
                v-if="authStore.isPegawai"
                to="/pegawai/profile"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                @click="showUserMenu = false"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Profil Saya
              </router-link>
              
              <button
                v-else
                @click="openAdminProfile"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Info Akun
              </button>

              <hr class="my-1 border-surface-200 dark:border-surface-700" />
              <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Keluar
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Admin Profile Modal (Floating info) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 sm:scale-100"
        leave-to-class="opacity-0 sm:scale-95"
      >
        <div v-if="showAdminModal" class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-md">
          <div @click.stop class="bg-white dark:bg-surface-800 rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden border border-surface-200 dark:border-surface-700">
            <div class="relative h-28 gradient-primary">
              <button @click="showAdminModal = false" class="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="px-8 pb-8">
              <div class="relative -mt-14 mb-6 flex justify-center">
                <div class="w-28 h-28 rounded-[2rem] bg-white dark:bg-surface-800 p-1.5 shadow-2xl">
                  <div class="w-full h-full rounded-[1.5rem] gradient-primary flex items-center justify-center text-white text-4xl font-black">
                    {{ userInitials }}
                  </div>
                </div>
              </div>
              <div class="text-center mb-8">
                <h3 class="text-2xl font-black text-surface-900 dark:text-white tracking-tight">{{ authStore.user?.pegawai?.namaLengkap || authStore.user?.username }}</h3>
                <p class="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-widest">
                  {{ authStore.user?.role === 'admin' ? 'System Administrator' : 'Staff Pegawai' }}
                </p>
              </div>
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-surface-50 dark:bg-surface-700/30 border border-surface-100 dark:border-surface-700/50 group hover:border-primary-500/30 transition-colors">
                  <div class="w-10 h-10 rounded-xl bg-white dark:bg-surface-800 flex items-center justify-center text-surface-400 group-hover:text-primary-500 shadow-sm transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-black text-surface-400 tracking-widest">Username</p>
                    <p class="text-base font-bold text-surface-700 dark:text-surface-200">{{ authStore.user?.username }}</p>
                  </div>
                </div>
                <div v-if="authStore.user?.pegawai?.nip" class="flex items-center gap-4 p-4 rounded-2xl bg-surface-50 dark:bg-surface-700/30 border border-surface-100 dark:border-surface-700/50 group hover:border-primary-500/30 transition-colors">
                  <div class="w-10 h-10 rounded-xl bg-white dark:bg-surface-800 flex items-center justify-center text-surface-400 group-hover:text-primary-500 shadow-sm transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                  </div>
                  <div>
                    <p class="text-[10px] uppercase font-black text-surface-400 tracking-widest">Nomor Induk Pegawai</p>
                    <p class="text-base font-bold text-surface-700 dark:text-surface-200">{{ authStore.user?.pegawai?.nip }}</p>
                  </div>
                </div>
              </div>
              <button @click="showAdminModal = false" class="w-full mt-8 btn btn-primary h-12 rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98]">Tutup</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDarkMode } from '@/composables/useDarkMode';
import { useAuthStore } from '@/stores/auth.store';
import { notifikasiApi } from '@/api/notifikasi.api';

defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { isDark, toggleDarkMode } = useDarkMode();
const showUserMenu = ref(false);
const showNotifMenu = ref(false);
const showAdminModal = ref(false);

const userInitials = computed(() => {
  const name = authStore.user?.pegawai?.namaLengkap || authStore.user?.username || 'U';
  return name.substring(0, 2).toUpperCase();
});

const openAdminProfile = () => {
  showUserMenu.value = false;
  showAdminModal.value = true;
};

const notifications = ref<any[]>([]);
const unreadCount = ref(0);
let pollInterval: any;

const fetchNotifications = async () => {
  try {
    const res = await notifikasiApi.getAll();
    notifications.value = res.data.data;
    unreadCount.value = notifications.value.filter(n => !n.isRead).length;
  } catch (error) {
    console.error('Failed to fetch notifications', error);
  }
};

const markAsRead = async (id: number) => {
  try {
    await notifikasiApi.markAsRead(id);
    const notif = notifications.value.find(n => n.idNotifikasi === id);
    if (notif && !notif.isRead) {
      notif.isRead = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  } catch (error) {
    console.error('Failed to mark notification as read', error);
  }
};

const markAllAsRead = async () => {
  try {
    await notifikasiApi.markAllAsRead();
    notifications.value.forEach(n => n.isRead = true);
    unreadCount.value = 0;
  } catch (error) {
    console.error('Failed to mark all notifications as read', error);
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
};

onMounted(() => {
  fetchNotifications();
  // Poll every 30 seconds
  pollInterval = setInterval(fetchNotifications, 30000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const pageTitle = computed(() => {
  const name = route.name as string;
  const titles: Record<string, string> = {
    AdminDashboard: 'Dashboard',
    PegawaiList: 'Pegawai',
    PegawaiDetail: 'Detail Pegawai',
    JabatanList: 'Jabatan',
    DepartemenList: 'Departemen',
    AbsensiRekap: 'Rekap Absensi',
    AbsensiValidasi: 'Validasi Absensi',
    CutiApproval: 'Persetujuan Cuti',
    PenggajianList: 'Penggajian',
    PenggajianGenerate: 'Generate Gaji',
    PenggajianDetail: 'Detail Gaji',
    LemburList: 'Lembur',
    Laporan: 'Laporan',
    Setting: 'Pengaturan',
    PegawaiDashboard: 'Dashboard',
    PegawaiAbsensi: 'Absensi',
    PegawaiCuti: 'Cuti',
    PegawaiSlipGaji: 'Slip Gaji',
    PegawaiProfile: 'Profil',
    AdminPengumuman: 'Pengumuman',
    AdminKasbon: 'Kasbon',
    AdminReimbursement: 'Reimbursement',
    PegawaiLembur: 'Lembur',
    PegawaiKasbon: 'Kasbon',
    PegawaiReimbursement: 'Reimbursement',
  };
  return titles[name] || 'Sistem Kepegawaian';
});
</script>
