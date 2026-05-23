import { JabatanRepository } from '../repositories/jabatan.repository';
import { NotFoundError, ValidationError } from '../utils/AppError';

export class JabatanService {
  static async list(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const { data, total } = await JabatanRepository.findAll({
      skip,
      limit,
      search,
      sortBy: 'namaJabatan',
      sortOrder: 'asc',
    });

    return {
      data: data.map((item) => ({
        id: item.idJabatan,
        namaJabatan: item.namaJabatan,
        deskripsi: item.deskripsi,
        gajiPokokDefault: item.gajiPokokDefault,
        tunjanganDefault: item.tunjanganDefault,
        jumlahPegawai: item._count.pegawai,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const jabatan = await JabatanRepository.findById(id);
    if (!jabatan) {
      throw new NotFoundError('Jabatan tidak ditemukan');
    }

    return {
      id: jabatan.idJabatan,
      namaJabatan: jabatan.namaJabatan,
      deskripsi: jabatan.deskripsi,
      gajiPokokDefault: jabatan.gajiPokokDefault,
      tunjanganDefault: jabatan.tunjanganDefault,
      jumlahPegawai: jabatan._count.pegawai,
      createdAt: jabatan.createdAt,
      updatedAt: jabatan.updatedAt,
    };
  }

  static async create(data: { namaJabatan: string; deskripsi?: string; gajiPokokDefault: number; tunjanganDefault?: number }) {
    const existing = await JabatanRepository.findByNama(data.namaJabatan);
    if (existing) {
      throw new ValidationError(`Jabatan "${data.namaJabatan}" sudah terdaftar`);
    }

    const jabatan = await JabatanRepository.create({
      namaJabatan: data.namaJabatan,
      deskripsi: data.deskripsi || null,
      gajiPokokDefault: data.gajiPokokDefault,
      tunjanganDefault: data.tunjanganDefault ?? 0,
    });

    return {
      id: jabatan.idJabatan,
      namaJabatan: jabatan.namaJabatan,
      deskripsi: jabatan.deskripsi,
      gajiPokokDefault: jabatan.gajiPokokDefault,
      tunjanganDefault: jabatan.tunjanganDefault,
    };
  }

  static async update(id: number, data: { namaJabatan?: string; deskripsi?: string; gajiPokokDefault?: number; tunjanganDefault?: number }) {
    const jabatan = await JabatanRepository.findById(id);
    if (!jabatan) {
      throw new NotFoundError('Jabatan tidak ditemukan');
    }

    if (data.namaJabatan && data.namaJabatan !== jabatan.namaJabatan) {
      const duplicate = await JabatanRepository.findByNama(data.namaJabatan);
      if (duplicate) {
        throw new ValidationError(`Jabatan "${data.namaJabatan}" sudah terdaftar`);
      }
    }

    const updated = await JabatanRepository.update(id, {
      ...(data.namaJabatan !== undefined && { namaJabatan: data.namaJabatan }),
      ...(data.deskripsi !== undefined && { deskripsi: data.deskripsi || null }),
      ...(data.gajiPokokDefault !== undefined && { gajiPokokDefault: data.gajiPokokDefault }),
      ...(data.tunjanganDefault !== undefined && { tunjanganDefault: data.tunjanganDefault }),
    });

    return {
      id: updated.idJabatan,
      namaJabatan: updated.namaJabatan,
      deskripsi: updated.deskripsi,
      gajiPokokDefault: updated.gajiPokokDefault,
      tunjanganDefault: updated.tunjanganDefault,
    };
  }

  static async delete(id: number) {
    const jabatan = await JabatanRepository.findById(id);
    if (!jabatan) {
      throw new NotFoundError('Jabatan tidak ditemukan');
    }

    const pegawaiCount = await JabatanRepository.countPegawaiByJabatan(id);
    if (pegawaiCount > 0) {
      throw new ValidationError(`Tidak dapat menghapus jabatan "${jabatan.namaJabatan}" karena masih terdapat ${pegawaiCount} pegawai aktif`);
    }

    await JabatanRepository.softDelete(id);
  }

  static async getAll() {
    const data = await JabatanRepository.getAll();
    return data.map((item) => ({
      id: item.idJabatan,
      namaJabatan: item.namaJabatan,
      gajiPokokDefault: item.gajiPokokDefault,
      tunjanganDefault: item.tunjanganDefault,
    }));
  }
}
