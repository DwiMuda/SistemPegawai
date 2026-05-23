<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PenggajianKomponenForm, Penggajian } from '@/types/penggajian';

const props = defineProps<{
  initialData?: Penggajian | null;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: PenggajianKomponenForm): void;
  (e: 'cancel'): void;
}>();

const form = ref<PenggajianKomponenForm>({
  bonus: 0,
  potonganLain: 0,
  keterangan: ''
});

// Watch initial data to populate form
watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = {
      bonus: newVal.bonus || 0,
      potonganLain: newVal.potonganLain || 0,
      keterangan: newVal.keterangan || ''
    };
  }
}, { immediate: true });

const onSubmit = () => {
  emit('submit', { ...form.value });
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div v-if="initialData" class="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg mb-4">
      <p class="text-sm text-surface-500">Info Gaji Saat Ini:</p>
      <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
        <div class="text-surface-600">Total Pendapatan Tetap:</div>
        <div class="font-medium text-right">{{ formatCurrency(initialData.gajiPokok + initialData.tunjanganJabatan + initialData.tunjanganTransport + initialData.tunjanganMakan) }}</div>
        
        <div class="text-surface-600">Total Potongan Sistem:</div>
        <div class="font-medium text-right text-danger-600">{{ formatCurrency(initialData.potonganAbsensi + initialData.potonganBpjs + initialData.potonganPajak) }}</div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
        Bonus Khusus (Rp)
      </label>
      <input 
        type="number" 
        v-model.number="form.bonus" 
        class="input w-full" 
        min="0"
        step="1000"
      />
      <p class="text-xs text-surface-500 mt-1">Akan menambah komponen pendapatan dan diperhitungkan ke pajak.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
        Potongan Lain-Lain (Rp)
      </label>
      <input 
        type="number" 
        v-model.number="form.potonganLain" 
        class="input w-full" 
        min="0"
        step="1000"
      />
      <p class="text-xs text-surface-500 mt-1">Potongan manual tambahan (misal: denda, kasbon).</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
        Keterangan
      </label>
      <textarea 
        v-model="form.keterangan" 
        class="input w-full" 
        rows="3" 
        placeholder="Keterangan penyesuaian komponen gaji..."
      ></textarea>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
      <button type="button" @click="$emit('cancel')" class="btn btn-outline" :disabled="submitting">
        Batal
      </button>
      <button type="submit" class="btn btn-primary" :disabled="submitting">
        <span v-if="submitting">Menyimpan...</span>
        <span v-else>Simpan Perubahan</span>
      </button>
    </div>
  </form>
</template>
