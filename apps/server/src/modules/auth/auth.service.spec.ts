import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-token') },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('1h') },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('应成功注册新用户', async () => {
      userService.findByEmail!.mockResolvedValue(null);
      userService.create!.mockResolvedValue({ id: 1, email: 'test@test.com' });
      const result = await authService.register({
        email: 'test@test.com', password: '123456', nickname: '测试用户',
      });
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(userService.create).toHaveBeenCalled();
    });

    it('邮箱已存在时应抛出 ConflictException', async () => {
      userService.findByEmail!.mockResolvedValue({ id: 1, email: 'test@test.com' });
      await expect(
        authService.register({ email: 'test@test.com', password: '123456', nickname: '测试用户' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('应成功登录', async () => {
      const hash = await bcrypt.hash('123456', 10);
      userService.findByEmail!.mockResolvedValue({ id: 1, email: 'test@test.com', passwordHash: hash });
      const result = await authService.login({ email: 'test@test.com', password: '123456' });
      expect(result.accessToken).toBe('mock-token');
    });

    it('邮箱不存在时应抛出 UnauthorizedException', async () => {
      userService.findByEmail!.mockResolvedValue(null);
      await expect(
        authService.login({ email: 'wrong@test.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('密码错误时应抛出 UnauthorizedException', async () => {
      const hash = await bcrypt.hash('123456', 10);
      userService.findByEmail!.mockResolvedValue({ id: 1, email: 'test@test.com', passwordHash: hash });
      await expect(
        authService.login({ email: 'test@test.com', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
