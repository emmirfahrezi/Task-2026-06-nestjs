import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Put, Post, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DivisiService } from './divisi.service';
import { CreateDivisiRequest, CreateDivisiValidation } from './dto/create-divisi.dto';
import { UpdateDivisiRequest, UpdateDivisiValidation } from './dto/update-divisi.dto';
import { DivisiResponse } from './dto/divisi-response.dto';
// Ini letak import ZodValidationPipe (Detektor X-Ray kita)
import { ZodValidationPipe } from '../common/zod-validation.pipe';

@ApiTags('Divisi')
@Controller('/divisi')
export class DivisiController {
  constructor(private divisiService: DivisiService) {}

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
