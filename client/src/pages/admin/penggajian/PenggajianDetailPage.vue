<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePenggajianStore } from '@/stores/penggajian.store';
import { useNotification } from '@/composables/useNotification';
import { useExport } from '@/composables/useExport';
import { penggajianApi } from '@/api/penggajian.api';
import PenggajianForm from '@/components/forms/PenggajianForm.vue';

const route = useRoute();
const router = useRouter();
const store = usePenggajianStore();
const { addToast } = useNotification();
const { isExporting, handleExport } = useExport();

const id = parseInt(route.params.id as string);
const showEditModal = ref(false);

const fetchData = async () => {
  try {
    await store.fetchById(id);
  } catch (error) {
    router.push('/admin/penggajian');
  }
};

onMounted(() => {
  fetchData();
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const formatStatus = (status: string | undefined) => {
  if (!status) return { text: '', class: '' };
  const map: Record<string, { text: string, class: string }> = {
    pending: { text: 'Menunggu', class: 'bg-warning-100 text-warning-800' },
    dibayar: { text: 'Dibayar', class: 'bg-success-100 text-success-800' },
    batal: { text: 'Dibatalkan', class: 'bg-danger-100 text-danger-800' }
  };
  return map[status] || { text: status, class: 'bg-surface-100 text-surface-800' };
};

const handleUpdateKomponen = async (data: any) => {
  try {
    await store.updateKomponen(id, data);
    addToast({ type: 'success', title: 'Berhasil', message: 'Komponen gaji berhasil diperbarui' });
    showEditModal.value = false;
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal mengupdate komponen gaji' });
  }
};

const handleBayar = async () => {
  if (confirm('Tandai gaji ini sebagai "Dibayar"? Tindakan ini tidak dapat dibatalkan.')) {
    try {
      await store.bayar(id);
      addToast({ type: 'success', title: 'Berhasil', message: 'Gaji berhasil ditandai sebagai dibayar' });
    } catch (error: any) {
      addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal memproses pembayaran' });
    }
  }
};

const handleBatal = async () => {
  if (confirm('Apakah Anda yakin ingin membatalkan penggajian ini?')) {
    try {
      await store.batal(id);
      addToast({ type: 'success', title: 'Berhasil', message: 'Gaji berhasil dibatalkan' });
    } catch (error: any) {
      addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal membatalkan pembayaran' });
    }
  }
};

const getNamaJabatan = (pegawai: any) => {
  if (!pegawai?.jabatan) return '-';
  if (typeof pegawai.jabatan === 'string') return pegawai.jabatan;
  return pegawai.jabatan.namaJabatan || '-';
};

const getNamaDepartemen = (pegawai: any) => {
  if (!pegawai?.departemen) return '-';
  if (typeof pegawai.departemen === 'string') return pegawai.departemen;
  return pegawai.departemen.namaDepartemen || '-';
};

const handleDownloadPdf = () => {
  if (!store.current) return;
  const filename = `SlipGaji_${store.current.pegawai?.nip}_${store.current.periodeBulan}_${store.current.periodeTahun}.pdf`;
  handleExport(() => penggajianApi.downloadPdf(id), filename);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <router-link to="/admin/penggajian" class="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white bg-surface-100 dark:bg-surface-800 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Detail Penggajian</h1>
          <p class="text-sm text-surface-500 dark:text-surface-400">Rincian slip gaji pegawai</p>
        </div>
      </div>
      
      <div v-if="store.current" class="flex gap-2">
        <button @click="handleDownloadPdf" :disabled="isExporting" class="btn btn-outline text-primary-600 border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">
          <svg v-if="isExporting" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
        <button v-if="store.current.statusBayar === 'pending'" @click="showEditModal = true" class="btn btn-outline">
          Edit Komponen
        </button>
        <button v-if="store.current.statusBayar === 'pending'" @click="handleBatal" class="btn btn-outline text-danger-600 border-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20">
          Batalkan Gaji
        </button>
        <button v-if="store.current.statusBayar === 'pending'" @click="handleBayar" class="btn btn-primary bg-success-600 hover:bg-success-700 border-none">
          Tandai Dibayar
        </button>
      </div>
    </div>

    <div v-if="store.isLoading && !store.current" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-surface-200 border-t-primary-600"></div>
      <p class="mt-2 text-surface-500">Memuat detail gaji...</p>
    </div>

    <div v-else-if="store.current" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Info Karyawan -->
      <div class="col-span-1 space-y-6">
        <div class="card p-6 border border-surface-200 dark:border-surface-700">
          <h3 class="text-lg font-bold text-surface-900 dark:text-white mb-4">Informasi Karyawan</h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-surface-500">Nama Lengkap</p>
              <p class="font-medium">{{ store.current.pegawai?.namaLengkap }}</p>
            </div>
            <div>
              <p class="text-sm text-surface-500">NIP</p>
              <p class="font-medium">{{ store.current.pegawai?.nip }}</p>
            </div>
            <div>
              <p class="text-sm text-surface-500">Jabatan</p>
              <p class="font-medium">{{ getNamaJabatan(store.current.pegawai) }}</p>
            </div>
            <div>
              <p class="text-sm text-surface-500">Departemen</p>
              <p class="font-medium">{{ getNamaDepartemen(store.current.pegawai) }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6 border border-surface-200 dark:border-surface-700">
          <h3 class="text-lg font-bold text-surface-900 dark:text-white mb-4">Status Transaksi</h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-surface-500 mb-1">Periode</p>
              <p class="font-medium">{{ new Date(2000, store.current.periodeBulan - 1).toLocaleString('id-ID', { month: 'long' }) }} {{ store.current.periodeTahun }}</p>
            </div>
            <div>
              <p class="text-sm text-surface-500 mb-1">Status</p>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="formatStatus(store.current.statusBayar).class">
                {{ formatStatus(store.current.statusBayar).text }}
              </span>
            </div>
            <div v-if="store.current.tanggalBayar">
              <p class="text-sm text-surface-500 mb-1">Tanggal Dibayar</p>
              <p class="font-medium">{{ new Date(store.current.tanggalBayar).toLocaleDateString('id-ID') }}</p>
            </div>
            <div v-if="store.current.keterangan">
              <p class="text-sm text-surface-500 mb-1">Keterangan</p>
              <p class="font-medium text-sm p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">{{ store.current.keterangan }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Slip Gaji Detail -->
      <div class="col-span-1 lg:col-span-2">
        <div class="card p-0 overflow-hidden border border-surface-200 dark:border-surface-700">
          <div class="bg-surface-50 dark:bg-surface-800/50 p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 class="text-xl font-bold text-surface-900 dark:text-white text-center">Rincian Slip Gaji</h3>
          </div>
          
          <div class="p-4 sm:p-6 space-y-8">
            <!-- Pendapatan -->
            <div>
              <h4 class="text-md font-bold text-success-600 mb-4 border-b border-surface-200 dark:border-surface-700 pb-2">PENDAPATAN</h4>
              <div class="space-y-3">
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Gaji Pokok</span>
                  <span>{{ formatCurrency(store.current.gajiPokok) }}</span>
                </div>
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Tunjangan Jabatan</span>
                  <span>{{ formatCurrency(store.current.tunjanganJabatan) }}</span>
                </div>
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Tunjangan Transport</span>
                  <span>{{ formatCurrency(store.current.tunjanganTransport) }}</span>
                </div>
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Tunjangan Makan</span>
                  <span>{{ formatCurrency(store.current.tunjanganMakan) }}</span>
                </div>
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Upah Lembur</span>
                  <span>{{ formatCurrency(store.current.upahLembur) }}</span>
                </div>
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Bonus</span>
                  <span>{{ formatCurrency(store.current.bonus) }}</span>
                </div>
                <div class="flex justify-between font-bold text-surface-900 dark:text-white pt-2 border-t border-surface-100 dark:border-surface-800">
                  <span>Total Pendapatan</span>
                  <span>{{ formatCurrency(store.current.gajiPokok + store.current.tunjanganJabatan + store.current.tunjanganTransport + store.current.tunjanganMakan + store.current.upahLembur + store.current.bonus) }}</span>
                </div>
              </div>
            </div>

            <!-- Potongan -->
            <div>
              <h4 class="text-md font-bold text-danger-600 mb-4 border-b border-surface-200 dark:border-surface-700 pb-2">POTONGAN</h4>
              <div class="space-y-3">
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Potongan Absensi</span>
                  <span>{{ formatCurrency(store.current.potonganAbsensi) }}</span>
                </div>
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>BPJS Kesehatan & Ketenagakerjaan</span>
                  <span>{{ formatCurrency(store.current.potonganBpjs) }}</span>
                </div>
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Pajak PPh 21</span>
                  <span>{{ formatCurrency(store.current.potonganPajak) }}</span>
                </div>
                <div class="flex justify-between text-surface-700 dark:text-surface-300">
                  <span>Potongan Lain-lain</span>
                  <span>{{ formatCurrency(store.current.potonganLain) }}</span>
                </div>
                <div class="flex justify-between font-bold text-surface-900 dark:text-white pt-2 border-t border-surface-100 dark:border-surface-800">
                  <span>Total Potongan</span>
                  <span>{{ formatCurrency(store.current.potonganAbsensi + store.current.potonganBpjs + store.current.potonganPajak + store.current.potonganLain) }}</span>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-primary-50 dark:bg-primary-900/20 p-4 sm:p-6 rounded-lg border border-primary-100 dark:border-primary-800">
              <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
                <span class="text-lg font-bold text-primary-900 dark:text-primary-100">TOTAL GAJI DITERIMA (TAKE HOME PAY)</span>
                <span class="text-2xl font-bold text-primary-700 dark:text-primary-300">{{ formatCurrency(store.current.totalGaji) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Komponen Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-surface-900 rounded-2xl w-full max-w-md shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div class="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
          <h2 class="text-lg font-bold text-surface-900 dark:text-white">Edit Komponen Gaji</h2>
          <button @click="showEditModal = false" class="text-surface-400 hover:text-surface-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <PenggajianForm 
            :initial-data="store.current" 
            :submitting="store.isLoading"
            @submit="handleUpdateKomponen"
            @cancel="showEditModal = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
