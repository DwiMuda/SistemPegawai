<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- NIP -->
      <div class="form-group">
        <label for="nip" class="form-label">NIP <span class="text-danger-500">*</span></label>
        <input
          id="nip"
          v-model="formData.nip"
          type="text"
          class="form-input"
          placeholder="Contoh: 199001012020121001"
          required
          :disabled="submitting"
        />
      </div>

      <!-- Nama Lengkap -->
      <div class="form-group">
        <label for="namaLengkap" class="form-label">Nama Lengkap <span class="text-danger-500">*</span></label>
        <input
          id="namaLengkap"
          v-model="formData.namaLengkap"
          type="text"
          class="form-input"
          placeholder="Nama lengkap pegawai"
          required
          :disabled="submitting"
        />
      </div>

      <!-- Jenis Kelamin -->
      <div class="form-group">
        <label for="jenisKelamin" class="form-label">Jenis Kelamin <span class="text-danger-500">*</span></label>
        <select
          id="jenisKelamin"
          v-model="formData.jenisKelamin"
          class="form-input"
          required
          :disabled="submitting"
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      <!-- Tanggal Lahir -->
      <div class="form-group">
        <label for="tanggalLahir" class="form-label">Tanggal Lahir <span class="text-danger-500">*</span></label>
        <input
          id="tanggalLahir"
          v-model="formData.tanggalLahir"
          type="date"
          class="form-input"
          required
          :disabled="submitting"
        />
      </div>

      <!-- Tempat Lahir -->
      <div class="form-group">
        <label for="tempatLahir" class="form-label">Tempat Lahir <span class="text-danger-500">*</span></label>
        <input
          id="tempatLahir"
          v-model="formData.tempatLahir"
          type="text"
          class="form-input"
          placeholder="Kota kelahiran"
          required
          :disabled="submitting"
        />
      </div>

      <!-- No Telpon -->
      <div class="form-group">
        <label for="noTelpon" class="form-label">No. Telepon</label>
        <input
          id="noTelpon"
          v-model="formData.noTelpon"
          type="tel"
          class="form-input"
          placeholder="081234567890"
          :disabled="submitting"
        />
      </div>
      
      <!-- Email -->
      <div class="form-group md:col-span-2">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="email@perusahaan.com"
          :disabled="submitting"
        />
      </div>

      <!-- Alamat -->
      <div class="form-group md:col-span-2">
        <label for="alamat" class="form-label">Alamat <span class="text-danger-500">*</span></label>
        <textarea
          id="alamat"
          v-model="formData.alamat"
          class="form-input min-h-[80px]"
          placeholder="Alamat lengkap"
          required
          :disabled="submitting"
        ></textarea>
      </div>

      <!-- Departemen -->
      <div class="form-group">
        <label for="idDepartemen" class="form-label">Departemen <span class="text-danger-500">*</span></label>
        <select
          id="idDepartemen"
          v-model="formData.idDepartemen"
          class="form-input"
          required
          :disabled="submitting || loadingOptions"
        >
          <option :value="null" disabled>Pilih Departemen</option>
          <option v-for="dept in departemenList" :key="dept.id" :value="dept.id">
            {{ dept.namaDepartemen }}
          </option>
        </select>
      </div>

      <!-- Jabatan -->
      <div class="form-group">
        <label for="idJabatan" class="form-label">Jabatan <span class="text-danger-500">*</span></label>
        <select
          id="idJabatan"
          v-model="formData.idJabatan"
          class="form-input"
          required
          :disabled="submitting || loadingOptions"
        >
          <option :value="null" disabled>Pilih Jabatan</option>
          <option v-for="jab in jabatanList" :key="jab.id" :value="jab.id">
            {{ jab.namaJabatan }}
          </option>
        </select>
      </div>

      <!-- Tanggal Masuk -->
      <div class="form-group">
        <label for="tanggalMasuk" class="form-label">Tanggal Masuk <span class="text-danger-500">*</span></label>
        <input
          id="tanggalMasuk"
          v-model="formData.tanggalMasuk"
          type="date"
          class="form-input"
          required
          :disabled="submitting"
        />
      </div>
      
      <!-- Status Pegawai -->
      <div class="form-group">
        <label for="statusPegawai" class="form-label">Status Pegawai <span class="text-danger-500">*</span></label>
        <select
          id="statusPegawai"
          v-model="formData.statusPegawai"
          class="form-input"
          required
          :disabled="submitting"
        >
          <option value="aktif">Aktif</option>
          <option value="cuti">Cuti</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>
    </div>

    <!-- Buat Akun Option (only on create) -->
    <div v-if="!isEdit" class="flex items-center gap-2 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30">
      <input
        id="buatAkun"
        v-model="formData.buatAkun"
        type="checkbox"
        class="w-5 h-5 text-primary-600 rounded border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 focus:ring-primary-500"
        :disabled="submitting"
      />
      <label for="buatAkun" class="text-sm font-medium text-surface-900 dark:text-surface-100 cursor-pointer">
        Buat akun user untuk login (Username & Password: NIP)
      </label>
    </div>

    <div class="flex items-center justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700 mt-2">
      <button
        type="button"
        class="btn btn-ghost"
        @click="$emit('cancel')"
        :disabled="submitting"
      >
        Batal
      </button>
      <button
        type="submit"
        class="btn btn-primary min-w-[120px]"
        :disabled="submitting || loadingOptions"
      >
        <svg v-if="submitting" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ submitting ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { departemenApi } from '@/api/departemen.api';
import { jabatanApi } from '@/api/jabatan.api';
import type { PegawaiForm as PegawaiFormType } from '@/types/pegawai';
import { format } from 'date-fns';

const props = defineProps<{
  initialData?: Partial<PegawaiFormType>;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: PegawaiFormType];
  cancel: [];
}>();

const isEdit = computed(() => !!props.initialData?.nip);

const formData = ref<PegawaiFormType>({
  nip: '',
  namaLengkap: '',
  jenisKelamin: 'L',
  tanggalLahir: '',
  tempatLahir: '',
  alamat: '',
  noTelpon: '',
  email: '',
  idJabatan: null,
  idDepartemen: null,
  tanggalMasuk: format(new Date(), 'yyyy-MM-dd'),
  statusPegawai: 'aktif',
  buatAkun: true,
  ...props.initialData,
});

const departemenList = ref<any[]>([]);
const jabatanList = ref<any[]>([]);
const loadingOptions = ref(false);

onMounted(async () => {
  loadingOptions.value = true;
  try {
    const [deptRes, jabRes] = await Promise.all([
      departemenApi.getAllSimple(),
      jabatanApi.getAllSimple(),
    ]);
    departemenList.value = deptRes.data.data;
    jabatanList.value = jabRes.data.data;
  } catch (error) {
    console.error('Failed to load dropdown options:', error);
  } finally {
    loadingOptions.value = false;
  }
});

function handleSubmit() {
  emit('submit', formData.value);
}
</script>
