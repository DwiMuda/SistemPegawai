<template>
  <aside
    class="fixed top-0 left-0 h-full flex flex-col z-[300] transition-all duration-300 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700"
    :class="[
      collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]',
      mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center px-4 border-b border-surface-200 dark:border-surface-700">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-x-2"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <span v-if="!collapsed" class="font-bold text-sm text-surface-900 dark:text-white whitespace-nowrap">
            SIMPEG
          </span>
        </transition>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="p-3 space-y-1 flex-1 overflow-y-auto scrollbar-hide">
      <template v-for="item in menuItems" :key="item.label">
        <!-- Single item -->
        <router-link
          v-if="!item.children"
          :to="item.to!"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
          :class="[
            isActive(item.to!) 
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400' 
              : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
          ]"
          :title="collapsed ? item.label : ''"
        >
          <SidebarIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-all duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
          </transition>
        </router-link>

        <!-- Group with children -->
        <div v-else>
          <button
            @click="toggleGroup(item.label)"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            :title="collapsed ? item.label : ''"
          >
            <SidebarIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
            <template v-if="!collapsed">
              <span class="flex-1 text-left whitespace-nowrap">{{ item.label }}</span>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                :class="openGroups.includes(item.label) ? 'rotate-180' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </template>
          </button>

          <!-- Children -->
          <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-96"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 max-h-96"
            leave-to-class="opacity-0 max-h-0"
          >
            <div
              v-if="!collapsed && openGroups.includes(item.label)"
              class="ml-4 mt-1 space-y-1 overflow-hidden"
            >
              <router-link
                v-for="child in item.children"
                :key="child.label"
                :to="child.to"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                :class="[
                  isActive(child.to)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-500/5 font-medium'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                ]"
              >
                <div class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="isActive(child.to) ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'" />
                <span>{{ child.label }}</span>
              </router-link>
            </div>
          </transition>
        </div>
      </template>
    </nav>

    <!-- Collapse button -->
    <button
      @click="$emit('toggle')"
      class="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 shadow-sm items-center justify-center hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors hidden lg:flex"
    >
      <svg
        class="w-3.5 h-3.5 text-surface-500 transition-transform duration-200"
        :class="collapsed ? 'rotate-180' : ''"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import SidebarIcon from './SidebarIcon.vue';

interface MenuItem {
  label: string;
  icon: string;
  to?: string;
  children?: { label: string; to: string; icon?: string }[];
}

defineProps<{
  collapsed: boolean;
  mobileOpen?: boolean;
  menuItems: MenuItem[];
}>();

const emit = defineEmits(['toggle', 'close-mobile']);

const route = useRoute();
const openGroups = ref<string[]>(['Data Master', 'Absensi', 'Penggajian']);

import { watch } from 'vue';
watch(() => route.path, () => {
  emit('close-mobile');
});

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/');
}

function toggleGroup(label: string) {
  const index = openGroups.value.indexOf(label);
  if (index !== -1) {
    openGroups.value.splice(index, 1);
  } else {
    openGroups.value.push(label);
  }
}
</script>
