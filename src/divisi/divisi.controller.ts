import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Put, Post, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DivisiService } from './divisi.service';
import { CreateDivisiRequest, CreateDivisiValidation } from './dto/create-divisi.dto';
import { UpdateDivisiRequest, UpdateDivisiValidation } from './dto/update-divisi.dto';
import { DivisiResponse } from './dto/divisi-response.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ResponseMessage } from '../common/decorators/response.decorator';

@ApiTags('Divisi')
@Controller('/divisi')
export class DivisiController {
  constructor(private divisiService: DivisiService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Membuat Divisi baru' })
  @ApiResponse({ status: 201, type: DivisiResponse })
  @UsePipes(new ZodValidationPipe(CreateDivisiValidation))
  @ResponseMessage('Berhasil membuat Divisi baru')
  async create(@Body() request: CreateDivisiRequest) {
    return await this.divisiService.create(request);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengambil semua Divisi' })
  @ApiResponse({ status: 200, type: [DivisiResponse] })
  @ResponseMessage('Berhasil mengambil daftar Divisi')
  async list() {
    return await this.divisiService.list();
  }

  @Get('/:divisiId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengambil satu Divisi berdasarkan ID' })
  @ApiResponse({ status: 200, type: DivisiResponse })
  @ResponseMessage('Berhasil mengambil data Divisi')
  async get(@Param('divisiId', ParseIntPipe) divisiId: number) {
    return await this.divisiService.get(divisiId);
  }

  @Put('/:divisiId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengupdate Divisi' })
  @ApiResponse({ status: 200, type: DivisiResponse })
  @UsePipes(new ZodValidationPipe(UpdateDivisiValidation))
  @ResponseMessage('Berhasil mengupdate Divisi')
  async update(
    @Param('divisiId', ParseIntPipe) divisiId: number,
    @Body() request: UpdateDivisiRequest,
  ) {
    return await this.divisiService.update(divisiId, request);
  }

  @Delete('/:divisiId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Menghapus Divisi' })
  @ResponseMessage('Berhasil menghapus Divisi')
  async remove(@Param('divisiId', ParseIntPipe) divisiId: number) {
    await this.divisiService.remove(divisiId);
    // Tidak return apapun; interceptor akan membungkusnya dengan data: undefined
  }
}
