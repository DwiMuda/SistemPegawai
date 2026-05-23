<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { mutasiApi } from '@/api/mutasi.api';
import { pegawaiApi } from '@/api/pegawai.api';
import { jabatanApi } from '@/api/jabatan.api';
import { departemenApi } from '@/api/departemen.api';
import { useNotification } from '@/composables/useNotification';
import AppModal from '@/components/common/AppModal.vue';

const { addToast } = useNotification();
const items = ref<any[]>([]);
const isLoading = ref(true);

const filterSearch = ref('');
const filterJenis = ref('');

// Form state
const showModal = ref(false);
const isSubmitting = ref(false);
const formData = ref({
  idPegawai: '',
  idJabatanBaru: '',
  idDepartemenBaru: '',
  tanggal: new Date().toISOString().split('T')[0],
  jenisMutasi: '',
  alasan: ''
});

// Dropdown options
const pegawaiOptions = ref<any[]>([]);
const jabatanOptions = ref<any[]>([]);
const departemenOptions = ref<any[]>([]);

const fetchOptions = async () => {
  try {
    const [pegawaiRes, jabatanRes, deptRes] = await Promise.all([
      pegawaiApi.getAll(),
      jabatanApi.getAll(),
      departemenApi.getAll()
    ]);
    pegawaiOptions.value = pegawaiRes.data.data;
    jabatanOptions.value = jabatanRes.data.data;
    departemenOptions.value = deptRes.data.data;
  } catch (error) {
    console.error('Gagal mengambil data dropdown', error);
  }
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const params: any = {};
    if (filterSearch.value) params.search = filterSearch.value;
    if (filterJenis.value) params.jenisMutasi = filterJenis.value;
    
    const res = await mutasiApi.getAll(params);
    items.value = res.data.data;
  } catch (error) {
    addToast({ type: 'error', title: 'Error', message: 'Gagal mengambil data mutasi' });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
  fetchOptions();
});

const openCreateModal = () => {
  formData.value = {
    idPegawai: '',
    idJabatanBaru: '',
    idDepartemenBaru: '',
    tanggal: new Date().toISOString().split('T')[0],
    jenisMutasi: '',
    alasan: ''
  };
  showModal.value = true;
};

const handlePegawaiChange = () => {
  const selectedPegawai = pegawaiOptions.value.find(p => p.idPegawai === Number(formData.value.idPegawai));
  if (selectedPegawai) {
    // Optional: auto-fill existing departemen as default
    formData.value.idDepartemenBaru = selectedPegawai.idDepartemen;
  }
};

