<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Data Departemen</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Departemen
      </button>
    </div>

    <div class="card p-6">
      <AppDataTable
        :columns="columns"
        :data="store.list"
        :loading="store.loading"
        :pagination="store.pagination"
        search-placeholder="Cari departemen atau kode..."
        empty-text="Belum ada data departemen"
        @page-change="onPageChange"
        @search="onSearch"
      >
        <template #cell-namaDepartemen="{ row }">
          <span class="font-medium text-surface-900 dark:text-white">{{ row.namaDepartemen }}</span>
        </template>

        <template #cell-kodeDepartemen="{ row }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400 font-mono">
            {{ row.kodeDepartemen }}
          </span>
        </template>

        <template #cell-kepala="{ row }">
          <div v-if="row.kepala" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400">
              {{ getInitials(row.kepala.nama) }}
            </div>
            <div>
              <p class="text-sm text-surface-700 dark:text-surface-200">{{ row.kepala.nama }}</p>
              <p class="text-xs text-surface-400">{{ row.kepala.nip }}</p>
            </div>
          </div>
          <span v-else class="text-sm text-surface-400 italic">Belum ditentukan</span>
        </template>

        <template #cell-jumlahPegawai="{ row }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
            {{ row.jumlahPegawai }} pegawai
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <button @click="openEditModal(row)" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-colors" title="Edit">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <button @click="confirmDelete(row)" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-danger-500 transition-colors" title="Hapus">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </template>
      </AppDataTable>
    </div>

    <!-- Create/Edit Modal -->
    <AppModal v-model="showModal" :title="isEditing ? 'Edit Departemen' : 'Tambah Departemen'" size="lg" @close="resetForm">
      <DepartemenForm
        :initial-data="editingData"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <AppModal v-model="showDeleteConfirm" title="Hapus Departemen" size="sm" @close="deletingId = null">
      <div class="text-center py-4">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p class="text-surface-700 dark:text-surface-300 mb-1">Apakah Anda yakin ingin menghapus departemen ini?</p>
        <p class="text-sm text-surface-400">Tindakan ini tidak dapat dibatalkan.</p>
      </div>
      <template #footer>
        <button @click="showDeleteConfirm = false" class="btn btn-ghost">Batal</button>
        <button @click="handleDelete" :disabled="submitting" class="btn btn-danger">
          <svg v-if="submitting" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Hapus
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDepartemenStore } from '@/stores/departemen.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppModal from '@/components/common/AppModal.vue';
import DepartemenForm from '@/components/forms/DepartemenForm.vue';
import type { Column } from '@/components/common/AppDataTable.vue';
import type { DepartemenForm as DepartemenFormType } from '@/types/departemen';

const store = useDepartemenStore();
const { addToast } = useNotification();

const showModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const editingData = ref<Partial<DepartemenFormType>>({});
const editingId = ref<number | null>(null);
const deletingId = ref<number | null>(null);

const columns: Column[] = [
  { key: 'kodeDepartemen', label: 'Kode', sortable: true },
  { key: 'namaDepartemen', label: 'Nama Departemen', sortable: true },
  { key: 'kepala', label: 'Kepala' },
  { key: 'jumlahPegawai', label: 'Pegawai', sortable: true },
];

onMounted(() => store.fetchAll());

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
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

function openEditModal(departemen: any) {
  isEditing.value = true;
  editingId.value = departemen.id;
  editingData.value = {
    namaDepartemen: departemen.namaDepartemen,
    kodeDepartemen: departemen.kodeDepartemen,
    idKepala: departemen.kepala?.id || null,
  };
  showModal.value = true;
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

async function handleSubmit(data: DepartemenFormType) {
  submitting.value = true;
  try {
    let success: boolean;
    if (isEditing.value && editingId.value) {
      success = await store.update(editingId.value, data);
    } else {
      success = await store.create(data);
    }
    if (success) {
      addToast({ type: 'success', title: 'Berhasil', message: `Departemen "${data.namaDepartemen}" berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}` });
      closeModal();
    } else {
      addToast({ type: 'error', title: 'Gagal', message: store.error || 'Terjadi kesalahan' });
    }
  } finally {
    submitting.value = false;
  }
}

async function confirmDelete(departemen: any) {
  deletingId.value = departemen.id;
  showDeleteConfirm.value = true;
}

async function handleDelete() {
  if (!deletingId.value) return;
  submitting.value = true;
  try {
    const success = await store.delete(deletingId.value);
    if (success) {
      addToast({ type: 'success', title: 'Berhasil', message: 'Departemen berhasil dihapus' });
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
