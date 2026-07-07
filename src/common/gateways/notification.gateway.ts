import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } }) // Izinkan semua domain terhubung
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  handleConnection(client: Socket) {
    this.logger.info(`Klien terhubung via WebSocket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Klien terputus dari WebSocket: ${client.id}`);
  }

  kirimNotifikasi(tipe: string, pesan: string, data: any) {
    // Memancarkan sinyal (event) bernama 'notifikasiBaru' ke semua klien yang terhubung
    this.server.emit('notifikasiBaru', {
      tipe,
      pesan,
      data,
      waktu: new Date().toISOString(),
    });
    this.logger.info(`Notifikasi di-broadcast: ${pesan}`);
  }
}
