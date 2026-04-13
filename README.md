# PawMind 🐾

AI 驱动的宠物陪伴应用，帮助都市宠物主人在工作和出行期间，通过 AI 互动、健康追踪和成长记录，与宠物保持情感连接。

> 宠物不会说话，但 AI 可以帮它们表达。

## 技术栈

- **移动端：** React Native + Expo + TypeScript + Zustand
- **后端：** NestJS + TypeORM + PostgreSQL + JWT 认证
- **共享包：** TypeScript 工具库
- **Monorepo：** npm workspaces

## 项目结构

```
├── apps/
│   ├── mobile/          # React Native Expo 移动应用
│   └── server/          # NestJS 后端服务
├── packages/
│   └── shared/          # 共享 TypeScript 工具
└── docs/                # 项目文档（PRD、架构、设计、指南）
```

## 快速开始

### 环境要求

- Node.js (支持 npm workspaces)
- PostgreSQL

### 安装依赖

```bash
npm install
```

### 启动开发

```bash
# 启动移动端
npm run mobile:start

# 启动后端服务
npm run server:dev
```

### 构建与测试

```bash
# 构建后端
npm run server:build

# 运行测试
npm test

# 测试覆盖率
npm run test:cov

# 代码检查
npm run lint
```

## 核心功能（v1.0 MVP）

- **宠物档案** — 3 步宠物建档，多宠管理
- **AI 陪伴聊天** — 宠物视角对话，情绪标签
- **健康管理** — 每日健康追踪，异常检测与分级预警
- **成长记录** — 照片/视频时间线，AI 月度成长报告
- **用户中心** — 账户管理与设置

## 文档

详细文档位于 `docs/` 目录：

- [产品需求文档](docs/prd/v1.0-mvp.md)
- [产品架构](docs/architecture/product-architecture-v1.0.md)
- [编码规范](docs/guides/coding-guidelines.md)
- [Git 工作流](docs/guides/git-workflow.md)
- [更新日志](docs/changelog/CHANGELOG.md)
