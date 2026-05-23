import { prisma } from '../server';
import { MutasiRepository } from '../repositories/mutasi.repository';
import { NotFoundError, ValidationError } from '../utils/AppError';
import type { CreateMutasiInput } from '../validators/mutasi.validator';

export class MutasiService {
  static async getAll(filters?: { search?: string, jenisMutasi?: string }) {
    return MutasiRepository.findAll(filters);
  }

  static async getById(id: number) {
    const mutasi = await MutasiRepository.findById(id);
    if (!mutasi) throw new NotFoundError('Data mutasi tidak ditemukan');
    return mutasi;
  }

  static async getByPegawai(idPegawai: number) {
    return MutasiRepository.findByPegawai(idPegawai);
  }

  static async create(data: CreateMutasiInput, idAdmin: number) {
    const pegawai = await prisma.pegawai.findUnique({
      where: { idPegawai: data.idPegawai }
    });

    if (!pegawai) throw new NotFoundError('Pegawai tidak ditemukan');
    if (pegawai.statusPegawai !== 'aktif') throw new ValidationError('Pegawai tidak aktif');

    const idJabatanLama = pegawai.idJabatan;
    const idDepartemenLama = pegawai.idDepartemen;
    const idDepartemenBaru = data.idDepartemenBaru ?? idDepartemenLama;

    if (idJabatanLama === data.idJabatanBaru && idDepartemenLama === idDepartemenBaru) {
      throw new ValidationError('Jabatan dan Departemen baru tidak boleh sama dengan yang lama');
    }

    const jabatanBaru = await prisma.jabatan.findUnique({ where: { idJabatan: data.idJabatanBaru } });
    if (!jabatanBaru) throw new NotFoundError('Jabatan baru tidak ditemukan');

    if (data.idDepartemenBaru) {
      const depBaru = await prisma.departemen.findUnique({ where: { idDepartemen: data.idDepartemenBaru } });
      if (!depBaru) throw new NotFoundError('Departemen baru tidak ditemukan');
    }

    return prisma.$transaction(async (tx) => {
      // 1. Create Mutasi record
      const mutasi = await tx.mutasi.create({
        data: {
          idPegawai: data.idPegawai,
          idJabatanLama,
          idJabatanBaru: data.idJabatanBaru,
          idDepartemenLama,
          idDepartemenBaru,
          tanggal: new Date(data.tanggal),
          alasan: data.alasan,
          jenisMutasi: data.jenisMutasi,
          idAdmin
        }
      });

      // 2. Update Pegawai record
      await tx.pegawai.update({
        where: { idPegawai: data.idPegawai },
        data: {
          idJabatan: data.idJabatanBaru,
          idDepartemen: idDepartemenBaru
        }
      });

      return mutasi;
    });
  }
}
