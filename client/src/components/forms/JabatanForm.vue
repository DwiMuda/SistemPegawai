<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
    <!-- Nama Jabatan -->
    <div class="form-group">
      <label for="namaJabatan" class="form-label">Nama Jabatan <span class="text-danger-500">*</span></label>
      <input
        id="namaJabatan"
        v-model="form.namaJabatan"
        type="text"
        class="form-input"
        :class="{ 'form-input-error': errors.namaJabatan }"
        placeholder="Masukkan nama jabatan"
        required
        :disabled="submitting"
      />
      <p v-if="errors.namaJabatan" class="text-xs text-danger-500">{{ errors.namaJabatan }}</p>
    </div>

    <!-- Deskripsi -->
    <div class="form-group">
      <label for="deskripsi" class="form-label">Deskripsi</label>
      <textarea
        id="deskripsi"
        v-model="form.deskripsi"
        rows="3"
        class="form-input min-h-[100px] resize-none"
        placeholder="Deskripsi jabatan (opsional)"
        :disabled="submitting"
      ></textarea>
    </div>

    <!-- Gaji & Tunjangan -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="form-group">
        <label for="gajiPokok" class="form-label">Gaji Pokok <span class="text-danger-500">*</span></label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400 font-medium font-mono">Rp</span>
          <input
            id="gajiPokok"
            v-model.number="form.gajiPokokDefault"
            type="number"
            min="0"
            class="form-input pl-10"
            :class="{ 'form-input-error': errors.gajiPokokDefault }"
            placeholder="0"
            required
            :disabled="submitting"
          />
        </div>
        <p v-if="errors.gajiPokokDefault" class="text-xs text-danger-500">{{ errors.gajiPokokDefault }}</p>
      </div>

      <div class="form-group">
        <label for="tunjangan" class="form-label">Tunjangan Default</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400 font-medium font-mono">Rp</span>
          <input
            id="tunjangan"
            v-model.number="form.tunjanganDefault"
            type="number"
            min="0"
            class="form-input pl-10"
            placeholder="0"
            :disabled="submitting"
          />
        </div>
      </div>
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
