import type { PegawaiForm as PegawaiFormType } from '@/types/pegawai';
type __VLS_Props = {
    initialData?: Partial<PegawaiFormType>;
    submitting?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (data: PegawaiFormType) => any;
    cancel: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSubmit?: ((data: PegawaiFormType) => any) | undefined;
    onCancel?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=PegawaiForm.vue.d.ts.map