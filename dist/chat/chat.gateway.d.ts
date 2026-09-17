import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ConfigService } from '@nestjs/config';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly configService;
    server: Server;
    constructor(chatService: ChatService, configService: ConfigService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSendMessage(client: Socket, payload: {
        receiverId: string;
        content: string;
        imageUrl?: string;
        senderId: string;
    }): Promise<void>;
}
