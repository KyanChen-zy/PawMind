import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PetService } from './pet.service';
import { Pet } from './pet.entity';

describe('PetService', () => {
  let service: PetService;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      create: jest.fn((data) => data),
      save: jest.fn((data) => ({ id: 1, ...data })),
      find: jest.fn(),
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetService,
        { provide: getRepositoryToken(Pet), useValue: repo },
      ],
    }).compile();
    service = module.get(PetService);
  });

  it('应成功创建宠物', async () => {
    const dto = { name: '毛球', species: 'cat', breed: '英短', birthday: '2024-01-01', gender: 'male', weight: 4.5 };
    const result = await service.create(1, dto);
    expect(result.name).toBe('毛球');
    expect(repo.save).toHaveBeenCalled();
  });

  it('应返回用户所有活跃宠物', async () => {
    repo.find.mockResolvedValue([{ id: 1, name: '毛球' }]);
    const result = await service.findAllByUser(1);
    expect(result).toHaveLength(1);
  });

  it('宠物不存在时应抛出 NotFoundException', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
  });

  it('非宠物主人访问时应抛出 ForbiddenException', async () => {
    repo.findOne.mockResolvedValue({ id: 1, userId: 2 });
    await expect(service.findOne(1, 1)).rejects.toThrow(ForbiddenException);
  });
});
