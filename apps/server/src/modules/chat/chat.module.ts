import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MockAiService } from './mock-ai.service';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), PetModule],
  controllers: [ChatController],
  providers: [ChatService, MockAiService],
})
export class ChatModule {}
