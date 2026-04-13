# PawMind 项目管理规则

> 本文档是项目管理的总纲，定义文档结构、版本管理、迭代流程和协作规范。

## 一、文档目录结构

```
docs/
├── architecture/           # 产品架构文档
│   └── product-architecture-v{版本号}.md
├── prd/                    # 产品需求文档（按版本）
│   └── v{版本号}-{简述}.md
├── design/                 # 技术设计文档（按功能/日期）
│   └── YYYY-MM-DD-{功能名}-design.md
├── plans/                  # 实施计划（按功能/日期）
│   └── YYYY-MM-DD-{功能名}-plan.md
├── guides/                 # 开发指南（持续维护）
│   ├── coding-guidelines.md
│   ├── preview-guide.md
│   └── git-workflow.md
├── changelog/              # 变更日志
│   └── CHANGELOG.md
└── PROJECT_RULES.md        # 本文件（项目管理总纲）
```

### 命名规范

| 文档类型 | 命名格式 | 示例 |
|---------|---------|------|
| 产品架构 | `product-architecture-v{版本}.md` | `product-architecture-v1.0.md` |
| PRD | `v{版本}-{简述}.md` | `v1.0-mvp.md` |
| 技术设计 | `YYYY-MM-DD-{功能名}-design.md` | `2026-04-12-ai-chat-design.md` |
| 实施计划 | `YYYY-MM-DD-{功能名}-plan.md` | `2026-04-12-mvp-phase1-plan.md` |
| 开发指南 | `{主题}.md` | `coding-guidelines.md` |

## 二、版本管理

### 版本号规范

采用语义化版本号 `MAJOR.MINOR.PATCH`：

- **MAJOR**：重大架构变更或不兼容更新（如 v2.0）
- **MINOR**：新增功能模块（如 v1.5 加入设备联动）
- **PATCH**：Bug 修复和小改进（如 v1.0.1）

### 版本路线图

| 版本 | 目标 | 状态 |
|------|------|------|
| v1.0 MVP | 建档 + AI 对话 + 健康管理 + 成长记录 | 已完成 |
| v2.0 | AI 健康管理升级（多渠道数据 + 可视化 + 设备管理 + 疫苗本 + 健康档案）+ CareAI（问答 + 诊断） | 开发中 |
| v3.0 | 宠物社区 + AI 行为分析 + 多人共养 / 宠物交友 | 规划中 |

### 分支策略

```
main                    ← 稳定发布分支
├── feature/xxx         ← 功能开发分支
├── fix/xxx             ← Bug 修复分支
└── UI-Design-Optimize  ← UI/UX 优化分支（当前）
```

**分支命名规范：**

| 类型 | 格式 | 示例 |
|------|------|------|
| 功能 | `feature/{模块}-{简述}` | `feature/chat-voice-input` |
| 修复 | `fix/{简述}` | `fix/home-animation` |
| 优化 | `optimize/{简述}` | `optimize/ui-design` |
| 发布 | `release/v{版本}` | `release/v1.0.0` |

**合并规则：**

1. 功能分支从 `main` 创建，完成后合并回 `main`
2. 合并前确保：代码编译通过、测试通过、文档已更新
3. 使用 `git merge --no-ff` 保留合并记录

## 三、迭代流程

每个功能迭代遵循以下流程：

```
┌─────────────────────────────────────────────────────────────┐
│  1. 需求收集     →  明确要做什么、为什么做                      │
│  2. PRD 编写     →  产品需求文档，定义功能和验收标准              │
│  3. 技术设计     →  技术方案、数据模型、接口设计                  │
│  4. 实施计划     →  拆解任务、评估工时、确定顺序                  │
│  5. 开发实现     →  按计划逐任务开发，频繁提交                    │
│  6. 测试验证     →  单元测试 + 手动测试 + 兼容性测试              │
│  7. 发布上线     →  合并到 main，打 tag，更新 CHANGELOG          │
│  8. 回顾总结     →  记录问题和改进点                            │
└─────────────────────────────────────────────────────────────┘
```

