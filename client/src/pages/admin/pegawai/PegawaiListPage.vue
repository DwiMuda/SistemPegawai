<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Data Pegawai</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Pegawai
      </button>
    </div>

    <div class="card p-6">
      <!-- Filters -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="w-full md:w-48">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Status</label>
            <select v-model="filterStatus" @change="applyFilters" class="form-input text-sm">
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="cuti">Cuti</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
          <div class="w-full md:w-48">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Departemen</label>
            <select v-model="filterDepartemen" @change="applyFilters" class="form-input text-sm">
              <option value="">Semua Departemen</option>
              <option v-for="dept in departemenList" :key="dept.id" :value="dept.id">
                {{ dept.namaDepartemen }}
              </option>
            </select>
          </div>
        </div>

        <!-- Search -->
        <div class="relative w-full md:w-72">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama, NIP, atau email..."
            class="form-input pl-10"
            @input="handleSearch"
          />
        </div>
      </div>

      <AppDataTable
        :columns="columns"
        :data="store.list"
        :loading="store.loading"
        :pagination="store.pagination"
        :show-search="false"
        empty-text="Belum ada data pegawai"
        @page-change="onPageChange"
      >
        <template #cell-namaLengkap="{ row }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold overflow-hidden">
              <img v-if="row.foto" :src="row.foto" alt="Avatar" class="w-full h-full object-cover" />
              <span v-else>{{ getInitials(row.namaLengkap) }}</span>
            </div>
            <div>
              <p class="font-medium text-surface-900 dark:text-white">{{ row.namaLengkap }}</p>
              <p class="text-xs text-surface-400">{{ row.nip }}</p>
            </div>
          </div>
        </template>

        <template #cell-jabatan="{ row }">
          <span class="text-sm">{{ row.jabatan?.namaJabatan }}</span>
        </template>

        <template #cell-departemen="{ row }">
          <span class="text-sm">{{ row.departemen?.namaDepartemen }}</span>
        </template>

        <template #cell-statusPegawai="{ row }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400': row.statusPegawai === 'aktif',
              'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400': row.statusPegawai === 'cuti',
              'bg-surface-100 text-surface-700 dark:bg-surface-500/10 dark:text-surface-400': row.statusPegawai === 'nonaktif',
            }"
          >
            {{ row.statusPegawai.charAt(0).toUpperCase() + row.statusPegawai.slice(1) }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <router-link :to="`/admin/pegawai/${row.idPegawai}`" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-info-500 transition-colors" title="Detail">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </router-link>
            <button @click="openEditModal(row)" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-colors" title="Edit">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <button @click="confirmDelete(row)" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-danger-500 transition-colors" title="Nonaktifkan">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </button>
          </div>
        </template>
      </AppDataTable>
    </div>

    <!-- Create/Edit Modal -->
    <AppModal v-model="showModal" :title="isEditing ? 'Edit Pegawai' : 'Tambah Pegawai'" size="full" @close="resetForm" :showCancel="false">
      <PegawaiForm
        :initial-data="editingData"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <AppModal v-model="showDeleteConfirm" title="Nonaktifkan Pegawai" size="sm" @close="deletingId = null">
      <div class="text-center py-4">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p class="text-surface-700 dark:text-surface-300 mb-1">Apakah Anda yakin ingin menonaktifkan pegawai ini?</p>
        <p class="text-sm text-surface-400">Pegawai akan ditandai sebagai nonaktif dan tidak bisa login.</p>
      </div>
      <template #footer>
        <button @click="showDeleteConfirm = false" class="btn btn-ghost">Batal</button>
        <button @click="handleDelete" :disabled="submitting" class="btn btn-danger">
          <svg v-if="submitting" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Nonaktifkan
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { usePegawaiStore } from '@/stores/pegawai.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppModal from '@/components/common/AppModal.vue';
import PegawaiForm from '@/components/forms/PegawaiForm.vue';
import type { Column } from '@/components/common/AppDataTable.vue';
import type { PegawaiForm as PegawaiFormType } from '@/types/pegawai';
import { departemenApi } from '@/api/departemen.api';
import { format } from 'date-fns';

const store = usePegawaiStore();
const { addToast } = useNotification();

const showModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const editingData = ref<Partial<PegawaiFormType>>({});
const editingId = ref<number | null>(null);
const deletingId = ref<number | null>(null);

const departemenList = ref<any[]>([]);
const filterStatus = ref('');
const filterDepartemen = ref('');
const searchQuery = ref('');
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const columns: Column[] = [
  { key: 'namaLengkap', label: 'Pegawai' },
  { key: 'jabatan', label: 'Jabatan' },
  { key: 'departemen', label: 'Departemen' },
  { key: 'statusPegawai', label: 'Status' },
];

onMounted(async () => {
  store.fetchAll();
  try {
    const res = await departemenApi.getAllSimple();
    departemenList.value = res.data.data;
  } catch (error) {
    console.error(error);
  }
});

onUnmounted(() => {
  store.clearFilters();
});

function getInitials(name: string): string {
  if (!name) return 'P';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function applyFilters() {
  store.setFilters({
    statusPegawai: filterStatus.value || undefined,
    idDepartemen: filterDepartemen.value ? Number(filterDepartemen.value) : undefined,
  });
  store.fetchAll(1);
}

function handleSearch() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    store.setSearch(searchQuery.value);
    store.fetchAll(1);
  }, 300);
}

