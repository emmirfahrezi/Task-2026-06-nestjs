import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateDivisiRequest } from './dto/create-divisi.dto';
import { UpdateDivisiRequest } from './dto/update-divisi.dto';
import { DivisiResponse } from './dto/divisi-response.dto';
import { Divisi } from '@prisma/client';
// ValidationService sudah tidak dipakai di sini karena sudah dipindah ke Pipe (Controller)

@Injectable()
export class DivisiService {
  constructor(private prismaService: PrismaService) {}

  toDivisiResponse(divisi: Divisi): DivisiResponse {
    return {
      id: divisi.id,
      name: divisi.name,
    };
  }

  async create(request: CreateDivisiRequest): Promise<DivisiResponse> {
    // Data yang masuk ke 'request' sudah pasti valid karena sudah melewati ZodValidationPipe di Controller
    const divisi = await this.prismaService.divisi.create({
      data: {
        name: request.name,
      },
    });

    return this.toDivisiResponse(divisi);
  }

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

  async list(): Promise<DivisiResponse[]> {
    const divisis = await this.prismaService.divisi.findMany();
    return divisis.map((divisi) => this.toDivisiResponse(divisi));
  }
}
