import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDivisiRequest {
  @ApiProperty({ description: 'Nama divisi yang akan diubah', example: 'Divisi IT Baru', required: false })
  name?: string;
}

export const UpdateDivisiValidation = z.object({
  name: z.string().min(1).max(100).optional(),
});
