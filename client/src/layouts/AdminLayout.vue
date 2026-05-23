<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950">
    <!-- Sidebar -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :menu-items="adminMenuItems"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />

    <!-- Main content area -->
    <div
      class="transition-all duration-300"
      :class="sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'"
    >
      <!-- Navbar -->
      <AppNavbar @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

      <!-- Page content -->
      <main class="p-4 lg:p-6 mt-16">
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileSidebarOpen"
        class="fixed inset-0 bg-black/50 z-[250] lg:hidden"
        @click="mobileSidebarOpen = false"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppNavbar from '@/components/layout/AppNavbar.vue';

const sidebarCollapsed = ref(false);
const mobileSidebarOpen = ref(false);

const adminMenuItems = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    to: '/admin/dashboard',
  },
  {
    label: 'Data Master',
    icon: 'folder',
    children: [
      { label: 'Pegawai', to: '/admin/pegawai', icon: 'users' },
      { label: 'Jabatan', to: '/admin/jabatan', icon: 'briefcase' },
      { label: 'Departemen', to: '/admin/departemen', icon: 'building' },
    ],
  },
  {
    label: 'Absensi',
    icon: 'clock',
    children: [
      { label: 'Rekap Absensi', to: '/admin/absensi/rekap', icon: 'calendar' },
      { label: 'Validasi', to: '/admin/absensi/validasi', icon: 'check-circle' },
    ],
  },
  {
    label: 'Cuti',
    icon: 'calendar-days',
    to: '/admin/cuti',
  },
  {
    label: 'Penggajian',
    icon: 'banknotes',
    children: [
      { label: 'Daftar Gaji', to: '/admin/penggajian', icon: 'list' },
      { label: 'Generate Gaji', to: '/admin/penggajian/generate', icon: 'calculator' },
    ],
  },
  {
    label: 'Lembur',
    icon: 'clock-overtime',
    to: '/admin/lembur',
  },
  {
    label: 'Mutasi',
    icon: 'arrows-right-left',
    to: '/admin/mutasi',
  },
  {
    label: 'Laporan',
    icon: 'chart-bar',
    to: '/admin/laporan',
  },
  {
    label: 'Pengaturan',
    icon: 'cog',
    to: '/admin/setting',
  },
];
</script>
