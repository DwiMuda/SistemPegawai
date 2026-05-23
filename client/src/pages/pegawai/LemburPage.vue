<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLemburStore } from '@/stores/lembur.store';
import { useNotification } from '@/composables/useNotification';

const store = useLemburStore();
const { addToast } = useNotification();

const showModal = ref(false);
const formData = ref({
  tanggal: '',
  jamMulai: '',
  jamSelesai: '',
  keterangan: ''
});

const currentDate = new Date();
const filterBulan = ref(currentDate.getMonth() + 1);
const filterTahun = ref(currentDate.getFullYear());

const fetchData = async () => {
  await store.fetchSaya({
    bulan: filterBulan.value,
    tahun: filterTahun.value
  });
};

onMounted(() => {
  fetchData();
});

const handleSubmit = async () => {
  try {
    await store.ajukan({
      tanggal: formData.value.tanggal,
      jamMulai: formData.value.jamMulai,
      jamSelesai: formData.value.jamSelesai,
      keterangan: formData.value.keterangan
    });
    addToast({ type: 'success', title: 'Berhasil', message: 'Pengajuan lembur berhasil dikirim' });
    showModal.value = false;
    formData.value = { tanggal: '', jamMulai: '', jamSelesai: '', keterangan: '' };
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal mengajukan lembur' });
  }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const formatStatus = (status: string) => {
  const map: Record<string, { text: string, class: string }> = {
    pending: { text: 'Menunggu', class: 'bg-warning-100 text-warning-800' },
    disetujui: { text: 'Disetujui', class: 'bg-success-100 text-success-800' },
    ditolak: { text: 'Ditolak', class: 'bg-danger-100 text-danger-800' }
  };
  return map[status] || { text: status, class: 'bg-surface-100 text-surface-800' };
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Pengajuan Lembur</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Kelola riwayat dan pengajuan jam lembur Anda</p>
      </div>
      
      <button @click="showModal = true" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Ajukan Lembur
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4 border border-surface-200 dark:border-surface-700 flex gap-4">
      <div>
        <label class="block text-sm text-surface-500 mb-1">Bulan</label>
        <select v-model="filterBulan" @change="fetchData" class="input py-2">
          <option v-for="m in 12" :key="m" :value="m">{{ new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' }) }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-surface-500 mb-1">Tahun</label>
        <select v-model="filterTahun" @change="fetchData" class="input py-2">
          <option v-for="y in 5" :key="y" :value="currentDate.getFullYear() - y + 3">{{ currentDate.getFullYear() - y + 3 }}</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th class="px-4 py-3 font-medium">Tanggal</th>
              <th class="px-4 py-3 font-medium">Jam</th>
              <th class="px-4 py-3 font-medium">Total Jam</th>
              <th class="px-4 py-3 font-medium">Estimasi Upah</th>
              <th class="px-4 py-3 font-medium">Keterangan</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-if="store.isLoading && store.list.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-surface-500">Memuat data lembur...</td>
            </tr>
            <tr v-else-if="store.list.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-surface-500">Belum ada data lembur di bulan ini</td>
            </tr>
            <tr v-for="item in store.list" :key="item.idLembur" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-3 text-surface-900 dark:text-white font-medium">
                {{ new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }) }}
              </td>
              <td class="px-4 py-3 text-surface-700 dark:text-surface-300">
                {{ item.jamMulai }} - {{ item.jamSelesai }}
              </td>
              <td class="px-4 py-3 text-surface-700 dark:text-surface-300">
                {{ item.totalJam }} jam
              </td>
              <td class="px-4 py-3 font-medium text-primary-600 dark:text-primary-400">
                {{ formatCurrency(item.totalUpah) }}
                <div class="text-xs text-surface-400 font-normal">({{ formatCurrency(item.tarifPerJam) }}/jam)</div>
              </td>
              <td class="px-4 py-3 text-surface-700 dark:text-surface-300 max-w-xs truncate">
                {{ item.keterangan }}
              </td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="formatStatus(item.status).class">
                  {{ formatStatus(item.status).text }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-surface-900 rounded-2xl w-full max-w-md shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
          <h2 class="text-lg font-bold text-surface-900 dark:text-white">Form Pengajuan Lembur</h2>
          <button @click="showModal = false" class="text-surface-400 hover:text-surface-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tanggal Lembur <span class="text-danger-500">*</span></label>
            <input v-model="formData.tanggal" type="date" required class="input w-full" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jam Mulai <span class="text-danger-500">*</span></label>
              <input v-model="formData.jamMulai" type="time" required class="input w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jam Selesai <span class="text-danger-500">*</span></label>
              <input v-model="formData.jamSelesai" type="time" required class="input w-full" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Keterangan/Pekerjaan <span class="text-danger-500">*</span></label>
            <textarea v-model="formData.keterangan" rows="3" required class="input w-full" placeholder="Deskripsikan pekerjaan lembur Anda..."></textarea>
          </div>
          
          <div class="pt-4 flex justify-end gap-2">
            <button type="button" @click="showModal = false" class="btn btn-outline">Batal</button>
            <button type="submit" class="btn btn-primary" :disabled="store.isLoading">
              <span v-if="store.isLoading">Menyimpan...</span>
              <span v-else>Ajukan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