### 文档产出时机

| 阶段 | 产出文档 | 存放位置 |
|------|---------|---------|
| 需求收集 | PRD | `docs/prd/` |
| 技术设计 | 设计文档 | `docs/design/` |
| 实施计划 | 计划文档 | `docs/plans/` |
| 发布上线 | CHANGELOG | `docs/changelog/` |

### 新版本启动检查清单

- [ ] 上一版本已合并到 main 并打 tag
- [ ] CHANGELOG 已更新
- [ ] 新版本 PRD 已编写并评审
- [ ] 技术设计文档已完成
- [ ] 实施计划已拆解

## 四、Git Commit 规范

遵循 Conventional Commits 格式：

```
<type>(<scope>): <description>

[optional body]
```

### type 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(chat): add voice input` |
| `fix` | 修复 Bug | `fix(home): resolve animation opacity issue` |
| `docs` | 文档变更 | `docs: add preview guide` |
| `style` | 代码格式（不影响功能） | `style: fix indentation` |
| `refactor` | 重构（不新增功能、不修 Bug） | `refactor(api): simplify request handler` |
| `test` | 添加或修改测试 | `test(auth): add login edge cases` |
| `chore` | 构建/工具/依赖变更 | `chore: update dependencies` |

### scope 范围

使用模块名：`auth`, `pet`, `care-ai`, `health`, `device`, `vaccination`, `growth`, `home`, `profile`, `api`, `nav`

## 五、CHANGELOG 规范

文件位置：`docs/changelog/CHANGELOG.md`

格式：

```markdown
# Changelog

## [v1.0.0] - 2026-XX-XX

### 新增
- 用户注册登录（邮箱 + JWT 认证）
- 宠物档案管理（3步建档 + 多宠物切换）
- AI 宠物对话（Mock 实现）
- 健康管理（录入 + 趋势图 + 异常预警）
- 成长记录（时间轴 + 文字记录）

### 修复
- 修复首页动画透明度问题
- 修复 Web 端聊天输入框不显示

### 变更
- 文档目录重组
```

每次发布必须更新 CHANGELOG。

## 六、代码规范

详见 `docs/guides/coding-guidelines.md`，核心要点：

- **命名**：变量/函数 camelCase，类 PascalCase，常量 UPPER_SNAKE_CASE
- **缩进**：2 空格
- **行长**：不超过 80 字符
- **注释**：JSDoc 风格，中文注释
- **测试**：核心模块覆盖率 ≥ 80%

## 七、发布流程

```bash
# 1. 确保在功能分支上，所有测试通过
npm run server:dev    # 后端正常
npx tsc --noEmit      # 无类型错误
npm test              # 测试通过

# 2. 合并到 main
git checkout main
git merge --no-ff feature/xxx -m "feat: merge xxx feature"

# 3. 打版本 tag
git tag -a v1.0.0 -m "Release v1.0.0: MVP launch"

# 4. 推送
git push origin main --tags

# 5. 更新 CHANGELOG
```

## 八、文档模板

### PRD 模板

```markdown
# [功能名称] — 产品需求文档

## 版本信息
| 字段 | 内容 |
|------|------|
| 版本 | vX.X |
| 日期 | YYYY-MM-DD |
| 状态 | 草稿/评审中/已确认 |

## 背景与目标
[为什么做这个功能]

## 用户场景
[谁在什么情况下使用]

## 功能需求
[具体的功能点和验收标准]

## 非功能需求
[性能、安全、兼容性等]

## 优先级
P0/P1/P2 标注

## 排期
预估开发周期
```

### 技术设计模板

```markdown
# [功能名称] 技术设计

## 目标
[一句话描述]

## 方案概述
[架构、技术选型、核心思路]

## 数据模型
[新增/修改的数据结构]

## 接口设计
[新增/修改的 API]

## 关键实现
[核心逻辑说明]

## 测试策略
[如何验证]
```
