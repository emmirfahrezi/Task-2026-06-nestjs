import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Put, Post, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DivisiService } from './divisi.service';
import { CreateDivisiRequest, CreateDivisiValidation } from './dto/create-divisi.dto';
import { UpdateDivisiRequest, UpdateDivisiValidation } from './dto/update-divisi.dto';
import { DivisiResponse } from './dto/divisi-response.dto';
// Ini letak import ZodValidationPipe (Detektor X-Ray kita)
import { ZodValidationPipe } from '../common/zod-validation.pipe';

/**
 * Controller untuk menangani semua rute yang berkaitan dengan entitas Divisi.
 * Berperan sebagai pintu masuk utama untuk operasi CRUD Divisi.
 */
@ApiTags('Divisi')
@Controller('/divisi')
export class DivisiController {
  constructor(private divisiService: DivisiService) {}

  /**
   * Membuat data divisi baru di dalam sistem.
   * Akan divalidasi oleh ZodValidationPipe sebelum diproses.
   * 
   * @param request Data divisi yang akan dibuat
   * @returns Respons berhasil beserta data divisi yang baru dibuat
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Membuat Divisi baru' })
  @ApiResponse({ status: 201, type: DivisiResponse })
  // Ini pemasangan ZodValidationPipe untuk mengecek data Create Divisi sebelum masuk fungsi create
  @UsePipes(new ZodValidationPipe(CreateDivisiValidation))
  async create(@Body() request: CreateDivisiRequest) {
    const result = await this.divisiService.create(request);
    return {
      status: 'success',
      message: 'Berhasil membuat Divisi baru',
      data: result,
    };
  }

  /**
   * Mengambil seluruh daftar divisi yang ada di database.
   * 
   * @returns Respons berhasil beserta array daftar divisi
   */
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengambil semua Divisi' })
  @ApiResponse({ status: 200, type: [DivisiResponse] })
  async list() {
    const result = await this.divisiService.list();
    return {
      status: 'success',
      message: 'Berhasil mengambil daftar Divisi',
      data: result,
    };
  }

  /**
   * Mengambil rincian spesifik dari satu divisi berdasarkan ID.
   * 
   * @param divisiId ID unik divisi
   * @returns Respons berhasil beserta data divisi terkait
   */
  @Get('/:divisiId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengambil satu Divisi berdasarkan ID' })
  @ApiResponse({ status: 200, type: DivisiResponse })
  async get(@Param('divisiId', ParseIntPipe) divisiId: number) {
    const result = await this.divisiService.get(divisiId);
    return {
      status: 'success',
      message: 'Berhasil mengambil data Divisi',
      data: result,
    };
  }

  /**
   * Memperbarui data divisi yang sudah ada.
   * Hanya kolom yang disediakan di request body yang akan diperbarui.
   * 
   * @param divisiId ID unik divisi yang akan diupdate
   * @param request Data pembaruan
   * @returns Respons berhasil beserta data divisi yang telah diupdate
   */
  @Put('/:divisiId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengupdate Divisi' })
  @ApiResponse({ status: 200, type: DivisiResponse })
  // Ini pemasangan ZodValidationPipe untuk mengecek data Update Divisi sebelum masuk fungsi update
  @UsePipes(new ZodValidationPipe(UpdateDivisiValidation))
  async update(
    @Param('divisiId', ParseIntPipe) divisiId: number,
    @Body() request: UpdateDivisiRequest,
  ) {
    const result = await this.divisiService.update(divisiId, request);
    return {
      status: 'success',
      message: 'Berhasil mengupdate Divisi',
      data: result,
    };
  }

  /**
   * Menghapus data divisi dari sistem secara permanen.
   * 
   * @param divisiId ID unik divisi yang akan dihapus
   * @returns Respons berhasil tanpa data
   */
  @Delete('/:divisiId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Menghapus Divisi' })
  async remove(@Param('divisiId', ParseIntPipe) divisiId: number) {
    await this.divisiService.remove(divisiId);
    return {
      status: 'success',
      message: 'Berhasil menghapus Divisi',
    };
  }
}
