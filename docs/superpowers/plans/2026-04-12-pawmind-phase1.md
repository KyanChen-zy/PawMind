# PawMind v1.0 MVP 实施计划 — Phase 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 PawMind 全栈 MVP，实现用户认证、宠物档案管理、AI 对话（Mock）、健康管理、成长记录五大 P0 功能。

**Architecture:** Monorepo（npm workspaces），NestJS 后端提供 RESTful API，TypeORM + PostgreSQL 持久化，React Native + Expo 前端，Zustand 状态管理。前后端通过 shared 包共享类型定义。

**Tech Stack:** Node.js 24, TypeScript, NestJS 11, TypeORM, PostgreSQL, React Native, Expo 55, Zustand, React Navigation v6, JWT

---

## Task 1: Monorepo 项目初始化

**Files:**
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.prettierrc`
- Create: `.eslintrc.js`

- [ ] **Step 1: 创建根 package.json**

```json
{
  "name": "pawmind",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "server:dev": "npm run dev -w apps/server",
    "server:build": "npm run build -w apps/server",
    "mobile:start": "npm run start -w apps/mobile",
    "lint": "eslint . --ext .ts,.tsx"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 3: 创建 .gitignore**

```
node_modules/
dist/
.expo/
*.tsbuildinfo
.env
.env.local
.DS_Store
coverage/
```

- [ ] **Step 4: 创建 .prettierrc**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80
}
```

- [ ] **Step 5: 提交**

```bash
git add package.json tsconfig.base.json .gitignore .prettierrc
git commit -m "chore: init monorepo with npm workspaces"
```

---

## Task 2: Shared 类型包

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/types/user.ts`
- Create: `packages/shared/src/types/pet.ts`
- Create: `packages/shared/src/types/chat.ts`
- Create: `packages/shared/src/types/health.ts`
- Create: `packages/shared/src/types/growth.ts`
- Create: `packages/shared/src/constants/index.ts`

- [ ] **Step 1: 创建 packages/shared/package.json**

```json
{
  "name": "@pawmind/shared",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 2: 创建 packages/shared/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 创建类型定义 packages/shared/src/types/user.ts**

```typescript
/** 用户注册请求 */
export interface RegisterDto {
  email: string;
  password: string;
  nickname: string;
}

/** 用户登录请求 */
export interface LoginDto {
  email: string;
  password: string;
}

/** 认证响应 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

/** 用户信息（不含密码） */
export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  avatar: string | null;
  createdAt: string;
}
```

- [ ] **Step 4: 创建 packages/shared/src/types/pet.ts**

```typescript
/** 宠物物种 */
export type PetSpecies = 'cat' | 'dog' | 'other';

/** 宠物性别 */
export type PetGender = 'male' | 'female' | 'unknown';

/** 宠物状态 */
export type PetStatus = 'active' | 'archived';

/** 创建宠物请求 */
export interface CreatePetDto {
  name: string;
  species: PetSpecies;
  breed: string;
  birthday: string;
  gender: PetGender;
  weight: number;
}

/** 更新宠物请求 */
export interface UpdatePetDto {
  name?: string;
  breed?: string;
  birthday?: string;
  gender?: PetGender;
  weight?: number;
  avatar?: string;
  personalityTags?: string[];
}

/** 宠物信息响应 */
export interface PetInfo {
  id: number;
  name: string;
  species: PetSpecies;
  breed: string;
  birthday: string;
  gender: PetGender;
  weight: number;
  avatar: string | null;
  personalityTags: string[];
  status: PetStatus;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 5: 创建 packages/shared/src/types/chat.ts**

```typescript
/** 对话消息角色 */
export type MessageRole = 'user' | 'ai';

/** 情绪标签 */
export type EmotionTag =
  | 'happy'
  | 'calm'
  | 'anxious'
  | 'excited'
  | 'sleepy'
  | 'playful';

/** 发送消息请求 */
export interface SendMessageDto {
  content: string;
}

/** 消息响应 */
export interface MessageInfo {
  id: number;
  role: MessageRole;
  content: string;
  emotionTag: EmotionTag | null;
  createdAt: string;
}

/** 对话会话响应 */
export interface ConversationInfo {
  id: number;
  petId: number;
  createdAt: string;
  lastMessage: string | null;
}
```

- [ ] **Step 6: 创建 packages/shared/src/types/health.ts**

```typescript
/** 预警严重程度 */
export type AlertSeverity = 'observe' | 'caution' | 'urgent';

/** 食欲等级 */
export type AppetiteLevel = 'low' | 'normal' | 'high';

/** 活动等级 */
export type ActivityLevel = 'low' | 'normal' | 'high';

/** 创建健康日志请求 */
export interface CreateHealthLogDto {
  date: string;
  weight?: number;
  appetiteLevel?: AppetiteLevel;
  activityLevel?: ActivityLevel;
  waterIntake?: number;
  symptoms?: string;
  notes?: string;
}

/** 健康日志响应 */
export interface HealthLogInfo {
  id: number;
  petId: number;
  date: string;
  weight: number | null;
  appetiteLevel: AppetiteLevel | null;
  activityLevel: ActivityLevel | null;
  waterIntake: number | null;
  symptoms: string | null;
  notes: string | null;
  isAlert: boolean;
  alertType: string | null;
  severity: AlertSeverity | null;
  createdAt: string;
}

/** 健康趋势数据点 */
export interface HealthTrendPoint {
  date: string;
  weight: number | null;
  activityLevel: ActivityLevel | null;
  appetiteLevel: AppetiteLevel | null;
}
```

- [ ] **Step 7: 创建 packages/shared/src/types/growth.ts**

```typescript
/** 成长记录内容类型 */
export type GrowthContentType = 'photo' | 'video' | 'text';

/** 创建成长记录请求 */
export interface CreateGrowthRecordDto {
  contentType: GrowthContentType;
  mediaUrl?: string;
  description?: string;
  tags?: string[];
}

/** 成长记录响应 */
export interface GrowthRecordInfo {
  id: number;
  petId: number;
  contentType: GrowthContentType;
  mediaUrl: string | null;
  description: string | null;
  tags: string[];
  createdAt: string;
}
```

- [ ] **Step 8: 创建常量 packages/shared/src/constants/index.ts**

```typescript
/** AI 对话每次回复最大字数 */
export const AI_MAX_REPLY_LENGTH = 60;

/** AI 对话每次回复最小字数 */
export const AI_MIN_REPLY_LENGTH = 30;

/** 每日最大 AI 推送消息数 */
export const MAX_DAILY_AI_PUSH = 3;

/** 健康预警阈值：体重变化百分比 */
export const WEIGHT_CHANGE_THRESHOLD = 0.05;

/** 密码最小长度 */
export const PASSWORD_MIN_LENGTH = 6;

/** 宠物昵称最大长度 */
export const PET_NAME_MAX_LENGTH = 20;
```

- [ ] **Step 9: 创建 packages/shared/src/index.ts**

```typescript
export * from './types/user';
export * from './types/pet';
export * from './types/chat';
export * from './types/health';
export * from './types/growth';
export * from './constants';
```

- [ ] **Step 10: 提交**

```bash
git add packages/
git commit -m "feat: add shared types package with all data models"
```

---

## Task 3: NestJS 后端初始化

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/tsconfig.build.json`
- Create: `apps/server/nest-cli.json`
- Create: `apps/server/src/main.ts`
- Create: `apps/server/src/app.module.ts`
- Create: `apps/server/.env.example`

- [ ] **Step 1: 创建 apps/server/package.json**

```json
{
  "name": "@pawmind/server",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "start": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/typeorm": "^11.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/passport": "^11.0.0",
    "@nestjs/config": "^4.0.0",
    "typeorm": "^0.3.20",
    "pg": "^8.13.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.1",
    "class-validator": "^0.14.1",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^22.0.0",
    "@types/passport-jwt": "^4.0.1",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.7.0"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

- [ ] **Step 2: 创建 apps/server/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "paths": {
      "@pawmind/shared": ["../../packages/shared/src"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 创建 apps/server/tsconfig.build.json**

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
```

- [ ] **Step 4: 创建 apps/server/nest-cli.json**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "tsConfigPath": "tsconfig.build.json"
  }
}
```

- [ ] **Step 5: 创建 apps/server/.env.example**

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=pawmind
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
```

- [ ] **Step 6: 创建 apps/server/src/app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_DATABASE', 'pawmind'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
```

- [ ] **Step 7: 创建 apps/server/src/main.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
```

- [ ] **Step 8: 安装依赖并验证**

```bash
cd apps/server && cp .env.example .env && npm install
npx nest build
```

Expected: 编译成功，无错误

- [ ] **Step 9: 提交**

```bash
git add apps/server/
git commit -m "feat: init NestJS backend with TypeORM + PostgreSQL config"
```

---

## Task 4: 用户实体与认证模块

**Files:**
- Create: `apps/server/src/modules/auth/auth.module.ts`
- Create: `apps/server/src/modules/auth/auth.controller.ts`
- Create: `apps/server/src/modules/auth/auth.service.ts`
- Create: `apps/server/src/modules/auth/auth.service.spec.ts`
- Create: `apps/server/src/modules/auth/dto/register.dto.ts`
- Create: `apps/server/src/modules/auth/dto/login.dto.ts`
- Create: `apps/server/src/modules/auth/strategies/jwt.strategy.ts`
- Create: `apps/server/src/modules/auth/guards/jwt-auth.guard.ts`
- Create: `apps/server/src/modules/user/user.entity.ts`
- Create: `apps/server/src/modules/user/user.module.ts`
- Create: `apps/server/src/modules/user/user.service.ts`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: 创建 User 实体 apps/server/src/modules/user/user.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ length: 50 })
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: 创建 UserService apps/server/src/modules/user/user.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** 根据邮箱查找用户 */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  /** 根据 ID 查找用户 */
  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  /** 创建用户 */
  async create(data: {
    email: string;
    passwordHash: string;
    nickname: string;
  }): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
```

- [ ] **Step 3: 创建 UserModule apps/server/src/modules/user/user.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

- [ ] **Step 4: 创建 DTO apps/server/src/modules/auth/dto/register.dto.ts**

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  nickname: string;
}
```

- [ ] **Step 5: 创建 DTO apps/server/src/modules/auth/dto/login.dto.ts**

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

- [ ] **Step 6: 创建 AuthService apps/server/src/modules/auth/auth.service.ts**

```typescript
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** 用户注册 */
  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('邮箱已被注册');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      email: dto.email,
      passwordHash,
      nickname: dto.nickname,
    });
    return this.generateTokens(user.id, user.email);
  }

  /** 用户登录 */
  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const valid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!valid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    return this.generateTokens(user.id, user.email);
  }

  /** 生成 JWT token 对 */
  private generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(
        'JWT_EXPIRES_IN',
        '1h',
      ),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get(
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      ),
    });
    return { accessToken, refreshToken, userId };
  }
}
```

- [ ] **Step 7: 创建 JWT Strategy apps/server/src/modules/auth/strategies/jwt.strategy.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(
        'JWT_SECRET',
        'dev-secret',
      ),
    });
  }

  /** 验证通过后将 payload 注入 request.user */
  async validate(payload: { sub: number; email: string }) {
    return { id: payload.sub, email: payload.email };
  }
}
```

