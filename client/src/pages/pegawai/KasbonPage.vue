<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useKasbonStore } from '@/stores/kasbon.store';
import { useNotification } from '@/composables/useNotification';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const kasbonStore = useKasbonStore();
const { addToast } = useNotification();
const isLoading = ref(true);
const isSubmitting = ref(false);

const formData = ref({
  jumlah: '',
  alasan: '',
  tanggal: new Date().toISOString().split('T')[0]
});

onMounted(async () => {
  await kasbonStore.fetchMyKasbon();
  isLoading.value = false;
});

const submitKasbon = async () => {
  isSubmitting.value = true;
  const rawJumlah = formData.value.jumlah.toString().replace(/[^0-9]/g, '');
  const payload = {
    ...formData.value,
    jumlah: parseFloat(rawJumlah)
  };

  const success = await kasbonStore.create(payload);
  if (success) {
    formData.value.jumlah = '';
    formData.value.alasan = '';
    addToast({
      type: 'success',
      title: 'Berhasil',
      message: 'Pengajuan kasbon berhasil dikirim'
    });
  } else {
    addToast({
      type: 'error',
      title: 'Gagal',
      message: kasbonStore.error || 'Gagal mengajukan kasbon'
    });
  }
  isSubmitting.value = false;
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'disetujui': return 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400';
    case 'ditolak': return 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-400';
    case 'lunas': return 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400';
    default: return 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400';
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Pinjaman / Kasbon</h1>
        <p class="text-surface-500 dark:text-surface-400 text-sm mt-1">Kelola dan ajukan fasilitas kasbon karyawan.</p>
      </div>
      <div class="flex items-center gap-4 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
        <div class="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-wider">Maksimum Kasbon</p>
          <p class="text-lg font-bold text-surface-900 dark:text-white">Rp 2.000.000</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Section -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-24">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-500">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <h2 class="text-lg font-bold text-surface-900 dark:text-white">Form Pengajuan</h2>
          </div>

          <form @submit.prevent="submitKasbon" class="space-y-5">
            <div class="form-group">
              <label class="form-label text-xs">Tanggal Pengajuan</label>
              <input type="date" v-model="formData.tanggal" class="form-input" required />
            </div>
            
            <div class="form-group">
              <label class="form-label text-xs">Jumlah Kasbon</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400 font-mono font-medium">Rp</span>
                <input 
                  type="number" 
                  v-model="formData.jumlah" 
                  class="form-input pl-10" 
                  placeholder="0" 
                  required 
                  min="10000" 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label text-xs">Alasan Pengajuan</label>
              <textarea 
                v-model="formData.alasan" 
                class="form-input min-h-[100px] resize-none" 
                placeholder="Jelaskan kebutuhan pengajuan kasbon Anda..." 
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary w-full h-11" :disabled="isSubmitting">
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ isSubmitting ? 'Mengirim...' : 'Ajukan Sekarang' }}
            </button>
            
            <p class="text-[10px] text-center text-surface-400 leading-relaxed px-4">
              Dengan mengajukan, Anda setuju bahwa nominal kasbon akan dipotong dari gaji bulan berjalan.
            </p>
          </form>
        </div>
      </div>

      <!-- History Section -->
      <div class="lg:col-span-2">
        <div class="card overflow-hidden">
          <div class="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <h2 class="text-lg font-bold text-surface-900 dark:text-white">Riwayat Pengajuan</h2>
            <div class="p-2 rounded-lg bg-surface-50 dark:bg-surface-800 text-surface-500 text-xs font-mono">
              {{ kasbonStore.myList.length }} Entries
            </div>
          </div>
          
          <div v-if="isLoading" class="p-12 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
          
          <div v-else-if="kasbonStore.myList.length === 0" class="p-16 text-center">
            <div class="w-16 h-16 rounded-full bg-surface-50 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4 text-surface-300">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <p class="text-surface-500">Belum ada riwayat pengajuan kasbon.</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-surface-50/50 dark:bg-surface-800/50 text-surface-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th class="px-6 py-4">Tanggal</th>
                  <th class="px-6 py-4 text-right">Jumlah</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">Keterangan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
                <tr v-for="item in kasbonStore.myList" :key="item.idKasbon" class="hover:bg-surface-50/80 dark:hover:bg-surface-800/30 transition-colors group">
                  <td class="px-6 py-4">
                    <p class="font-medium text-surface-900 dark:text-white">{{ format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id }) }}</p>
                    <p class="text-[10px] text-surface-400 mt-0.5">{{ format(new Date(item.tanggal), 'HH:mm') }} WIB</p>
                  </td>
                  <td class="px-6 py-4 text-right font-bold text-danger-600 dark:text-danger-400">
                    {{ formatCurrency(item.jumlah) }}
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight', getStatusBadge(item.status)]">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="max-w-[200px]">
                      <p class="text-surface-600 dark:text-surface-300 truncate" :title="item.alasan">{{ item.alasan }}</p>
                      <div v-if="item.catatanAdmin" class="mt-1 flex items-center gap-1.5 text-xs text-warning-600 dark:text-warning-400 italic">
                        <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <span class="truncate" :title="item.catatanAdmin">{{ item.catatanAdmin }}</span>
                      </div>
                      <div v-if="item.bulanPotong && item.status === 'lunas'" class="mt-1 flex items-center gap-1.5 text-[10px] text-success-600 font-bold uppercase">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        Dipotong Gaji Bln {{ item.bulanPotong }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
