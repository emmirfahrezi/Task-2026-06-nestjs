import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      const responseBody: any = exception.getResponse();
      // Mengambil pesan error (Bisa string atau object bawaan NestJS)
      const message = typeof responseBody === 'string' ? responseBody : responseBody.message;

      response.status(exception.getStatus()).json({
        status: 'error',
        message: message || exception.message,
      });
    } else if (exception instanceof ZodError) {
      // Menggabungkan pesan error Zod menjadi kalimat yang rapi
      const validationMessages = exception.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');

      response.status(400).json({
        status: 'error',
        message: `Format data salah -> ${validationMessages}`,
      });
    } else {
      // Jika terjadi error fatal (Database mati, syntax error, dll)
      response.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server internal',
      });
    }
  }
}
