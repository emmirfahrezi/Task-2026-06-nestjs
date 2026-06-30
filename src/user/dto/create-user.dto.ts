import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty({ description: 'Nama user', example: 'Emmir Fahrezi' })
  name: string;
  
  @ApiProperty({ description: 'ID divisi tempat user bernaung', example: 1 })
  divisi_id: number;
}

export const CreateUserValidation = z.object({
  name: z.string().min(1).max(100),
  divisi_id: z.number().int().positive(),
});
