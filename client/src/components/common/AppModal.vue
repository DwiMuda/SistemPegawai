<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
    >
      <div v-if="modelValue" class="fixed inset-0 z-[500] flex items-center justify-center p-4" @click.self="closeOnBackdrop && handleClose()">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

        <!-- Modal -->
        <div
          class="relative w-full bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 max-h-[90vh] flex flex-col"
          :class="sizeClass"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-white">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button
              @click="handleClose"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-4 overflow-y-auto flex-1">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-200 dark:border-surface-700">
            <slot name="footer">
              <button
                v-if="showCancel"
                type="button"
                @click="handleClose"
                class="btn btn-ghost"
              >
                {{ cancelText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  showCancel?: boolean;
  cancelText?: string;
}>(), {
  title: '',
  size: 'md',
  closeOnBackdrop: true,
  showCancel: true,
  cancelText: 'Batal',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();

const sizeClass: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-3xl',
};

function handleClose() {
  emit('update:modelValue', false);
  emit('close');
}
</script>
