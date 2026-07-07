import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Put, Post, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserRequest, CreateUserValidation } from './dto/create-user.dto';
import { UpdateUserRequest, UpdateUserValidation } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ResponseMessage } from '../common/decorators/response.decorator';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Membuat User baru' })
  @ApiResponse({ status: 201, type: UserResponse })
  @UsePipes(new ZodValidationPipe(CreateUserValidation))
  @ResponseMessage('Berhasil membuat User baru')
  async create(@Body() request: CreateUserRequest) {
    return await this.userService.create(request);
  }
  
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengambil semua User (Lengkap dengan Divisi-nya)' })
  @ApiResponse({ status: 200, type: [UserResponse] })
  @ResponseMessage('Berhasil mengambil daftar User')
  async list() {
    return await this.userService.list();
  }

  @Get('/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengambil satu User berdasarkan ID' })
  @ApiResponse({ status: 200, type: UserResponse })
  @ResponseMessage('Berhasil mengambil data User')
  async get(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.get(userId);
  }

  @Put('/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mengupdate User' })
  @ApiResponse({ status: 200, type: UserResponse })
  @UsePipes(new ZodValidationPipe(UpdateUserValidation))
  @ResponseMessage('Berhasil mengupdate User')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() request: UpdateUserRequest,
  ) {
    return await this.userService.update(userId, request);
  }

  @Delete('/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Menghapus User' })
  @ResponseMessage('Berhasil menghapus User')
  async remove(@Param('userId', ParseIntPipe) userId: number) {
    await this.userService.remove(userId);
  }
}
