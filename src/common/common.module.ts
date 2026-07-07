import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ValidationService } from './services/validation.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorFilter } from './filters/error.filter';
import { NotificationGateway } from './gateways/notification.gateway';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    NotificationGateway,
  ],
  exports: [PrismaService, ValidationService, NotificationGateway],
})
export class CommonModule { }
