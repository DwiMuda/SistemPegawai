export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    undoAction?: () => void;
}
export declare function useNotification(): {
    toasts: import("vue").Ref<{
        id: string;
        type: "success" | "error" | "warning" | "info";
        title: string;
        message?: string | undefined;
        duration?: number | undefined;
        undoAction?: (() => void) | undefined;
    }[], Toast[] | {
        id: string;
        type: "success" | "error" | "warning" | "info";
        title: string;
        message?: string | undefined;
        duration?: number | undefined;
        undoAction?: (() => void) | undefined;
    }[]>;
    addToast: (toast: Omit<Toast, "id">) => string;
    removeToast: (id: string) => void;
    success: (title: string, message?: string) => string;
    error: (title: string, message?: string) => string;
    warning: (title: string, message?: string) => string;
    info: (title: string, message?: string) => string;
    clearAll: () => void;
};
//# sourceMappingURL=useNotification.d.ts.map