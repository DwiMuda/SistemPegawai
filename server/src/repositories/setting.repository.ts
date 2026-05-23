import { prisma } from '../server';

export class SettingRepository {
  static async findAll() {
    return prisma.setting.findMany({
      orderBy: { key: 'asc' }
    });
  }

  static async findByKey(key: string) {
    return prisma.setting.findUnique({
      where: { key }
    });
  }

  static async update(key: string, value: string) {
    return prisma.setting.update({
      where: { key },
      data: { value }
    });
  }

  // Optional: create if not exist (seed equivalent)
  static async upsert(key: string, value: string, deskripsi: string) {
    return prisma.setting.upsert({
      where: { key },
      update: { value, deskripsi },
      create: { key, value, deskripsi }
    });
  }
}