const saveMutasi = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      ...formData.value,
      idPegawai: Number(formData.value.idPegawai),
      idJabatanBaru: Number(formData.value.idJabatanBaru),
      idDepartemenBaru: Number(formData.value.idDepartemenBaru),
      tanggal: new Date(formData.value.tanggal).toISOString()
    };
    
    await mutasiApi.create(payload);
    addToast({ type: 'success', title: 'Berhasil', message: 'Mutasi pegawai berhasil diproses' });
    showModal.value = false;
    fetchData();
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.response?.data?.message || 'Gagal memproses mutasi' });
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getBadgeColor = (jenis: string) => {
  switch (jenis) {
    case 'promosi': return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
    case 'demosi': return 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400';
    case 'rotasi': return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400';
    case 'transfer': return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
    default: return 'bg-surface-100 text-surface-800';
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Mutasi Pegawai</h1>
        <p class="text-sm text-surface-500 dark:text-surface-400">Kelola riwayat promosi, demosi, rotasi, dan transfer pegawai</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Mutasi Baru
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4 border border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input v-model="filterSearch" @keyup.enter="fetchData" type="text" placeholder="Cari nama pegawai..." class="input w-full" />
      </div>
      <div class="w-full sm:w-48">
        <select v-model="filterJenis" @change="fetchData" class="input w-full">
          <option value="">Semua Jenis</option>
          <option value="promosi">Promosi</option>
          <option value="demosi">Demosi</option>
          <option value="rotasi">Rotasi</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>
      <button @click="fetchData" class="btn btn-secondary">Cari</button>
    </div>

    <!-- Table -->
    <div class="card border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-50 dark:bg-surface-800/50 text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th class="px-4 py-3 font-medium">Pegawai</th>
              <th class="px-4 py-3 font-medium">Jenis & Tanggal</th>
              <th class="px-4 py-3 font-medium">Perubahan Jabatan</th>
              <th class="px-4 py-3 font-medium">Alasan</th>
              <th class="px-4 py-3 font-medium text-center">Diproses Oleh</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 dark:divide-surface-700">
            <tr v-if="isLoading">
              <td colspan="5" class="px-4 py-8 text-center text-surface-500">Memuat data...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-surface-500">Tidak ada data mutasi ditemukan.</td>
            </tr>
            <tr v-for="item in items" :key="item.idMutasi" class="hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <td class="px-4 py-3">
                <div class="font-medium text-surface-900 dark:text-white">{{ item.pegawai.namaLengkap }}</div>
                <div class="text-xs text-surface-500">{{ item.pegawai.nip }}</div>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider mb-1 inline-block" :class="getBadgeColor(item.jenisMutasi)">
                  {{ item.jenisMutasi }}
                </span>
                <div class="text-xs text-surface-500">{{ formatDate(item.tanggal) }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center text-xs">
                  <div class="w-24 text-surface-500 truncate">Lama</div>
                  <div class="flex-1 truncate">{{ jabatanOptions.find(j => j.idJabatan === item.idJabatanLama)?.namaJabatan || 'Unknown' }}</div>
                </div>
                <div class="flex items-center text-xs font-medium mt-1">
                  <div class="w-24 text-primary-600 truncate">Baru</div>
                  <div class="flex-1 text-surface-900 dark:text-white truncate">{{ item.pegawai.jabatan.namaJabatan }}</div>
                </div>
              </td>
              <td class="px-4 py-3 max-w-xs truncate" :title="item.alasan">
                {{ item.alasan }}
              </td>
              <td class="px-4 py-3 text-center">
                <div class="text-xs text-surface-600 dark:text-surface-400">{{ item.admin?.pegawai?.namaLengkap || 'Admin' }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <AppModal v-model="showModal" title="Mutasi Pegawai">
      <form @submit.prevent="saveMutasi" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Pegawai</label>
          <select v-model="formData.idPegawai" @change="handlePegawaiChange" required class="input w-full">
            <option value="">-- Pilih Pegawai --</option>
            <option v-for="p in pegawaiOptions" :key="p.idPegawai" :value="p.idPegawai">{{ p.nip }} - {{ p.namaLengkap }}</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jenis Mutasi</label>
            <select v-model="formData.jenisMutasi" required class="input w-full">
              <option value="">-- Pilih Jenis --</option>
              <option value="promosi">Promosi</option>
              <option value="demosi">Demosi</option>
              <option value="rotasi">Rotasi</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tanggal Berlaku</label>
            <input v-model="formData.tanggal" type="date" required class="input w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Jabatan Baru</label>
            <select v-model="formData.idJabatanBaru" required class="input w-full">
              <option value="">-- Pilih Jabatan --</option>
              <option v-for="j in jabatanOptions" :key="j.idJabatan" :value="j.idJabatan">{{ j.namaJabatan }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Departemen Baru</label>
            <select v-model="formData.idDepartemenBaru" required class="input w-full">
              <option value="">-- Pilih Departemen --</option>
              <option v-for="d in departemenOptions" :key="d.idDepartemen" :value="d.idDepartemen">{{ d.namaDepartemen }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Alasan / Keterangan</label>
          <textarea v-model="formData.alasan" required rows="3" class="input w-full" placeholder="Alasan mutasi..."></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
          <button type="button" @click="showModal = false" class="btn btn-secondary">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">Menyimpan...</span>
            <span v-else>Simpan Mutasi</span>
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>
