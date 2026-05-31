<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useReimbursementStore } from '@/stores/reimbursement.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppModal from '@/components/common/AppModal.vue';
import type { Column } from '@/components/common/AppDataTable.vue';
import { API_URL } from '@/utils/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const reimburseStore = useReimbursementStore();
const { addToast } = useNotification();

const showModal = ref(false);
const isSubmitting = ref(false);
const selectedItem = ref<any>(null);
const actionType = ref<'approve' | 'reject'>('approve');
const catatanAdmin = ref('');

const columns: Column[] = [
  { key: 'pegawai', label: 'Pegawai' },
  { key: 'tanggal', label: 'Tanggal & Jenis' },
  { key: 'jumlah', label: 'Jumlah' },
  { key: 'buktiFile', label: 'Bukti' },
  { key: 'status', label: 'Status' },
];

const getFileUrl = (path: string) => {
  if (!path) return '';
  const baseUrl = API_URL.replace('/api/v1', '');
  return `${baseUrl}${path}`;
};

onMounted(async () => {
  await reimburseStore.fetchAll();
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
      success = await reimburseStore.approve(selectedItem.value.idReimburse, catatanAdmin.value);
    } else {
      success = await reimburseStore.reject(selectedItem.value.idReimburse, catatanAdmin.value);
    }
    
    if (success) {
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: `Reimbursement berhasil ${actionType.value === 'approve' ? 'disetujui' : 'ditolak'}`
      });
      closeModal();
    } else {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: reimburseStore.error || 'Terjadi kesalahan'
      });
    }
  } finally {
    isSubmitting.value = false;
  }
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
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Persetujuan Reimbursement</h1>
        <p class="text-surface-500 dark:text-surface-400 text-sm mt-1">Kelola klaim penggantian dana operasional pegawai.</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="reimburseStore.fetchAll()" class="btn btn-secondary btn-icon" :disabled="reimburseStore.loading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'animate-spin': reimburseStore.loading}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <div class="card p-6">
      <AppDataTable
        :columns="columns"
        :data="reimburseStore.list"
        :loading="reimburseStore.loading"
        empty-text="Belum ada pengajuan reimbursement"
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
          <div>
            <p class="text-sm font-medium">{{ format(new Date(row.tanggal), 'dd MMM yyyy', { locale: id }) }}</p>
            <p class="text-[10px] uppercase font-bold text-primary-500">{{ row.jenis }}</p>
          </div>
        </template>

        <template #cell-jumlah="{ row }">
          <span class="font-bold text-success-600 dark:text-success-400">{{ formatCurrency(row.jumlah) }}</span>
        </template>

        <template #cell-buktiFile="{ row }">
          <a v-if="row.buktiFile" :href="getFileUrl(row.buktiFile)" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-xs font-medium">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            Lampiran
          </a>
          <span v-else class="text-xs text-surface-400 italic">Tanpa Bukti</span>
        </template>

        <template #cell-status="{ row }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
            :class="getStatusBadge(row.status)"
          >
            {{ row.status }}
          </span>
        </template>

        <template #actions="{ row }">
          <div v-if="row.status === 'pending'" class="flex justify-end gap-2">
            <button @click="openModal(row, 'approve')" class="btn btn-sm btn-primary">Setujui</button>
            <button @click="openModal(row, 'reject')" class="btn btn-sm btn-ghost text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/10">Tolak</button>
          </div>
          <div v-else class="text-right">
            <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider">Diproses Oleh</p>
            <p class="text-xs font-medium text-surface-700 dark:text-surface-300">{{ row.admin?.username || '-' }}</p>
          </div>
        </template>
      </AppDataTable>
    </div>

    <!-- Modal Approval -->
    <AppModal 
      v-model="showModal" 
      :title="actionType === 'approve' ? 'Setujui Reimbursement' : 'Tolak Reimbursement'"
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
              <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Total Klaim</p>
              <p class="text-sm font-bold text-success-600 dark:text-success-400">{{ formatCurrency(selectedItem?.jumlah || 0) }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Deskripsi Klaim ({{ selectedItem?.jenis }})</p>
              <p class="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">"{{ selectedItem?.deskripsi }}"</p>
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
              <p>Persetujuan ini akan memasukkan dana penggantian ke dalam komponen slip gaji periode berjalan.</p>
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
