<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePengumumanStore } from '@/stores/pengumuman.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppModal from '@/components/common/AppModal.vue';
import type { Column } from '@/components/common/AppDataTable.vue';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const pengumumanStore = usePengumumanStore();
const { addToast } = useNotification();

const showModal = ref(false);
const showDeleteConfirm = ref(false);
const deletingId = ref<number | null>(null);
const isEdit = ref(false);
const isSubmitting = ref(false);

const formData = ref({
  idPengumuman: 0,
  judul: '',
  konten: '',
  tanggalMulai: new Date().toISOString().split('T')[0],
  tanggalSelesai: ''
});

const columns: Column[] = [
  { key: 'judul', label: 'Pengumuman' },
  { key: 'periode', label: 'Masa Berlaku' },
  { key: 'admin', label: 'Dibuat Oleh' },
];

onMounted(async () => {
  await pengumumanStore.fetchAll();
});

const openModal = (item?: any) => {
  if (item) {
    isEdit.value = true;
    formData.value = {
      idPengumuman: item.idPengumuman,
      judul: item.judul,
      konten: item.konten,
      tanggalMulai: new Date(item.tanggalMulai).toISOString().split('T')[0],
      tanggalSelesai: item.tanggalSelesai ? new Date(item.tanggalSelesai).toISOString().split('T')[0] : ''
    };
  } else {
    isEdit.value = false;
    formData.value = {
      idPengumuman: 0,
      judul: '',
      konten: '',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: ''
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitForm = async () => {
  isSubmitting.value = true;
  const payload = {
    ...formData.value,
    tanggalSelesai: formData.value.tanggalSelesai ? formData.value.tanggalSelesai : null
  };
  
  try {
    let success;
    if (isEdit.value) {
      success = await pengumumanStore.update(formData.value.idPengumuman, payload);
    } else {
      success = await pengumumanStore.create(payload);
    }
    
    if (success) {
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: `Pengumuman berhasil ${isEdit.value ? 'diperbarui' : 'ditambahkan'}`
      });
      closeModal();
    } else {
      addToast({
        type: 'error',
        title: 'Gagal',
        message: pengumumanStore.error || 'Terjadi kesalahan saat menyimpan'
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = (id: number) => {
  deletingId.value = id;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  if (!deletingId.value) return;
  
  const success = await pengumumanStore.delete(deletingId.value);
  if (success) {
    addToast({ type: 'success', title: 'Berhasil', message: 'Pengumuman berhasil dihapus' });
    showDeleteConfirm.value = false;
    deletingId.value = null;
  } else {
    addToast({ type: 'error', title: 'Gagal', message: pengumumanStore.error || 'Gagal menghapus pengumuman' });
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Papan Pengumuman</h1>
        <p class="text-surface-500 dark:text-surface-400 text-sm mt-1">Kelola informasi dan pengumuman resmi perusahaan untuk semua pegawai.</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Tambah Pengumuman
      </button>
    </div>

    <div class="card p-6">
      <AppDataTable
        :columns="columns"
        :data="pengumumanStore.list"
        :loading="pengumumanStore.loading"
        empty-text="Belum ada pengumuman yang diterbitkan"
      >
        <template #cell-judul="{ row }">
          <div class="max-w-md">
            <p class="font-bold text-surface-900 dark:text-white group-hover:text-primary-600 transition-colors">{{ row.judul }}</p>
            <p class="text-xs text-surface-500 mt-1 line-clamp-2">{{ row.konten }}</p>
          </div>
        </template>

        <template #cell-periode="{ row }">
          <div class="flex flex-col">
            <span class="text-sm text-surface-700 dark:text-surface-300 font-medium">
              {{ format(new Date(row.tanggalMulai), 'dd MMM yyyy', { locale: id }) }}
            </span>
            <span v-if="row.tanggalSelesai" class="text-[10px] text-surface-400">
              s/d {{ format(new Date(row.tanggalSelesai), 'dd MMM yyyy', { locale: id }) }}
            </span>
            <span v-else class="text-[10px] text-success-500 font-bold uppercase tracking-wider">Seterusnya</span>
          </div>
        </template>

        <template #cell-admin="{ row }">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[10px] text-white font-bold">
              {{ (row.admin?.pegawai?.namaLengkap || row.admin?.username || 'A').substring(0, 1) }}
            </div>
            <span class="text-xs text-surface-600 dark:text-surface-400">
              {{ row.admin?.pegawai?.namaLengkap || row.admin?.username }}
            </span>
          </div>
        </template>

        <template #actions="{ row }">
          <div class="flex justify-end gap-2">
            <button @click="openModal(row)" class="btn btn-sm btn-ghost" title="Edit">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button @click="confirmDelete(row.idPengumuman)" class="btn btn-sm btn-ghost text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/10" title="Hapus">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </template>
      </AppDataTable>
    </div>

    <!-- Modal Form -->
    <AppModal 
      v-model="showModal" 
      :title="isEdit ? 'Sunting Pengumuman' : 'Terbitkan Pengumuman Baru'"
      size="md"
    >
      <form @submit.prevent="submitForm" class="space-y-5 py-2">
        <div class="form-group">
          <label class="form-label">Judul Pengumuman</label>
          <input 
            type="text" 
            v-model="formData.judul" 
            class="form-input" 
            placeholder="Contoh: Jadwal Libur Lebaran 2024"
            required 
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Isi Pengumuman</label>
          <textarea 
            v-model="formData.konten" 
            class="form-input min-h-[150px] resize-none" 
            placeholder="Tuliskan detail pengumuman di sini..."
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-group">
            <label class="form-label">Tanggal Mulai</label>
            <input type="date" v-model="formData.tanggalMulai" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Selesai (Opsional)</label>
            <input type="date" v-model="formData.tanggalSelesai" class="form-input" />
            <p class="text-[10px] text-surface-400 mt-1 italic">* Kosongkan jika berlaku selamanya</p>
          </div>
        </div>
      </form>

      <template #footer>
        <button @click="closeModal" class="btn btn-ghost" :disabled="isSubmitting">Batal</button>
        <button @click="submitForm" class="btn btn-primary min-w-[120px]" :disabled="isSubmitting">
          <svg v-if="isSubmitting" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ isEdit ? 'Simpan Perubahan' : 'Terbitkan Sekarang' }}
        </button>
      </template>
    </AppModal>

    <!-- Delete Confirmation -->
    <AppModal v-model="showDeleteConfirm" title="Hapus Pengumuman" size="sm">
      <div class="py-4">
        <div class="w-16 h-16 rounded-full bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center mx-auto mb-4 text-danger-600">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <p class="text-center text-surface-600 dark:text-surface-300">
          Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>
      <template #footer>
        <button @click="showDeleteConfirm = false" class="btn btn-ghost">Batal</button>
        <button @click="handleDelete" class="btn btn-danger min-w-[100px]">Ya, Hapus</button>
      </template>
    </AppModal>
  </div>
</template>
