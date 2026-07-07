import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateDivisiRequest } from './dto/create-divisi.dto';
import { UpdateDivisiRequest } from './dto/update-divisi.dto';
import { DivisiResponse } from './dto/divisi-response.dto';
import { Divisi } from '@prisma/client';
import { NotificationGateway } from '../common/gateways/notification.gateway';
// ValidationService sudah tidak dipakai di sini karena sudah dipindah ke Pipe (Controller)

/**
 * Service yang bertanggung jawab atas logika bisnis (Business Logic) 
 * untuk entitas Divisi. Menghubungkan Controller dengan Prisma ORM.
 */
@Injectable()
export class DivisiService {
  constructor(
    private prismaService: PrismaService,
    private notificationGateway: NotificationGateway
  ) {}

  /**
   * Mengubah objek entitas database mentah (Prisma) 
   * menjadi format DTO (Data Transfer Object) yang rapi.
   * 
   * @param divisi Entitas divisi dari database
   * @returns DivisiResponse DTO
   */
  toDivisiResponse(divisi: Divisi): DivisiResponse {
    return {
      id: divisi.id,
      name: divisi.name,
    };
  }

  /**
   * Menyimpan data divisi baru ke database dan memancarkan 
   * notifikasi real-time via WebSocket.
   * 
   * @param request Data divisi baru (sudah divalidasi)
   * @returns DivisiResponse data yang baru disimpan
   */
  async create(request: CreateDivisiRequest): Promise<DivisiResponse> {
    // 1. Validasi apakah nama divisi sudah pernah ada di database
    const existingDivisi = await this.prismaService.divisi.findFirst({
      where: {
        name: request.name,
      },
    });

    if (existingDivisi) {
      throw new BadRequestException('Mohon maaf, Divisi dengan nama tersebut sudah ditambahkan sebelumnya');
    }

    // 2. Data yang masuk ke 'request' sudah pasti valid karena sudah melewati ZodValidationPipe di Controller
    const divisi = await this.prismaService.divisi.create({
      data: {
        name: request.name,
      },
    });

    const response = this.toDivisiResponse(divisi);
    this.notificationGateway.kirimNotifikasi('NEW_DIVISI', 'Divisi baru telah ditambahkan', response);
    
    return response;
  }

  /**
   * Mencari dan mengembalikan satu divisi spesifik berdasarkan ID.
   * Akan melempar NotFoundException jika tidak ditemukan.
   * 
   * @param divisiId ID divisi yang dicari
   * @returns DivisiResponse data divisi yang ditemukan
   */
  async get(divisiId: number): Promise<DivisiResponse> {
    const divisi = await this.prismaService.divisi.findUnique({
      where: {
        id: divisiId,
      },
    });

    if (!divisi) {
      throw new NotFoundException('Id tidak ditemukan');
    }

    return this.toDivisiResponse(divisi);
  }

  /**
   * Melakukan pembaruan (update) terhadap data divisi yang ada.
   * Akan melempar NotFoundException jika divisi tidak ada.
   * 
   * @param divisiId ID divisi yang akan diupdate
   * @param request Data pembaruan
   * @returns DivisiResponse data yang telah diperbarui
   */
  async update(divisiId: number, request: UpdateDivisiRequest): Promise<DivisiResponse> {
    // 1. Cek apakah divisi yang mau diupdate itu ada
    const divisi = await this.prismaService.divisi.findUnique({
      where: {
        id: divisiId,
      },
    });

    if (!divisi) {
      throw new NotFoundException('Id tidak ditemukan');
    }

    // 2. Jika user mengirimkan nama baru, cek apakah nama itu bentrok dengan divisi LAIN
    if (request.name) {
      const existingName = await this.prismaService.divisi.findFirst({
        where: {
          name: request.name,
          id: { not: divisiId }, // Jangan deteksi error jika namanya sama dengan nama dia sendiri saat ini
        },
      });

      if (existingName) {
        throw new BadRequestException('Mohon maaf, nama divisi tersebut sudah digunakan oleh divisi lain');
      }
    }

    // 3. Lakukan update
    const updated = await this.prismaService.divisi.update({
      where: {
        id: divisiId,
      },
      data: {
        name: request.name,
      },
    });

    const response = this.toDivisiResponse(updated);
    this.notificationGateway.kirimNotifikasi('UPDATE_DIVISI', `Divisi ${updated.name} telah diperbarui`, response);

    return response;
  }

  /**
   * Menghapus divisi beserta data yang terkait di dalamnya.
   * Akan melempar NotFoundException jika divisi tidak ditemukan sebelum dihapus.
   * 
   * @param divisiId ID divisi yang akan dihapus
   * @returns true jika berhasil dihapus
   */
  async remove(divisiId: number): Promise<boolean> {
    const divisi = await this.prismaService.divisi.findUnique({
      where: {
        id: divisiId,
      },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!divisi) {
      throw new NotFoundException('Id tidak di temukan');
    }

    // Pastikan tidak ada user yang masih terhubung dengan divisi ini
    if (divisi._count.users > 0) {
      throw new BadRequestException('Tidak bisa menghapus divisi karena masih ada user yang terdaftar di divisi ini');
    }

    await this.prismaService.divisi.delete({
      where: {
        id: divisiId,
      },
    });

    this.notificationGateway.kirimNotifikasi('DELETE_DIVISI', `Divisi ${divisi.name} telah dihapus`, { id: divisiId });

    return true;
  }

  /**
   * Mengambil semua daftar divisi yang terdaftar.
   * 
   * @returns Array dari DivisiResponse
   */
  async list(): Promise<DivisiResponse[]> {
    const divisis = await this.prismaService.divisi.findMany();
    return divisis.map((divisi) => this.toDivisiResponse(divisi));
  }
}
