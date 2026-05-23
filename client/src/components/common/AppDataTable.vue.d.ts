import type { PaginationMeta } from '@/types/api';
export interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    type?: 'string' | 'number' | 'currency' | 'date' | 'badge';
}
type __VLS_Props = {
    columns: Column[];
    data: any[] | null;
    loading?: boolean;
    pagination?: PaginationMeta | null;
    searchPlaceholder?: string;
    emptyText?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};
declare var __VLS_1: {}, __VLS_4: `cell-${string}`, __VLS_5: {
    row: any;
    value: any;
}, __VLS_7: {
    row: any;
    index: number;
};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_4>]?: (props: typeof __VLS_5) => any;
} & {
    toolbar?: (props: typeof __VLS_1) => any;
} & {
    actions?: (props: typeof __VLS_7) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    sort: (key: string, order: "desc" | "asc") => any;
    search: (query: string) => any;
    "page-change": (page: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSort?: ((key: string, order: "desc" | "asc") => any) | undefined;
    onSearch?: ((query: string) => any) | undefined;
    "onPage-change"?: ((page: number) => any) | undefined;
}>, {
    loading: boolean;
    searchPlaceholder: string;
    emptyText: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=AppDataTable.vue.d.ts.map