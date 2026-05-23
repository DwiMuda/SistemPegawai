<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950">
    <!-- Sidebar -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :menu-items="pegawaiMenuItems"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />

    <!-- Main content -->
    <div
      class="transition-all duration-300"
      :class="sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'"
    >
      <AppNavbar @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppNavbar from '@/components/layout/AppNavbar.vue';

const sidebarCollapsed = ref(false);

const pegawaiMenuItems = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    to: '/pegawai/dashboard',
  },
  {
    label: 'Absensi',
    icon: 'clock',
    to: '/pegawai/absensi',
  },
  {
    label: 'Cuti',
    icon: 'calendar-days',
    to: '/pegawai/cuti',
  },
  {
    label: 'Lembur',
    icon: 'clock',
    to: '/pegawai/lembur',
  },
  {
    label: 'Slip Gaji',
    icon: 'banknotes',
    to: '/pegawai/slip-gaji',
  },
  {
    label: 'Profil',
    icon: 'user',
    to: '/pegawai/profile',
  },
];
</script>
