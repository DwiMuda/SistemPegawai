import { ref } from 'vue';
const toasts = ref([]);
let idCounter = 0;
export function useNotification() {
    function addToast(toast) {
        const id = `toast-${++idCounter}-${Date.now()}`;
        const newToast = {
            id,
            duration: 5000,
            ...toast,
        };
        toasts.value.push(newToast);
        // Auto dismiss
        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }
        return id;
    }
    function removeToast(id) {
        const index = toasts.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }
    function success(title, message) {
        return addToast({ type: 'success', title, message });
    }
    function error(title, message) {
        return addToast({ type: 'error', title, message, duration: 8000 });
    }
    function warning(title, message) {
        return addToast({ type: 'warning', title, message });
    }
    function info(title, message) {
        return addToast({ type: 'info', title, message });
    }
    function clearAll() {
        toasts.value = [];
    }
    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        clearAll,
    };
}
//# sourceMappingURL=useNotification.js.map