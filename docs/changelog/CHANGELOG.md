# Changelog

所有重要变更记录在此文件中。格式基于 [Keep a Changelog](https://keepachangelog.com/)。

## [Unreleased]

### 修复
- 修复首页动画透明度卡在低值的问题（分离数据加载与动画逻辑）
- 修复 Web 端聊天输入框不显示（移除 KeyboardAvoidingView）
- 修复 Web 端首页不渲染（移除错误的 linking 配置）
- 修复 add-pet-screen JSX 标签不匹配
- 修复 growth-screen 缺少 SHADOWS 导入

### 变更
- 文档目录重组为标准化结构
- 新增项目管理规则 (PROJECT_RULES.md)
- 后端 dev 脚本改用 ts-node 直接运行

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
