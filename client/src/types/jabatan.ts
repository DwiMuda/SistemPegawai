export interface Jabatan {
  id: number;
  namaJabatan: string;
  deskripsi: string | null;
  gajiPokokDefault: number;
  tunjanganDefault: number;
  jumlahPegawai?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface JabatanForm {
  namaJabatan: string;
  deskripsi?: string;
  gajiPokokDefault: number;
  tunjanganDefault?: number;
}

export interface JabatanListParams {
  page?: number;
  limit?: number;
  search?: string;
}
