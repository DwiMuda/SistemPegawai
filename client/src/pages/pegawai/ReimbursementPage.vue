<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useReimbursementStore } from '@/stores/reimbursement.store';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const reimburseStore = useReimbursementStore();
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
    alert('Pengajuan klaim berhasil dikirim');
  } else {
    alert('Gagal mengajukan klaim: ' + reimburseStore.error);
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
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Klaim Reimbursement</h1>
        <p class="text-surface-500 dark:text-surface-400">Ajukan penggantian dana karyawan</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1">
        <div class="card p-6">
          <h2 class="text-lg font-bold mb-4">Form Klaim</h2>
          <form @submit.prevent="submitReimburse" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tanggal</label>
              <input type="date" v-model="formData.tanggal" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jenis Klaim</label>
              <select v-model="formData.jenis" class="input" required>
                <option value="kesehatan">Kesehatan</option>
                <option value="transport">Transportasi / Perjalanan Dinas</option>
                <option value="operasional">Operasional Kantor</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jumlah (Rp)</label>
              <input type="number" v-model="formData.jumlah" class="input" placeholder="Contoh: 150000" required min="1000" />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Deskripsi</label>
              <textarea v-model="formData.deskripsi" class="input" rows="2" placeholder="Penjelasan singkat klaim" required></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Bukti File (Foto Struk/Nota)</label>
              <input type="file" ref="fileInput" class="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/20 dark:file:text-primary-400" accept="image/*,.pdf" />
              <p class="text-xs text-surface-500 mt-1">Format: JPG, PNG, PDF (Opsional)</p>
            </div>
            <button type="submit" class="btn btn-primary w-full" :disabled="isSubmitting">
              {{ isSubmitting ? 'Memproses...' : 'Ajukan Klaim' }}
            </button>
          </form>
        </div>
      </div>

      <div class="md:col-span-2">
        <div class="card p-0 overflow-hidden">
          <div class="p-4 border-b border-surface-200 dark:border-surface-700">
            <h2 class="text-lg font-bold text-surface-900 dark:text-white">Riwayat Klaim</h2>
          </div>
          
          <div v-if="isLoading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
          
          <div v-else-if="reimburseStore.myList.length === 0" class="p-8 text-center text-surface-500">
            Belum ada riwayat pengajuan reimbursement.
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                <tr>
                  <th class="px-4 py-3 font-medium">Tanggal</th>
                  <th class="px-4 py-3 font-medium">Jenis</th>
                  <th class="px-4 py-3 font-medium">Jumlah</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                  <th class="px-4 py-3 font-medium">Keterangan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
                <tr v-for="item in reimburseStore.myList" :key="item.idReimburse" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td class="px-4 py-3 whitespace-nowrap">{{ format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id }) }}</td>
                  <td class="px-4 py-3 capitalize">{{ item.jenis }}</td>
                  <td class="px-4 py-3 font-medium whitespace-nowrap">{{ formatCurrency(item.jumlah) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="['px-2.5 py-1 rounded-full text-xs font-medium capitalize', getStatusBadge(item.status)]">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs">
                    <div class="mb-1">{{ item.deskripsi }}</div>
                    <div v-if="item.catatanAdmin"><span class="font-bold text-warning-600">Admin:</span> {{ item.catatanAdmin }}</div>
                    <div v-if="item.bulanBayar && item.status === 'dibayar'" class="text-success-600 font-medium">Dibayar bersama gaji bln {{ item.bulanBayar }}</div>
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
