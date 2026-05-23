import type { PenggajianKomponenForm, Penggajian } from '@/types/penggajian';
type __VLS_Props = {
    initialData?: Penggajian | null;
    submitting?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    submit: (data: PenggajianKomponenForm) => any;
    cancel: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSubmit?: ((data: PenggajianKomponenForm) => any) | undefined;
    onCancel?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=PenggajianForm.vue.d.ts.map