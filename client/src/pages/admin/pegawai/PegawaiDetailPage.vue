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
        <div class="card p-6 flex flex-col items-center text-center relative overflow-hidden">
          <!-- Background accent -->
          <div class="absolute top-0 left-0 w-full h-24 gradient-primary opacity-10 dark:opacity-20"></div>
          
          <div class="relative w-32 h-32 rounded-3xl mb-4 mt-4 bg-white dark:bg-surface-800 p-1 shadow-xl">
            <div class="w-full h-full rounded-2xl bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center overflow-hidden">
              <img v-if="pegawai.foto" :src="pegawai.foto" alt="Profile" class="w-full h-full object-cover" />
              <span v-else class="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {{ getInitials(pegawai.namaLengkap) }}
              </span>
            </div>
            <!-- Status indicator -->
            <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white dark:border-surface-800"
                 :class="{
                   'bg-success-500': pegawai.statusPegawai === 'aktif',
                   'bg-warning-500': pegawai.statusPegawai === 'cuti',
                   'bg-surface-400': pegawai.statusPegawai === 'nonaktif',
                 }">
            </div>
          </div>

          <h2 class="text-xl font-bold text-surface-900 dark:text-white">{{ pegawai.namaLengkap }}</h2>
          <p class="text-primary-600 dark:text-primary-400 font-mono text-sm font-semibold mb-6">{{ pegawai.nip }}</p>
          
          <div class="w-full grid grid-cols-2 gap-3 mb-2">
            <div class="bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700 rounded-2xl p-4">
              <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Status</p>
              <p class="text-sm font-bold capitalize"
                :class="{
                  'text-success-600 dark:text-success-400': pegawai.statusPegawai === 'aktif',
                  'text-warning-600 dark:text-warning-400': pegawai.statusPegawai === 'cuti',
                  'text-surface-600 dark:text-surface-400': pegawai.statusPegawai === 'nonaktif',
                }"
              >{{ pegawai.statusPegawai }}</p>
            </div>
            <div class="bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700 rounded-2xl p-4">
              <p class="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-1">Sisa Cuti</p>
              <p class="text-sm font-bold text-surface-900 dark:text-white">{{ pegawai.sisaCuti }} Hari</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-sm font-bold text-surface-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Pekerjaan
          </h3>
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-500 shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <p class="text-xs text-surface-400 font-medium mb-0.5">Departemen</p>
                <p class="font-bold text-surface-900 dark:text-white">{{ pegawai.departemen?.namaDepartemen }}</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-500 shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
              </div>
              <div>
                <p class="text-xs text-surface-400 font-medium mb-0.5">Jabatan</p>
                <p class="font-bold text-surface-900 dark:text-white">{{ pegawai.jabatan?.namaJabatan }}</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-500 shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p class="text-xs text-surface-400 font-medium mb-0.5">Tanggal Masuk</p>
                <p class="font-bold text-surface-900 dark:text-white">{{ formatDate(pegawai.tanggalMasuk) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Info -->
      <div class="lg:col-span-2">
        <div class="card p-8 h-full">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-surface-900 dark:text-white">Informasi Pribadi</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div class="group">
              <p class="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 group-hover:text-primary-500 transition-colors">Jenis Kelamin</p>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center text-surface-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <p class="font-bold text-surface-700 dark:text-surface-200">
                  {{ pegawai.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </p>
              </div>
            </div>
            
            <div class="group">
              <p class="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 group-hover:text-primary-500 transition-colors">Tempat, Tanggal Lahir</p>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center text-surface-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <p class="font-bold text-surface-700 dark:text-surface-200">
                  {{ pegawai.tempatLahir }}, {{ formatDate(pegawai.tanggalLahir) }}
                </p>
              </div>
            </div>

            <div class="md:col-span-2 group">
              <p class="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 group-hover:text-primary-500 transition-colors">Alamat Lengkap</p>
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center text-surface-500 mt-0.5">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                <p class="font-bold text-surface-700 dark:text-surface-200 leading-relaxed">{{ pegawai.alamat }}</p>
              </div>
            </div>

            <div class="group">
              <p class="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 group-hover:text-primary-500 transition-colors">Alamat Email</p>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center text-surface-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <p class="font-bold text-surface-700 dark:text-surface-200">{{ pegawai.email || '-' }}</p>
              </div>
            </div>

            <div class="group">
              <p class="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 group-hover:text-primary-500 transition-colors">Nomor Telepon</p>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center text-surface-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <p class="font-bold text-surface-700 dark:text-surface-200">{{ pegawai.noTelpon || '-' }}</p>
              </div>
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
