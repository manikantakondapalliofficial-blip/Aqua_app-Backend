import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:userId')
  async getMessages(@Request() req: any, @Param('userId') otherUserId: string) {
    const currentUserId = req.user.sub;
    return this.chatService.getMessages(currentUserId, otherUserId);
  }
}
