<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
    <!-- Pegawai -->
    <div v-if="!isEdit" class="form-group">
      <label for="idPegawai" class="form-label">Pegawai <span class="text-danger-500">*</span></label>
      <select
        id="idPegawai"
        v-model="formData.idPegawai"
        class="form-input"
        required
        :disabled="submitting || loadingPegawai"
      >
        <option :value="null" disabled>Pilih Pegawai</option>
        <option v-for="pegawai in pegawaiList" :key="pegawai.idPegawai" :value="pegawai.idPegawai">
          {{ pegawai.namaLengkap }} - {{ pegawai.nip }}
        </option>
      </select>
    </div>

    <!-- Tanggal -->
    <div v-if="!isEdit" class="form-group">
      <label for="tanggal" class="form-label">Tanggal <span class="text-danger-500">*</span></label>
      <input
        id="tanggal"
        v-model="formData.tanggal"
        type="date"
        class="form-input"
        required
        :disabled="submitting"
      />
    </div>

    <!-- Status -->
    <div class="form-group">
      <label for="status" class="form-label">Status <span class="text-danger-500">*</span></label>
      <select
        id="status"
        v-model="formData.status"
        class="form-input"
        required
        :disabled="submitting"
      >
        <option value="hadir">Hadir</option>
        <option value="izin">Izin</option>
        <option value="sakit">Sakit</option>
        <option value="cuti">Cuti</option>
        <option value="alpha">Alpha</option>
        <option value="libur">Libur</option>
      </select>
    </div>

    <!-- Jam Masuk & Keluar (Hanya jika Hadir) -->
    <div v-if="formData.status === 'hadir'" class="grid grid-cols-2 gap-4">
      <div class="form-group">
        <label for="jamMasuk" class="form-label">Jam Masuk</label>
        <input
          id="jamMasuk"
          v-model="formData.jamMasuk"
          type="time"
          class="form-input"
          :disabled="submitting"
        />
      </div>
      <div class="form-group">
        <label for="jamKeluar" class="form-label">Jam Keluar</label>
        <input
          id="jamKeluar"
          v-model="formData.jamKeluar"
          type="time"
          class="form-input"
          :disabled="submitting"
        />
      </div>
    </div>

    <!-- Keterangan -->
    <div class="form-group">
      <label for="keterangan" class="form-label">Keterangan</label>
      <textarea
        id="keterangan"
        v-model="formData.keterangan"
        class="form-input"
        placeholder="Alasan izin/sakit/keterangan lainnya"
        rows="3"
        :disabled="submitting"
      ></textarea>
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
        :disabled="submitting || loadingPegawai"
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
import { pegawaiApi } from '@/api/pegawai.api';
import type { AbsensiManualForm } from '@/types/absensi';
import { format } from 'date-fns';

const props = defineProps<{
  initialData?: Partial<AbsensiManualForm>;
  submitting?: boolean;
  isEdit?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: AbsensiManualForm];
  cancel: [];
}>();

const formData = ref<AbsensiManualForm>({
  idPegawai: null,
  tanggal: format(new Date(), 'yyyy-MM-dd'),
  status: 'hadir',
  jamMasuk: '08:00',
  jamKeluar: '17:00',
  keterangan: '',
  ...props.initialData,
});

const pegawaiList = ref<any[]>([]);
const loadingPegawai = ref(false);

onMounted(async () => {
  if (!props.isEdit) {
    loadingPegawai.value = true;
    try {
      const res = await pegawaiApi.getAllSimple();
      pegawaiList.value = res.data.data;
    } catch (error) {
      console.error('Failed to load pegawai options:', error);
    } finally {
      loadingPegawai.value = false;
    }
  }
});

function handleSubmit() {
  const dataToSubmit = { ...formData.value };
  
  if (dataToSubmit.status !== 'hadir') {
    delete dataToSubmit.jamMasuk;
    delete dataToSubmit.jamKeluar;
  }
  
  emit('submit', dataToSubmit);
}
</script>
