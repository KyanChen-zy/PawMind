# Changelog

所有重要变更记录在此文件中。格式基于 [Keep a Changelog](https://keepachangelog.com/)。

## [Unreleased]

## [v2.0.0] - 2026-04-13

### 新增
- **健康管理升级**：多渠道数据采集（设备 + 手动），健康指标卡（24h/7天），数据可视化
- **设备管理**：设备绑定/解绑/详情，3步配对向导（Mock），展示型商城（外链购买）
- **健康档案**：就诊记录 + 日常观察，支持打字/OCR/语音输入（OCR/语音 v2.0 为占位）
- **电子疫苗本**：条形码扫描添加疫苗（扫描 v2.0 为占位），接种提醒
- **CareAI 模块**：健康知识问答（Mock），每日小知识，AI 诊断（口腔/粪便/皮肤/报告/药品，Mock）
- 后端新增 device、vaccination、care-ai 模块，扩展 health 模块（HealthMetric、HealthRecord）
- 41 个单元测试，9 个测试套件

### 变更
- 移除 AI 陪伴聊天模块（宠物视角对话），替换为 CareAI
- 底部导航：「AI陪伴」→「CareAI」
- 版本路线图更新：v2.0 重新定义为 AI 健康管理，原社区功能推迟至 v3.0
- PROJECT_RULES.md 更新模块 scope（新增 care-ai、device、vaccination）

### 技术变更
- 删除 chat 模块（Conversation、Message 实体）
- 新增 9 个数据库实体：Device、DeviceProduct、HealthMetric、HealthRecord、Vaccination、CareAiSession、CareAiMessage、DailyTip、DiagnosisReport
- 新增 14 个移动端页面，3 个 Zustand Store，4 个 API Service

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
