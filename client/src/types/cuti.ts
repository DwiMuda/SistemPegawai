import type { Pegawai } from './pegawai';

export interface PengajuanCuti {
  idCuti: number;
  idPegawai: number;
  jenisCuti: 'tahunan' | 'sakit' | 'melahirkan' | 'lainnya';
  tanggalMulai: string;
  tanggalSelesai: string;
  jumlahHari: number;
  alasan: string;
  status: 'pending' | 'disetujui' | 'ditolak';
  idAdmin: number | null;
  catatanAdmin: string | null;
  createdAt: string;
  
  // Relations
  pegawai?: Partial<Pegawai>;
  admin?: { username: string };
}

export interface CutiForm {
  jenisCuti: 'tahunan' | 'sakit' | 'melahirkan' | 'lainnya';
  tanggalMulai: string; // YYYY-MM-DD
  tanggalSelesai: string; // YYYY-MM-DD
  jumlahHari: number;
  alasan: string;
}

export interface CutiApproveForm {
  status: 'disetujui' | 'ditolak';
  catatanAdmin?: string;
}

export interface CutiQueryParams {
  status?: 'pending' | 'disetujui' | 'ditolak' | '';
  idPegawai?: number;
  bulan?: number;
  tahun?: number;
}
