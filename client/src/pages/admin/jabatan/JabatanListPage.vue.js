import { ref, onMounted } from 'vue';
import { useJabatanStore } from '@/stores/jabatan.store';
import { useNotification } from '@/composables/useNotification';
import AppDataTable from '@/components/common/AppDataTable.vue';
import AppModal from '@/components/common/AppModal.vue';
import JabatanForm from '@/components/forms/JabatanForm.vue';
const store = useJabatanStore();
const { addToast } = useNotification();
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const editingData = ref({});
const editingId = ref(null);
const deletingId = ref(null);
const columns = [
    { key: 'namaJabatan', label: 'Nama Jabatan', sortable: true },
    { key: 'gajiPokokDefault', label: 'Gaji Pokok', type: 'currency', sortable: true },
    { key: 'tunjanganDefault', label: 'Tunjangan', type: 'currency', sortable: true },
    { key: 'jumlahPegawai', label: 'Pegawai', sortable: true },
];
onMounted(() => store.fetchAll());
function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}
function onPageChange(page) {
    store.fetchAll(page);
}
function onSearch(query) {
    store.setSearch(query);
    store.fetchAll(1);
}
function openCreateModal() {
    isEditing.value = false;
    editingData.value = {};
    showModal.value = true;
}
function openEditModal(jabatan) {
    isEditing.value = true;
    editingId.value = jabatan.id;
    editingData.value = {
        namaJabatan: jabatan.namaJabatan,
        deskripsi: jabatan.deskripsi || '',
        gajiPokokDefault: jabatan.gajiPokokDefault,
        tunjanganDefault: jabatan.tunjanganDefault,
    };
    showModal.value = true;
}
function closeModal() {
    showModal.value = false;
    resetForm();
}
function resetForm() {
    editingData.value = {};
    editingId.value = null;
    isEditing.value = false;
}
async function handleSubmit(data) {
    submitting.value = true;
    try {
        let success;
        if (isEditing.value && editingId.value) {
            success = await store.update(editingId.value, data);
        }
        else {
            success = await store.create(data);
        }
        if (success) {
            addToast({ type: 'success', title: 'Berhasil', message: `Jabatan "${data.namaJabatan}" berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}` });
            closeModal();
        }
        else {
            addToast({ type: 'error', title: 'Gagal', message: store.error || 'Terjadi kesalahan' });
        }
    }
    finally {
        submitting.value = false;
    }
}
async function confirmDelete(jabatan) {
    deletingId.value = jabatan.id;
    showDeleteConfirm.value = true;
}
async function handleDelete() {
    if (!deletingId.value)
        return;
    submitting.value = true;
    try {
        const success = await store.delete(deletingId.value);
        if (success) {
            addToast({ type: 'success', title: 'Berhasil', message: 'Jabatan berhasil dihapus' });
            showDeleteConfirm.value = false;
            deletingId.value = null;
        }
        else {
            addToast({ type: 'error', title: 'Gagal', message: store.error || 'Terjadi kesalahan' });
        }
    }
    finally {
        submitting.value = false;
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
    ...{ onClick: (__VLS_ctx.openCreateModal) },
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
/** @type {[typeof AppDataTable, typeof AppDataTable, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppDataTable, new AppDataTable({
    ...{ 'onPageChange': {} },
    ...{ 'onSearch': {} },
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.store.list),
    loading: (__VLS_ctx.store.loading),
    pagination: (__VLS_ctx.store.pagination),
    searchPlaceholder: "Cari jabatan...",
    emptyText: "Belum ada data jabatan",
}));
const __VLS_1 = __VLS_0({
    ...{ 'onPageChange': {} },
    ...{ 'onSearch': {} },
    columns: (__VLS_ctx.columns),
    data: (__VLS_ctx.store.list),
    loading: (__VLS_ctx.store.loading),
    pagination: (__VLS_ctx.store.pagination),
    searchPlaceholder: "Cari jabatan...",
    emptyText: "Belum ada data jabatan",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onPageChange: (__VLS_ctx.onPageChange)
};
const __VLS_7 = {
    onSearch: (__VLS_ctx.onSearch)
};
__VLS_2.slots.default;
{
    const { 'cell-namaJabatan': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium text-surface-900 dark:text-white" },
    });
    (row.namaJabatan);
    if (row.deskripsi) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-xs text-surface-400 mt-0.5" },
        });
        (row.deskripsi);
    }
}
{
    const { 'cell-gajiPokokDefault': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatRupiah(row.gajiPokokDefault));
}
{
    const { 'cell-tunjanganDefault': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatRupiah(row.tunjanganDefault));
}
{
    const { 'cell-jumlahPegawai': __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400" },
    });
    (row.jumlahPegawai);
}
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-end gap-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openEditModal(row);
            } },
        ...{ class: "p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-primary-500 transition-colors" },
        title: "Edit",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "w-4 h-4" },
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.confirmDelete(row);
            } },
        ...{ class: "p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400 hover:text-danger-500 transition-colors" },
        title: "Hapus",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "w-4 h-4" },
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        'stroke-width': "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
        d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
    });
}
var __VLS_2;
/** @type {[typeof AppModal, typeof AppModal, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(AppModal, new AppModal({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.showModal),
    title: (__VLS_ctx.isEditing ? 'Edit Jabatan' : 'Tambah Jabatan'),
    size: "lg",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.showModal),
    title: (__VLS_ctx.isEditing ? 'Edit Jabatan' : 'Tambah Jabatan'),
    size: "lg",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
let __VLS_13;
const __VLS_14 = {
    onClose: (__VLS_ctx.resetForm)
};
__VLS_10.slots.default;
/** @type {[typeof JabatanForm, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(JabatanForm, new JabatanForm({
    ...{ 'onSubmit': {} },
    ...{ 'onCancel': {} },
    initialData: (__VLS_ctx.editingData),
    submitting: (__VLS_ctx.submitting),
}));
const __VLS_16 = __VLS_15({
    ...{ 'onSubmit': {} },
    ...{ 'onCancel': {} },
    initialData: (__VLS_ctx.editingData),
    submitting: (__VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_18;
let __VLS_19;
let __VLS_20;
const __VLS_21 = {
    onSubmit: (__VLS_ctx.handleSubmit)
};
const __VLS_22 = {
    onCancel: (__VLS_ctx.closeModal)
};
var __VLS_17;
var __VLS_10;
/** @type {[typeof AppModal, typeof AppModal, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(AppModal, new AppModal({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.showDeleteConfirm),
    title: "Hapus Jabatan",
    size: "sm",
}));
const __VLS_24 = __VLS_23({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.showDeleteConfirm),
    title: "Hapus Jabatan",
    size: "sm",
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_26;
let __VLS_27;
let __VLS_28;
const __VLS_29 = {
    onClose: (...[$event]) => {
        __VLS_ctx.deletingId = null;
    }
};
__VLS_25.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center py-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "w-12 h-12 mx-auto mb-3 rounded-full bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "w-6 h-6 text-danger-500" },
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-surface-700 dark:text-surface-300 mb-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm text-surface-400" },
});
{
    const { footer: __VLS_thisSlot } = __VLS_25.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.showDeleteConfirm = false;
            } },
        ...{ class: "btn btn-ghost" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleDelete) },
        disabled: (__VLS_ctx.submitting),
        ...{ class: "btn btn-danger" },
    });
    if (__VLS_ctx.submitting) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: "w-4 h-4 animate-spin mr-2" },
            fill: "none",
            viewBox: "0 0 24 24",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.circle)({
            ...{ class: "opacity-25" },
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            'stroke-width': "4",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            ...{ class: "opacity-75" },
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z",
        });
    }
}
var __VLS_25;
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
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-400']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-primary-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-primary-400']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-surface-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-surface-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-surface-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-surface-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-danger-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-danger-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-danger-500/10']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-6']} */ ;
/** @type {__VLS_StyleScopedClasses['h-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-surface-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-surface-400']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AppDataTable: AppDataTable,
            AppModal: AppModal,
            JabatanForm: JabatanForm,
            store: store,
            showModal: showModal,
            showDeleteConfirm: showDeleteConfirm,
            isEditing: isEditing,
            submitting: submitting,
            editingData: editingData,
            deletingId: deletingId,
            columns: columns,
            formatRupiah: formatRupiah,
            onPageChange: onPageChange,
            onSearch: onSearch,
            openCreateModal: openCreateModal,
            openEditModal: openEditModal,
            closeModal: closeModal,
            resetForm: resetForm,
            handleSubmit: handleSubmit,
            confirmDelete: confirmDelete,
            handleDelete: handleDelete,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=JabatanListPage.vue.js.map