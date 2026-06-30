import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Put, Post, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserRequest, CreateUserValidation } from './dto/create-user.dto';
import { UpdateUserRequest, UpdateUserValidation } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
// Ini letak import ZodValidationPipe (Detektor X-Ray kita)
import { ZodValidationPipe } from '../common/zod-validation.pipe';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

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
