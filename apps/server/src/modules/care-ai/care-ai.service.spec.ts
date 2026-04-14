import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CareAiService } from './care-ai.service';
import { CareAiSession } from './care-ai-session.entity';
import { CareAiMessage } from './care-ai-message.entity';
import { DailyTip } from './daily-tip.entity';
import { DiagnosisReport } from './diagnosis-report.entity';
import { PetService } from '../pet/pet.service';

const mockPet = { id: 1, userId: 1 };

function makeRepo(overrides: Record<string, jest.Mock> = {}) {
  return {
    create: jest.fn((d) => d),
    save: jest.fn((d) => Promise.resolve({ id: 1, ...d })),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    ...overrides,
  };
}

describe('CareAiService', () => {
  let service: CareAiService;
  let sessionRepo: ReturnType<typeof makeRepo>;
  let messageRepo: ReturnType<typeof makeRepo>;
  let tipRepo: ReturnType<typeof makeRepo>;
  let diagnosisRepo: ReturnType<typeof makeRepo>;
  let petService: { findOne: jest.Mock };

  beforeEach(async () => {
    sessionRepo = makeRepo();
    messageRepo = makeRepo();
    tipRepo = makeRepo();
    diagnosisRepo = makeRepo();
    petService = { findOne: jest.fn().mockResolvedValue(mockPet) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CareAiService,
        { provide: getRepositoryToken(CareAiSession), useValue: sessionRepo },
        { provide: getRepositoryToken(CareAiMessage), useValue: messageRepo },
        { provide: getRepositoryToken(DailyTip), useValue: tipRepo },
        { provide: getRepositoryToken(DiagnosisReport), useValue: diagnosisRepo },
        { provide: PetService, useValue: petService },
      ],
    }).compile();

    service = module.get(CareAiService);
  });

  describe('createSession', () => {
    it('应成功创建会话', async () => {
      const result = await service.createSession(1, 1);
      expect(petService.findOne).toHaveBeenCalledWith(1, 1);
      expect(sessionRepo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('petId', 1);
    });
  });

  describe('sendMessage', () => {
    it('应返回 userMsg 和 aiMsg，且 aiMsg 内容匹配关键词', async () => {
      sessionRepo.findOne.mockResolvedValue({ id: 1, petId: 1 });
      let callCount = 0;
      messageRepo.save.mockImplementation((d) => {
        callCount++;
        return Promise.resolve({ id: callCount, ...d });
      });

      const result = await service.sendMessage(1, 1, '我的猫一直在呕吐怎么办');
      expect(result).toHaveProperty('userMsg');
      expect(result).toHaveProperty('aiMsg');
      expect(result.userMsg.role).toBe('user');
      expect(result.aiMsg.role).toBe('assistant');
      // 关键词"呕吐"应匹配到具体答案，而非默认回复
      expect(result.aiMsg.content).not.toContain('还在学习中');
      expect(result.aiMsg.content).toContain('呕吐');
    });

    it('会话不存在时应抛出 NotFoundException', async () => {
      sessionRepo.findOne.mockResolvedValue(null);
      await expect(service.sendMessage(999, 1, '测试')).rejects.toThrow('会话不存在');
    });
  });

  describe('getDailyTip', () => {
    it('存在今日 tip 时应返回今日 tip', async () => {
      const today = new Date().toISOString().split('T')[0];
      const mockTip = { id: 1, title: '今日喂食建议', publishDate: today, isActive: true };
      tipRepo.findOne.mockResolvedValue(mockTip);

      const result = await service.getDailyTip();
      expect(result).toEqual(mockTip);
    });

    it('无今日 tip 时应返回最新活跃 tip', async () => {
      const latestTip = { id: 2, title: '最新建议', isActive: true };
      tipRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(latestTip);

      const result = await service.getDailyTip();
      expect(result).toEqual(latestTip);
      expect(tipRepo.findOne).toHaveBeenCalledTimes(2);
    });
  });
});
