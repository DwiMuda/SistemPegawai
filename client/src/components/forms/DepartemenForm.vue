<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
    <!-- Nama Departemen -->
    <div class="form-group">
      <label for="namaDepartemen" class="form-label">Nama Departemen <span class="text-danger-500">*</span></label>
      <input
        id="namaDepartemen"
        v-model="form.namaDepartemen"
        type="text"
        class="form-input"
        :class="{ 'form-input-error': errors.namaDepartemen }"
        placeholder="Masukkan nama departemen"
        required
        :disabled="submitting"
      />
      <p v-if="errors.namaDepartemen" class="text-xs text-danger-500">{{ errors.namaDepartemen }}</p>
    </div>

    <!-- Kode Departemen -->
    <div class="form-group">
      <label for="kodeDepartemen" class="form-label">Kode Departemen <span class="text-danger-500">*</span></label>
      <input
        id="kodeDepartemen"
        v-model="form.kodeDepartemen"
        type="text"
        class="form-input uppercase"
        :class="{ 'form-input-error': errors.kodeDepartemen }"
        placeholder="Contoh: HRD-01, TI-01"
        required
        :disabled="submitting"
      />
      <p v-if="errors.kodeDepartemen" class="text-xs text-danger-500">{{ errors.kodeDepartemen }}</p>
    </div>

    <!-- Kepala Departemen -->
    <div class="form-group">
      <label for="idKepala" class="form-label">Kepala Departemen</label>
      <select
        id="idKepala"
        v-model="form.idKepala"
        class="form-input"
        :disabled="submitting"
      >
        <option :value="null">-- Pilih Kepala Departemen --</option>
        <option
          v-for="pegawai in pegawaiList"
          :key="pegawai.id"
          :value="pegawai.id"
        >
          {{ pegawai.nama }} ({{ pegawai.nip }})
        </option>
      </select>
      <p v-if="errors.idKepala" class="text-xs text-danger-500">{{ errors.idKepala }}</p>
    </div>

    <!-- Actions -->
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
        :disabled="submitting"
      >
        <svg v-if="submitting" class="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import type { DepartemenForm } from '@/types/departemen';
import { api } from '@/utils/api';

interface PegawaiOption {
  id: number;
  nip: string;
  nama: string;
}

const props = withDefaults(defineProps<{
  initialData?: Partial<DepartemenForm>;
  submitting?: boolean;
}>(), {
  initialData: () => ({}),
  submitting: false,
});

const emit = defineEmits<{
  submit: [data: DepartemenForm];
  cancel: [];
}>();

const form = reactive<DepartemenForm>({
  namaDepartemen: props.initialData.namaDepartemen || '',
  kodeDepartemen: props.initialData.kodeDepartemen || '',
  idKepala: props.initialData.idKepala ?? null,
});

const errors = reactive<Record<string, string>>({});
const pegawaiList = ref<PegawaiOption[]>([]);

const submitLabel = computed(() => props.initialData?.namaDepartemen ? 'Perbarui' : 'Simpan');

onMounted(async () => {
  try {
    const response = await api.get('/pegawai/all');
    pegawaiList.value = response.data.data.map((p: any) => ({
      id: p.id,
      nip: p.nip,
      nama: p.namaLengkap,
    }));
  } catch {
    // silently fail
  }
});

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k]);
  let valid = true;

  if (!form.namaDepartemen || form.namaDepartemen.trim().length < 3) {
    errors.namaDepartemen = 'Nama departemen minimal 3 karakter';
    valid = false;
  }

  if (!form.kodeDepartemen || form.kodeDepartemen.trim().length < 2) {
    errors.kodeDepartemen = 'Kode departemen minimal 2 karakter';
    valid = false;
  }

  return valid;
}

function handleSubmit() {
  if (!validate()) return;
  emit('submit', { ...form, kodeDepartemen: form.kodeDepartemen.toUpperCase() });
}
</script>
