<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <router-link to="/admin/pegawai" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </router-link>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Detail Pegawai</h1>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline">
          Cetak Profil
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <svg class="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <div v-else-if="error" class="card p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center">
        <svg class="w-8 h-8 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-surface-900 dark:text-white mb-2">Terjadi Kesalahan</h3>
      <p class="text-surface-500 mb-6">{{ error }}</p>
      <router-link to="/admin/pegawai" class="btn btn-primary">Kembali ke Daftar</router-link>
    </div>

    <div v-else-if="pegawai" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <div class="card p-6 flex flex-col items-center text-center">
          <div class="w-32 h-32 rounded-full mb-4 bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center overflow-hidden border-4 border-white dark:border-surface-800 shadow-lg">
            <img v-if="pegawai.foto" :src="pegawai.foto" alt="Profile" class="w-full h-full object-cover" />
            <span v-else class="text-4xl font-bold text-primary-600 dark:text-primary-400">
              {{ getInitials(pegawai.namaLengkap) }}
            </span>
          </div>
          <h2 class="text-xl font-bold text-surface-900 dark:text-white">{{ pegawai.namaLengkap }}</h2>
          <p class="text-surface-500 dark:text-surface-400 mb-4">{{ pegawai.nip }}</p>
          
          <div class="w-full grid grid-cols-2 gap-4 mb-6">
            <div class="bg-surface-50 dark:bg-surface-800 rounded-xl p-3">
              <p class="text-xs text-surface-500 mb-1">Status</p>
              <p class="font-medium capitalize"
                :class="{
                  'text-success-600': pegawai.statusPegawai === 'aktif',
                  'text-warning-600': pegawai.statusPegawai === 'cuti',
                  'text-surface-600': pegawai.statusPegawai === 'nonaktif',
                }"
              >{{ pegawai.statusPegawai }}</p>
            </div>
            <div class="bg-surface-50 dark:bg-surface-800 rounded-xl p-3">
              <p class="text-xs text-surface-500 mb-1">Sisa Cuti</p>
              <p class="font-medium text-surface-900 dark:text-white">{{ pegawai.sisaCuti }} Hari</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-bold text-surface-900 dark:text-white mb-4">Posisi & Pekerjaan</h3>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-surface-500 mb-1">Departemen</p>
              <p class="font-medium text-surface-900 dark:text-white">{{ pegawai.departemen?.namaDepartemen }}</p>
            </div>
            <div>
              <p class="text-xs text-surface-500 mb-1">Jabatan</p>
              <p class="font-medium text-surface-900 dark:text-white">{{ pegawai.jabatan?.namaJabatan }}</p>
            </div>
            <div>
              <p class="text-xs text-surface-500 mb-1">Tanggal Masuk</p>
              <p class="font-medium text-surface-900 dark:text-white">{{ formatDate(pegawai.tanggalMasuk) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Info -->
      <div class="lg:col-span-2">
        <div class="card p-6 h-full">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-surface-900 dark:text-white">Informasi Pribadi</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <p class="text-sm text-surface-500 mb-1">Jenis Kelamin</p>
              <p class="font-medium text-surface-900 dark:text-white">
                {{ pegawai.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-surface-500 mb-1">Tempat, Tanggal Lahir</p>
              <p class="font-medium text-surface-900 dark:text-white">
                {{ pegawai.tempatLahir }}, {{ formatDate(pegawai.tanggalLahir) }}
              </p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-surface-500 mb-1">Alamat</p>
              <p class="font-medium text-surface-900 dark:text-white">{{ pegawai.alamat }}</p>
            </div>
            <div>
              <p class="text-sm text-surface-500 mb-1">Email</p>
              <p class="font-medium text-surface-900 dark:text-white">{{ pegawai.email || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-surface-500 mb-1">No. Telepon</p>
              <p class="font-medium text-surface-900 dark:text-white">{{ pegawai.noTelpon || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { pegawaiApi } from '@/api/pegawai.api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const pegawai = ref<any>(null);

onMounted(async () => {
  const pegawaiId = Number(route.params.id);
  if (!pegawaiId) {
    error.value = 'ID Pegawai tidak valid';
    loading.value = false;
    return;
  }

  try {
    const response = await pegawaiApi.getById(pegawaiId);
    pegawai.value = response.data.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Gagal memuat detail pegawai';
  } finally {
    loading.value = false;
  }
});

function getInitials(name: string): string {
  if (!name) return 'P';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
}
</script>
