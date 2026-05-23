import { ref, computed, onMounted } from 'vue';
import { useAbsensiStore } from '@/stores/absensi.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppModal from '@/components/common/AppModal.vue';
import AbsensiForm from '@/components/forms/AbsensiForm.vue';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
const store = useAbsensiStore();
const { addToast } = useNotification();
const showManualModal = ref(false);
const showEditModal = ref(false);
const submitting = ref(false);
const editingData = ref(null);
const editingId = ref(null);
const selectedIds = ref([]);
const columns = [
    { key: 'checkbox', label: '' },
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pegawai', label: 'Pegawai' },
    { key: 'waktu', label: 'Waktu (Msk - Klr)' },
    { key: 'status', label: 'Status' },
];
const unvalidatedData = computed(() => {
    return store.rekap.filter(item => !item.isValidated);
});
onMounted(() => {
    store.setFilters({ bulan: new Date().getMonth() + 1, tahun: new Date().getFullYear() });
    store.fetchRekap();
});
function formatDate(dateString) {
    if (!dateString)
        return '-';
    return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
}
function openManualInputModal() {
    showManualModal.value = true;
}
function openEditModal(row) {
    editingId.value = row.idAbsensi;
    editingData.value = {
        tanggal: row.tanggal ? format(new Date(row.tanggal), 'yyyy-MM-dd') : '',
        status: row.status,
        jamMasuk: row.jamMasuk,
        jamKeluar: row.jamKeluar,
        keterangan: row.keterangan,
    };
    showEditModal.value = true;
}
async function handleManualInput(data) {
    submitting.value = true;
    const success = await store.manualInput(data);
    submitting.value = false;
    if (success) {
        addToast({ type: 'success', title: 'Berhasil', message: 'Data absensi manual berhasil ditambahkan' });
        showManualModal.value = false;
    }
}
async function handleEdit(data) {
    if (!editingId.value)
        return;
    submitting.value = true;
    // Also validate automatically upon edit
    const success = await store.validasi(editingId.value, { ...data, isValidated: true });
    submitting.value = false;
    if (success) {
        addToast({ type: 'success', title: 'Berhasil', message: 'Data absensi berhasil diperbarui' });
        showEditModal.value = false;
        selectedIds.value = selectedIds.value.filter(id => id !== editingId.value);
    }
}
async function handleValidasiSingle(idAbsensi) {
    const success = await store.validasi(idAbsensi, { isValidated: true });
    if (success) {
        addToast({ type: 'success', title: 'Berhasil', message: 'Data berhasil divalidasi' });
        selectedIds.value = selectedIds.value.filter(id => id !== idAbsensi);
    }
}
async function handleValidasiMassal() {
    if (selectedIds.value.length === 0)
        return;
    submitting.value = true;
    const success = await store.validasiMassal(selectedIds.value);
    submitting.value = false;
    if (success) {
        addToast({ type: 'success', title: 'Berhasil', message: `${selectedIds.value.length} data berhasil divalidasi` });
        selectedIds.value = [];
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl font-bold text-surface-900 dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.openManualInputModal) },
    ...{ class: "btn btn-primary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "w-4 h-4 mr-2" },
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M12 4.5v15m7.5-7.5h-15",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card p-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-lg font-medium text-surface-900 dark:text-white" },
});
if (__VLS_ctx.selectedIds.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleValidasiMassal) },
        ...{ class: "btn btn-success btn-sm" },
        disabled: (__VLS_ctx.submitting),
    });
    (__VLS_ctx.selectedIds.length);
}
/** @type {[typeof AppDataTable, typeof AppDataTable, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppDataTable, new AppDataTable({
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.unvalidatedData),
    loading: (__VLS_ctx.store.loading),
    searchPlaceholder: "Cari pegawai...",
    emptyText: "Semua data absensi bulan ini sudah divalidasi",
}));
const __VLS_1 = __VLS_0({
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.unvalidatedData),
    loading: (__VLS_ctx.store.loading),
    searchPlaceholder: "Cari pegawai...",
    emptyText: "Semua data absensi bulan ini sudah divalidasi",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
{
    const { 'cell-checkbox': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "checkbox",
        value: (row.idAbsensi),
        ...{ class: "w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" },
    });
    (__VLS_ctx.selectedIds);
}
{
    const { 'cell-tanggal': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm font-medium" },
    });
    (__VLS_ctx.formatDate(row.tanggal));
}
{
    const { 'cell-pegawai': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "font-medium text-surface-900 dark:text-white" },
    });
    (row.pegawai?.namaLengkap);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-surface-500" },
    });
    (row.pegawai?.departemen?.namaDepartemen);
}
{
    const { 'cell-waktu': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-sm" },
    });
    if (row.jamMasuk) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ({ 'text-danger-500 font-bold': row.isLate }) },
        });
        (row.jamMasuk);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-surface-400" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "mx-1" },
    });
    if (row.jamKeluar) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (row.jamKeluar);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-surface-400" },
        });
    }
}
{
    const { 'cell-status': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase" },
        ...{ class: ({
                'bg-success-50 text-success-700': row.status === 'hadir' && !row.isLate,
                'bg-warning-50 text-warning-700': row.status === 'hadir' && row.isLate,
                'bg-info-50 text-info-700': row.status === 'izin',
                'bg-danger-50 text-danger-700': row.status === 'sakit',
                'bg-surface-100 text-surface-700': row.status === 'alpha' || row.status === 'libur',
            }) },
    });
    (row.status === 'hadir' && row.isLate ? 'Terlambat' : row.status);
}
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-end gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openEditModal(row);
            } },
        ...{ class: "btn btn-outline btn-sm" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleValidasiSingle(row.idAbsensi);
            } },
        ...{ class: "btn btn-primary btn-sm" },
    });
}
var __VLS_2;
/** @type {[typeof AppModal, typeof AppModal, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(AppModal, new AppModal({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.showManualModal),
    title: "Input Absensi Manual",
    size: "lg",
    showCancel: (false),
}));
const __VLS_4 = __VLS_3({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.showManualModal),
    title: "Input Absensi Manual",
    size: "lg",
    showCancel: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
let __VLS_6;
let __VLS_7;
let __VLS_8;
const __VLS_9 = {
    onClose: (...[$event]) => {
        __VLS_ctx.showManualModal = false;
    }
};
__VLS_5.slots.default;
/** @type {[typeof AbsensiForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(AbsensiForm, new AbsensiForm({
    ...{ 'onSubmit': {} },
    ...{ 'onCancel': {} },
    initialData: ({}),
    submitting: (__VLS_ctx.submitting),
}));
const __VLS_11 = __VLS_10({
    ...{ 'onSubmit': {} },
    ...{ 'onCancel': {} },
    initialData: ({}),
    submitting: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onSubmit: (__VLS_ctx.handleManualInput)
};
const __VLS_17 = {
    onCancel: (...[$event]) => {
        __VLS_ctx.showManualModal = false;
    }
};
var __VLS_12;
var __VLS_5;
/** @type {[typeof AppModal, typeof AppModal, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(AppModal, new AppModal({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.showEditModal),
    title: "Edit Absensi",
    size: "lg",
    showCancel: (false),
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.showEditModal),
    title: "Edit Absensi",
    size: "lg",
    showCancel: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_21;
let __VLS_22;
let __VLS_23;
const __VLS_24 = {
    onClose: (...[$event]) => {
        __VLS_ctx.showEditModal = false;
    }
};
__VLS_20.slots.default;
if (__VLS_ctx.editingData) {
    /** @type {[typeof AbsensiForm, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(AbsensiForm, new AbsensiForm({
        ...{ 'onSubmit': {} },
        ...{ 'onCancel': {} },
        initialData: (__VLS_ctx.editingData),
        isEdit: (true),
        submitting: (__VLS_ctx.submitting),
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onSubmit': {} },
        ...{ 'onCancel': {} },
        initialData: (__VLS_ctx.editingData),
        isEdit: (true),
        submitting: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onSubmit: (__VLS_ctx.handleEdit)
    };
    const __VLS_32 = {
        onCancel: (...[$event]) => {
            if (!(__VLS_ctx.editingData))
                return;
            __VLS_ctx.showEditModal = false;
        }
    };
    var __VLS_27;
}
var __VLS_20;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-400']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AppDataTable: AppDataTable,
            AppModal: AppModal,
            AbsensiForm: AbsensiForm,
            store: store,
            showManualModal: showManualModal,
            showEditModal: showEditModal,
            submitting: submitting,
            editingData: editingData,
            selectedIds: selectedIds,
            columns: columns,
            unvalidatedData: unvalidatedData,
            formatDate: formatDate,
            openManualInputModal: openManualInputModal,
            openEditModal: openEditModal,
            handleManualInput: handleManualInput,
            handleEdit: handleEdit,
            handleValidasiSingle: handleValidasiSingle,
            handleValidasiMassal: handleValidasiMassal,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=AbsensiValidasiPage.vue.js.map