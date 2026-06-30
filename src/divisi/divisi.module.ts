import { Module } from '@nestjs/common';
import { DivisiService } from './divisi.service';
import { DivisiController } from './divisi.controller';

@Module({
  providers: [DivisiService],
  controllers: [DivisiController],
})
export class DivisiModule {}