- [ ] **Step 8: 创建 JWT Guard apps/server/src/modules/auth/guards/jwt-auth.guard.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 9: 创建 AuthController apps/server/src/modules/auth/auth.controller.ts**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
```

- [ ] **Step 10: 创建 AuthModule apps/server/src/modules/auth/auth.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET', 'dev-secret'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 11: 更新 AppModule 注册 AuthModule**

修改 `apps/server/src/app.module.ts`，在 imports 中添加 AuthModule：

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_DATABASE', 'pawmind'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 12: 编写 AuthService 单元测试 apps/server/src/modules/auth/auth.service.spec.ts**

```typescript
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
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('1h'),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('应成功注册新用户', async () => {
      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });

      const result = await authService.register({
        email: 'test@test.com',
        password: '123456',
        nickname: '测试用户',
      });

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(userService.create).toHaveBeenCalled();
    });

    it('邮箱已存在时应抛出 ConflictException', async () => {
      userService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });

      await expect(
        authService.register({
          email: 'test@test.com',
          password: '123456',
          nickname: '测试用户',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('应成功登录', async () => {
      const hash = await bcrypt.hash('123456', 10);
      userService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        passwordHash: hash,
      });

      const result = await authService.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.accessToken).toBe('mock-token');
    });

    it('邮箱不存在时应抛出 UnauthorizedException', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'wrong@test.com',
          password: '123456',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('密码错误时应抛出 UnauthorizedException', async () => {
      const hash = await bcrypt.hash('123456', 10);
      userService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        passwordHash: hash,
      });

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
```

- [ ] **Step 13: 运行测试验证**

```bash
cd apps/server && npx jest src/modules/auth/auth.service.spec.ts --verbose
```

Expected: 4 个测试全部通过

- [ ] **Step 14: 提交**

```bash
git add apps/server/src/modules/
git commit -m "feat: add auth module with register, login, JWT"
```

---

## Task 5: 宠物档案模块

**Files:**
- Create: `apps/server/src/modules/pet/pet.entity.ts`
- Create: `apps/server/src/modules/pet/pet.module.ts`
- Create: `apps/server/src/modules/pet/pet.service.ts`
- Create: `apps/server/src/modules/pet/pet.service.spec.ts`
- Create: `apps/server/src/modules/pet/pet.controller.ts`
- Create: `apps/server/src/modules/pet/dto/create-pet.dto.ts`
- Create: `apps/server/src/modules/pet/dto/update-pet.dto.ts`
- Create: `apps/server/src/common/decorators/current-user.decorator.ts`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: 创建 CurrentUser 装饰器 apps/server/src/common/decorators/current-user.decorator.ts**

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** 从 request 中提取当前登录用户 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

- [ ] **Step 2: 创建 Pet 实体 apps/server/src/modules/pet/pet.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 10 })
  species: string;

  @Column({ length: 50 })
  breed: string;

  @Column({ type: 'date' })
  birthday: string;

  @Column({ length: 10, default: 'unknown' })
  gender: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column({ nullable: true })
  avatar: string;

  @Column('simple-array', { nullable: true })
  personalityTags: string[];

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 3: 创建 DTO apps/server/src/modules/pet/dto/create-pet.dto.ts**

```typescript
import {
  IsString,
  IsNumber,
  IsIn,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MaxLength(20)
  name: string;

  @IsIn(['cat', 'dog', 'other'])
  species: string;

  @IsString()
  @MaxLength(50)
  breed: string;

  @IsDateString()
  birthday: string;

  @IsIn(['male', 'female', 'unknown'])
  gender: string;

  @IsNumber()
  @Min(0)
  weight: number;
}
```

- [ ] **Step 4: 创建 DTO apps/server/src/modules/pet/dto/update-pet.dto.ts**

```typescript
import {
  IsString,
  IsNumber,
  IsIn,
  IsDateString,
  IsArray,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'unknown'])
  gender?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  personalityTags?: string[];
}
```

- [ ] **Step 5: 创建 PetService apps/server/src/modules/pet/pet.service.ts**

```typescript
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
  ) {}

  /** 创建宠物档案 */
  async create(userId: number, dto: CreatePetDto): Promise<Pet> {
    const pet = this.petRepo.create({ ...dto, userId });
    return this.petRepo.save(pet);
  }

  /** 获取用户所有宠物 */
  async findAllByUser(userId: number): Promise<Pet[]> {
    return this.petRepo.find({
      where: { userId, status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  /** 获取单个宠物详情 */
  async findOne(id: number, userId: number): Promise<Pet> {
    const pet = await this.petRepo.findOne({
      where: { id },
    });
    if (!pet) {
      throw new NotFoundException('宠物不存在');
    }
    if (pet.userId !== userId) {
      throw new ForbiddenException('无权访问该宠物');
    }
    return pet;
  }

  /** 更新宠物信息 */
  async update(
    id: number,
    userId: number,
    dto: UpdatePetDto,
  ): Promise<Pet> {
    const pet = await this.findOne(id, userId);
    Object.assign(pet, dto);
    return this.petRepo.save(pet);
  }

  /** 归档宠物（软删除） */
  async archive(id: number, userId: number): Promise<void> {
    const pet = await this.findOne(id, userId);
    pet.status = 'archived';
    await this.petRepo.save(pet);
  }
}
```

- [ ] **Step 6: 创建 PetController apps/server/src/modules/pet/pet.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  create(
    @CurrentUser() user: { id: number },
    @Body() dto: CreatePetDto,
  ) {
    return this.petService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: { id: number }) {
    return this.petService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.petService.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() dto: UpdatePetDto,
  ) {
    return this.petService.update(id, user.id, dto);
  }

  @Delete(':id')
  archive(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.petService.archive(id, user.id);
  }
}
```

- [ ] **Step 7: 创建 PetModule apps/server/src/modules/pet/pet.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet.entity';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pet])],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
```

- [ ] **Step 8: 更新 AppModule 注册 PetModule**

修改 `apps/server/src/app.module.ts` imports 数组，添加 PetModule：

```typescript
import { PetModule } from './modules/pet/pet.module';
// ... 在 imports 数组中添加
imports: [
  // ... 已有的 ConfigModule, TypeOrmModule, AuthModule
  PetModule,
],
```

- [ ] **Step 9: 编写 PetService 单元测试 apps/server/src/modules/pet/pet.service.spec.ts**

```typescript
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
    const dto = {
      name: '毛球',
      species: 'cat',
      breed: '英短',
      birthday: '2024-01-01',
      gender: 'male',
      weight: 4.5,
    };
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
    await expect(service.findOne(999, 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('非宠物主人访问时应抛出 ForbiddenException', async () => {
    repo.findOne.mockResolvedValue({ id: 1, userId: 2 });
    await expect(service.findOne(1, 1)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
```

- [ ] **Step 10: 运行测试验证**

```bash
cd apps/server && npx jest src/modules/pet/pet.service.spec.ts --verbose
```

Expected: 4 个测试全部通过

- [ ] **Step 11: 提交**

```bash
git add apps/server/src/modules/pet/ apps/server/src/common/ apps/server/src/app.module.ts
git commit -m "feat: add pet profile module with CRUD operations"
```

---

## Task 6: AI 对话模块（Mock 实现）

**Files:**
- Create: `apps/server/src/modules/chat/conversation.entity.ts`
- Create: `apps/server/src/modules/chat/message.entity.ts`
- Create: `apps/server/src/modules/chat/chat.module.ts`
- Create: `apps/server/src/modules/chat/chat.service.ts`
- Create: `apps/server/src/modules/chat/chat.service.spec.ts`
- Create: `apps/server/src/modules/chat/chat.controller.ts`
- Create: `apps/server/src/modules/chat/mock-ai.service.ts`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: 创建 Conversation 实体 apps/server/src/modules/chat/conversation.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Pet } from '../pet/pet.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: 创建 Message 实体 apps/server/src/modules/chat/message.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: number;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column({ length: 10 })
  role: string;

  @Column('text')
  content: string;

  @Column({ nullable: true, length: 20 })
  emotionTag: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

- [ ] **Step 3: 创建 MockAiService apps/server/src/modules/chat/mock-ai.service.ts**

```typescript
import { Injectable } from '@nestjs/common';

/** Mock AI 回复，后续替换为真实 AI API */
const MOCK_REPLIES: Record<string, { content: string; emotion: string }[]> = {
  default: [
    { content: '喵～今天在家乖乖的，就是有点想你了', emotion: 'calm' },
    { content: '汪！刚才追了一会儿自己的尾巴，可开心了', emotion: 'happy' },
    { content: '嗯...刚睡醒，打了个大大的哈欠', emotion: 'sleepy' },
    { content: '今天偷偷跳上了沙发，嘿嘿别告诉别人', emotion: 'playful' },
    { content: '你什么时候回来呀？我在门口等你好久了', emotion: 'anxious' },
    { content: '刚吃完饭，现在趴在窗台上看外面的小鸟', emotion: 'calm' },
  ],
};

@Injectable()
export class MockAiService {
  /** 根据用户消息生成 Mock AI 回复 */
  generateReply(
    _userMessage: string,
    _petName: string,
  ): { content: string; emotionTag: string } {
    const replies = MOCK_REPLIES.default;
    const idx = Math.floor(Math.random() * replies.length);
    const reply = replies[idx];
    return {
      content: reply.content,
      emotionTag: reply.emotion,
    };
  }
}
```

- [ ] **Step 4: 创建 ChatService apps/server/src/modules/chat/chat.service.ts**

```typescript
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
    @InjectRepository(Conversation)
    private readonly convRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    private readonly mockAi: MockAiService,
    private readonly petService: PetService,
  ) {}

  /** 创建新对话 */
  async createConversation(
    petId: number,
    userId: number,
  ): Promise<Conversation> {
    await this.petService.findOne(petId, userId);
    const conv = this.convRepo.create({ petId });
    return this.convRepo.save(conv);
  }

  /** 获取宠物的对话列表 */
  async getConversations(
    petId: number,
    userId: number,
  ): Promise<Conversation[]> {
    await this.petService.findOne(petId, userId);
    return this.convRepo.find({
      where: { petId },
      order: { createdAt: 'DESC' },
    });
  }

  /** 发送消息并获取 AI 回复 */
  async sendMessage(
    conversationId: number,
    userId: number,
    content: string,
  ): Promise<{ userMsg: Message; aiMsg: Message }> {
    const conv = await this.convRepo.findOne({
      where: { id: conversationId },
      relations: ['pet'],
    });
    if (!conv) {
      throw new NotFoundException('对话不存在');
    }
    await this.petService.findOne(conv.petId, userId);

    // 保存用户消息
    const userMsg = await this.msgRepo.save(
      this.msgRepo.create({
        conversationId,
        role: 'user',
        content,
      }),
    );

    // 生成 AI 回复
    const aiReply = this.mockAi.generateReply(
      content,
      conv.pet?.name || '宠物',
    );
    const aiMsg = await this.msgRepo.save(
      this.msgRepo.create({
        conversationId,
        role: 'ai',
        content: aiReply.content,
        emotionTag: aiReply.emotionTag,
      }),
    );

    return { userMsg, aiMsg };
  }

  /** 获取对话消息列表 */
  async getMessages(
    conversationId: number,
    userId: number,
  ): Promise<Message[]> {
    const conv = await this.convRepo.findOne({
      where: { id: conversationId },
    });
    if (!conv) {
      throw new NotFoundException('对话不存在');
    }
    await this.petService.findOne(conv.petId, userId);
    return this.msgRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }
}
```

- [ ] **Step 5: 创建 ChatController apps/server/src/modules/chat/chat.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('pets/:petId/conversations')
  createConversation(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.chatService.createConversation(petId, user.id);
  }

  @Get('pets/:petId/conversations')
  getConversations(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.chatService.getConversations(petId, user.id);
  }

  @Post('conversations/:id/messages')
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(id, user.id, content);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.chatService.getMessages(id, user.id);
  }
}
```

- [ ] **Step 6: 创建 ChatModule apps/server/src/modules/chat/chat.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MockAiService } from './mock-ai.service';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    PetModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, MockAiService],
})
export class ChatModule {}
```

- [ ] **Step 7: 更新 AppModule 注册 ChatModule**

修改 `apps/server/src/app.module.ts` imports 数组，添加：

```typescript
import { ChatModule } from './modules/chat/chat.module';
// imports: [..., ChatModule]
```

- [ ] **Step 8: 编写 ChatService 单元测试 apps/server/src/modules/chat/chat.service.spec.ts**

```typescript
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
      create: jest.fn((d) => d),
      save: jest.fn((d) => ({ id: 1, ...d })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
    };
    msgRepo = {
      create: jest.fn((d) => d),
      save: jest.fn((d) => ({ id: 1, ...d })),
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        MockAiService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: convRepo,
        },
        {
          provide: getRepositoryToken(Message),
          useValue: msgRepo,
        },
        {
          provide: PetService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              userId: 1,
              name: '毛球',
            }),
          },
        },
      ],
    }).compile();

    service = module.get(ChatService);
  });

  it('应成功创建对话', async () => {
    const result = await service.createConversation(1, 1);
    expect(result.petId).toBe(1);
  });

  it('发送消息应返回用户消息和 AI 回复', async () => {
    convRepo.findOne.mockResolvedValue({
      id: 1,
      petId: 1,
      pet: { name: '毛球' },
    });
    const result = await service.sendMessage(1, 1, '你好呀');
    expect(result.userMsg.role).toBe('user');
    expect(result.aiMsg.role).toBe('ai');
    expect(result.aiMsg.emotionTag).toBeDefined();
  });
});
```

- [ ] **Step 9: 运行测试验证**

```bash
cd apps/server && npx jest src/modules/chat/chat.service.spec.ts --verbose
```

Expected: 2 个测试全部通过

- [ ] **Step 10: 提交**

```bash
git add apps/server/src/modules/chat/ apps/server/src/app.module.ts
git commit -m "feat: add AI chat module with mock replies"
```

---

## Task 7: 健康管理模块

**Files:**
- Create: `apps/server/src/modules/health/health-log.entity.ts`
- Create: `apps/server/src/modules/health/health.module.ts`
- Create: `apps/server/src/modules/health/health.service.ts`
- Create: `apps/server/src/modules/health/health.service.spec.ts`
- Create: `apps/server/src/modules/health/health.controller.ts`
- Create: `apps/server/src/modules/health/dto/create-health-log.dto.ts`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: 创建 HealthLog 实体 apps/server/src/modules/health/health-log.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pet } from '../pet/pet.entity';

@Entity('health_logs')
export class HealthLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ type: 'date' })
  date: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  weight: number;

  @Column({ nullable: true, length: 10 })
  appetiteLevel: string;

  @Column({ nullable: true, length: 10 })
  activityLevel: string;

  @Column({ type: 'int', nullable: true })
  waterIntake: number;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isAlert: boolean;

  @Column({ nullable: true, length: 50 })
  alertType: string;

  @Column({ nullable: true, length: 10 })
  severity: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

- [ ] **Step 2: 创建 DTO apps/server/src/modules/health/dto/create-health-log.dto.ts**

```typescript
import {
  IsDateString,
  IsNumber,
  IsString,
  IsIn,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateHealthLogDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsIn(['low', 'normal', 'high'])
  appetiteLevel?: string;

  @IsOptional()
  @IsIn(['low', 'normal', 'high'])
  activityLevel?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  waterIntake?: number;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
```

- [ ] **Step 3: 创建 HealthService apps/server/src/modules/health/health.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { HealthLog } from './health-log.entity';
import { CreateHealthLogDto } from './dto/create-health-log.dto';
import { PetService } from '../pet/pet.service';

/** 体重变化阈值 5% */
const WEIGHT_THRESHOLD = 0.05;

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthLog)
    private readonly logRepo: Repository<HealthLog>,
    private readonly petService: PetService,
  ) {}


  /** 创建健康日志，自动检测异常 */
  async create(
    petId: number,
    userId: number,
    dto: CreateHealthLogDto,
  ): Promise<HealthLog> {
    await this.petService.findOne(petId, userId);

    const log = this.logRepo.create({ ...dto, petId });

    // 异常检测：体重变化
    if (dto.weight) {
      const lastLog = await this.logRepo.findOne({
        where: { petId },
        order: { date: 'DESC' },
      });
      if (lastLog?.weight) {
        const change = Math.abs(
          (dto.weight - Number(lastLog.weight)) /
            Number(lastLog.weight),
        );
        if (change >= WEIGHT_THRESHOLD) {
          log.isAlert = true;
          log.alertType = '体重异常变化';
          log.severity =
            change >= 0.1 ? 'urgent' : 'caution';
        }
      }
    }

    // 异常检测：食欲偏低
    if (dto.appetiteLevel === 'low') {
      log.isAlert = true;
      log.alertType = log.alertType
        ? `${log.alertType}; 食欲偏低`
        : '食欲偏低';
      log.severity = log.severity || 'observe';
    }

    return this.logRepo.save(log);
  }

  /** 获取健康日志列表 */
  async findByPet(
    petId: number,
    userId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<HealthLog[]> {
    await this.petService.findOne(petId, userId);
    const where: any = { petId };
    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    }
    return this.logRepo.find({
      where,
      order: { date: 'DESC' },
    });
  }

  /** 获取健康趋势数据 */
  async getTrends(
    petId: number,
    userId: number,
    days: number = 7,
  ): Promise<HealthLog[]> {
    await this.petService.findOne(petId, userId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const dateStr = startDate.toISOString().split('T')[0];
    return this.logRepo.find({
      where: {
        petId,
        date: Between(dateStr, new Date().toISOString().split('T')[0]),
      },
      order: { date: 'ASC' },
    });
  }

  /** 获取预警列表 */
  async getAlerts(
    petId: number,
    userId: number,
  ): Promise<HealthLog[]> {
    await this.petService.findOne(petId, userId);
    return this.logRepo.find({
      where: { petId, isAlert: true },
      order: { date: 'DESC' },
    });
  }

  /** 标记预警已处理 */
  async resolveAlert(
    logId: number,
    userId: number,
  ): Promise<HealthLog> {
    const log = await this.logRepo.findOne({
      where: { id: logId },
    });
    if (!log) {
      throw new NotFoundException('日志不存在');
    }
    await this.petService.findOne(log.petId, userId);
    log.isAlert = false;
    return this.logRepo.save(log);
  }
}
```

- [ ] **Step 4: 创建 HealthController apps/server/src/modules/health/health.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HealthService } from './health.service';
import { CreateHealthLogDto } from './dto/create-health-log.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post('pets/:petId/health-logs')
  create(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
    @Body() dto: CreateHealthLogDto,
  ) {
    return this.healthService.create(petId, user.id, dto);
  }

  @Get('pets/:petId/health-logs')
  findAll(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.healthService.findByPet(
      petId,
      user.id,
      startDate,
      endDate,
    );
  }

  @Get('pets/:petId/health-logs/trends')
  getTrends(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
    @Query('days') days?: string,
  ) {
    return this.healthService.getTrends(
      petId,
      user.id,
      days ? parseInt(days) : 7,
    );
  }

  @Get('pets/:petId/health-logs/alerts')
  getAlerts(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.healthService.getAlerts(petId, user.id);
  }

  @Put('health-logs/:id/resolve')
  resolve(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.healthService.resolveAlert(id, user.id);
  }
}
```

- [ ] **Step 5: 创建 HealthModule apps/server/src/modules/health/health.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthLog } from './health-log.entity';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [TypeOrmModule.forFeature([HealthLog]), PetModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
```

