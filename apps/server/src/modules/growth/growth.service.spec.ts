import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GrowthService } from './growth.service';
import { GrowthRecord } from './growth-record.entity';
import { PetService } from '../pet/pet.service';

describe('GrowthService', () => {
  let service: GrowthService;
  let repo: Record<string, jest.Mock>;
  let petService: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      create: jest.fn((data) => data),
      save: jest.fn((data) => ({ id: 1, ...data })),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };
    petService = {
      findOne: jest.fn().mockResolvedValue({ id: 1, userId: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrowthService,
        { provide: getRepositoryToken(GrowthRecord), useValue: repo },
        { provide: PetService, useValue: petService },
      ],
    }).compile();

    service = module.get(GrowthService);
  });

  describe('create', () => {
    it('应成功创建成长记录', async () => {
      const dto = {
        contentType: 'text',
        description: '今天第一次学会握手',
        tags: ['里程碑'],
      };
      const result = await service.create(1, 1, dto);
      expect(result.contentType).toBe('text');
      expect(result.description).toBe('今天第一次学会握手');
      expect(petService.findOne).toHaveBeenCalledWith(1, 1);
      expect(repo.save).toHaveBeenCalled();
    });

    it('应验证宠物归属后再创建', async () => {
      const dto = { contentType: 'photo', mediaUrl: 'https://example.com/photo.jpg' };
      await service.create(2, 1, dto);
      expect(petService.findOne).toHaveBeenCalledWith(2, 1);
    });
  });

  describe('findByPet', () => {
    it('应返回指定宠物的所有成长记录（按时间倒序）', async () => {
      const records = [
        { id: 2, petId: 1, description: '记录2', createdAt: new Date() },
        { id: 1, petId: 1, description: '记录1', createdAt: new Date() },
      ];
      repo.find.mockResolvedValue(records);
      const result = await service.findByPet(1, 1);
      expect(result).toHaveLength(2);
      expect(petService.findOne).toHaveBeenCalledWith(1, 1);
      expect(repo.find).toHaveBeenCalledWith({
        where: { petId: 1 },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('remove', () => {
    it('应成功删除成长记录', async () => {
      const record = { id: 1, petId: 1 };
      repo.findOne.mockResolvedValue(record);
      await service.remove(1, 1);
      expect(petService.findOne).toHaveBeenCalledWith(1, 1);
      expect(repo.remove).toHaveBeenCalledWith(record);
    });

    it('记录不存在时应静默返回', async () => {
      repo.findOne.mockResolvedValue(null);
      await service.remove(999, 1);
      expect(petService.findOne).not.toHaveBeenCalled();
      expect(repo.remove).not.toHaveBeenCalled();
    });
  });
});
