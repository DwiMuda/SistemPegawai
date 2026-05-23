<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCutiStore } from '@/stores/cuti.store';
import { useNotification } from '@/composables/useNotification';

const cutiStore = useCutiStore();
const { addToast } = useNotification();

const selectedStatus = ref<'pending' | 'disetujui' | 'ditolak' | ''>('');

const isModalOpen = ref(false);
const isSubmitting = ref(false);
const selectedCutiId = ref<number | null>(null);
const actionType = ref<'disetujui' | 'ditolak'>('disetujui');
const catatanAdmin = ref('');

const fetchData = async () => {
  await cutiStore.fetchAllCuti(selectedStatus.value ? { status: selectedStatus.value } : undefined);
};

const handleResetTahunan = async () => {
  if (confirm('PERINGATAN: Aksi ini akan mereset sisa cuti semua pegawai aktif menjadi 12 hari. Lanjutkan?')) {
    try {
      await cutiStore.resetTahunan();
      addToast({ type: 'success', title: 'Berhasil', message: 'Sisa cuti tahunan berhasil direset' });
    } catch (error: any) {
      addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal mereset cuti tahunan' });
    }
  }
};

const openActionModal = (id: number, type: 'disetujui' | 'ditolak') => {
  selectedCutiId.value = id;
  actionType.value = type;
  catatanAdmin.value = '';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedCutiId.value = null;
  catatanAdmin.value = '';
};

const submitAction = async () => {
  if (!selectedCutiId.value) return;

  if (actionType.value === 'ditolak' && !catatanAdmin.value) {
    addToast({ type: 'error', title: 'Error', message: 'Catatan penolakan harus diisi' });
    return;
  }

  try {
    isSubmitting.value = true;
    await cutiStore.approveCuti(selectedCutiId.value, {
      status: actionType.value,
      catatanAdmin: catatanAdmin.value || undefined
    });
    addToast({ type: 'success', title: 'Berhasil', message: `Pengajuan cuti berhasil ${actionType.value}` });
    closeModal();
    fetchData(); // Refresh list to get updated sisa cuti inside pegawai
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || `Gagal ${actionType.value} cuti` });
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

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Persetujuan Cuti</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Kelola pengajuan cuti dari seluruh pegawai</p>
      </div>
      
      <div class="flex gap-2">
        <select v-model="selectedStatus" @change="fetchData" class="input py-2">
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>
        <button @click="fetchData" class="btn btn-outline" :disabled="cutiStore.isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'animate-spin': cutiStore.isLoading}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button @click="handleResetTahunan" class="btn btn-outline text-danger-600 border-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20" title="Reset Sisa Cuti Tahunan Semua Pegawai ke 12">
          Reset Cuti Tahunan
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th class="px-4 py-3 font-medium">Pegawai</th>
              <th class="px-4 py-3 font-medium">Jenis Cuti</th>
              <th class="px-4 py-3 font-medium">Tanggal</th>
              <th class="px-4 py-3 font-medium">Hari</th>
              <th class="px-4 py-3 font-medium">Alasan</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
              <th class="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-if="cutiStore.isLoading && cutiStore.cutiList.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-surface-500">
                <div class="flex flex-col items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-primary-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memuat data...
                </div>
              </td>
            </tr>
            <tr v-else-if="cutiStore.cutiList.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-surface-500 dark:text-surface-400">
                Belum ada data pengajuan cuti.
              </td>
            </tr>
            <tr v-for="item in cutiStore.cutiList" :key="item.idCuti" class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                    {{ item.pegawai?.namaLengkap?.charAt(0) || '?' }}
                  </div>
                  <div>
                    <p class="font-medium text-surface-900 dark:text-white">{{ item.pegawai?.namaLengkap }}</p>
                    <p class="text-xs text-surface-500">{{ item.pegawai?.nip }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 capitalize text-surface-700 dark:text-surface-300">
                {{ item.jenisCuti }}
              </td>
              <td class="px-4 py-3 text-surface-700 dark:text-surface-300">
                {{ formatDate(item.tanggalMulai) }} - {{ formatDate(item.tanggalSelesai) }}
              </td>
              <td class="px-4 py-3 text-surface-700 dark:text-surface-300">
                {{ item.jumlahHari }} Hari
              </td>
              <td class="px-4 py-3 text-surface-700 dark:text-surface-300 max-w-[200px] truncate" :title="item.alasan">
                {{ item.alasan }}
              </td>
              <td class="px-4 py-3 text-center">
                <span 
                  class="px-2.5 py-1 text-xs font-medium rounded-full inline-block"
                  :class="formatStatus(item.status).class"
                >
                  {{ formatStatus(item.status).text }}
                </span>
                <div v-if="item.catatanAdmin && item.status !== 'pending'" class="text-xs mt-1 text-surface-500 max-w-[150px] truncate mx-auto" :title="item.catatanAdmin">
                  {{ item.admin?.username }}: {{ item.catatanAdmin }}
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <div v-if="item.status === 'pending'" class="flex justify-end gap-2">
                  <button @click="openActionModal(item.idCuti, 'disetujui')" class="p-1 text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20 rounded transition-colors" title="Setujui">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button @click="openActionModal(item.idCuti, 'ditolak')" class="p-1 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded transition-colors" title="Tolak">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div v-else class="text-xs text-surface-400">
                  Sudah diproses
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Konfirmasi Aksi -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-surface-200 dark:border-surface-700">
        <div class="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-surface-900 dark:text-white">
            {{ actionType === 'disetujui' ? 'Setujui Pengajuan' : 'Tolak Pengajuan' }}
          </h3>
          <button @click="closeModal" class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-surface-600 dark:text-surface-300 mb-4">
            Apakah Anda yakin ingin {{ actionType === 'disetujui' ? 'menyetujui' : 'menolak' }} pengajuan cuti ini?
          </p>
          
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Catatan Admin {{ actionType === 'ditolak' ? '(Wajib)' : '(Opsional)' }}
            </label>
            <textarea 
              v-model="catatanAdmin" 
              rows="3" 
              class="input w-full" 
              :placeholder="actionType === 'ditolak' ? 'Berikan alasan penolakan...' : 'Tambahkan catatan jika ada...'"
              :required="actionType === 'ditolak'"
            ></textarea>
          </div>
        </div>
        <div class="px-6 py-4 bg-surface-50 dark:bg-surface-800/50 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-3">
          <button @click="closeModal" class="btn btn-outline" :disabled="isSubmitting">Batal</button>
          <button 
            @click="submitAction" 
            class="btn" 
            :class="actionType === 'disetujui' ? 'btn-primary' : 'btn-danger'"
            :disabled="isSubmitting || (actionType === 'ditolak' && !catatanAdmin)"
          >
            <span v-if="isSubmitting">Memproses...</span>
            <span v-else>{{ actionType === 'disetujui' ? 'Setujui' : 'Tolak' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
