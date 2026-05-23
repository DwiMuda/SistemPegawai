import type { AbsensiManualForm } from '@/types/absensi';
type __VLS_Props = {
    initialData?: Partial<AbsensiManualForm>;
    submitting?: boolean;
    isEdit?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (data: AbsensiManualForm) => any;
    cancel: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSubmit?: ((data: AbsensiManualForm) => any) | undefined;
    onCancel?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=AbsensiForm.vue.d.ts.map