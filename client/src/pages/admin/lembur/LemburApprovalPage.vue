<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useLemburStore } from '@/stores/lembur.store';
import { useNotification } from '@/composables/useNotification';
import type { Lembur } from '@/types/lembur';

const store = useLemburStore();
const { addToast } = useNotification();

const currentDate = new Date();
const filterBulan = ref(currentDate.getMonth() + 1);
const filterTahun = ref(currentDate.getFullYear());
const filterStatus = ref('');

const selectedIds = ref<number[]>([]);
const isProcessingBulk = ref(false);

const selectedLembur = ref<Lembur | null>(null);
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const actionKeterangan = ref('');
const actionTarifPerJam = ref(0);

const fetchData = async () => {
  await store.fetchAll({
    bulan: filterBulan.value,
    tahun: filterTahun.value,
    status: filterStatus.value
  });
  selectedIds.value = [];
};

onMounted(() => {
  fetchData();
});

const openApproveModal = (item: Lembur) => {
  selectedLembur.value = item;
  actionTarifPerJam.value = item.tarifPerJam;
  actionKeterangan.value = '';
  showApproveModal.value = true;
};

const openRejectModal = (item: Lembur) => {
  selectedLembur.value = item;
  actionKeterangan.value = '';
  showRejectModal.value = true;
};

const handleApprove = async () => {
  if (!selectedLembur.value) return;
  try {
    await store.approve(selectedLembur.value.idLembur, {
      status: 'disetujui',
      tarifPerJam: actionTarifPerJam.value,
      keterangan: actionKeterangan.value
    });
    addToast({ type: 'success', title: 'Berhasil', message: 'Pengajuan lembur disetujui' });
    showApproveModal.value = false;
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal menyetujui lembur' });
  }
};

const handleReject = async () => {
  if (!selectedLembur.value) return;
  try {
    await store.approve(selectedLembur.value.idLembur, {
      status: 'ditolak',
      keterangan: actionKeterangan.value
    });
    addToast({ type: 'success', title: 'Berhasil', message: 'Pengajuan lembur ditolak' });
    showRejectModal.value = false;
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal menolak lembur' });
  }
};

const isAllSelected = computed(() => {
  const pendingLembur = store.list.filter(l => l.status === 'pending');
  return pendingLembur.length > 0 && selectedIds.value.length === pendingLembur.length;
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = store.list.filter(l => l.status === 'pending').map(l => l.idLembur);
  }
};

