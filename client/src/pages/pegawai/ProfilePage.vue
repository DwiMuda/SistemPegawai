<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useNotification } from '@/composables/useNotification';

const authStore = useAuthStore();
const { addToast } = useNotification();

const isSubmittingProfile = ref(false);
const isSubmittingPassword = ref(false);

const profileData = ref({
  email: '',
  noTelpon: '',
  alamat: ''
});

const passwordData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

onMounted(async () => {
  // Fetch latest profile data to ensure local state is synced
  await authStore.fetchProfile();
  
  const pegawai = authStore.user?.pegawai;
  if (pegawai) {
    profileData.value = {
      email: pegawai.email || '',
      noTelpon: pegawai.noTelpon || '',
      alamat: pegawai.alamat || ''
    };
  }
});

const handleUpdateProfile = async () => {
  isSubmittingProfile.value = true;
  try {
    await authStore.updateProfile(profileData.value);
    addToast({ type: 'success', title: 'Berhasil', message: 'Profil berhasil diperbarui' });
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.message });
  } finally {
    isSubmittingProfile.value = false;
  }
};

const handleUpdatePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    addToast({ type: 'error', title: 'Gagal', message: 'Konfirmasi password tidak cocok' });
    return;
  }

  isSubmittingPassword.value = true;
  try {
    await authStore.changePassword({
      oldPassword: passwordData.value.oldPassword,
      newPassword: passwordData.value.newPassword
    });
    addToast({ type: 'success', title: 'Berhasil', message: 'Password berhasil diubah' });
    passwordData.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  } catch (error: any) {
    addToast({ type: 'error', title: 'Gagal', message: error.message });
  } finally {
    isSubmittingPassword.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-surface-900 dark:text-white">Profil Saya</h1>
      <p class="text-sm text-surface-500 dark:text-surface-400">Kelola informasi profil dan pengaturan akun Anda</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Info (Read Only) -->
      <div class="lg:col-span-1 space-y-6">
        <div class="card p-6 border border-surface-200 dark:border-surface-700">
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center overflow-hidden mb-4 border-4 border-white dark:border-surface-800 shadow-lg">
              <img v-if="authStore.user?.pegawai?.foto" :src="authStore.user.pegawai.foto" class="w-full h-full object-cover" />
              <span v-else class="text-3xl font-bold">{{ authStore.user?.pegawai?.namaLengkap?.charAt(0) || authStore.user?.username.charAt(0) }}</span>
            </div>
            <h2 class="text-xl font-bold text-surface-900 dark:text-white">{{ authStore.user?.pegawai?.namaLengkap || 'Administrator' }}</h2>
            <p class="text-surface-500">{{ authStore.user?.pegawai?.jabatan?.namaJabatan || authStore.user?.role }}</p>
          </div>

          <div class="mt-6 space-y-3">
            <div v-if="authStore.user?.pegawai?.nip">
              <p class="text-xs text-surface-500 uppercase font-semibold">NIP</p>
              <p class="text-surface-900 dark:text-white font-medium">{{ authStore.user.pegawai.nip }}</p>
            </div>
            <div v-if="authStore.user?.pegawai?.departemen">
              <p class="text-xs text-surface-500 uppercase font-semibold">Departemen</p>
              <p class="text-surface-900 dark:text-white font-medium">{{ authStore.user.pegawai.departemen.namaDepartemen }}</p>
            </div>
            <div v-if="authStore.user?.pegawai?.tanggalMasuk">
              <p class="text-xs text-surface-500 uppercase font-semibold">Tanggal Bergabung</p>
              <p class="text-surface-900 dark:text-white font-medium">{{ new Date(authStore.user.pegawai.tanggalMasuk).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Forms -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Update Kontak -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700">
          <h3 class="text-lg font-bold text-surface-900 dark:text-white mb-4">Informasi Kontak</h3>
          <form @submit.prevent="handleUpdateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email</label>
                <input v-model="profileData.email" type="email" class="input w-full" placeholder="email@contoh.com" />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">No. Telepon</label>
                <input v-model="profileData.noTelpon" type="tel" class="input w-full" placeholder="08123456789" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Alamat Lengkap</label>
              <textarea v-model="profileData.alamat" rows="3" class="input w-full" placeholder="Alamat domisili..."></textarea>
            </div>
            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary" :disabled="isSubmittingProfile">
                <span v-if="isSubmittingProfile">Menyimpan...</span>
                <span v-else>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Ubah Password -->
        <div class="card p-6 border border-surface-200 dark:border-surface-700">
          <h3 class="text-lg font-bold text-surface-900 dark:text-white mb-4">Ubah Password</h3>
          <form @submit.prevent="handleUpdatePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Password Saat Ini</label>
              <input v-model="passwordData.oldPassword" type="password" required class="input w-full md:w-1/2" placeholder="••••••••" />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Password Baru</label>
              <input v-model="passwordData.newPassword" type="password" required class="input w-full md:w-1/2" placeholder="••••••••" />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Konfirmasi Password Baru</label>
              <input v-model="passwordData.confirmPassword" type="password" required class="input w-full md:w-1/2" placeholder="••••••••" />
            </div>
            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary" :disabled="isSubmittingPassword">
                <span v-if="isSubmittingPassword">Menyimpan...</span>
                <span v-else>Ubah Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
