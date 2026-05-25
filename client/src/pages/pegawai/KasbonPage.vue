<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useKasbonStore } from '@/stores/kasbon.store';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const kasbonStore = useKasbonStore();
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
  const payload = {
    ...formData.value,
    jumlah: parseFloat(formData.value.jumlah.toString().replace(/[^0-9]/g, ''))
  };
  const success = await kasbonStore.create(payload);
  if (success) {
    formData.value.jumlah = '';
    formData.value.alasan = '';
    alert('Pengajuan kasbon berhasil dikirim');
  } else {
    alert('Gagal mengajukan kasbon: ' + kasbonStore.error);
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
    case 'lunas': return 'bg-primary-100 text-primary-800';
    default: return 'bg-warning-100 text-warning-800';
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Pengajuan Kasbon</h1>
        <p class="text-surface-500 dark:text-surface-400">Ajukan pinjaman / kasbon karyawan</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1">
        <div class="card p-6">
          <h2 class="text-lg font-bold mb-4">Form Pengajuan</h2>
          <form @submit.prevent="submitKasbon" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tanggal Pengajuan</label>
              <input type="date" v-model="formData.tanggal" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jumlah Kasbon (Rp)</label>
              <input type="number" v-model="formData.jumlah" class="input" placeholder="Contoh: 1000000" required min="10000" />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Alasan</label>
              <textarea v-model="formData.alasan" class="input" rows="3" placeholder="Alasan pengajuan kasbon" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-full" :disabled="isSubmitting">
              {{ isSubmitting ? 'Memproses...' : 'Ajukan Kasbon' }}
            </button>
          </form>
        </div>
      </div>

      <div class="md:col-span-2">
        <div class="card p-0 overflow-hidden">
          <div class="p-4 border-b border-surface-200 dark:border-surface-700">
            <h2 class="text-lg font-bold text-surface-900 dark:text-white">Riwayat Pengajuan</h2>
          </div>
          
          <div v-if="isLoading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
          
          <div v-else-if="kasbonStore.myList.length === 0" class="p-8 text-center text-surface-500">
            Belum ada riwayat pengajuan kasbon.
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                <tr>
                  <th class="px-4 py-3 font-medium">Tanggal</th>
                  <th class="px-4 py-3 font-medium">Jumlah</th>
                  <th class="px-4 py-3 font-medium">Alasan</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                  <th class="px-4 py-3 font-medium">Keterangan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
                <tr v-for="item in kasbonStore.myList" :key="item.idKasbon" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                  <td class="px-4 py-3 whitespace-nowrap">{{ format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id }) }}</td>
                  <td class="px-4 py-3 font-medium whitespace-nowrap">{{ formatCurrency(item.jumlah) }}</td>
                  <td class="px-4 py-3">{{ item.alasan }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="['px-2.5 py-1 rounded-full text-xs font-medium capitalize', getStatusBadge(item.status)]">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-xs">
                    <div v-if="item.catatanAdmin"><span class="font-bold">Admin:</span> {{ item.catatanAdmin }}</div>
                    <div v-if="item.bulanPotong && item.status === 'lunas'" class="text-success-600 mt-1">Dipotong dari gaji bln {{ item.bulanPotong }}</div>
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
