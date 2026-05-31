<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useKasbonStore } from '@/stores/kasbon.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppModal from '@/components/common/AppModal.vue';
import type { Column } from '@/components/common/AppDataTable.vue';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const kasbonStore = useKasbonStore();
const { addToast } = useNotification();

const showModal = ref(false);
const isSubmitting = ref(false);
const selectedItem = ref<any>(null);
const actionType = ref<'approve' | 'reject'>('approve');
const catatanAdmin = ref('');

const columns: Column[] = [
  { key: 'pegawai', label: 'Pegawai' },
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'jumlah', label: 'Jumlah' },
  { key: 'status', label: 'Status' },
  { key: 'alasan', label: 'Alasan' },
];

onMounted(async () => {
  await kasbonStore.fetchAll();
});

const openModal = (item: any, action: 'approve' | 'reject') => {
  selectedItem.value = item;
  actionType.value = action;
  catatanAdmin.value = '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedItem.value = null;
};

const submitApproval = async () => {
  if (!selectedItem.value) return;
  isSubmitting.value = true;
  
  try {
    let success;
    if (actionType.value === 'approve') {
      success = await kasbonStore.approve(selectedItem.value.idKasbon, catatanAdmin.value);
    } else {
      success = await kasbonStore.reject(selectedItem.value.idKasbon, catatanAdmin.value);
    }
    
    if (success) {
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: `Kasbon berhasil ${actionType.value === 'approve' ? 'disetujui' : 'ditolak'}`
      });
      closeModal();
    } else {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: kasbonStore.error || 'Terjadi kesalahan'
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Persetujuan Kasbon</h1>
        <p class="text-surface-500 dark:text-surface-400 text-sm mt-1">Kelola pengajuan pinjaman/kasbon pegawai perusahaan.</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="kasbonStore.fetchAll()" class="btn btn-secondary btn-icon" :disabled="kasbonStore.loading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'animate-spin': kasbonStore.loading}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <div class="card p-6">
      <AppDataTable
        :columns="columns"
        :data="kasbonStore.list"
        :loading="kasbonStore.loading"
        empty-text="Belum ada pengajuan kasbon"
      >
        <template #cell-pegawai="{ row }">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {{ row.pegawai?.namaLengkap?.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <p class="font-medium text-surface-900 dark:text-white">{{ row.pegawai?.namaLengkap }}</p>
              <p class="text-[10px] text-surface-400 font-mono">{{ row.pegawai?.nip }}</p>
            </div>
          </div>
        </template>

        <template #cell-tanggal="{ row }">
          <span class="text-sm">{{ format(new Date(row.tanggal), 'dd MMM yyyy', { locale: id }) }}</span>
        </template>

        <template #cell-jumlah="{ row }">
          <span class="font-bold text-danger-600 dark:text-danger-400">{{ formatCurrency(row.jumlah) }}</span>
        </template>

        <template #cell-status="{ row }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
            :class="{
              'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400': row.status === 'pending',
              'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400': row.status === 'disetujui',
              'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-400': row.status === 'ditolak',
              'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400': row.status === 'lunas',
            }"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell-alasan="{ row }">
          <span class="text-xs text-surface-500 max-w-xs truncate block" :title="row.alasan">{{ row.alasan }}</span>
        </template>

        <template #actions="{ row }">
          <div v-if="row.status === 'pending'" class="flex justify-end gap-2">
            <button @click="openModal(row, 'approve')" class="btn btn-sm btn-primary">Setujui</button>
            <button @click="openModal(row, 'reject')" class="btn btn-sm btn-ghost text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/10">Tolak</button>
          </div>
          <div v-else class="text-right">
            <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider">Oleh Admin</p>
            <p class="text-xs font-medium text-surface-700 dark:text-surface-300">{{ row.admin?.username || '-' }}</p>
          </div>
        </template>
      </AppDataTable>
    </div>

    <!-- Modal Approval -->
    <AppModal 
      v-model="showModal" 
      :title="actionType === 'approve' ? 'Setujui Pengajuan Kasbon' : 'Tolak Pengajuan Kasbon'"
      size="md"
      @close="closeModal"
    >
      <div class="space-y-6 py-2">
        <div class="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Pegawai</p>
              <p class="text-sm font-bold text-surface-900 dark:text-white">{{ selectedItem?.pegawai?.namaLengkap }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Jumlah</p>
              <p class="text-sm font-bold text-danger-600 dark:text-danger-400">{{ formatCurrency(selectedItem?.jumlah || 0) }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Alasan Pengajuan</p>
              <p class="text-sm text-surface-600 dark:text-surface-300 leading-relaxed italic">"{{ selectedItem?.alasan }}"</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitApproval" class="space-y-4">
          <div class="form-group">
            <label class="form-label">Catatan Admin <span v-if="actionType === 'reject'" class="text-danger-500">*</span></label>
            <textarea 
              v-model="catatanAdmin" 
              class="form-input min-h-[100px] resize-none" 
              :required="actionType === 'reject'" 
              placeholder="Tambahkan catatan atau alasan keputusan..."
            ></textarea>
            <div v-if="actionType === 'approve'" class="flex items-start gap-2 mt-2 p-3 rounded-xl bg-info-50 dark:bg-info-500/10 text-info-700 dark:text-info-400 text-xs">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p>Persetujuan ini akan menyebabkan kasbon otomatis dipotong pada slip gaji periode berikutnya.</p>
            </div>
          </div>
        </form>
      </div>

      <template #footer>
        <button @click="closeModal" class="btn btn-ghost" :disabled="isSubmitting">Batal</button>
        <button 
          @click="submitApproval" 
          class="btn min-w-[120px]" 
          :class="actionType === 'approve' ? 'btn-primary' : 'btn-danger'" 
          :disabled="isSubmitting"
        >
          <svg v-if="isSubmitting" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ actionType === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>
