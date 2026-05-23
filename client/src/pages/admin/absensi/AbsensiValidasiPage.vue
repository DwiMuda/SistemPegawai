<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Validasi & Input Absensi</h1>
      <button @click="openManualInputModal" class="btn btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Input Manual
      </button>
    </div>

    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-surface-900 dark:text-white">Data Belum Divalidasi</h2>
        <button 
          v-if="selectedIds.length > 0" 
          @click="handleValidasiMassal" 
          class="btn btn-success btn-sm"
          :disabled="submitting"
        >
          Validasi {{ selectedIds.length }} Data
        </button>
      </div>

      <AppDataTable
        :columns="columns"
        :data="unvalidatedData"
        :loading="store.loading"
        search-placeholder="Cari pegawai..."
        empty-text="Semua data absensi bulan ini sudah divalidasi"
      >
        <template #cell-checkbox="{ row }">
          <input 
            type="checkbox" 
            :value="row.idAbsensi" 
            v-model="selectedIds"
            class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
        </template>

        <template #cell-tanggal="{ row }">
          <span class="text-sm font-medium">{{ formatDate(row.tanggal) }}</span>
        </template>
        
        <template #cell-pegawai="{ row }">
          <div>
            <p class="font-medium text-surface-900 dark:text-white">{{ row.pegawai?.namaLengkap }}</p>
            <p class="text-xs text-surface-500">{{ row.pegawai?.departemen?.namaDepartemen }}</p>
          </div>
        </template>

        <template #cell-waktu="{ row }">
          <div class="text-sm">
            <span v-if="row.jamMasuk" :class="{'text-danger-500 font-bold': row.isLate}">{{ row.jamMasuk }}</span>
            <span v-else class="text-surface-400">-</span>
            <span class="mx-1">-</span>
            <span v-if="row.jamKeluar">{{ row.jamKeluar }}</span>
            <span v-else class="text-surface-400">-</span>
          </div>
        </template>

        <template #cell-status="{ row }">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase"
            :class="{
              'bg-success-50 text-success-700': row.status === 'hadir' && !row.isLate,
              'bg-warning-50 text-warning-700': row.status === 'hadir' && row.isLate,
              'bg-info-50 text-info-700': row.status === 'izin',
              'bg-danger-50 text-danger-700': row.status === 'sakit',
              'bg-surface-100 text-surface-700': row.status === 'alpha' || row.status === 'libur',
            }"
          >
            {{ row.status === 'hadir' && row.isLate ? 'Terlambat' : row.status }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-2">
            <button @click="openEditModal(row)" class="btn btn-outline btn-sm">Edit</button>
            <button @click="handleValidasiSingle(row.idAbsensi)" class="btn btn-primary btn-sm">Validasi</button>
          </div>
        </template>
      </AppDataTable>
    </div>

    <!-- Manual Input Modal -->
    <AppModal v-model="showManualModal" title="Input Absensi Manual" size="lg" @close="showManualModal = false" :showCancel="false">
      <AbsensiForm
        :initial-data="{}"
        :submitting="submitting"
        @submit="handleManualInput"
        @cancel="showManualModal = false"
      />
    </AppModal>

    <!-- Edit Modal -->
    <AppModal v-model="showEditModal" title="Edit Absensi" size="lg" @close="showEditModal = false" :showCancel="false">
      <AbsensiForm
        v-if="editingData"
        :initial-data="editingData"
        :is-edit="true"
        :submitting="submitting"
        @submit="handleEdit"
        @cancel="showEditModal = false"
      />
    </AppModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAbsensiStore } from '@/stores/absensi.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppModal from '@/components/common/AppModal.vue';
import AbsensiForm from '@/components/forms/AbsensiForm.vue';
import type { Column } from '@/components/common/AppDataTable.vue';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import type { AbsensiManualForm } from '@/types/absensi';

const store = useAbsensiStore();
const { addToast } = useNotification();

const showManualModal = ref(false);
const showEditModal = ref(false);
const submitting = ref(false);
const editingData = ref<any>(null);
const editingId = ref<number | null>(null);
const selectedIds = ref<number[]>([]);

const columns: Column[] = [
  { key: 'checkbox', label: '' },
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'pegawai', label: 'Pegawai' },
  { key: 'waktu', label: 'Waktu (Msk - Klr)' },
  { key: 'status', label: 'Status' },
];

const unvalidatedData = computed(() => {
  return store.rekap.filter(item => !item.isValidated);
});

onMounted(() => {
  store.setFilters({ bulan: new Date().getMonth() + 1, tahun: new Date().getFullYear() });
  store.fetchRekap();
});

function formatDate(dateString: string) {
  if (!dateString) return '-';
  return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
}

function openManualInputModal() {
  showManualModal.value = true;
}

function openEditModal(row: any) {
  editingId.value = row.idAbsensi;
  editingData.value = {
    tanggal: row.tanggal ? format(new Date(row.tanggal), 'yyyy-MM-dd') : '',
    status: row.status,
    jamMasuk: row.jamMasuk,
    jamKeluar: row.jamKeluar,
    keterangan: row.keterangan,
  };
  showEditModal.value = true;
}

async function handleManualInput(data: AbsensiManualForm) {
  submitting.value = true;
  const success = await store.manualInput(data);
  submitting.value = false;
  
  if (success) {
    addToast({ type: 'success', title: 'Berhasil', message: 'Data absensi manual berhasil ditambahkan' });
    showManualModal.value = false;
  }
}

async function handleEdit(data: any) {
  if (!editingId.value) return;
  submitting.value = true;
  
  // Also validate automatically upon edit
  const success = await store.validasi(editingId.value, { ...data, isValidated: true });
  submitting.value = false;

  if (success) {
    addToast({ type: 'success', title: 'Berhasil', message: 'Data absensi berhasil diperbarui' });
    showEditModal.value = false;
    selectedIds.value = selectedIds.value.filter(id => id !== editingId.value);
  }
}

async function handleValidasiSingle(idAbsensi: number) {
  const success = await store.validasi(idAbsensi, { isValidated: true });
  if (success) {
    addToast({ type: 'success', title: 'Berhasil', message: 'Data berhasil divalidasi' });
    selectedIds.value = selectedIds.value.filter(id => id !== idAbsensi);
  }
}

async function handleValidasiMassal() {
  if (selectedIds.value.length === 0) return;
  
  submitting.value = true;
  const success = await store.validasiMassal(selectedIds.value);
  submitting.value = false;

  if (success) {
    addToast({ type: 'success', title: 'Berhasil', message: `${selectedIds.value.length} data berhasil divalidasi` });
    selectedIds.value = [];
  }
}
</script>
