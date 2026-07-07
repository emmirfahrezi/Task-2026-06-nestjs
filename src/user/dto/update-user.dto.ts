import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRequest {
  @ApiProperty({ description: 'Nama user yang akan diubah', example: 'Emmir Pro', required: false })
  name?: string;
  
  @ApiProperty({ description: 'ID divisi baru untuk user', example: 2, required: false })
  divisi_id?: number;
}

export const UpdateUserValidation = z.object({
  name: z.string().min(1, 'Nama user tidak boleh kosong').max(100, 'Nama user maksimal 100 karakter').optional(),
  divisi_id: z.number().int('ID divisi harus berupa bilangan bulat').positive('ID divisi tidak valid').optional(),
});