- [ ] **Step 6: 编写 HealthService 单元测试 apps/server/src/modules/health/health.service.spec.ts**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HealthService } from './health.service';
import { HealthLog } from './health-log.entity';
import { PetService } from '../pet/pet.service';

describe('HealthService', () => {
  let service: HealthService;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      create: jest.fn((d) => d),
      save: jest.fn((d) => ({ id: 1, ...d })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getRepositoryToken(HealthLog),
          useValue: repo,
        },
        {
          provide: PetService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              userId: 1,
            }),
          },
        },
      ],
    }).compile();

    service = module.get(HealthService);
  });

  it('应成功创建健康日志', async () => {
    const result = await service.create(1, 1, {
      date: '2026-04-12',
      weight: 4.5,
    });
    expect(result.petId).toBe(1);
    expect(repo.save).toHaveBeenCalled();
  });

  it('体重变化超过阈值应触发预警', async () => {
    repo.findOne.mockResolvedValue({
      weight: 5.0,
      date: '2026-04-11',
    });
    const result = await service.create(1, 1, {
      date: '2026-04-12',
      weight: 4.0,
    });
    expect(result.isAlert).toBe(true);
    expect(result.severity).toBe('urgent');
  });

  it('食欲偏低应触发观察级预警', async () => {
    const result = await service.create(1, 1, {
      date: '2026-04-12',
      appetiteLevel: 'low',
    });
    expect(result.isAlert).toBe(true);
    expect(result.severity).toBe('observe');
  });
});
```

- [ ] **Step 7: 运行测试验证**

```bash
cd apps/server && npx jest src/modules/health/health.service.spec.ts --verbose
```

Expected: 3 个测试全部通过

- [ ] **Step 8: 更新 AppModule 并提交**

```typescript
// app.module.ts imports 添加
import { HealthModule } from './modules/health/health.module';
```

```bash
git add apps/server/src/modules/health/ apps/server/src/app.module.ts
git commit -m "feat: add health management module with alert detection"
```

---

## Task 8: 成长记录模块

**Files:**
- Create: `apps/server/src/modules/growth/growth-record.entity.ts`
- Create: `apps/server/src/modules/growth/growth.module.ts`
- Create: `apps/server/src/modules/growth/growth.service.ts`
- Create: `apps/server/src/modules/growth/growth.controller.ts`
- Create: `apps/server/src/modules/growth/dto/create-growth-record.dto.ts`
- Modify: `apps/server/src/app.module.ts`

- [ ] **Step 1: 创建 GrowthRecord 实体 apps/server/src/modules/growth/growth-record.entity.ts**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pet } from '../pet/pet.entity';

@Entity('growth_records')
export class GrowthRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  petId: number;

  @ManyToOne(() => Pet)
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({ length: 10 })
  contentType: string;

  @Column({ nullable: true })
  mediaUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;
}
```

