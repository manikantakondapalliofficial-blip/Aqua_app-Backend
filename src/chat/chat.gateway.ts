import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract JWT token from auth or headers
      const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      // Verify token
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      const userId = decoded.sub; // sub is the user id
      
      // Join a room with the user's ID
      client.join(userId);
      console.log(`User ${userId} connected and joined room ${userId}`);
    } catch (e) {
      console.error('Socket connection auth error:', e);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string; content: string; imageUrl?: string; senderId: string },
  ) {
    try {
      const { receiverId, content, imageUrl, senderId } = payload;
      
      // Save message to Supabase
      const message = await this.chatService.saveMessage(senderId, receiverId, content, imageUrl);

      // Emit the message to both sender and receiver rooms so their UI can update
      this.server.to(senderId).emit('newMessage', message);
      this.server.to(receiverId).emit('newMessage', message);
      
    } catch (e) {
      console.error('Error handling send message:', e);
      client.emit('error', 'Failed to send message');
    }
  }
}
