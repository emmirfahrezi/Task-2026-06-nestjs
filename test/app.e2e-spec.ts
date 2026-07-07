import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Divisi API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });


  it('GET /divisi (Seharusnya mereturn array Divisi dan status 200)', async () => {
    const response = await request(app.getHttpServer())
      .get('/divisi') // Nembak ke endpoint /divisi
      .expect(200);   // Memastikan balasan statusnya 200 OK

    // Memastikan format JSON yang kembali sesuai dengan buatan TransformInterceptor
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Berhasil mengambil daftar Divisi');
    expect(Array.isArray(response.body.data)).toBe(true); // Memastikan 'data' adalah Array
  });
});