- [ ] **Step 2: 创建 DTO apps/server/src/modules/growth/dto/create-growth-record.dto.ts**

```typescript
import {
  IsString,
  IsIn,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateGrowthRecordDto {
  @IsIn(['photo', 'video', 'text'])
  contentType: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
```

- [ ] **Step 3: 创建 GrowthService apps/server/src/modules/growth/growth.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrowthRecord } from './growth-record.entity';
import { CreateGrowthRecordDto } from './dto/create-growth-record.dto';
import { PetService } from '../pet/pet.service';

@Injectable()
export class GrowthService {
  constructor(
    @InjectRepository(GrowthRecord)
    private readonly recordRepo: Repository<GrowthRecord>,
    private readonly petService: PetService,
  ) {}

  /** 创建成长记录 */
  async create(
    petId: number,
    userId: number,
    dto: CreateGrowthRecordDto,
  ): Promise<GrowthRecord> {
    await this.petService.findOne(petId, userId);
    const record = this.recordRepo.create({ ...dto, petId });
    return this.recordRepo.save(record);
  }

  /** 获取成长记录时间轴 */
  async findByPet(
    petId: number,
    userId: number,
  ): Promise<GrowthRecord[]> {
    await this.petService.findOne(petId, userId);
    return this.recordRepo.find({
      where: { petId },
      order: { createdAt: 'DESC' },
    });
  }

  /** 删除成长记录 */
  async remove(id: number, userId: number): Promise<void> {
    const record = await this.recordRepo.findOne({
      where: { id },
    });
    if (!record) return;
    await this.petService.findOne(record.petId, userId);
    await this.recordRepo.remove(record);
  }
}
```

- [ ] **Step 4: 创建 GrowthController apps/server/src/modules/growth/growth.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GrowthService } from './growth.service';
import { CreateGrowthRecordDto } from './dto/create-growth-record.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class GrowthController {
  constructor(
    private readonly growthService: GrowthService,
  ) {}

  @Post('pets/:petId/growth-records')
  create(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
    @Body() dto: CreateGrowthRecordDto,
  ) {
    return this.growthService.create(petId, user.id, dto);
  }

  @Get('pets/:petId/growth-records')
  findAll(
    @Param('petId', ParseIntPipe) petId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.growthService.findByPet(petId, user.id);
  }

  @Delete('growth-records/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.growthService.remove(id, user.id);
  }
}
```

