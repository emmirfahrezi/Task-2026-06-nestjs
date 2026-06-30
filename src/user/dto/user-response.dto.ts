import { ApiProperty } from '@nestjs/swagger';
import { DivisiResponse } from '../../divisi/dto/divisi-response.dto';

export class UserResponse {
  @ApiProperty({ example: 1 })
  id: number;
  
  @ApiProperty({ example: 'Emmir Fahrezi' })
  name: string;
  
  @ApiProperty({ example: 1 })
  divisi_id: number;
  
  @ApiProperty({ type: () => DivisiResponse, required: false })
  divisi?: DivisiResponse;
}