function onPageChange(page: number) {
  store.fetchAll(page);
}

function onSearch(query: string) {
  store.setSearch(query);
  store.fetchAll(1);
}

function openCreateModal() {
  isEditing.value = false;
  editingData.value = {};
  showModal.value = true;
}

async function openEditModal(pegawai: any) {
  const fullData = await store.getById(pegawai.idPegawai);
  if (fullData) {
    isEditing.value = true;
    editingId.value = fullData.idPegawai;
    editingData.value = {
      ...fullData,
      jenisKelamin: fullData.jenisKelamin as 'L' | 'P',
      noTelpon: fullData.noTelpon || undefined,
      email: fullData.email || undefined,
      foto: fullData.foto || undefined,
      tanggalLahir: fullData.tanggalLahir ? format(new Date(fullData.tanggalLahir), 'yyyy-MM-dd') : '',
      tanggalMasuk: fullData.tanggalMasuk ? format(new Date(fullData.tanggalMasuk), 'yyyy-MM-dd') : '',
    };
    showModal.value = true;
  } else {
    addToast({ type: 'error', title: 'Error', message: 'Gagal memuat data pegawai' });
  }
}

function closeModal() {
  showModal.value = false;
  resetForm();
}

function resetForm() {
  editingData.value = {};
  editingId.value = null;
  isEditing.value = false;
}

async function handleSubmit(data: PegawaiFormType) {
  submitting.value = true;
  try {
    let success: boolean;
    if (isEditing.value && editingId.value) {
      success = await store.update(editingId.value, data);
    } else {
      success = await store.create(data);
    }
    if (success) {
      addToast({ type: 'success', title: 'Berhasil', message: `Pegawai "${data.namaLengkap}" berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}` });
      closeModal();
    } else {
      addToast({ type: 'error', title: 'Gagal', message: store.error || 'Terjadi kesalahan' });
    }
  } finally {
    submitting.value = false;
  }
}

async function confirmDelete(pegawai: any) {
  deletingId.value = pegawai.idPegawai;
  showDeleteConfirm.value = true;
}

async function handleDelete() {
  if (!deletingId.value) return;
  submitting.value = true;
  try {
    const success = await store.delete(deletingId.value);
    if (success) {
      addToast({ type: 'success', title: 'Berhasil', message: 'Pegawai berhasil dinonaktifkan' });
      showDeleteConfirm.value = false;
      deletingId.value = null;
    } else {
      addToast({ type: 'error', title: 'Gagal', message: store.error || 'Terjadi kesalahan' });
    }
  } finally {
    submitting.value = false;
  }
}
</script>
