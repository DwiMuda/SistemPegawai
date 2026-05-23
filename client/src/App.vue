<template>
  <div id="app-root" :class="{ dark: isDark }">
    <router-view />
    <!-- Toast Container -->
    <AppToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDarkMode } from '@/composables/useDarkMode';
import AppToastContainer from '@/components/common/AppToastContainer.vue';

const { isDark } = useDarkMode();
</script>
