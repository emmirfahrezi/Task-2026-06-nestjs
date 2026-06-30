import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as zod from 'zod';

// Ini adalah ZodValidationPipe (Detektor X-Ray di pintu masuk Controller)
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  // Menerima schema Zod yang akan digunakan untuk mengecek data
  constructor(private schema: zod.ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // Kalau yang dikirim bukan request body (misal param id di URL), abaikan saja pengecekan Zod
    if (metadata.type !== 'body') {
      return value;
    }

    // Melakukan pengecekan data sesuai schema. Jika salah, otomatis akan melempar ZodError
    const parsedValue = this.schema.parse(value);
    return parsedValue;
  }
}
