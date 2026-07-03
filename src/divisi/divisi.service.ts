import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateDivisiRequest } from './dto/create-divisi.dto';
import { UpdateDivisiRequest } from './dto/update-divisi.dto';
import { DivisiResponse } from './dto/divisi-response.dto';
import { Divisi } from '@prisma/client';
import { NotificationGateway } from '../common/notification.gateway';
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
    // Data yang masuk ke 'request' sudah pasti valid karena sudah melewati ZodValidationPipe di Controller
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
      throw new NotFoundException('Divisi not found');
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
    // Data yang masuk ke 'request' sudah pasti valid karena sudah melewati ZodValidationPipe di Controller
    const divisi = await this.prismaService.divisi.findUnique({
      where: {
        id: divisiId,
      },
    });

    if (!divisi) {
      throw new NotFoundException('Divisi not found');
    }

    const updated = await this.prismaService.divisi.update({
      where: {
        id: divisiId,
      },
      data: {
        name: request.name,
      },
    });

    return this.toDivisiResponse(updated);
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
    });

    if (!divisi) {
      throw new NotFoundException('Divisi not found');
    }

    await this.prismaService.divisi.delete({
      where: {
        id: divisiId,
      },
    });

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
