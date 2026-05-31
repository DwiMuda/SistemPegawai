import { PegawaiRepository } from '../repositories/pegawai.repository';
import { DepartemenRepository } from '../repositories/departemen.repository';
import { JabatanRepository } from '../repositories/jabatan.repository';
import { NotFoundError, ValidationError } from '../utils/AppError';
import { prisma } from '../server';
import { hashPassword } from '../utils/hash';

export class PegawaiService {
  static async list(params: {
    page: number;
    limit: number;
    search?: string;
    idDepartemen?: number;
    idJabatan?: number;
    statusPegawai?: string;
  }) {
    const { page, limit, search, idDepartemen, idJabatan, statusPegawai } = params;
    const skip = (page - 1) * limit;

    const { data, total } = await PegawaiRepository.findAll({
      skip,
      limit,
      search,
      idDepartemen,
      idJabatan,
      statusPegawai,
      sortBy: 'namaLengkap',
      sortOrder: 'asc',
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const pegawai = await PegawaiRepository.findById(id);
    if (!pegawai) {
      throw new NotFoundError('Pegawai tidak ditemukan');
    }

    return pegawai;
  }

  static async create(data: {
    nip: string;
    namaLengkap: string;
    jenisKelamin: string;
    tanggalLahir: Date;
    tempatLahir: string;
    alamat: string;
    noTelpon?: string;
    email?: string;
    idJabatan: number;
    idDepartemen: number;
    tanggalMasuk: Date;
    statusPegawai?: string;
    foto?: string;
    buatAkun?: boolean;
  }) {
    // Check if NIP already exists
    const existingNip = await PegawaiRepository.findByNip(data.nip);
    if (existingNip) {
      throw new ValidationError(`NIP "${data.nip}" sudah terdaftar`);
    }

    // Check if Email already exists
    if (data.email) {
      const existingEmail = await PegawaiRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new ValidationError(`Email "${data.email}" sudah terdaftar`);
      }
    }

    // Validate Departemen
    const departemen = await DepartemenRepository.findById(data.idDepartemen);
    if (!departemen) {
      throw new ValidationError('Departemen tidak ditemukan');
    }

    // Validate Jabatan
    const jabatan = await JabatanRepository.findById(data.idJabatan);
    if (!jabatan) {
      throw new ValidationError('Jabatan tidak ditemukan');
    }

    return prisma.$transaction(async (tx) => {
      // Create Pegawai
      const pegawai = await tx.pegawai.create({
        data: {
          nip: data.nip,
          namaLengkap: data.namaLengkap,
          jenisKelamin: data.jenisKelamin,
          tanggalLahir: data.tanggalLahir,
          tempatLahir: data.tempatLahir,
          alamat: data.alamat,
          noTelpon: data.noTelpon,
          email: data.email,
          idJabatan: data.idJabatan,
          idDepartemen: data.idDepartemen,
          tanggalMasuk: data.tanggalMasuk,
          statusPegawai: data.statusPegawai || 'aktif',
          foto: data.foto,
        },
      });

      // Optionally Create User Account
      if (data.buatAkun) {
        const username = data.nip;
        // Default password: Sistem123!
        const passwordHash = await hashPassword('Sistem123!');

        await tx.users.create({
          data: {
            username,
            passwordHash,
            role: 'pegawai',
            idPegawai: pegawai.idPegawai,
            isActive: true,
          },
        });
      }

      return pegawai;
    });
  }

  static async update(id: number, data: {
    nip?: string;
    namaLengkap?: string;
    jenisKelamin?: string;
    tanggalLahir?: Date;
    tempatLahir?: string;
    alamat?: string;
    noTelpon?: string;
    email?: string;
    idJabatan?: number;
    idDepartemen?: number;
    tanggalMasuk?: Date;
    statusPegawai?: string;
    foto?: string;
  }) {
    const pegawai = await PegawaiRepository.findById(id);
    if (!pegawai) {
      throw new NotFoundError('Pegawai tidak ditemukan');
    }

    if (data.nip && data.nip !== pegawai.nip) {
      const duplicate = await PegawaiRepository.findByNip(data.nip);
      if (duplicate) {
        throw new ValidationError(`NIP "${data.nip}" sudah terdaftar`);
      }
    }

    if (data.email && data.email !== pegawai.email) {
      const duplicate = await PegawaiRepository.findByEmail(data.email);
      if (duplicate) {
        throw new ValidationError(`Email "${data.email}" sudah terdaftar`);
      }
    }

    if (data.idDepartemen && data.idDepartemen !== pegawai.idDepartemen) {
      const departemen = await DepartemenRepository.findById(data.idDepartemen);
      if (!departemen) {
        throw new ValidationError('Departemen tidak ditemukan');
      }
    }

    if (data.idJabatan && data.idJabatan !== pegawai.idJabatan) {
      const jabatan = await JabatanRepository.findById(data.idJabatan);
      if (!jabatan) {
        throw new ValidationError('Jabatan tidak ditemukan');
      }
    }

    // Clean and transform data for Prisma update
    const { idJabatan, idDepartemen, buatAkun, ...cleanData } = data as any;
    
    const prismaUpdateData: any = {
      ...cleanData,
      ...(idJabatan && { jabatan: { connect: { idJabatan } } }),
      ...(idDepartemen && { departemen: { connect: { idDepartemen } } }),
    };

    const updated = await PegawaiRepository.update(id, prismaUpdateData);
    return updated;
  }

  static async delete(id: number) {
    const pegawai = await PegawaiRepository.findById(id);
    if (!pegawai) {
      throw new NotFoundError('Pegawai tidak ditemukan');
    }

    // Since we use soft delete, we'll mark the user account as inactive as well
    return prisma.$transaction(async (tx) => {
      const deletedPegawai = await tx.pegawai.update({
        where: { idPegawai: id },
        data: { deletedAt: new Date(), statusPegawai: 'nonaktif' },
      });

      // Inactivate associated User
      await tx.users.updateMany({
        where: { idPegawai: id },
        data: { isActive: false },
      });

      return deletedPegawai;
    });
  }

  static async getAll() {
    const data = await PegawaiRepository.getAll();
    return data.map((item) => ({
      id: item.idPegawai,
      nip: item.nip,
      namaLengkap: item.namaLengkap,
      jabatan: item.jabatan.namaJabatan,
      departemen: item.departemen.namaDepartemen,
    }));
  }
}
