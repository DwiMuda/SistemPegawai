export interface Notifikasi {
    idNotifikasi: number;
    idUser: number;
    judul: string;
    pesan: string;
    tipe: 'info' | 'success' | 'warning' | 'danger';
    isRead: boolean;
    terkaitTabel?: string;
    terkaitId?: number;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=notifikasi.d.ts.map