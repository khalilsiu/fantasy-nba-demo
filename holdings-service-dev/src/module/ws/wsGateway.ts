import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket', 'flashsocket', 'polling'],
  cors: {
    origin: '*',
  },
})
export class WSGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(WSGateway.name);

  @WebSocketServer() private server: Server;
  wsClients: Socket[] = [];
  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }

  handleConnection(client: Socket) {
    this.wsClients.push(client);
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
    this.broadcast('disconnect', {});
  }

  private broadcast(event, message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (const c of this.wsClients) {
      c.send(event, broadCastMessage);
    }
  }

  public sendToRoom(event: string, room: string, message?: any) {
    this.logger.log(`wsGateway send to room ${room}`);
    const broadCastMessage = JSON.stringify(message);
    this.server.to(room).emit(event, broadCastMessage);
  }

  @SubscribeMessage('event')
  onChgEvent(client: Socket, payload: any) {
    this.broadcast('event', payload);
  }

  @SubscribeMessage('join')
  joinRoom(client: Socket, room: string) {
    this.logger.log(`wsGateway join room ${room}`);
    client.join(room);
    return { event: 'RoomJoined' };
  }
}
