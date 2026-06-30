import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // Setup Swagger OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Urbansolv API')
    .setDescription('Dokumentasi API Urbansolv Task')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Ini untuk menghasilkan file JSON murni di path http://localhost:3000/api-json
  SwaggerModule.setup('api', app, document, { jsonDocumentUrl: 'api-json' });

  // Membuat endpoint kustom untuk merender antarmuka Stoplight Elements
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/docs', (req, res) => {
    (res as any).type('text/html').send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <title>API Docs (Stoplight)</title>
          <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
          <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
        </head>
        <body style="height: 100vh; margin: 0">
          <elements-api
            apiDescriptionUrl="/api-json"
            router="hash"
            layout="sidebar"
          />
        </body>
      </html>
    `);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
