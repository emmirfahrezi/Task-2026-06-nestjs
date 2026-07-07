import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDivisiRequest {
  @ApiProperty({ description: 'Nama divisi yang akan dibuat', example: 'Divisi IT' })
  name: string;
}

export const CreateDivisiValidation = z.object({
  name: z.string().min(1, 'Nama divisi tidak boleh kosong').max(100, 'Nama divisi maksimal 100 karakter'),
});
