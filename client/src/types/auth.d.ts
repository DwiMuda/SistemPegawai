export interface User {
    id: number;
    username: string;
    role: 'admin' | 'pegawai';
    nama: string;
    pegawai?: {
        sisaCuti: number;
        [key: string]: any;
    };
}
export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}
export interface LoginCredentials {
    username: string;
    password?: string;
}
//# sourceMappingURL=auth.d.ts.map