<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCutiStore } from '@/stores/cuti.store';
import { useAuthStore } from '@/stores/auth.store';
import { useNotification } from '@/composables/useNotification';

const cutiStore = useCutiStore();
const authStore = useAuthStore();
const { addToast } = useNotification();

const isSubmitting = ref(false);

const form = ref({
  jenisCuti: 'tahunan' as 'tahunan' | 'sakit' | 'melahirkan' | 'lainnya',
  tanggalMulai: '',
  tanggalSelesai: '',
  jumlahHari: 1,
  alasan: ''
});

// Calculate date diff when dates change
const calculateDays = () => {
  if (form.value.tanggalMulai && form.value.tanggalSelesai) {
    const start = new Date(form.value.tanggalMulai);
    const end = new Date(form.value.tanggalSelesai);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    form.value.jumlahHari = diffDays > 0 ? diffDays : 1;
  }
};

const onSubmit = async () => {
  if (!form.value.tanggalMulai || !form.value.tanggalSelesai || !form.value.alasan) {
    addToast({ type: 'error', title: 'Error', message: 'Lengkapi semua field' });
    return;
  }
  
  if (form.value.jumlahHari <= 0) {
    addToast({ type: 'error', title: 'Error', message: 'Jumlah hari tidak valid' });
    return;
  }

  try {
    isSubmitting.value = true;
    await cutiStore.ajukanCuti({ ...form.value });
    addToast({ type: 'success', title: 'Berhasil', message: 'Pengajuan cuti berhasil dibuat' });
    
    // Reset form
    form.value.tanggalMulai = '';
    form.value.tanggalSelesai = '';
    form.value.alasan = '';
    form.value.jumlahHari = 1;
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal mengajukan cuti' });
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const formatStatus = (status: string) => {
  const map: Record<string, { text: string, class: string }> = {
    pending: { text: 'Menunggu', class: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400' },
    disetujui: { text: 'Disetujui', class: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400' },
    ditolak: { text: 'Ditolak', class: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400' }
  };
  return map[status] || { text: status, class: 'bg-surface-100 text-surface-800' };
};

const sisaCuti = computed(() => {
  return authStore.user?.pegawai?.sisaCuti ?? 0;
});

onMounted(() => {
  cutiStore.fetchMyCuti();
});

const handleBatal = async (idCuti: number) => {
  if (confirm('Apakah Anda yakin ingin membatalkan pengajuan cuti ini?')) {
    try {
      await cutiStore.batalkanCuti(idCuti);
      addToast({ type: 'success', title: 'Berhasil', message: 'Pengajuan cuti berhasil dibatalkan' });
      authStore.fetchProfile(); // update sisa cuti jika perlu
    } catch (error: any) {
      addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal membatalkan cuti' });
    }
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Pengajuan Cuti</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Ajukan dan pantau status cuti Anda</p>
      </div>
      
      <div class="bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg border border-primary-100 dark:border-primary-800 flex items-center gap-3">
        <div class="bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-primary-600 dark:text-primary-400 font-medium">Sisa Cuti Tahunan</p>
          <p class="text-lg font-bold text-primary-700 dark:text-primary-300">{{ sisaCuti }} Hari</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Form Pengajuan -->
      <div class="lg:col-span-1">
        <div class="card p-6 h-full border border-surface-200 dark:border-surface-700">
          <h2 class="text-lg font-semibold text-surface-900 dark:text-white mb-4">Buat Pengajuan Baru</h2>
          
          <form @submit.prevent="onSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jenis Cuti</label>
              <select v-model="form.jenisCuti" class="input w-full">
                <option value="tahunan">Cuti Tahunan</option>
                <option value="sakit">Cuti Sakit</option>
                <option value="melahirkan">Cuti Melahirkan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Mulai</label>
                <input type="date" v-model="form.tanggalMulai" @change="calculateDays" class="input w-full" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Selesai</label>
                <input type="date" v-model="form.tanggalSelesai" @change="calculateDays" class="input w-full" required />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jumlah Hari</label>
              <input type="number" v-model="form.jumlahHari" class="input w-full" min="1" />
            </div>

            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Alasan</label>
              <textarea v-model="form.alasan" rows="3" class="input w-full" placeholder="Berikan alasan yang jelas..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary w-full justify-center" :disabled="isSubmitting">
              <span v-if="isSubmitting">Mengajukan...</span>
              <span v-else>Ajukan Cuti</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Riwayat Cuti -->
      <div class="lg:col-span-2">
        <div class="card border border-surface-200 dark:border-surface-700 overflow-hidden flex flex-col h-full">
          <div class="p-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-white">Riwayat Pengajuan</h2>
            <button @click="cutiStore.fetchMyCuti()" class="btn btn-sm btn-outline" :disabled="cutiStore.isLoading">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'animate-spin': cutiStore.isLoading}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="ml-2">Refresh</span>
            </button>
          </div>

          <div class="overflow-x-auto flex-1">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700">
                <tr>
                  <th class="px-4 py-3 font-medium">Tanggal Pengajuan</th>
                  <th class="px-4 py-3 font-medium">Jenis</th>
                  <th class="px-4 py-3 font-medium">Rentang Waktu</th>
                  <th class="px-4 py-3 font-medium">Hari</th>
                  <th class="px-4 py-3 font-medium text-center">Status</th>
                  <th class="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
                <tr v-if="cutiStore.isLoading && cutiStore.myCutiList.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-surface-500">
                    <div class="flex flex-col items-center justify-center">
                      <svg class="animate-spin h-6 w-6 text-primary-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memuat data...
                    </div>
                  </td>
                </tr>
                <tr v-else-if="cutiStore.myCutiList.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-surface-500 dark:text-surface-400">
                    Belum ada riwayat pengajuan cuti.
                  </td>
                </tr>
                <tr v-for="item in cutiStore.myCutiList" :key="item.idCuti" class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td class="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {{ formatDate(item.createdAt) }}
                  </td>
                  <td class="px-4 py-3 capitalize font-medium text-surface-800 dark:text-surface-200">
                    {{ item.jenisCuti }}
                  </td>
                  <td class="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {{ formatDate(item.tanggalMulai) }} - {{ formatDate(item.tanggalSelesai) }}
                  </td>
                  <td class="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {{ item.jumlahHari }} Hari
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span 
                      class="px-2.5 py-1 text-xs font-medium rounded-full inline-block"
                      :class="formatStatus(item.status).class"
                    >
                      {{ formatStatus(item.status).text }}
                    </span>
                    <div v-if="item.catatanAdmin && item.status === 'ditolak'" class="text-xs text-danger-500 mt-1 max-w-[150px] truncate" :title="item.catatanAdmin">
                      Catatan: {{ item.catatanAdmin }}
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button 
                      v-if="item.status === 'pending'" 
                      @click="handleBatal(item.idCuti)" 
                      class="btn btn-sm btn-ghost text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                    >
                      Batal
                    </button>
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
