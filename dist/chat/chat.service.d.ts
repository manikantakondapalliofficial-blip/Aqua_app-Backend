export declare class ChatService {
    getMessages(userId1: string, userId2: string): Promise<any[]>;
    saveMessage(senderId: string, receiverId: string, content: string, imageUrl?: string): Promise<any>;
}
