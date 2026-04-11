# PawMind v1.0 MVP 设计文档

## 项目概述

PawMind 是面向城市养宠人群的 AI 宠物陪伴 App，通过 AI 语音互动、行为分析和健康追踪，帮助主人在工作繁忙或出差期间仍能与宠物保持情感连接。

## 技术选型

| 层级 | 技术选择 |
|------|---------|
| 前端 | React Native + Expo (TypeScript) |
| 后端 | NestJS (TypeScript) |
| 数据库 | PostgreSQL + TypeORM |
| AI 对话 | 先 Mock，后续接入真实 API |
| 状态管理 | Zustand |
| 导航 | React Navigation v6 |
| 图片存储 | 本地文件系统 (MVP) |
| 认证 | JWT (access + refresh token) |

## MVP 功能范围 (全部 P0)

### 1. 用户系统
- 手机号/邮箱注册登录
- JWT 认证（access token + refresh token）
- 用户基础信息管理

### 2. 宠物建档模块
- 3步建档流程（基础信息 → 健康信息 → 上传照片）
- 多宠物管理（单账号支持绑定多只宠物）
- 宠物信息编辑（随时更新体重、疫苗、照片等）

### 3. AI 陪伴对话模块
- AI 对话（宠物视角，以第一人称回应主人）— Mock 实现
- 语音输入 — 文字输入先行，语音后续迭代
- 对话气泡式界面，附宠物表情包

### 4. 健康管理模块
- 今日健康录入（体重/进食/活动量/症状快速录入）
- 健康趋势图（近 7/30 天关键指标折线图）
- 异常预警（AI 检测到异常时主动提醒）
- 预警严重程度分级（观察/注意/立即就医 三级）

### 5. 成长记录模块
- 照片/视频上传（随时记录，附文字）
- 时间轴展示（按时间倒序，卡片式）

## 核心数据模型

### User（用户）
- id, email, phone, password_hash, nickname, avatar
- created_at, updated_at

### PetProfile（宠物档案）
- id, user_id (FK), name, species, breed, birthday, gender
- weight, avatar, personality_tags, vaccine_list
- status (active/archived), created_at, updated_at

### AIConversation（AI 对话会话）
- id, pet_id (FK), created_at, updated_at

### AIMessage（AI 对话消息）
- id, conversation_id (FK), role (user/ai), content
- emotion_tag, created_at

### HealthLog（健康日志）
- id, pet_id (FK), date
- weight, appetite_level, activity_level, water_intake
- symptoms, notes
- is_alert, alert_type, severity (observe/caution/urgent)
- created_at, updated_at

### GrowthRecord（成长记录）
- id, pet_id (FK), content_type (photo/video/text)
- media_url, description, tags
- created_at

## 项目结构

```
pawmind/
├── apps/
│   ├── mobile/                  # React Native + Expo
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── App.tsx
│   │   └── src/
│   │       ├── screens/         # 页面组件
│   │       │   ├── auth/        # 登录注册
│   │       │   ├── home/        # 首页
│   │       │   ├── chat/        # AI 陪伴
│   │       │   ├── health/      # 健康管理
│   │       │   ├── growth/      # 成长册
│   │       │   └── profile/     # 我的
│   │       ├── components/      # 通用组件
│   │       │   ├── ui/          # 基础 UI 组件
│   │       │   └── business/    # 业务组件
│   │       ├── navigation/      # 导航配置
│   │       ├── services/        # API 调用层
│   │       ├── stores/          # Zustand 状态管理
│   │       ├── hooks/           # 自定义 hooks
│   │       ├── utils/           # 工具函数
│   │       ├── constants/       # 常量定义
│   │       ├── types/           # TypeScript 类型
│   │       └── assets/          # 静态资源
│   └── server/                  # NestJS 后端
│       ├── package.json
│       ├── tsconfig.json
│       ├── nest-cli.json
│       └── src/
│           ├── main.ts
│           ├── app.module.ts
│           ├── modules/
│           │   ├── auth/        # 认证模块
│           │   ├── user/        # 用户模块
│           │   ├── pet/         # 宠物档案模块
│           │   ├── chat/        # AI 对话模块
│           │   ├── health/      # 健康管理模块
│           │   └── growth/      # 成长记录模块
│           ├── common/
│           │   ├── decorators/  # 自定义装饰器
│           │   ├── filters/     # 异常过滤器
│           │   ├── guards/      # 守卫
│           │   ├── interceptors/# 拦截器
│           │   └── pipes/       # 管道
│           ├── config/          # 配置
│           └── database/        # 数据库相关
│               ├── entities/    # TypeORM 实体
│               └── migrations/  # 数据库迁移
└── packages/
    └── shared/                  # 前后端共享类型
        ├── package.json
        └── src/
            ├── types/           # 共享类型定义
            └── constants/       # 共享常量
```

## 接口设计概要

### Auth
- POST /api/auth/register — 注册
- POST /api/auth/login — 登录
- POST /api/auth/refresh — 刷新 token

### Pet
- POST /api/pets — 创建宠物档案
- GET /api/pets — 获取用户所有宠物
- GET /api/pets/:id — 获取单个宠物详情
- PUT /api/pets/:id — 更新宠物信息
- DELETE /api/pets/:id — 删除（归档）宠物

### Chat
- POST /api/pets/:petId/conversations — 创建对话
- GET /api/pets/:petId/conversations — 获取对话列表
- POST /api/conversations/:id/messages — 发送消息
- GET /api/conversations/:id/messages — 获取消息列表

### Health
- POST /api/pets/:petId/health-logs — 创建健康日志
- GET /api/pets/:petId/health-logs — 获取健康日志（支持日期范围筛选）
- GET /api/pets/:petId/health-logs/trends — 获取健康趋势数据
- GET /api/pets/:petId/health-logs/alerts — 获取预警列表
- PUT /api/health-logs/:id/resolve — 标记预警已处理

### Growth
- POST /api/pets/:petId/growth-records — 创建成长记录
- GET /api/pets/:petId/growth-records — 获取成长记录（时间轴）
- DELETE /api/growth-records/:id — 删除成长记录

## 编码规范

遵循 AI_CODING_GUIDELINES.md：
- 变量/函数名：camelCase
- 类名：PascalCase
- 常量：UPPER_SNAKE_CASE
- 文件/目录名：小写字母，连字符分隔
- 2 空格缩进，行长不超过 80 字符
- JSDoc 风格注释，中文注释

## 设计原则

1. 情感优先于功能
2. 主人不应该做判断员（健康数据给出行动建议）
3. 宠物是主角，主人是感知者
4. 陪伴轻触化（30秒内完成互动）
5. 降级而非崩溃（AI失败保留基础功能）

---

*文档版本：v1.0 | 创建日期：2026-04-12*
