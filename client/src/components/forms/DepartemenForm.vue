<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
        Nama Departemen <span class="text-danger-500">*</span>
      </label>
      <input
        v-model="form.namaDepartemen"
        type="text"
        class="w-full px-4 py-2.5 rounded-xl border text-sm transition-all"
        :class="errors.namaDepartemen ? 'border-danger-500 focus:ring-danger-500/20' : 'border-surface-200 dark:border-surface-600 focus:ring-primary-500/20 focus:border-primary-500'"
        placeholder="Masukkan nama departemen"
      />
      <p v-if="errors.namaDepartemen" class="mt-1 text-xs text-danger-500">{{ errors.namaDepartemen }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
        Kode Departemen <span class="text-danger-500">*</span>
      </label>
      <input
        v-model="form.kodeDepartemen"
        type="text"
        class="w-full px-4 py-2.5 rounded-xl border text-sm transition-all uppercase"
        :class="errors.kodeDepartemen ? 'border-danger-500 focus:ring-danger-500/20' : 'border-surface-200 dark:border-surface-600 focus:ring-primary-500/20 focus:border-primary-500'"
        placeholder="Contoh: HRD-01, TI-01"
      />
      <p v-if="errors.kodeDepartemen" class="mt-1 text-xs text-danger-500">{{ errors.kodeDepartemen }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Kepala Departemen</label>
      <div class="relative">
        <select
          v-model="form.idKepala"
          class="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
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
        <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <p v-if="errors.idKepala" class="mt-1 text-xs text-danger-500">{{ errors.idKepala }}</p>
    </div>

    <div class="flex items-center justify-end gap-3 pt-2">
      <button type="button" @click="$emit('cancel')" class="btn btn-ghost">Batal</button>
      <button type="submit" :disabled="submitting" class="btn btn-primary">
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
      id: p.idPegawai,
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
