<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePengumumanStore } from '@/stores/pengumuman.store';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const pengumumanStore = usePengumumanStore();
const showModal = ref(false);
const isEdit = ref(false);
const isSubmitting = ref(false);

const formData = ref({
  idPengumuman: 0,
  judul: '',
  konten: '',
  tanggalMulai: new Date().toISOString().split('T')[0],
  tanggalSelesai: ''
});

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
  
  let success;
  if (isEdit.value) {
    success = await pengumumanStore.update(formData.value.idPengumuman, payload);
  } else {
    success = await pengumumanStore.create(payload);
  }
  
  if (success) {
    closeModal();
  } else {
    alert('Gagal menyimpan pengumuman');
  }
  isSubmitting.value = false;
};

const deletePengumuman = async (idPengumuman: number) => {
  if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
    await pengumumanStore.delete(idPengumuman);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Papan Pengumuman</h1>
        <p class="text-surface-500 dark:text-surface-400">Kelola pengumuman untuk pegawai</p>
      </div>
      <button @click="openModal()" class="btn btn-primary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Tambah Pengumuman
      </button>
    </div>

    <div class="card p-0 overflow-hidden">
      <div v-if="pengumumanStore.loading && pengumumanStore.list.length === 0" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      </div>
      
      <div v-else-if="pengumumanStore.list.length === 0" class="p-8 text-center text-surface-500">
        Belum ada pengumuman.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
            <tr>
              <th class="px-4 py-3 font-medium">Judul</th>
              <th class="px-4 py-3 font-medium">Tgl Mulai</th>
              <th class="px-4 py-3 font-medium">Tgl Selesai</th>
              <th class="px-4 py-3 font-medium">Admin</th>
              <th class="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-for="item in pengumumanStore.list" :key="item.idPengumuman" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-3 font-medium text-surface-900 dark:text-white">{{ item.judul }}</td>
              <td class="px-4 py-3">{{ format(new Date(item.tanggalMulai), 'dd MMM yyyy', { locale: id }) }}</td>
              <td class="px-4 py-3">{{ item.tanggalSelesai ? format(new Date(item.tanggalSelesai), 'dd MMM yyyy', { locale: id }) : '-' }}</td>
              <td class="px-4 py-3">{{ item.admin?.pegawai?.namaLengkap || item.admin?.username }}</td>
              <td class="px-4 py-3 text-right">
                <button @click="openModal(item)" class="text-primary-600 hover:text-primary-900 mx-2">Edit</button>
                <button @click="deletePengumuman(item.idPengumuman)" class="text-danger-600 hover:text-danger-900">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-surface-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-surface-200 dark:border-surface-800">
        <div class="px-6 py-4 border-b border-surface-200 dark:border-surface-800 flex justify-between items-center">
          <h3 class="text-lg font-bold text-surface-900 dark:text-white">{{ isEdit ? 'Edit Pengumuman' : 'Tambah Pengumuman' }}</h3>
          <button @click="closeModal" class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Judul Pengumuman</label>
            <input type="text" v-model="formData.judul" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Konten</label>
            <textarea v-model="formData.konten" class="input" rows="4" required></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tanggal Mulai</label>
              <input type="date" v-model="formData.tanggalMulai" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tanggal Selesai (Opsional)</label>
              <input type="date" v-model="formData.tanggalSelesai" class="input" />
            </div>
          </div>
          
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="closeModal" class="btn btn-outline">Batal</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
