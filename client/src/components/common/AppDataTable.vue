<template>
  <div>
    <!-- Toolbar -->
    <div v-if="showSearch || $slots.toolbar" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      <div v-if="showSearch" class="relative w-full sm:w-72">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          @input="onSearch"
        />
      </div>
      <div v-else></div> <!-- Spacer when search is hidden -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <slot name="toolbar" />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-surface-50 dark:bg-surface-800/50">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-left font-medium text-surface-600 dark:text-surface-400 whitespace-nowrap"
              :class="{ 'cursor-pointer select-none': col.sortable }"
              @click="col.sortable && toggleSort(col.key)"
            >
              <div class="flex items-center gap-1">
                {{ col.label }}
                <svg v-if="col.sortable && sortBy === col.key" class="w-3.5 h-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="sortOrder === 'asc'" stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <svg v-else-if="col.sortable" class="w-3.5 h-3.5 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </th>
            <th v-if="$slots.actions" class="px-4 py-3 text-right font-medium text-surface-600 dark:text-surface-400 whitespace-nowrap w-24">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100 dark:divide-surface-700">
          <!-- Loading state -->
          <tr v-if="loading">
            <td :colspan="columnCount" class="px-4 py-12">
              <div class="flex flex-col items-center justify-center gap-3">
                <svg class="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span class="text-sm text-surface-400">Memuat data...</span>
              </div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-else-if="!data || data.length === 0">
            <td :colspan="columnCount" class="px-4 py-12">
              <div class="flex flex-col items-center justify-center gap-2">
                <svg class="w-12 h-12 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="text-sm text-surface-400">{{ emptyText }}</p>
              </div>
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            class="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
          >
            <td v-for="col in columns" :key="col.key" class="px-4 py-3 text-surface-700 dark:text-surface-200">
              <slot :name="`cell-${col.key}`" :row="row" :value="getValue(row, col.key)">
                {{ formatValue(getValue(row, col.key), col.type) }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-4 py-3 text-right">
              <slot name="actions" :row="row" :index="rowIndex" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-between mt-4">
      <p class="text-sm text-surface-500">
        Menampilkan {{ ((pagination.page - 1) * pagination.limit) + 1 }} - {{ Math.min(pagination.page * pagination.limit, pagination.total) }} dari {{ pagination.total }} data
      </p>
      <div class="flex items-center gap-1">
        <button
          :disabled="pagination.page <= 1"
          class="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
          @click="$emit('page-change', pagination.page - 1)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          class="min-w-[36px] h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
          :class="p === pagination.page ? 'bg-primary-500 text-white' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'"
          @click="$emit('page-change', p)"
        >
          {{ p }}
        </button>
        <button
          :disabled="pagination.page >= pagination.totalPages"
          class="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
          @click="$emit('page-change', pagination.page + 1)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PaginationMeta } from '@/types/api';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'string' | 'number' | 'currency' | 'date' | 'badge';
}

const props = withDefaults(defineProps<{
  columns: Column[];
  data: any[] | null;
  loading?: boolean;
  pagination?: PaginationMeta | null;
  searchPlaceholder?: string;
  emptyText?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  showSearch?: boolean;
}>(), {
  loading: false,
  searchPlaceholder: 'Cari data...',
  emptyText: 'Tidak ada data',
  sortBy: '',
  sortOrder: 'asc',
  showSearch: true,
});

const emit = defineEmits<{
  'page-change': [page: number];
  'search': [query: string];
  'sort': [key: string, order: 'asc' | 'desc'];
}>();

const searchQuery = ref('');
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const columnCount = computed(() => {
  let count = props.columns.length;
  return count;
});

const visiblePages = computed(() => {
  if (!props.pagination) return [];
  const { page, totalPages } = props.pagination;
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

function getValue(row: any, key: string): any {
  return key.split('.').reduce((obj, k) => obj?.[k], row);
}

function formatValue(value: any, type?: string): string {
  if (value === null || value === undefined) return '-';
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    case 'date':
      return new Date(value).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    case 'number':
      return new Intl.NumberFormat('id-ID').format(value);
    default:
      return String(value);
  }
}

function onSearch() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    emit('search', searchQuery.value);
  }, 300);
}

function toggleSort(key: string) {
  const newOrder = props.sortBy === key && props.sortOrder === 'asc' ? 'desc' : 'asc';
  emit('sort', key, newOrder);
}
</script>