- [ ] **Step 5: 创建 GrowthModule apps/server/src/modules/growth/growth.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowthRecord } from './growth-record.entity';
import { GrowthService } from './growth.service';
import { GrowthController } from './growth.controller';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GrowthRecord]),
    PetModule,
  ],
  controllers: [GrowthController],
  providers: [GrowthService],
})
export class GrowthModule {}
```

- [ ] **Step 6: 更新 AppModule 最终版本 apps/server/src/app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { PetModule } from './modules/pet/pet.module';
import { ChatModule } from './modules/chat/chat.module';
import { HealthModule } from './modules/health/health.module';
import { GrowthModule } from './modules/growth/growth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_DATABASE', 'pawmind'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    PetModule,
    ChatModule,
    HealthModule,
    GrowthModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 7: 编译验证后端全部模块**

```bash
cd apps/server && npx nest build
```

Expected: 编译成功，无错误

- [ ] **Step 8: 运行全部后端测试**

```bash
cd apps/server && npx jest --verbose
```

Expected: 所有测试通过

- [ ] **Step 9: 提交**

```bash
git add apps/server/
git commit -m "feat: add growth records module, complete backend API"
```

---

## Task 9: React Native + Expo 前端初始化

**Files:**
- Create: `apps/mobile/` (Expo 项目)
- Create: `apps/mobile/src/constants/theme.ts`
- Create: `apps/mobile/src/constants/api.ts`
- Create: `apps/mobile/src/services/api.ts`
- Create: `apps/mobile/src/services/auth.ts`
- Create: `apps/mobile/src/stores/auth.store.ts`

- [ ] **Step 1: 创建 Expo 项目**

```bash
cd apps && npx create-expo-app mobile --template blank-typescript
```

- [ ] **Step 2: 安装核心依赖**

```bash
cd apps/mobile && npx expo install \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  @react-navigation/native-stack \
  react-native-screens \
  react-native-safe-area-context \
  zustand \
  @react-native-async-storage/async-storage \
  expo-image-picker \
  expo-secure-store
```

- [ ] **Step 3: 创建主题常量 apps/mobile/src/constants/theme.ts**

```typescript
/** 应用主色调 */
export const COLORS = {
  primary: '#FF8C42',
  primaryLight: '#FFB380',
  secondary: '#4ECDC4',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#999999',
  border: '#EEEEEE',
  error: '#FF4757',
  warning: '#FFA502',
  success: '#2ED573',
  alertObserve: '#3498DB',
  alertCaution: '#FFA502',
  alertUrgent: '#FF4757',
};

export const FONTS = {
  regular: { fontSize: 14, color: COLORS.text },
  medium: { fontSize: 16, color: COLORS.text },
  large: { fontSize: 18, color: COLORS.text },
  title: { fontSize: 22, fontWeight: '700' as const, color: COLORS.text },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

- [ ] **Step 4: 创建 API 常量 apps/mobile/src/constants/api.ts**

```typescript
/** API 基础地址，开发环境使用本地地址 */
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.pawmind.app/api';
```

- [ ] **Step 5: 创建 API 服务层 apps/mobile/src/services/api.ts**

```typescript
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/api';

/** 通用 API 请求封装 */
class ApiClient {
  private baseUrl = API_BASE_URL;

  private async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync('accessToken');
  }

  async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.message || `请求失败: ${res.status}`,
      );
    }

    return res.json();
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
```

- [ ] **Step 6: 创建认证服务 apps/mobile/src/services/auth.ts**

```typescript
import * as SecureStore from 'expo-secure-store';
import { api } from './api';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

/** 注册 */
export async function register(
  email: string,
  password: string,
  nickname: string,
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    nickname,
  });
  await SecureStore.setItemAsync(
    'accessToken',
    res.accessToken,
  );
  await SecureStore.setItemAsync(
    'refreshToken',
    res.refreshToken,
  );
  return res;
}

/** 登录 */
export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  await SecureStore.setItemAsync(
    'accessToken',
    res.accessToken,
  );
  await SecureStore.setItemAsync(
    'refreshToken',
    res.refreshToken,
  );
  return res;
}

/** 登出 */
export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

/** 检查是否已登录 */
export async function isLoggedIn(): Promise<boolean> {
  const token = await SecureStore.getItemAsync('accessToken');
  return !!token;
}
```

- [ ] **Step 7: 创建认证状态管理 apps/mobile/src/stores/auth.store.ts**

```typescript
import { create } from 'zustand';
import * as authService from '../services/auth';

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    nickname: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userId: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(email, password);
      set({
        isLoggedIn: true,
        userId: res.userId,
        loading: false,
      });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  register: async (email, password, nickname) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register(
        email,
        password,
        nickname,
      );
      set({
        isLoggedIn: true,
        userId: res.userId,
        loading: false,
      });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ isLoggedIn: false, userId: null });
  },

  checkAuth: async () => {
    const loggedIn = await authService.isLoggedIn();
    set({ isLoggedIn: loggedIn });
  },
}));
```

- [ ] **Step 8: 提交**

```bash
git add apps/mobile/
git commit -m "feat: init Expo app with API client, auth service, and state management"
```

---

## Task 10: 前端导航与认证页面

**Files:**
- Create: `apps/mobile/src/navigation/index.tsx`
- Create: `apps/mobile/src/navigation/auth-stack.tsx`
- Create: `apps/mobile/src/navigation/main-tabs.tsx`
- Create: `apps/mobile/src/screens/auth/login-screen.tsx`
- Create: `apps/mobile/src/screens/auth/register-screen.tsx`
- Modify: `apps/mobile/App.tsx`

- [ ] **Step 1: 创建 AuthStack 导航 apps/mobile/src/navigation/auth-stack.tsx**

```tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/login-screen';
import { RegisterScreen } from '../screens/auth/register-screen';

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
}
```

- [ ] **Step 2: 创建 MainTabs 导航 apps/mobile/src/navigation/main-tabs.tsx**

```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../constants/theme';
import { HomeScreen } from '../screens/home/home-screen';
import { ChatScreen } from '../screens/chat/chat-screen';
import { HealthScreen } from '../screens/health/health-screen';
import { GrowthScreen } from '../screens/growth/growth-screen';
import { ProfileScreen } from '../screens/profile/profile-screen';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'AI陪伴',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>💬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{
          tabBarLabel: '健康',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Growth"
        component={GrowthScreen}
        options={{
          tabBarLabel: '成长册',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📸</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

- [ ] **Step 3: 创建根导航 apps/mobile/src/navigation/index.tsx**

```tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/auth.store';
import { AuthStack } from './auth-stack';
import { MainTabs } from './main-tabs';

export function RootNavigation() {
  const { isLoggedIn, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
```

- [ ] **Step 4: 创建登录页面 apps/mobile/src/screens/auth/login-screen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { COLORS, SPACING } from '../../constants/theme';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('提示', '请填写邮箱和密码');
      return;
    }
    await login(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🐾 PawMind</Text>
        <Text style={styles.subtitle}>
          懂你宠物的 AI 陪伴伙伴
        </Text>

        <TextInput
          style={styles.input}
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="邮箱输入框"
        />
        <TextInput
          style={styles.input}
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="密码输入框"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="登录"
        >
          <Text style={styles.buttonText}>
            {loading ? '登录中...' : '登录'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
        >
          <Text style={styles.link}>
            还没有账号？立即注册
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontSize: 14,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
});
```

- [ ] **Step 5: 创建注册页面 apps/mobile/src/screens/auth/register-screen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { COLORS, SPACING } from '../../constants/theme';

export function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const { register, loading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !nickname) {
      Alert.alert('提示', '请填写所有字段');
      return;
    }
    if (password.length < 6) {
      Alert.alert('提示', '密码至少 6 位');
      return;
    }
    await register(email, password, nickname);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>创建账号</Text>
        <Text style={styles.subtitle}>
          开始你的 AI 宠物陪伴之旅
        </Text>

        <TextInput
          style={styles.input}
          placeholder="昵称"
          value={nickname}
          onChangeText={setNickname}
          accessibilityLabel="昵称输入框"
        />
        <TextInput
          style={styles.input}
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="邮箱输入框"
        />
        <TextInput
          style={styles.input}
          placeholder="密码（至少 6 位）"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="密码输入框"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="注册"
        >
          <Text style={styles.buttonText}>
            {loading ? '注册中...' : '注册'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
        >
          <Text style={styles.link}>
            已有账号？返回登录
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontSize: 14,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
});
```

- [ ] **Step 6: 更新 App.tsx 入口**

```tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigation } from './src/navigation';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <RootNavigation />
    </>
  );
}
```

- [ ] **Step 7: 提交**

```bash
git add apps/mobile/
git commit -m "feat: add navigation, login and register screens"
```

---

## Task 11: 宠物档案服务与状态管理

**Files:**
- Create: `apps/mobile/src/services/pet.ts`
- Create: `apps/mobile/src/stores/pet.store.ts`

- [ ] **Step 1: 创建宠物服务 apps/mobile/src/services/pet.ts**

```typescript
import { api } from './api';

export interface PetInfo {
  id: number;
  name: string;
  species: string;
  breed: string;
  birthday: string;
  gender: string;
  weight: number;
  avatar: string | null;
  personalityTags: string[];
  status: string;
  createdAt: string;
}

export interface CreatePetData {
  name: string;
  species: string;
  breed: string;
  birthday: string;
  gender: string;
  weight: number;
}

