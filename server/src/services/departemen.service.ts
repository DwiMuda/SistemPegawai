import { DepartemenRepository } from '../repositories/departemen.repository';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { prisma } from '../server';

export class DepartemenService {
  static async list(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const { data, total } = await DepartemenRepository.findAll({
      skip,
      limit,
      search,
      sortBy: 'namaDepartemen',
      sortOrder: 'asc',
    });

    return {
      data: data.map((item) => ({
        id: item.idDepartemen,
        namaDepartemen: item.namaDepartemen,
        kodeDepartemen: item.kodeDepartemen,
        kepala: item.kepala
          ? { id: item.kepala.idPegawai, nama: item.kepala.namaLengkap, nip: item.kepala.nip }
          : null,
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
    const departemen = await DepartemenRepository.findById(id);
    if (!departemen) {
      throw new NotFoundError('Departemen tidak ditemukan');
    }

    return {
      id: departemen.idDepartemen,
      namaDepartemen: departemen.namaDepartemen,
      kodeDepartemen: departemen.kodeDepartemen,
      kepala: departemen.kepala
        ? { id: departemen.kepala.idPegawai, nama: departemen.kepala.namaLengkap, nip: departemen.kepala.nip }
        : null,
      jumlahPegawai: departemen._count.pegawai,
      createdAt: departemen.createdAt,
      updatedAt: departemen.updatedAt,
    };
  }

  static async create(data: { namaDepartemen: string; kodeDepartemen: string; idKepala?: number | null }) {
    const existingNama = await DepartemenRepository.findByNama(data.namaDepartemen);
    if (existingNama) {
      throw new ValidationError(`Departemen "${data.namaDepartemen}" sudah terdaftar`);
    }

    const existingKode = await DepartemenRepository.findByKode(data.kodeDepartemen);
    if (existingKode) {
      throw new ValidationError(`Kode departemen "${data.kodeDepartemen}" sudah terdaftar`);
    }

    if (data.idKepala) {
      const pegawai = await prisma.pegawai.findFirst({
        where: { idPegawai: data.idKepala, deletedAt: null },
      });
      if (!pegawai) {
        throw new ValidationError('Kepala departemen tidak ditemukan');
      }
    }

    const departemen = await DepartemenRepository.create({
      namaDepartemen: data.namaDepartemen,
      kodeDepartemen: data.kodeDepartemen,
      kepala: data.idKepala ? { connect: { idPegawai: data.idKepala } } : undefined,
    });

    return {
      id: departemen.idDepartemen,
      namaDepartemen: departemen.namaDepartemen,
      kodeDepartemen: departemen.kodeDepartemen,
    };
  }

  static async update(id: number, data: { namaDepartemen?: string; kodeDepartemen?: string; idKepala?: number | null }) {
    const departemen = await DepartemenRepository.findById(id);
    if (!departemen) {
      throw new NotFoundError('Departemen tidak ditemukan');
    }

    if (data.namaDepartemen && data.namaDepartemen !== departemen.namaDepartemen) {
      const duplicate = await DepartemenRepository.findByNama(data.namaDepartemen);
      if (duplicate) {
        throw new ValidationError(`Departemen "${data.namaDepartemen}" sudah terdaftar`);
      }
    }

    if (data.kodeDepartemen && data.kodeDepartemen !== departemen.kodeDepartemen) {
      const duplicate = await DepartemenRepository.findByKode(data.kodeDepartemen);
      if (duplicate) {
        throw new ValidationError(`Kode departemen "${data.kodeDepartemen}" sudah terdaftar`);
      }
    }

    if (data.idKepala !== undefined && data.idKepala !== null) {
      const pegawai = await prisma.pegawai.findFirst({
        where: { idPegawai: data.idKepala, deletedAt: null },
      });
      if (!pegawai) {
        throw new ValidationError('Kepala departemen tidak ditemukan');
      }
    }

    const updated = await DepartemenRepository.update(id, {
      ...(data.namaDepartemen !== undefined && { namaDepartemen: data.namaDepartemen }),
      ...(data.kodeDepartemen !== undefined && { kodeDepartemen: data.kodeDepartemen }),
      ...(data.idKepala !== undefined && { kepala: data.idKepala ? { connect: { idPegawai: data.idKepala } } : { disconnect: true } }),
    });

    return {
      id: updated.idDepartemen,
      namaDepartemen: updated.namaDepartemen,
      kodeDepartemen: updated.kodeDepartemen,
    };
  }

  static async delete(id: number) {
    const departemen = await DepartemenRepository.findById(id);
    if (!departemen) {
      throw new NotFoundError('Departemen tidak ditemukan');
    }

    const pegawaiCount = await DepartemenRepository.countPegawaiByDepartemen(id);
    if (pegawaiCount > 0) {
      throw new ValidationError(`Tidak dapat menghapus "${departemen.namaDepartemen}" karena masih terdapat ${pegawaiCount} pegawai aktif`);
    }

    await DepartemenRepository.softDelete(id);
  }

  static async getAll() {
    const data = await DepartemenRepository.getAll();
    return data.map((item) => ({
      id: item.idDepartemen,
      namaDepartemen: item.namaDepartemen,
      kodeDepartemen: item.kodeDepartemen,
      kepala: item.kepala
        ? { id: item.kepala.idPegawai, nama: item.kepala.namaLengkap, nip: item.kepala.nip }
        : null,
    }));
  }
}
