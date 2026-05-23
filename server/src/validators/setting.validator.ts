import { z } from 'zod';

export const updateSettingSchema = z.object({
  value: z.string().min(1, 'Value tidak boleh kosong'),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
