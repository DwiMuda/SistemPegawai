import type { Pegawai } from './pegawai';

export interface Penggajian {
  idGaji: number;
  idPegawai: number;
  periodeBulan: number;
  periodeTahun: number;
  gajiPokok: number;
  tunjanganJabatan: number;
  tunjanganTransport: number;
  tunjanganMakan: number;
  bonus: number;
  upahLembur: number;
  potonganAbsensi: number;
  potonganBpjs: number;
  potonganPajak: number;
  potonganLain: number;
  totalGaji: number;
  statusBayar: 'pending' | 'dibayar' | 'batal';
  tanggalBayar: string | null;
  idAdmin: number | null;
  keterangan: string | null;
  createdAt: string;
  
  pegawai?: Partial<Pegawai>;
  admin?: { username: string };
}

export interface PenggajianGenerateForm {
  bulan: number;
  tahun: number;
}

export interface PenggajianKomponenForm {
  bonus: number;
  potonganLain: number;
  keterangan: string | null;
}

export interface PenggajianQueryParams {
  bulan?: number;
  tahun?: number;
  idPegawai?: number;
  idDepartemen?: number;
  status?: string;
}
