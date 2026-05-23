import { Pegawai } from './pegawai';

export interface Lembur {
  idLembur: number;
  idPegawai: number;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  totalJam: number;
  tarifPerJam: number;
  totalUpah: number;
  status: 'pending' | 'disetujui' | 'ditolak';
  idAdmin?: number | null;
  keterangan?: string | null;
  createdAt: string;

  pegawai?: Pegawai;
  admin?: { username: string };
}

export interface AjukanLemburPayload {
  tanggal: string; // YYYY-MM-DD
  jamMulai: string; // HH:mm
  jamSelesai: string; // HH:mm
  keterangan: string;
}

export interface ApproveLemburPayload {
  status: 'disetujui' | 'ditolak';
  tarifPerJam?: number;
  keterangan?: string;
}

export interface LemburQueryOptions {
  status?: string;
  idPegawai?: number;
  bulan?: number;
  tahun?: number;
}
