import type { LoginCredentials, User } from '@/types/auth';
interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
export declare const useAuthStore: import("pinia").StoreDefinition<"auth", AuthState, {
    isAuthenticated: (state: {
        user: {
            id: number;
            username: string;
            role: "admin" | "pegawai";
            nama: string;
            pegawai?: {
                [x: string]: any;
                sisaCuti: number;
            } | undefined;
        } | null;
        token: string | null;
        loading: boolean;
        error: string | null;
    } & import("pinia").PiniaCustomStateProperties<AuthState>) => boolean;
    isAdmin: (state: {
        user: {
            id: number;
            username: string;
            role: "admin" | "pegawai";
            nama: string;
            pegawai?: {
                [x: string]: any;
                sisaCuti: number;
            } | undefined;
        } | null;
        token: string | null;
        loading: boolean;
        error: string | null;
    } & import("pinia").PiniaCustomStateProperties<AuthState>) => boolean;
    isPegawai: (state: {
        user: {
            id: number;
            username: string;
            role: "admin" | "pegawai";
            nama: string;
            pegawai?: {
                [x: string]: any;
                sisaCuti: number;
            } | undefined;
        } | null;
        token: string | null;
        loading: boolean;
        error: string | null;
    } & import("pinia").PiniaCustomStateProperties<AuthState>) => boolean;
}, {
    login(credentials: LoginCredentials): Promise<boolean>;
    logout(): Promise<void>;
    clearAuth(): void;
    fetchProfile(): Promise<{
        id: number;
        username: string;
        role: "admin" | "pegawai";
        nama: string;
        pegawai?: {
            [x: string]: any;
            sisaCuti: number;
        } | undefined;
    } | null>;
    updateProfile(data: any): Promise<any>;
    changePassword(data: any): Promise<any>;
}>;
export {};
//# sourceMappingURL=auth.store.d.ts.map