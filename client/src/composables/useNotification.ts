import { ref, reactive } from 'vue';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  undoAction?: () => void;
}

const toasts = ref<Toast[]>([]);

let idCounter = 0;

export function useNotification() {
  function addToast(toast: Omit<Toast, 'id'>) {
    const id = `toast-${++idCounter}-${Date.now()}`;
    const newToast: Toast = {
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

  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }

  function success(title: string, message?: string) {
    return addToast({ type: 'success', title, message });
  }

  function error(title: string, message?: string) {
    return addToast({ type: 'error', title, message, duration: 8000 });
  }

  function warning(title: string, message?: string) {
    return addToast({ type: 'warning', title, message });
  }

  function info(title: string, message?: string) {
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
