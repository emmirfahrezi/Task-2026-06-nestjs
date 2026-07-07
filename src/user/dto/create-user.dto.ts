import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty({ description: 'Nama user', example: 'Emmir Fahrezi' })
  name: string;

  @ApiProperty({ description: 'ID divisi tempat user bernaung', example: 1 })
  divisi_id: number;
}

export const CreateUserValidation = z.object({
  name: z.string().min(1, 'Nama user tidak boleh kosong').max(100, 'Nama user maksimal 100 karakter'),
  divisi_id: z.number().int('ID divisi harus berupa bilangan bulat').positive('ID divisi tidak valid'),
});
