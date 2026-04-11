import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { MockAiService } from './mock-ai.service';
import { PetService } from '../pet/pet.service';

describe('ChatService', () => {
  let service: ChatService;
  let convRepo: Record<string, jest.Mock>;
  let msgRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    convRepo = {
      create: jest.fn((d) => d), save: jest.fn((d) => ({ id: 1, ...d })),
      find: jest.fn().mockResolvedValue([]), findOne: jest.fn(),
    };
    msgRepo = {
      create: jest.fn((d) => d), save: jest.fn((d) => ({ id: 1, ...d })),
      find: jest.fn().mockResolvedValue([]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService, MockAiService,
        { provide: getRepositoryToken(Conversation), useValue: convRepo },
        { provide: getRepositoryToken(Message), useValue: msgRepo },
        { provide: PetService, useValue: { findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1, name: '毛球' }) } },
      ],
    }).compile();
    service = module.get(ChatService);
  });

  it('应成功创建对话', async () => {
    const result = await service.createConversation(1, 1);
    expect(result.petId).toBe(1);
  });

  it('发送消息应返回用户消息和 AI 回复', async () => {
    convRepo.findOne.mockResolvedValue({ id: 1, petId: 1, pet: { name: '毛球' } });
    const result = await service.sendMessage(1, 1, '你好呀');
    expect(result.userMsg.role).toBe('user');
    expect(result.aiMsg.role).toBe('ai');
    expect(result.aiMsg.emotionTag).toBeDefined();
  });
});
