import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { Divisi, User } from '@prisma/client';
// ValidationService sudah tidak dipakai di sini karena sudah dipindah ke Pipe (Controller)

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
  ) {}

  toUserResponse(user: User & { divisi?: Divisi }): UserResponse {
    return {
      id: user.id,
      name: user.name,
      divisi_id: user.divisi_id,
      ...(user.divisi && {
        divisi: {
          id: user.divisi.id,
          name: user.divisi.name,
        },
      }),
    };
  }

  async create(request: CreateUserRequest): Promise<UserResponse> {
    this.logger.info(`Mulai memproses pembuatan user: ${request.name}`);
    // Data yang masuk ke 'request' sudah pasti valid karena sudah melewati ZodValidationPipe di Controller
    const divisi = await this.prismaService.divisi.findUnique({
      where: {
        id: request.divisi_id,
      },
    });

    if (!divisi) {
      throw new NotFoundException('Divisi not found');
    }

    const user = await this.prismaService.user.create({
      data: {
        name: request.name,
        divisi_id: request.divisi_id,
      },
    });

    return this.toUserResponse(user);
  }

  async get(userId: number): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user);
  }

  async update(userId: number, request: UpdateUserRequest): Promise<UserResponse> {
    // Data yang masuk ke 'request' sudah pasti valid karena sudah melewati ZodValidationPipe di Controller
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (request.divisi_id) {
      const divisi = await this.prismaService.divisi.findUnique({
        where: {
          id: request.divisi_id,
        },
      });

      if (!divisi) {
        throw new NotFoundException('Divisi not found');
      }
    }

    const updated = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        name: request.name,
        divisi_id: request.divisi_id,
      },
    });

    return this.toUserResponse(updated);
  }

  async remove(userId: number): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.user.delete({
      where: {
        id: userId,
      },
    });

    return true;
  }

  async list(): Promise<UserResponse[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        divisi: true,
      },
    });
    return users.map((user) => this.toUserResponse(user));
  }
}
