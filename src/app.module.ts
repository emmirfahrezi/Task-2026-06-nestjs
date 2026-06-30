import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { DivisiModule } from './divisi/divisi.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CommonModule, DivisiModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
