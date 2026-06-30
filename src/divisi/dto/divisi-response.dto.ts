import { ApiProperty } from '@nestjs/swagger';

export class DivisiResponse {
  @ApiProperty({ example: 1 })
  id: number;
  
  @ApiProperty({ example: 'Divisi IT' })
  name: string;
}