export function fetchPets(): Promise<PetInfo[]> {
  return api.get('/pets');
}

export function fetchPet(id: number): Promise<PetInfo> {
  return api.get(`/pets/${id}`);
}

export function createPet(data: CreatePetData): Promise<PetInfo> {
  return api.post('/pets', data);
}

export function updatePet(
  id: number,
  data: Partial<CreatePetData>,
): Promise<PetInfo> {
  return api.put(`/pets/${id}`, data);
}

export function archivePet(id: number): Promise<void> {
  return api.delete(`/pets/${id}`);
}
```

- [ ] **Step 2: 创建宠物状态管理 apps/mobile/src/stores/pet.store.ts**

```typescript
import { create } from 'zustand';
import * as petService from '../services/pet';
import type { PetInfo, CreatePetData } from '../services/pet';

interface PetState {
  pets: PetInfo[];
  currentPet: PetInfo | null;
  loading: boolean;
  fetchPets: () => Promise<void>;
  selectPet: (pet: PetInfo) => void;
  addPet: (data: CreatePetData) => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  currentPet: null,
  loading: false,

  fetchPets: async () => {
    set({ loading: true });
    try {
      const pets = await petService.fetchPets();
      set({ pets, loading: false });
      if (!get().currentPet && pets.length > 0) {
        set({ currentPet: pets[0] });
      }
    } catch {
      set({ loading: false });
    }
  },

  selectPet: (pet) => set({ currentPet: pet }),

  addPet: async (data) => {
    const pet = await petService.createPet(data);
    set((s) => ({
      pets: [pet, ...s.pets],
      currentPet: pet,
    }));
  },
}));
```

- [ ] **Step 3: 提交**

```bash
git add apps/mobile/src/services/pet.ts apps/mobile/src/stores/pet.store.ts
git commit -m "feat: add pet service and store"
```

---

## Task 12: 首页 — 今日宠物状态

**Files:**
- Create: `apps/mobile/src/screens/home/home-screen.tsx`
- Create: `apps/mobile/src/components/ui/status-card.tsx`

- [ ] **Step 1: 创建状态卡片组件 apps/mobile/src/components/ui/status-card.tsx**

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface StatusCardProps {
  petName: string;
  emotion: string;
  summary: string;
}

const EMOTION_MAP: Record<string, { icon: string; color: string }> = {
  happy: { icon: '😊', color: COLORS.success },
  calm: { icon: '😌', color: COLORS.secondary },
  anxious: { icon: '😟', color: COLORS.warning },
  excited: { icon: '🤩', color: COLORS.primary },
  sleepy: { icon: '😴', color: COLORS.textSecondary },
  playful: { icon: '😸', color: COLORS.primary },
};

export function StatusCard({
  petName,
  emotion,
  summary,
}: StatusCardProps) {
  const emotionInfo = EMOTION_MAP[emotion] || EMOTION_MAP.calm;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.petName}>{petName}</Text>
        <Text style={{ fontSize: 32 }}>
          {emotionInfo.icon}
        </Text>
      </View>
      <View
        style={[
          styles.emotionBadge,
          { backgroundColor: emotionInfo.color + '20' },
        ]}
      >
        <Text
          style={[
            styles.emotionText,
            { color: emotionInfo.color },
          ]}
        >
          {emotion === 'happy' && '开心'}
          {emotion === 'calm' && '平静'}
          {emotion === 'anxious' && '焦虑'}
          {emotion === 'excited' && '兴奋'}
          {emotion === 'sleepy' && '犯困'}
          {emotion === 'playful' && '调皮'}
        </Text>
      </View>
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  emotionBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: SPACING.sm,
  },
  emotionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summary: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    lineHeight: 22,
  },
});
```

- [ ] **Step 2: 创建首页 apps/mobile/src/screens/home/home-screen.tsx**

```tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import { StatusCard } from '../../components/ui/status-card';
import { COLORS, SPACING } from '../../constants/theme';

export function HomeScreen({ navigation }: any) {
  const { currentPet, pets, fetchPets } = usePetStore();

  useEffect(() => {
    fetchPets();
  }, []);

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 60 }}>🐾</Text>
          <Text style={styles.emptyTitle}>
            先来认识一下你的宠物吧
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
          >
            <Text style={styles.addButtonText}>
              开始建档
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.logo}>🐾 PawMind</Text>
          <Text style={styles.petSwitch}>
            {currentPet.name}
          </Text>
        </View>

        <StatusCard
          petName={currentPet.name}
          emotion="calm"
          summary="今天在家乖乖的，吃了两顿饭，活动量正常"
        />

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={{ fontSize: 28 }}>💬</Text>
            <Text style={styles.actionLabel}>
              AI 陪伴
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Health')}
          >
            <Text style={{ fontSize: 28 }}>📊</Text>
            <Text style={styles.actionLabel}>
              记录健康
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Growth')}
          >
            <Text style={{ fontSize: 28 }}>📸</Text>
            <Text style={styles.actionLabel}>
              拍照记录
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
  },
  petSwitch: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
```

- [ ] **Step 3: 提交**

```bash
git add apps/mobile/src/screens/home/ apps/mobile/src/components/
git commit -m "feat: add home screen with status card and quick actions"
```

---

## Task 13: AI 陪伴对话页面

**Files:**
- Create: `apps/mobile/src/services/chat.ts`
- Create: `apps/mobile/src/screens/chat/chat-screen.tsx`

- [ ] **Step 1: 创建对话服务 apps/mobile/src/services/chat.ts**

```typescript
import { api } from './api';

export interface MessageInfo {
  id: number;
  role: 'user' | 'ai';
  content: string;
  emotionTag: string | null;
  createdAt: string;
}

export interface ConversationInfo {
  id: number;
  petId: number;
  createdAt: string;
}

export function createConversation(
  petId: number,
): Promise<ConversationInfo> {
  return api.post(`/pets/${petId}/conversations`, {});
}

export function getConversations(
  petId: number,
): Promise<ConversationInfo[]> {
  return api.get(`/pets/${petId}/conversations`);
}

export function sendMessage(
  conversationId: number,
  content: string,
): Promise<{ userMsg: MessageInfo; aiMsg: MessageInfo }> {
  return api.post(
    `/conversations/${conversationId}/messages`,
    { content },
  );
}

export function getMessages(
  conversationId: number,
): Promise<MessageInfo[]> {
  return api.get(
    `/conversations/${conversationId}/messages`,
  );
}
```

- [ ] **Step 2: 创建 AI 对话页面 apps/mobile/src/screens/chat/chat-screen.tsx**

```tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import * as chatService from '../../services/chat';
import type { MessageInfo } from '../../services/chat';
import { COLORS, SPACING } from '../../constants/theme';

const QUICK_TOPICS = [
  '今天乖不乖',
  '想我吗',
  '有没有捣乱',
  '今天吃什么了',
];

export function ChatScreen() {
  const { currentPet } = usePetStore();
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [input, setInput] = useState('');
  const [convId, setConvId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (currentPet) {
      initConversation();
    }
  }, [currentPet?.id]);

  const initConversation = async () => {
    if (!currentPet) return;
    try {
      // 优先复用最近的对话，没有则创建新对话
      const convs = await chatService.getConversations(
        currentPet.id,
      );
      let conv;
      if (convs.length > 0) {
        conv = convs[0];
        const msgs = await chatService.getMessages(conv.id);
        setMessages(msgs);
      } else {
        conv = await chatService.createConversation(
          currentPet.id,
        );
        setMessages([]);
      }
      setConvId(conv.id);
    } catch {
      // 静默处理
    }
  };

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || !convId || sending) return;
    setInput('');
    setSending(true);

    try {
      const { userMsg, aiMsg } =
        await chatService.sendMessage(convId, content);
      setMessages((prev) => [...prev, userMsg, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'ai',
          content: '宠物有点忙，稍后再试',
          emotionTag: null,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 40 }}>💬</Text>
          <Text style={styles.emptyText}>
            先添加宠物档案才能开始对话
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {currentPet.name} 的 AI 分身
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd()
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user'
                ? styles.userBubble
                : styles.aiBubble,
            ]}
          >
            <Text
              style={
                item.role === 'user'
                  ? styles.userText
                  : styles.aiText
              }
            >
              {item.content}
            </Text>
            {item.emotionTag && (
              <Text style={styles.emotionTag}>
                {item.emotionTag}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>
              和 {currentPet.name} 说点什么吧
            </Text>
            <View style={styles.quickTopics}>
              {QUICK_TOPICS.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={styles.topicChip}
                  onPress={() => handleSend(topic)}
                >
                  <Text style={styles.topicText}>
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="说点什么..."
            onSubmitEditing={() => handleSend()}
            accessibilityLabel="消息输入框"
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !input.trim() && styles.sendBtnDisabled,
            ]}
            onPress={() => handleSend()}
            disabled={!input.trim() || sending}
            accessibilityRole="button"
            accessibilityLabel="发送"
          >
            <Text style={styles.sendText}>发送</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 18, fontWeight: '700' },
  messageList: { padding: SPACING.md },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
  },
  userText: { color: '#FFF', fontSize: 15 },
  aiText: { color: COLORS.text, fontSize: 15 },
  emotionTag: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  inputBar: {
    flexDirection: 'row',
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { color: '#FFF', fontWeight: '600' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptyChat: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyChatText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  quickTopics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  topicChip: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topicText: { color: COLORS.primary, fontSize: 14 },
});
```

