import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '../decorators/response.decorator';

export interface Response<T> {
  status: string;
  message: string;
  data?: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const responseMessage =
      this.reflector.get<string>(
        RESPONSE_MESSAGE,
        context.getHandler(),
      ) || 'Berhasil memproses permintaan';

    return next.handle().pipe(
      map((data) => {
        const response: any = {
          status: 'success',
          message: responseMessage,
        };

        if (data !== undefined && data !== null) {
          response.data = data;
        }

        return response;
      }),
    );
  }
}
