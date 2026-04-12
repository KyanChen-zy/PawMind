import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      create: jest.fn((data) => data),
      save: jest.fn((data) => ({ id: 1, ...data })),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get(UserService);
  });

  describe('findByEmail', () => {
    it('应通过邮箱查找用户', async () => {
      const user = { id: 1, email: 'test@test.com', nickname: '测试' };
      repo.findOne.mockResolvedValue(user);
      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(user);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('邮箱不存在时应返回 null', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findByEmail('noone@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('应通过 ID 查找用户', async () => {
      const user = { id: 1, email: 'test@test.com', nickname: '测试' };
      repo.findOne.mockResolvedValue(user);
      const result = await service.findById(1);
      expect(result).toEqual(user);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('ID 不存在时应返回 null', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('应成功创建用户', async () => {
      const userData = {
        email: 'new@test.com',
        passwordHash: 'hashed123',
        nickname: '新用户',
      };
      const result = await service.create(userData);
      expect(result.email).toBe('new@test.com');
      expect(result.nickname).toBe('新用户');
      expect(repo.create).toHaveBeenCalledWith(userData);
      expect(repo.save).toHaveBeenCalled();
    });
  });
});
