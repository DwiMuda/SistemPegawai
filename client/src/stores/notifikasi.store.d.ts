import type { Notifikasi } from '@/types/notifikasi';
export declare const useNotifikasiStore: import("pinia").StoreDefinition<"notifikasi", Pick<{
    notifications: import("vue").Ref<{
        idNotifikasi: number;
        idUser: number;
        judul: string;
        pesan: string;
        tipe: "info" | "success" | "warning" | "danger";
        isRead: boolean;
        terkaitTabel?: string | undefined;
        terkaitId?: number | undefined;
        createdAt: string;
        updatedAt: string;
    }[], Notifikasi[] | {
        idNotifikasi: number;
        idUser: number;
        judul: string;
        pesan: string;
        tipe: "info" | "success" | "warning" | "danger";
        isRead: boolean;
        terkaitTabel?: string | undefined;
        terkaitId?: number | undefined;
        createdAt: string;
        updatedAt: string;
    }[]>;
    unreadCount: import("vue").Ref<number, number>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
    getUnreadCount: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}, "error" | "notifications" | "unreadCount" | "isLoading">, Pick<{
    notifications: import("vue").Ref<{
        idNotifikasi: number;
        idUser: number;
        judul: string;
        pesan: string;
        tipe: "info" | "success" | "warning" | "danger";
        isRead: boolean;
        terkaitTabel?: string | undefined;
        terkaitId?: number | undefined;
        createdAt: string;
        updatedAt: string;
    }[], Notifikasi[] | {
        idNotifikasi: number;
        idUser: number;
        judul: string;
        pesan: string;
        tipe: "info" | "success" | "warning" | "danger";
        isRead: boolean;
        terkaitTabel?: string | undefined;
        terkaitId?: number | undefined;
        createdAt: string;
        updatedAt: string;
    }[]>;
    unreadCount: import("vue").Ref<number, number>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
    getUnreadCount: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}, never>, Pick<{
    notifications: import("vue").Ref<{
        idNotifikasi: number;
        idUser: number;
        judul: string;
        pesan: string;
        tipe: "info" | "success" | "warning" | "danger";
        isRead: boolean;
        terkaitTabel?: string | undefined;
        terkaitId?: number | undefined;
        createdAt: string;
        updatedAt: string;
    }[], Notifikasi[] | {
        idNotifikasi: number;
        idUser: number;
        judul: string;
        pesan: string;
        tipe: "info" | "success" | "warning" | "danger";
        isRead: boolean;
        terkaitTabel?: string | undefined;
        terkaitId?: number | undefined;
        createdAt: string;
        updatedAt: string;
    }[]>;
    unreadCount: import("vue").Ref<number, number>;
    isLoading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
    getUnreadCount: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}, "markAsRead" | "markAllAsRead" | "fetchNotifications" | "getUnreadCount">>;
//# sourceMappingURL=notifikasi.store.d.ts.map