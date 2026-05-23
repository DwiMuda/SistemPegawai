<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
        Nama Jabatan <span class="text-danger-500">*</span>
      </label>
      <input
        v-model="form.namaJabatan"
        type="text"
        class="w-full px-4 py-2.5 rounded-xl border text-sm transition-all"
        :class="errors.namaJabatan ? 'border-danger-500 focus:ring-danger-500/20' : 'border-surface-200 dark:border-surface-600 focus:ring-primary-500/20 focus:border-primary-500'"
        placeholder="Masukkan nama jabatan"
      />
      <p v-if="errors.namaJabatan" class="mt-1 text-xs text-danger-500">{{ errors.namaJabatan }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Deskripsi</label>
      <textarea
        v-model="form.deskripsi"
        rows="3"
        class="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
        placeholder="Deskripsi jabatan (opsional)"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Gaji Pokok <span class="text-danger-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400">Rp</span>
          <input
            v-model.number="form.gajiPokokDefault"
            type="number"
            min="0"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all"
            :class="errors.gajiPokokDefault ? 'border-danger-500 focus:ring-danger-500/20' : 'border-surface-200 dark:border-surface-600 focus:ring-primary-500/20 focus:border-primary-500'"
            placeholder="0"
          />
        </div>
        <p v-if="errors.gajiPokokDefault" class="mt-1 text-xs text-danger-500">{{ errors.gajiPokokDefault }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tunjangan Default</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400">Rp</span>
          <input
            v-model.number="form.tunjanganDefault"
            type="number"
            min="0"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            placeholder="0"
          />
        </div>
      </div>
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
import { reactive, ref } from 'vue';
import type { JabatanForm } from '@/types/jabatan';

const props = withDefaults(defineProps<{
  initialData?: Partial<JabatanForm>;
  submitting?: boolean;
}>(), {
  initialData: () => ({}),
  submitting: false,
});

const emit = defineEmits<{
  submit: [data: JabatanForm];
  cancel: [];
}>();

const form = reactive<JabatanForm>({
  namaJabatan: props.initialData.namaJabatan || '',
  deskripsi: props.initialData.deskripsi || '',
  gajiPokokDefault: props.initialData.gajiPokokDefault || 0,
  tunjanganDefault: props.initialData.tunjanganDefault ?? 0,
});

const errors = reactive<Record<string, string>>({});
const submitLabel = computed(() => props.initialData?.namaJabatan ? 'Perbarui' : 'Simpan');

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k]);
  let valid = true;

  if (!form.namaJabatan || form.namaJabatan.trim().length < 3) {
    errors.namaJabatan = 'Nama jabatan minimal 3 karakter';
    valid = false;
  }

  if (!form.gajiPokokDefault || form.gajiPokokDefault <= 0) {
    errors.gajiPokokDefault = 'Gaji pokok harus lebih dari 0';
    valid = false;
  }

  return valid;
}

function handleSubmit() {
  if (!validate()) return;
  emit('submit', { ...form });
}

import { computed } from 'vue';
</script>
