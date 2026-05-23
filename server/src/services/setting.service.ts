import { SettingRepository } from '../repositories/setting.repository';
import { NotFoundError } from '../utils/AppError';

export class SettingService {
  private static cache = new Map<string, string>();

  static async getAll() {
    return SettingRepository.findAll();
  }

  static async getByKey(key: string, defaultValue: string): Promise<string> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const setting = await SettingRepository.findByKey(key);
    if (setting) {
      this.cache.set(key, setting.value);
      return setting.value;
    }

    // Insert default value if not exists, but in read mode we just return default
    return defaultValue;
  }

  static async getNumber(key: string, defaultValue: number): Promise<number> {
    const val = await this.getByKey(key, defaultValue.toString());
    const parsed = Number(val);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  static async update(key: string, value: string) {
    const existing = await SettingRepository.findByKey(key);
    
    if (!existing) {
      throw new NotFoundError(`Setting dengan key '${key}' tidak ditemukan`);
    }

    const result = await SettingRepository.update(key, value);
    // Update cache
    this.cache.set(key, value);
    return result;
  }
}
