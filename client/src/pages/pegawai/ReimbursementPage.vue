<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useReimbursementStore } from '@/stores/reimbursement.store';
import { useNotification } from '@/composables/useNotification';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const reimburseStore = useReimbursementStore();
const { addToast } = useNotification();
const isLoading = ref(true);
const isSubmitting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const formData = ref({
  jenis: 'kesehatan',
  jumlah: '',
  deskripsi: '',
  tanggal: new Date().toISOString().split('T')[0]
});

onMounted(async () => {
  await reimburseStore.fetchMyReimbursement();
  isLoading.value = false;
});

const submitReimburse = async () => {
  isSubmitting.value = true;
  
  const payload = new FormData();
  payload.append('jenis', formData.value.jenis);
  payload.append('jumlah', formData.value.jumlah.toString().replace(/[^0-9]/g, ''));
  payload.append('deskripsi', formData.value.deskripsi);
  payload.append('tanggal', formData.value.tanggal);
  
  if (fileInput.value && fileInput.value.files && fileInput.value.files[0]) {
    payload.append('buktiFile', fileInput.value.files[0]);
  }

  const success = await reimburseStore.create(payload);
  if (success) {
    formData.value.jumlah = '';
    formData.value.deskripsi = '';
    if (fileInput.value) fileInput.value.value = '';
    addToast({
      type: 'success',
      title: 'Berhasil',
      message: 'Pengajuan klaim reimbursement berhasil dikirim'
    });
  } else {
    addToast({
      type: 'error',
      title: 'Gagal',
      message: reimburseStore.error || 'Gagal mengirim pengajuan'
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
    case 'dibayar': return 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400';
    default: return 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400';
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Klaim Reimbursement</h1>
        <p class="text-surface-500 dark:text-surface-400 text-sm mt-1">Ajukan penggantian dana operasional atau kesehatan.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-500 text-xs font-medium border border-surface-200 dark:border-surface-700">
          Total Klaim Bulan Ini: <span class="text-success-600 dark:text-success-400 font-bold ml-1">Rp 0</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Section -->
      <div class="lg:col-span-1">
        <div class="card p-6 sticky top-24">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-500">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h2 class="text-lg font-bold text-surface-900 dark:text-white">Form Klaim</h2>
          </div>

          <form @submit.prevent="submitReimburse" class="space-y-5">
            <div class="form-group">
              <label class="form-label text-xs">Tanggal Transaksi</label>
              <input type="date" v-model="formData.tanggal" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label text-xs">Jenis Klaim</label>
              <select v-model="formData.jenis" class="form-input" required>
                <option value="kesehatan">Kesehatan</option>
                <option value="transport">Transportasi / Dinas</option>
                <option value="operasional">Operasional Kantor</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label text-xs">Jumlah Klaim</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400 font-mono font-medium">Rp</span>
                <input 
                  type="number" 
                  v-model="formData.jumlah" 
                  class="form-input pl-10" 
                  placeholder="0" 
                  required 
                  min="1000" 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label text-xs">Deskripsi</label>
              <textarea 
                v-model="formData.deskripsi" 
                class="form-input min-h-[80px] resize-none" 
                placeholder="Penjelasan singkat penggunaan dana..." 
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label text-xs">Bukti Lampiran</label>
              <div class="relative group">
                <input 
                  type="file" 
                  ref="fileInput" 
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*,.pdf"
                />
                <div class="form-input flex items-center justify-between group-hover:border-primary-500 transition-colors">
                  <span class="text-surface-400 truncate">Pilih file struk/nota...</span>
                  <svg class="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
              </div>
              <p class="text-[10px] text-surface-400 mt-1">Format: JPG, PNG, PDF (Maks. 2MB)</p>
            </div>

            <button type="submit" class="btn btn-primary w-full h-11" :disabled="isSubmitting">
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan' }}
            </button>
          </form>
        </div>
      </div>

      <!-- History Section -->
      <div class="lg:col-span-2">
        <div class="card overflow-hidden">
          <div class="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <h2 class="text-lg font-bold text-surface-900 dark:text-white">Riwayat Klaim</h2>
          </div>
          
          <div v-if="isLoading" class="p-12 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
          
          <div v-else-if="reimburseStore.myList.length === 0" class="p-16 text-center">
            <div class="w-16 h-16 rounded-full bg-surface-50 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4 text-surface-300">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p class="text-surface-500">Belum ada riwayat klaim reimbursement.</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-surface-50/50 dark:bg-surface-800/50 text-surface-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th class="px-6 py-4">Tanggal & Jenis</th>
                  <th class="px-6 py-4 text-right">Jumlah</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">Keterangan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
                <tr v-for="item in reimburseStore.myList" :key="item.idReimburse" class="hover:bg-surface-50/80 dark:hover:bg-surface-800/30 transition-colors group">
                  <td class="px-6 py-4">
                    <p class="font-medium text-surface-900 dark:text-white">{{ format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id }) }}</p>
                    <p class="text-[10px] uppercase font-bold text-primary-500 mt-0.5 tracking-wider">{{ item.jenis }}</p>
                  </td>
                  <td class="px-6 py-4 text-right font-bold text-success-600 dark:text-success-400">
                    {{ formatCurrency(item.jumlah) }}
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight', getStatusBadge(item.status)]">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="max-w-[200px]">
                      <p class="text-surface-600 dark:text-surface-300 truncate" :title="item.deskripsi">{{ item.deskripsi }}</p>
                      
                      <div v-if="item.catatanAdmin" class="mt-1 flex items-center gap-1.5 text-xs text-warning-600 dark:text-warning-400 italic">
                        <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <span class="truncate" :title="item.catatanAdmin">{{ item.catatanAdmin }}</span>
                      </div>
                      
                      <div v-if="item.bulanBayar && item.status === 'dibayar'" class="mt-1 flex items-center gap-1.5 text-[10px] text-primary-600 font-bold uppercase">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Dibayarkan pd Gaji Bln {{ item.bulanBayar }}
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
