import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { MockAiService } from './mock-ai.service';
import { PetService } from '../pet/pet.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) private readonly convRepo: Repository<Conversation>,
    @InjectRepository(Message) private readonly msgRepo: Repository<Message>,
    private readonly mockAi: MockAiService,
    private readonly petService: PetService,
  ) {}

  async createConversation(petId: number, userId: number): Promise<Conversation> {
    await this.petService.findOne(petId, userId);
    const conv = this.convRepo.create({ petId });
    return this.convRepo.save(conv);
  }

  async getConversations(petId: number, userId: number): Promise<Conversation[]> {
    await this.petService.findOne(petId, userId);
    return this.convRepo.find({ where: { petId }, order: { createdAt: 'DESC' } });
  }

  async sendMessage(conversationId: number, userId: number, content: string): Promise<{ userMsg: Message; aiMsg: Message }> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId }, relations: ['pet'] });
    if (!conv) throw new NotFoundException('对话不存在');
    await this.petService.findOne(conv.petId, userId);

    const userMsg = await this.msgRepo.save(this.msgRepo.create({ conversationId, role: 'user', content }));
    const aiReply = this.mockAi.generateReply(content, conv.pet?.name || '宠物');
    const aiMsg = await this.msgRepo.save(this.msgRepo.create({
      conversationId, role: 'ai', content: aiReply.content, emotionTag: aiReply.emotionTag,
    }));
    return { userMsg, aiMsg };
  }

  async getMessages(conversationId: number, userId: number): Promise<Message[]> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('对话不存在');
    await this.petService.findOne(conv.petId, userId);
    return this.msgRepo.find({ where: { conversationId }, order: { createdAt: 'ASC' } });
  }
}
