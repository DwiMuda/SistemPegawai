<template>
  <nav class="fixed bottom-0 left-0 right-0 z-[300] bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 lg:hidden">
    <div class="flex items-center justify-around py-2 px-4">
      <router-link
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs transition-colors"
        :class="[
          isActive(item.to)
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-surface-400 dark:text-surface-500'
        ]"
      >
        <SidebarIcon :name="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import SidebarIcon from './SidebarIcon.vue';

defineProps<{
  items: { label: string; icon: string; to: string }[];
}>();

const route = useRoute();

function isActive(path: string): boolean {
  return route.path.startsWith(path);
}
</script>
