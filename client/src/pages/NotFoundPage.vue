<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center text-center">
    <div class="animate-fade-in-up">
      <div class="text-8xl font-bold text-gradient mb-4">404</div>
      <h2 class="text-2xl font-semibold text-surface-900 dark:text-white mb-2">Halaman Tidak Ditemukan</h2>
      <p class="text-surface-500 dark:text-surface-400 mb-8 max-w-md">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <router-link to="/" class="btn-primary">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Kembali ke Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Not Found page
</script>
