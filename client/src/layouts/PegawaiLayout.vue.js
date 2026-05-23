import { ref } from 'vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppNavbar from '@/components/layout/AppNavbar.vue';
const sidebarCollapsed = ref(false);
const pegawaiMenuItems = [
    {
        label: 'Dashboard',
        icon: 'dashboard',
        to: '/pegawai/dashboard',
    },
    {
        label: 'Absensi',
        icon: 'clock',
        to: '/pegawai/absensi',
    },
    {
        label: 'Cuti',
        icon: 'calendar-days',
        to: '/pegawai/cuti',
    },
    {
        label: 'Lembur',
        icon: 'clock',
        to: '/pegawai/lembur',
    },
    {
        label: 'Slip Gaji',
        icon: 'banknotes',
        to: '/pegawai/slip-gaji',
    },
    {
        label: 'Profil',
        icon: 'user',
        to: '/pegawai/profile',
    },
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-h-screen bg-surface-50 dark:bg-surface-950" },
});
/** @type {[typeof AppSidebar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AppSidebar, new AppSidebar({
    ...{ 'onToggle': {} },
    collapsed: (__VLS_ctx.sidebarCollapsed),
    menuItems: (__VLS_ctx.pegawaiMenuItems),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onToggle': {} },
    collapsed: (__VLS_ctx.sidebarCollapsed),
    menuItems: (__VLS_ctx.pegawaiMenuItems),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onToggle: (...[$event]) => {
        __VLS_ctx.sidebarCollapsed = !__VLS_ctx.sidebarCollapsed;
    }
};
var __VLS_2;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "transition-all duration-300" },
    ...{ class: (__VLS_ctx.sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]') },
});
/** @type {[typeof AppNavbar, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(AppNavbar, new AppNavbar({
    ...{ 'onToggleSidebar': {} },
}));
const __VLS_8 = __VLS_7({
    ...{ 'onToggleSidebar': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_10;
let __VLS_11;
let __VLS_12;
const __VLS_13 = {
    onToggleSidebar: (...[$event]) => {
        __VLS_ctx.sidebarCollapsed = !__VLS_ctx.sidebarCollapsed;
    }
};
var __VLS_9;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "p-4 lg:p-6 mt-16" },
});
const __VLS_14 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
{
    const { default: __VLS_thisSlot } = __VLS_17.slots;
    const [{ Component }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_18 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        enterActiveClass: "transition-all duration-300 ease-out",
        enterFromClass: "opacity-0 translate-y-2",
        enterToClass: "opacity-100 translate-y-0",
        leaveActiveClass: "transition-all duration-200 ease-in",
        leaveFromClass: "opacity-100",
        leaveToClass: "opacity-0",
        mode: "out-in",
    }));
    const __VLS_20 = __VLS_19({
        enterActiveClass: "transition-all duration-300 ease-out",
        enterFromClass: "opacity-0 translate-y-2",
        enterToClass: "opacity-100 translate-y-0",
        leaveActiveClass: "transition-all duration-200 ease-in",
        leaveFromClass: "opacity-100",
        leaveToClass: "opacity-0",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_21.slots.default;
    const __VLS_22 = ((Component));
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    var __VLS_21;
    __VLS_17.slots['' /* empty slot name completion */];
}
var __VLS_17;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-surface-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-surface-950']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            AppSidebar: AppSidebar,
            AppNavbar: AppNavbar,
            sidebarCollapsed: sidebarCollapsed,
            pegawaiMenuItems: pegawaiMenuItems,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PegawaiLayout.vue.js.map