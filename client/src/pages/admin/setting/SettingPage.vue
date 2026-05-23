<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { settingApi } from '@/api/setting.api';
import { useNotification } from '@/composables/useNotification';

const { addToast } = useNotification();
const settings = ref<any[]>([]);
const isLoading = ref(true);

const editingKey = ref<string | null>(null);
const editValue = ref('');
const isSaving = ref(false);

const fetchData = async () => {
  isLoading.value = true;
  try {
    const res = await settingApi.getAll();
    settings.value = res.data.data;
  } catch (error) {
    addToast({ type: 'error', title: 'Gagal', message: 'Gagal mengambil data pengaturan' });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const startEdit = (item: any) => {
  editingKey.value = item.key;
  editValue.value = item.value;
};

const cancelEdit = () => {
  editingKey.value = null;
  editValue.value = '';
};

const saveEdit = async (key: string) => {
  if (!editValue.value.trim()) {
    addToast({ type: 'warning', title: 'Perhatian', message: 'Nilai pengaturan tidak boleh kosong' });
    return;
  }
  
  isSaving.value = true;
  try {
    await settingApi.update(key, editValue.value);
    addToast({ type: 'success', title: 'Berhasil', message: 'Pengaturan berhasil disimpan' });
    
    // Update local data
    const index = settings.value.findIndex(s => s.key === key);
    if (index !== -1) {
      settings.value[index].value = editValue.value;
    }
    
    editingKey.value = null;
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal menyimpan pengaturan' });
  } finally {
    isSaving.value = false;
  }
};

const formatKeyName = (key: string) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Pengaturan Sistem</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Konfigurasi parameter dan variabel global sistem</p>
      </div>
    </div>

    <!-- Table -->
    <div class="card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th class="px-4 py-3 font-medium w-1/4">Parameter</th>
              <th class="px-4 py-3 font-medium w-1/3">Deskripsi</th>
              <th class="px-4 py-3 font-medium w-1/4">Nilai</th>
              <th class="px-4 py-3 font-medium w-1/6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-if="isLoading && settings.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-surface-500">Memuat pengaturan...</td>
            </tr>
            <tr v-else-if="settings.length === 0">
              <td colspan="4" class="px-4 py-8 text-center text-surface-500">Belum ada pengaturan yang dikonfigurasi. (Silakan jalankan Prisma Seeder)</td>
            </tr>
            <tr v-for="item in settings" :key="item.key" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-4 align-top">
                <div class="font-medium text-surface-900 dark:text-white">{{ formatKeyName(item.key) }}</div>
                <div class="text-xs text-surface-400 font-mono mt-1">{{ item.key }}</div>
              </td>
              <td class="px-4 py-4 align-top text-surface-600 dark:text-surface-400">
                {{ item.deskripsi || '-' }}
              </td>
              <td class="px-4 py-4 align-top">
                <div v-if="editingKey === item.key">
                  <input v-model="editValue" type="text" class="input py-1.5 px-2 w-full text-sm" @keyup.enter="saveEdit(item.key)" @keyup.esc="cancelEdit" autofocus />
                </div>
                <div v-else class="font-medium text-primary-600 dark:text-primary-400 break-all">
                  {{ item.value }}
                </div>
              </td>
              <td class="px-4 py-4 align-top text-center">
                <div v-if="editingKey === item.key" class="flex justify-center gap-2">
                  <button @click="saveEdit(item.key)" class="p-1.5 text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20 rounded transition-colors" title="Simpan" :disabled="isSaving">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button @click="cancelEdit" class="p-1.5 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded transition-colors" title="Batal" :disabled="isSaving">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div v-else class="flex justify-center">
                  <button @click="startEdit(item)" class="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
