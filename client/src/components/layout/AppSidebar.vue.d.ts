interface MenuItem {
    label: string;
    icon: string;
    to?: string;
    children?: {
        label: string;
        to: string;
        icon?: string;
    }[];
}
type __VLS_Props = {
    collapsed: boolean;
    menuItems: MenuItem[];
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    toggle: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onToggle?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=AppSidebar.vue.d.ts.map