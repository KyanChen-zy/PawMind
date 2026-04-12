# Changelog

所有重要变更记录在此文件中。格式基于 [Keep a Changelog](https://keepachangelog.com/)。

## [Unreleased]

### 新增
- 补充 growth 模块和 user 模块单元测试（总测试数 6 套件 24 用例）

### 优化
- 首页 UI 全面重设计（状态卡片、快捷操作栏、健康指标、入场动画）
- 登录/注册页面视觉升级（渐变背景、卡片布局、动画效果）
- AI 陪伴对话页 UI 优化（气泡样式、快捷话题栏）
- 健康管理页 UI 优化（健康指标卡片、趋势图样式）
- 成长记录页 UI 优化（时间轴卡片、空状态引导）
- 宠物建档页 UI 优化（3 步流程卡片化、动画过渡）
- 个人中心页 UI 优化（宠物信息卡片、菜单样式）
- 底部 TabBar 视觉升级（图标、配色、选中状态）
- 主题色系统增强（新增渐变色、阴影层级、字体规范）

### 修复
- 修复首页动画透明度卡在低值的问题（分离数据加载与动画逻辑）
- 修复 Web 端聊天输入框不显示（移除 KeyboardAvoidingView）
- 修复 Web 端首页不渲染（移除错误的 linking 配置）
- 修复 add-pet-screen JSX 标签不匹配
- 修复 growth-screen 缺少 SHADOWS 导入
- 修复 expo-secure-store 在 Web 端不可用（增加 localStorage 降级）
- 修复 jest 测试脚本无法执行（改用 npx jest）

### 变更
- 文档目录重组为标准化结构（architecture/prd/design/plans/guides/changelog）
- 新增项目管理规则 (PROJECT_RULES.md)
- 新增产品架构文档 (product-architecture-v1.0.md)
- 新增开发指南（preview-guide / git-workflow / ui-design-optimization）
- 后端 dev 脚本改用 ts-node 直接运行
- .gitignore 增强 .DS_Store 全局忽略

---

## [v1.0.0-alpha] - 2026-04-12

### 新增
- **用户系统**：邮箱注册登录，JWT 认证（access + refresh token）
- **宠物档案**：3步建档流程，多宠物管理，信息编辑，软删除
- **AI 陪伴对话**：宠物视角 Mock 回复，快捷话题，情绪标签，对话记忆
- **健康管理**：每日健康录入，7/30天趋势图，异常预警（观察/注意/立即就医三级），预警处理
- **成长记录**：文字记录，时间轴展示，新增/删除
- **前端**：React Native + Expo，5个核心页面，Zustand 状态管理，SafeAreaProvider
- **后端**：NestJS + TypeORM + PostgreSQL，5个功能模块，14个单元测试
- **工程化**：npm workspaces monorepo，共享类型包，Web + 移动端双平台支持