- [ ] **Step 3: 提交**

```bash
git add apps/mobile/src/services/chat.ts apps/mobile/src/screens/chat/
git commit -m "feat: add AI chat screen with quick topics"
```

---

## Task 14: 健康管理页面

**Files:**
- Create: `apps/mobile/src/services/health.ts`
- Create: `apps/mobile/src/screens/health/health-screen.tsx`

- [ ] **Step 1: 创建健康服务 apps/mobile/src/services/health.ts**

```typescript
import { api } from './api';

export interface HealthLogInfo {
  id: number;
  petId: number;
  date: string;
  weight: number | null;
  appetiteLevel: string | null;
  activityLevel: string | null;
  waterIntake: number | null;
  symptoms: string | null;
  notes: string | null;
  isAlert: boolean;
  alertType: string | null;
  severity: string | null;
  createdAt: string;
}

export interface CreateHealthLogData {
  date: string;
  weight?: number;
  appetiteLevel?: string;
  activityLevel?: string;
  waterIntake?: number;
  symptoms?: string;
  notes?: string;
}

export function createHealthLog(
  petId: number,
  data: CreateHealthLogData,
): Promise<HealthLogInfo> {
  return api.post(`/pets/${petId}/health-logs`, data);
}

export function getHealthLogs(
  petId: number,
): Promise<HealthLogInfo[]> {
  return api.get(`/pets/${petId}/health-logs`);
}

export function getHealthTrends(
  petId: number,
  days: number = 7,
): Promise<HealthLogInfo[]> {
  return api.get(
    `/pets/${petId}/health-logs/trends?days=${days}`,
  );
}

export function getAlerts(
  petId: number,
): Promise<HealthLogInfo[]> {
  return api.get(`/pets/${petId}/health-logs/alerts`);
}

export function resolveAlert(
  logId: number,
): Promise<HealthLogInfo> {
  return api.put(`/health-logs/${logId}/resolve`, {});
}
```

- [ ] **Step 2: 创建健康管理页面 apps/mobile/src/screens/health/health-screen.tsx**

```tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import * as healthService from '../../services/health';
import type { HealthLogInfo } from '../../services/health';
import { COLORS, SPACING } from '../../constants/theme';

const SEVERITY_COLORS: Record<string, string> = {
  observe: COLORS.alertObserve,
  caution: COLORS.alertCaution,
  urgent: COLORS.alertUrgent,
};

const SEVERITY_LABELS: Record<string, string> = {
  observe: '观察',
  caution: '注意',
  urgent: '立即就医',
};

export function HealthScreen() {
  const { currentPet } = usePetStore();
  const [logs, setLogs] = useState<HealthLogInfo[]>([]);
  const [alerts, setAlerts] = useState<HealthLogInfo[]>([]);
  const [weight, setWeight] = useState('');
  const [appetite, setAppetite] = useState('normal');
  const [activity, setActivity] = useState('normal');

  useEffect(() => {
    if (currentPet) loadData();
  }, [currentPet?.id]);

  const loadData = async () => {
    if (!currentPet) return;
    try {
      const [logsData, alertsData] = await Promise.all([
        healthService.getHealthTrends(currentPet.id, 7),
        healthService.getAlerts(currentPet.id),
      ]);
      setLogs(logsData);
      setAlerts(alertsData);
    } catch {
      // 静默处理
    }
  };

  const handleRecord = async () => {
    if (!currentPet) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await healthService.createHealthLog(currentPet.id, {
        date: today,
        weight: weight ? parseFloat(weight) : undefined,
        appetiteLevel: appetite,
        activityLevel: activity,
      });
      Alert.alert('记录成功', '今日健康数据已保存');
      setWeight('');
      loadData();
    } catch (e: any) {
      Alert.alert('记录失败', e.message);
    }
  };

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 40 }}>📊</Text>
          <Text style={styles.emptyText}>
            还没有记录，今天就开始吧
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.pageTitle}>
          {currentPet.name} 的健康
        </Text>

        {/* 预警区域 */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              预警提醒
            </Text>
            {alerts.map((alert) => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  {
                    borderLeftColor:
                      SEVERITY_COLORS[alert.severity || 'observe'],
                  },
                ]}
              >
                <Text style={styles.alertType}>
                  {alert.alertType}
                </Text>
                <Text
                  style={[
                    styles.alertSeverity,
                    {
                      color:
                        SEVERITY_COLORS[alert.severity || 'observe'],
                    },
                  ]}
                >
                  {SEVERITY_LABELS[alert.severity || 'observe']}
                </Text>
                <Text style={styles.alertDate}>
                  {alert.date}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 快速录入 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            今日健康记录
          </Text>
          <View style={styles.inputRow}>
            <Text style={styles.label}>体重 (kg)</Text>
            <TextInput
              style={styles.numberInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder={String(currentPet.weight)}
              accessibilityLabel="体重输入"
            />
          </View>

          <Text style={styles.label}>食欲</Text>
          <View style={styles.chipRow}>
            {['low', 'normal', 'high'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.chip,
                  appetite === level && styles.chipActive,
                ]}
                onPress={() => setAppetite(level)}
              >
                <Text
                  style={
                    appetite === level
                      ? styles.chipTextActive
                      : styles.chipText
                  }
                >
                  {level === 'low' ? '偏低' : level === 'normal' ? '正常' : '偏高'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>活动量</Text>
          <View style={styles.chipRow}>
            {['low', 'normal', 'high'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.chip,
                  activity === level && styles.chipActive,
                ]}
                onPress={() => setActivity(level)}
              >
                <Text
                  style={
                    activity === level
                      ? styles.chipTextActive
                      : styles.chipText
                  }
                >
                  {level === 'low' ? '偏低' : level === 'normal' ? '正常' : '偏高'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.recordBtn}
            onPress={handleRecord}
            accessibilityRole="button"
          >
            <Text style={styles.recordBtnText}>
              保存记录
            </Text>
          </TouchableOpacity>
        </View>

        {/* 近期趋势 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            近 7 天趋势
          </Text>
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>
              暂无数据
            </Text>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logRow}>
                <Text style={styles.logDate}>
                  {log.date}
                </Text>
                <Text style={styles.logValue}>
                  {log.weight ? `${log.weight}kg` : '-'}
                </Text>
                <Text style={styles.logValue}>
                  {log.appetiteLevel || '-'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    padding: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  alertCard: {
    borderLeftWidth: 4,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  alertType: { fontSize: 15, fontWeight: '600' },
  alertSeverity: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  alertDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  numberInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.sm,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { color: COLORS.textSecondary },
  chipTextActive: { color: '#FFF' },
  recordBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  recordBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logDate: { fontSize: 14, color: COLORS.text },
  logValue: { fontSize: 14, color: COLORS.textSecondary },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
```

- [ ] **Step 3: 提交**

```bash
git add apps/mobile/src/services/health.ts apps/mobile/src/screens/health/
git commit -m "feat: add health management screen with recording and alerts"
```

---

## Task 15: 成长册页面

**Files:**
- Create: `apps/mobile/src/services/growth.ts`
- Create: `apps/mobile/src/screens/growth/growth-screen.tsx`

- [ ] **Step 1: 创建成长记录服务 apps/mobile/src/services/growth.ts**

```typescript
import { api } from './api';

export interface GrowthRecordInfo {
  id: number;
  petId: number;
  contentType: string;
  mediaUrl: string | null;
  description: string | null;
  tags: string[];
  createdAt: string;
}

export function getGrowthRecords(
  petId: number,
): Promise<GrowthRecordInfo[]> {
  return api.get(`/pets/${petId}/growth-records`);
}

export function createGrowthRecord(
  petId: number,
  data: {
    contentType: string;
    mediaUrl?: string;
    description?: string;
    tags?: string[];
  },
): Promise<GrowthRecordInfo> {
  return api.post(`/pets/${petId}/growth-records`, data);
}

export function deleteGrowthRecord(
  id: number,
): Promise<void> {
  return api.delete(`/growth-records/${id}`);
}
```

- [ ] **Step 2: 创建成长册页面 apps/mobile/src/screens/growth/growth-screen.tsx**

```tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import * as growthService from '../../services/growth';
import type { GrowthRecordInfo } from '../../services/growth';
import { COLORS, SPACING } from '../../constants/theme';

export function GrowthScreen() {
  const { currentPet } = usePetStore();
  const [records, setRecords] = useState<GrowthRecordInfo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (currentPet) loadRecords();
  }, [currentPet?.id]);

  const loadRecords = async () => {
    if (!currentPet) return;
    try {
      const data = await growthService.getGrowthRecords(
        currentPet.id,
      );
      setRecords(data);
    } catch {
      // 静默处理
    }
  };

  const handleAdd = async () => {
    if (!currentPet || !description.trim()) return;
    try {
      await growthService.createGrowthRecord(currentPet.id, {
        contentType: 'text',
        description: description.trim(),
      });
      setDescription('');
      setShowModal(false);
      loadRecords();
    } catch (e: any) {
      Alert.alert('添加失败', e.message);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  if (!currentPet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 40 }}>📸</Text>
          <Text style={styles.emptyText}>
            快去记录第一个精彩瞬间
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {currentPet.name} 的成长册
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowModal(true)}
          accessibilityRole="button"
          accessibilityLabel="添加记录"
        >
          <Text style={styles.addBtnText}>+ 记录</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardDate}>
              {formatDate(item.createdAt)}
            </Text>
            {item.description && (
              <Text style={styles.cardDesc}>
                {item.description}
              </Text>
            )}
            {item.tags?.length > 0 && (
              <View style={styles.tagRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>
              还没有成长记录，点击右上角开始记录
            </Text>
          </View>
        }
      />

      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              新增记录
            </Text>
            <TouchableOpacity onPress={handleAdd}>
              <Text style={styles.saveText}>保存</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="记录今天的精彩瞬间..."
            multiline
            numberOfLines={6}
            accessibilityLabel="记录内容"
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  title: { fontSize: 22, fontWeight: '700' },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  addBtnText: { color: '#FFF', fontWeight: '600' },
  list: { padding: SPACING.md },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  cardDesc: { fontSize: 15, lineHeight: 22 },
  tagRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.primaryLight + '30',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { fontSize: 12, color: COLORS.primary },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: { paddingTop: 60, alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary },
  modal: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  cancelText: { color: COLORS.textSecondary, fontSize: 16 },
  saveText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  textArea: {
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
  },
});
```

- [ ] **Step 3: 提交**

```bash
git add apps/mobile/src/services/growth.ts apps/mobile/src/screens/growth/
git commit -m "feat: add growth records screen with timeline"
```

---

## Task 16: 个人中心与宠物建档页面

**Files:**
- Create: `apps/mobile/src/screens/profile/profile-screen.tsx`
- Create: `apps/mobile/src/screens/profile/add-pet-screen.tsx`
- Modify: `apps/mobile/src/navigation/main-tabs.tsx` (添加 AddPet 路由)

- [ ] **Step 1: 创建个人中心页面 apps/mobile/src/screens/profile/profile-screen.tsx**

```tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import { usePetStore } from '../../stores/pet.store';
import { COLORS, SPACING } from '../../constants/theme';

export function ProfileScreen({ navigation }: any) {
  const { logout } = useAuthStore();
  const { pets, currentPet, selectPet } = usePetStore();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>我的</Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            宠物档案
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddPet')}
            accessibilityRole="button"
          >
            <Text style={styles.addText}>+ 添加宠物</Text>
          </TouchableOpacity>
        </View>

        {pets.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => navigation.navigate('AddPet')}
          >
            <Text style={{ fontSize: 30 }}>🐾</Text>
            <Text style={styles.emptyText}>
              添加你的第一只宠物
            </Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={pets}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.petCard,
                  currentPet?.id === item.id &&
                    styles.petCardActive,
                ]}
                onPress={() => selectPet(item)}
              >
                <Text style={styles.petName}>
                  {item.name}
                </Text>
                <Text style={styles.petInfo}>
                  {item.breed} · {item.weight}kg
                </Text>
                {currentPet?.id === item.id && (
                  <Text style={styles.currentBadge}>
                    当前
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
        accessibilityRole="button"
      >
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    padding: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  addText: { color: COLORS.primary, fontWeight: '600' },
  petCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  petCardActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  petName: { fontSize: 16, fontWeight: '600', flex: 1 },
  petInfo: { color: COLORS.textSecondary, fontSize: 13 },
  currentBadge: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  logoutBtn: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
    alignItems: 'center',
  },
  logoutText: { color: COLORS.error, fontWeight: '600' },
});
```

- [ ] **Step 2: 创建宠物建档页面 apps/mobile/src/screens/profile/add-pet-screen.tsx**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '../../stores/pet.store';
import { COLORS, SPACING } from '../../constants/theme';

const SPECIES_OPTIONS = [
  { value: 'cat', label: '猫咪' },
  { value: 'dog', label: '狗狗' },
  { value: 'other', label: '其他' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: '男孩' },
  { value: 'female', label: '女孩' },
  { value: 'unknown', label: '不确定' },
];

export function AddPetScreen({ navigation }: any) {
  const { addPet } = usePetStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('cat');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('unknown');
  const [weight, setWeight] = useState('');

  const handleSubmit = async () => {
    if (!name || !breed || !weight) {
      Alert.alert('提示', '请填写必要信息');
      return;
    }
    try {
      await addPet({
        name,
        species,
        breed,
        birthday: birthday || '2024-01-01',
        gender,
        weight: parseFloat(weight),
      });
      Alert.alert('建档成功', `${name} 的档案已创建`, [
        { text: '好的', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('建档失败', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          onPress={() =>
            step > 1 ? setStep(step - 1) : navigation.goBack()
          }
        >
          <Text style={styles.back}>
            {step > 1 ? '上一步' : '返回'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.stepText}>
          第 {step} 步 / 共 3 步
        </Text>

        {step === 1 && (
          <>
            <Text style={styles.title}>
              你的宠物叫什么名字？
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="宠物昵称"
              maxLength={20}
              accessibilityLabel="宠物昵称"
            />
            <Text style={styles.label}>宠物类型</Text>
            <View style={styles.chipRow}>
              {SPECIES_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.chip,
                    species === opt.value &&
                      styles.chipActive,
                  ]}
                  onPress={() => setSpecies(opt.value)}
                >
                  <Text
                    style={
                      species === opt.value
                        ? styles.chipTextActive
                        : styles.chipText
                    }
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => {
                if (!name) {
                  Alert.alert('提示', '请输入宠物昵称');
                  return;
                }
                setStep(2);
              }}
            >
              <Text style={styles.nextBtnText}>
                下一步
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>
              {name} 的基本信息
            </Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="品种（如：英短、金毛）"
              accessibilityLabel="品种"
            />
            <TextInput
              style={styles.input}
              value={birthday}
              onChangeText={setBirthday}
              placeholder="生日（如：2024-01-01）"
              accessibilityLabel="生日"
            />
            <Text style={styles.label}>性别</Text>
            <View style={styles.chipRow}>
              {GENDER_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.chip,
                    gender === opt.value &&
                      styles.chipActive,
                  ]}
                  onPress={() => setGender(opt.value)}
                >
                  <Text
                    style={
                      gender === opt.value
                        ? styles.chipTextActive
                        : styles.chipText
                    }
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => {
                if (!breed) {
                  Alert.alert('提示', '请输入品种');
                  return;
                }
                setStep(3);
              }}
            >
              <Text style={styles.nextBtnText}>
                下一步
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>
              最后一步，{name} 多重？
            </Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="体重 (kg)"
              keyboardType="decimal-pad"
              accessibilityLabel="体重"
            />
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
            >
              <Text style={styles.nextBtnText}>
                完成建档
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  back: { color: COLORS.primary, fontSize: 16 },
  stepText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    marginBottom: SPACING.md,
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { color: COLORS.textSecondary },
  chipTextActive: { color: '#FFF' },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
```

- [ ] **Step 3: 更新导航添加 AddPet 路由**

修改 `apps/mobile/src/navigation/main-tabs.tsx`，将 MainTabs 改为使用 Stack 包裹 Tabs + AddPet：

创建 `apps/mobile/src/navigation/main-stack.tsx`：

```tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './main-tabs';
import { AddPetScreen } from '../screens/profile/add-pet-screen';

const Stack = createNativeStackNavigator();

export function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
```

更新 `apps/mobile/src/navigation/index.tsx`，将 `MainTabs` 替换为 `MainStack`：

```tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/auth.store';
import { AuthStack } from './auth-stack';
import { MainStack } from './main-stack';

export function RootNavigation() {
  const { isLoggedIn, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add apps/mobile/src/screens/profile/ apps/mobile/src/navigation/
git commit -m "feat: add profile screen and 3-step pet onboarding flow"
```

---

## Task 17: 最终验证与清理

- [ ] **Step 1: 安装所有依赖**

```bash
npm install
```

- [ ] **Step 2: 验证后端编译**

```bash
cd apps/server && npx nest build
```

Expected: 编译成功

- [ ] **Step 3: 运行后端全部测试**

```bash
cd apps/server && npx jest --verbose
```

Expected: 所有测试通过

- [ ] **Step 4: 验证前端 TypeScript 类型检查**

```bash
cd apps/mobile && npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 5: 最终提交**

```bash
git add -A
git commit -m "chore: final cleanup and verification for PawMind MVP Phase 1"
```

---

## 后续阶段规划

Phase 1 完成后，后续可按以下顺序迭代：

- **Phase 2:** 接入真实 AI API 替换 Mock，优化对话体验
- **Phase 3:** 图片上传功能（expo-image-picker + 后端文件存储）
- **Phase 4:** 推送通知（expo-notifications）
- **Phase 5:** 设备联动（MQTT 协议）
- **Phase 6:** 会员体系与付费功能