const handleBulkApprove = async () => {
  if (selectedIds.value.length === 0) return;
  if (confirm(`Apakah Anda yakin ingin menyetujui ${selectedIds.value.length} pengajuan lembur?`)) {
    isProcessingBulk.value = true;
    try {
      await store.batchApprove(selectedIds.value, 'disetujui');
      addToast({ type: 'success', title: 'Berhasil', message: 'Lembur massal disetujui' });
      selectedIds.value = [];
    } catch (err: any) {
      addToast({ type: 'error', title: 'Gagal', message: err.message || 'Terjadi kesalahan' });
    } finally {
      isProcessingBulk.value = false;
    }
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
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Persetujuan Lembur</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Kelola pengajuan jam lembur pegawai</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4 border border-surface-200 dark:border-surface-700 grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div>
        <label class="block text-sm text-surface-500 mb-1">Status</label>
        <select v-model="filterStatus" @change="fetchData" class="input py-2">
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>
      <div class="col-span-1 md:col-span-3 flex justify-end">
        <button v-if="selectedIds.length > 0" @click="handleBulkApprove" :disabled="isProcessingBulk" class="btn btn-success">
          <svg v-if="isProcessingBulk" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Setujui Terpilih ({{ selectedIds.length }})
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th class="px-4 py-3 font-medium w-10">
                <input 
                  type="checkbox" 
                  class="rounded text-primary-600 focus:ring-primary-500" 
                  :checked="isAllSelected" 
                  @change="toggleSelectAll" 
                  :disabled="store.list.filter(l => l.status === 'pending').length === 0"
                />
              </th>
              <th class="px-4 py-3 font-medium">Pegawai</th>
              <th class="px-4 py-3 font-medium">Tanggal</th>
              <th class="px-4 py-3 font-medium">Total Jam</th>
              <th class="px-4 py-3 font-medium">Estimasi Upah</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
              <th class="px-4 py-3 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-if="store.isLoading && store.list.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-surface-500">Memuat data lembur...</td>
            </tr>
            <tr v-else-if="store.list.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-surface-500">Tidak ada data lembur</td>
            </tr>
            <tr v-for="item in store.list" :key="item.idLembur" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-3 text-center">
                <input 
                  v-if="item.status === 'pending'"
                  type="checkbox" 
                  class="rounded text-primary-600 focus:ring-primary-500" 
                  :value="item.idLembur"
                  v-model="selectedIds"
                />
              </td>
              <td class="px-4 py-3">
                <div class="font-medium text-surface-900 dark:text-white">{{ item.pegawai?.namaLengkap }}</div>
                <div class="text-xs text-surface-500">{{ item.pegawai?.nip }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-surface-900 dark:text-white">{{ new Date(item.tanggal).toLocaleDateString('id-ID') }}</div>
                <div class="text-xs text-surface-500">{{ item.jamMulai }} - {{ item.jamSelesai }}</div>
              </td>
              <td class="px-4 py-3 text-surface-700 dark:text-surface-300">
                {{ item.totalJam }} jam
              </td>
              <td class="px-4 py-3 font-medium text-primary-600 dark:text-primary-400">
                {{ formatCurrency(item.totalUpah) }}
                <div class="text-xs text-surface-400 font-normal">({{ formatCurrency(item.tarifPerJam) }}/jam)</div>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="formatStatus(item.status).class">
                  {{ formatStatus(item.status).text }}
                </span>
                <div v-if="item.admin" class="text-[10px] text-surface-400 mt-1">oleh {{ item.admin.username }}</div>
              </td>
              <td class="px-4 py-3">
                <div v-if="item.status === 'pending'" class="flex items-center justify-center gap-2">
                  <button @click="openApproveModal(item)" class="p-1.5 text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20 rounded-lg transition-colors" title="Setujui">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button @click="openRejectModal(item)" class="p-1.5 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors" title="Tolak">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div v-else class="text-center text-xs text-surface-400">-</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Approve Modal -->
    <div v-if="showApproveModal && selectedLembur" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-surface-900 rounded-2xl w-full max-w-md shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
          <h2 class="text-lg font-bold text-surface-900 dark:text-white">Setujui Lembur</h2>
        </div>
        <div class="p-4 space-y-4">
          <div class="bg-surface-50 dark:bg-surface-800 p-3 rounded-lg text-sm">
            <p><strong>Pegawai:</strong> {{ selectedLembur.pegawai?.namaLengkap }}</p>
            <p><strong>Total Jam:</strong> {{ selectedLembur.totalJam }} jam</p>
            <p><strong>Keterangan:</strong> {{ selectedLembur.keterangan }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tarif Per Jam (Otomatis: Gaji/173)</label>
            <input v-model.number="actionTarifPerJam" type="number" class="input w-full" />
            <p class="text-xs text-surface-500 mt-1">Total Upah: {{ formatCurrency(actionTarifPerJam * selectedLembur.totalJam) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Catatan Admin (Opsional)</label>
            <textarea v-model="actionKeterangan" rows="2" class="input w-full" placeholder="Tambahkan catatan..."></textarea>
          </div>
          
          <div class="pt-4 flex justify-end gap-2">
            <button @click="showApproveModal = false" class="btn btn-outline">Batal</button>
            <button @click="handleApprove" class="btn btn-primary bg-success-600 hover:bg-success-700 border-none" :disabled="store.isLoading">
              <span v-if="store.isLoading">Menyimpan...</span>
              <span v-else>Setujui</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal && selectedLembur" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-surface-900 rounded-2xl w-full max-w-md shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
          <h2 class="text-lg font-bold text-surface-900 dark:text-white">Tolak Lembur</h2>
        </div>
        <div class="p-4 space-y-4">
          <p class="text-sm text-surface-600 dark:text-surface-400">
            Anda yakin ingin menolak pengajuan lembur dari <strong>{{ selectedLembur.pegawai?.namaLengkap }}</strong>?
          </p>
          
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Alasan Penolakan</label>
            <textarea v-model="actionKeterangan" rows="3" class="input w-full" placeholder="Masukkan alasan penolakan..."></textarea>
          </div>
          
          <div class="pt-4 flex justify-end gap-2">
            <button @click="showRejectModal = false" class="btn btn-outline">Batal</button>
            <button @click="handleReject" class="btn btn-primary bg-danger-600 hover:bg-danger-700 border-none" :disabled="store.isLoading">
              <span v-if="store.isLoading">Memproses...</span>
              <span v-else>Tolak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
