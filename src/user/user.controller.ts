import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Put, Post, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserRequest, CreateUserValidation } from './dto/create-user.dto';
import { UpdateUserRequest, UpdateUserValidation } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
// Ini letak import ZodValidationPipe (Detektor X-Ray kita)
import { ZodValidationPipe } from '../common/zod-validation.pipe';

/**
 * Controller untuk menangani semua rute yang berkaitan dengan entitas User.
 * Berperan sebagai pintu masuk utama untuk operasi CRUD User.
 */
@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Membuat data user baru di dalam sistem.
   * Akan divalidasi oleh ZodValidationPipe sebelum diproses.
   * 
   * @param request Data user yang akan dibuat
   * @returns Respons berhasil beserta data user yang baru dibuat
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Membuat User baru' })
  @ApiResponse({ status: 201, type: UserResponse })
  // Ini pemasangan ZodValidationPipe untuk mengecek data Create User sebelum masuk fungsi create
  @UsePipes(new ZodValidationPipe(CreateUserValidation))
  async create(@Body() request: CreateUserRequest) {
    const result = await this.userService.create(request);
    return {
      status: 'success',
      message: 'Berhasil membuat User baru',
      data: result,
    };
  }

  /**
   * Mengambil seluruh daftar user yang ada di database.
   * Termasuk relasinya dengan entitas Divisi.
   * 
   * @returns Respons berhasil beserta array daftar user
   */
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengambil semua User (Lengkap dengan Divisi-nya)' })
  @ApiResponse({ status: 200, type: [UserResponse] })
  async list() {
    const result = await this.userService.list();
    return {
      status: 'success',
      message: 'Berhasil mengambil daftar User',
      data: result,
    };
  }

  /**
   * Mengambil rincian spesifik dari satu user berdasarkan ID.
   * 
   * @param userId ID unik user
   * @returns Respons berhasil beserta data user terkait
   */
  @Get('/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengambil satu User berdasarkan ID' })
  @ApiResponse({ status: 200, type: UserResponse })
  async get(@Param('userId', ParseIntPipe) userId: number) {
    const result = await this.userService.get(userId);
    return {
      status: 'success',
      message: 'Berhasil mengambil data User',
      data: result,
    };
  }

  /**
   * Memperbarui data user yang sudah ada.
   * Hanya kolom yang disediakan di request body yang akan diperbarui.
   * 
   * @param userId ID unik user yang akan diupdate
   * @param request Data pembaruan
   * @returns Respons berhasil beserta data user yang telah diupdate
   */
  @Put('/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengupdate User' })
  @ApiResponse({ status: 200, type: UserResponse })
  // Ini pemasangan ZodValidationPipe untuk mengecek data Update User sebelum masuk fungsi update
  @UsePipes(new ZodValidationPipe(UpdateUserValidation))
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() request: UpdateUserRequest,
  ) {
    const result = await this.userService.update(userId, request);
    return {
      status: 'success',
      message: 'Berhasil mengupdate User',
      data: result,
    };
  }

  /**
   * Menghapus data user dari sistem secara permanen.
   * 
   * @param userId ID unik user yang akan dihapus
   * @returns Respons berhasil tanpa data
   */
  @Delete('/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Menghapus User' })
  async remove(@Param('userId', ParseIntPipe) userId: number) {
    await this.userService.remove(userId);
    return {
      status: 'success',
      message: 'Berhasil menghapus User',
    };
  }
}
