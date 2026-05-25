<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useReimbursementStore } from '@/stores/reimbursement.store';
import { API_URL } from '@/utils/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const reimburseStore = useReimbursementStore();
const showModal = ref(false);
const isSubmitting = ref(false);
const selectedItem = ref<any>(null);
const actionType = ref<'approve' | 'reject'>('approve');
const catatanAdmin = ref('');

const getFileUrl = (path: string) => {
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
  
  let success;
  if (actionType.value === 'approve') {
    success = await reimburseStore.approve(selectedItem.value.idReimburse, catatanAdmin.value);
  } else {
    success = await reimburseStore.reject(selectedItem.value.idReimburse, catatanAdmin.value);
  }
  
  if (success) {
    closeModal();
  } else {
    alert(`Gagal ${actionType.value === 'approve' ? 'menyetujui' : 'menolak'} reimbursement`);
  }
  isSubmitting.value = false;
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'disetujui': return 'bg-success-100 text-success-800';
    case 'ditolak': return 'bg-danger-100 text-danger-800';
    case 'dibayar': return 'bg-primary-100 text-primary-800';
    default: return 'bg-warning-100 text-warning-800';
  }
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Persetujuan Reimbursement</h1>
      <p class="text-surface-500 dark:text-surface-400">Kelola klaim penggantian dana pegawai</p>
    </div>

    <div class="card p-0 overflow-hidden">
      <div v-if="reimburseStore.loading && reimburseStore.list.length === 0" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      </div>
      
      <div v-else-if="reimburseStore.list.length === 0" class="p-8 text-center text-surface-500">
        Belum ada pengajuan reimbursement.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
            <tr>
              <th class="px-4 py-3 font-medium">Pegawai</th>
              <th class="px-4 py-3 font-medium">Tanggal & Jenis</th>
              <th class="px-4 py-3 font-medium">Jumlah</th>
              <th class="px-4 py-3 font-medium">Bukti</th>
              <th class="px-4 py-3 font-medium">Status</th>
              <th class="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-for="item in reimburseStore.list" :key="item.idReimburse" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-3">
                <div class="font-medium text-surface-900 dark:text-white">{{ item.pegawai.namaLengkap }}</div>
                <div class="text-xs text-surface-500">{{ item.pegawai.departemen?.namaDepartemen }}</div>
              </td>
              <td class="px-4 py-3">
                <div>{{ format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id }) }}</div>
                <div class="text-xs text-surface-500 capitalize">{{ item.jenis }}</div>
              </td>
              <td class="px-4 py-3 font-medium text-success-600">{{ formatCurrency(item.jumlah) }}</td>
              <td class="px-4 py-3">
                <a v-if="item.buktiFile" :href="getFileUrl(item.buktiFile)" target="_blank" class="text-primary-600 hover:underline flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Lihat File
                </a>
                <span v-else class="text-surface-400 text-xs">-</span>
              </td>
              <td class="px-4 py-3">
                <span :class="['px-2.5 py-1 rounded-full text-xs font-medium capitalize', getStatusBadge(item.status)]">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div v-if="item.status === 'pending'" class="flex justify-end gap-2">
                  <button @click="openModal(item, 'approve')" class="btn btn-sm btn-primary">Setujui</button>
                  <button @click="openModal(item, 'reject')" class="btn btn-sm btn-danger">Tolak</button>
                </div>
                <div v-else class="text-xs text-surface-500">
                  Oleh: {{ item.admin?.username }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Approval -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-surface-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-surface-200 dark:border-surface-800">
        <div class="px-6 py-4 border-b border-surface-200 dark:border-surface-800 flex justify-between items-center" :class="actionType === 'approve' ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-danger-50 dark:bg-danger-900/20'">
          <h3 class="text-lg font-bold" :class="actionType === 'approve' ? 'text-primary-700' : 'text-danger-700'">
            {{ actionType === 'approve' ? 'Setujui Reimbursement' : 'Tolak Reimbursement' }}
          </h3>
          <button @click="closeModal" class="text-surface-400 hover:text-surface-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="bg-surface-50 dark:bg-surface-800 p-3 rounded-lg text-sm">
            <p><strong>Pegawai:</strong> {{ selectedItem?.pegawai?.namaLengkap }}</p>
            <p><strong>Jenis:</strong> <span class="capitalize">{{ selectedItem?.jenis }}</span></p>
            <p><strong>Jumlah:</strong> {{ formatCurrency(selectedItem?.jumlah || 0) }}</p>
            <p><strong>Deskripsi:</strong> {{ selectedItem?.deskripsi }}</p>
          </div>

          <form @submit.prevent="submitApproval">
            <div class="mb-4">
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Catatan Admin <span v-if="actionType === 'reject'" class="text-danger-500">*</span></label>
              <textarea v-model="catatanAdmin" class="input" rows="3" :required="actionType === 'reject'" placeholder="Tambahkan catatan (opsional jika disetujui)"></textarea>
              <p v-if="actionType === 'approve'" class="text-xs text-surface-500 mt-1">Catatan: Dana akan otomatis ditambahkan ke slip gaji periode ini.</p>
            </div>
            
            <div class="flex justify-end gap-3">
              <button type="button" @click="closeModal" class="btn btn-outline">Batal</button>
              <button type="submit" class="btn" :class="actionType === 'approve' ? 'btn-primary' : 'btn-danger'" :disabled="isSubmitting">
                {{ isSubmitting ? 'Memproses...' : (actionType === 'approve' ? 'Setujui' : 'Tolak') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
