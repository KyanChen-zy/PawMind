import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('pets/:petId/conversations')
  createConversation(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }) {
    return this.chatService.createConversation(petId, user.id);
  }

  @Get('pets/:petId/conversations')
  getConversations(@Param('petId', ParseIntPipe) petId: number, @CurrentUser() user: { id: number }) {
    return this.chatService.getConversations(petId, user.id);
  }

  @Post('conversations/:id/messages')
  sendMessage(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }, @Body('content') content: string) {
    return this.chatService.sendMessage(id, user.id, content);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.chatService.getMessages(id, user.id);
  }
}
