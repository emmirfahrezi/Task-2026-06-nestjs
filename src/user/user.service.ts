import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { Divisi, User } from '@prisma/client';
import { NotificationGateway } from '../common/notification.gateway';
// ValidationService sudah tidak dipakai di sini karena sudah dipindah ke Pipe (Controller)

/**
 * Service yang bertanggung jawab atas logika bisnis (Business Logic) 
 * untuk entitas User. Menghubungkan Controller dengan Prisma ORM 
 * dan mengirim notifikasi via WebSocket.
 */
@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private notificationGateway: NotificationGateway
  ) {}

  /**
   * Mengubah objek entitas database mentah (Prisma) 
   * menjadi format DTO (Data Transfer Object) yang rapi.
   * 
   * @param user Entitas user dari database (termasuk relasi Divisi)
   * @returns UserResponse DTO
   */
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

  /**
   * Menyimpan data user baru ke database, memastikan divisi-nya ada,
   * dan memancarkan notifikasi real-time via WebSocket.
   * 
   * @param request Data user baru (sudah divalidasi)
   * @returns UserResponse data yang baru disimpan
   */
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

    const response = this.toUserResponse(user);
    this.notificationGateway.kirimNotifikasi('NEW_USER', 'User baru telah bergabung', response);
    
    return response;
  }

  /**
   * Mencari dan mengembalikan satu user spesifik berdasarkan ID.
   * Akan melempar NotFoundException jika tidak ditemukan.
   * 
   * @param userId ID user yang dicari
   * @returns UserResponse data user yang ditemukan
   */
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

  /**
   * Melakukan pembaruan (update) terhadap data user yang ada.
   * Memastikan user dan divisi tujuan (jika diubah) benar-benar ada.
   * 
   * @param userId ID user yang akan diupdate
   * @param request Data pembaruan
   * @returns UserResponse data yang telah diperbarui
   */
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

  /**
   * Menghapus user beserta data yang terkait di dalamnya.
   * Akan melempar NotFoundException jika user tidak ditemukan sebelum dihapus.
   * 
   * @param userId ID user yang akan dihapus
   * @returns true jika berhasil dihapus
   */
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

  /**
   * Mengambil semua daftar user yang terdaftar beserta data 
   * divisi tempat mereka bernaung.
   * 
   * @returns Array dari UserResponse
   */
  async list(): Promise<UserResponse[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        divisi: true,
      },
    });
    return users.map((user) => this.toUserResponse(user));
  }
}
