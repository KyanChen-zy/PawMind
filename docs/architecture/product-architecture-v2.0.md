# PawMind 产品架构文档 v2.0

> 从 v1.0 升级，描述 v2.0 AI 健康管理的系统整体结构、信息层级和核心数据模型。

## 产品定位

PawMind 是面向**城市养宠人群**的 AI 宠物健康管理 App，通过智能设备数据采集、健康指标可视化、AI 辅助诊断和健康知识服务，帮助主人全面掌握宠物健康状况，及时发现健康隐患。

**核心理念（v2.0）**：让 AI 成为宠物的私人健康管家。

## 核心数据流

```
多渠道健康数据（设备自动上报 / 手动录入 / 拍照扫描）
  → 数据聚合与指标计算
  → 健康指标可视化（24h / 7天）
  → AI 健康分析（异常检测 / 诊断 / 问答）
  → 主人知情 & 行动（预警 / 报告 / 就医建议）
```

## 全局结构图（移动端 App）

```
┌─ 顶部导航栏 ─────────────────────────────────────────────┐
│  PawMind Logo      [宠物昵称/切换]      通知铃 🔔  头像   │
├────────────────────────────────────────────────────────┤
│                                                        │
│                    主内容区                             │
│  ┌─────────────────────────────────────────────────┐  │
│  │                                                 │  │
│  │   今日状态卡 / CareAI / 健康指标 / 功能页面       │  │
│  │                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
├────────────────────────────────────────────────────────┤
│ 底部 TabBar                                            │
│  🏠 首页    🩺 CareAI    📊 健康    📸 成长册    👤 我   │
└────────────────────────────────────────────────────────┘
```

## 信息层级

```
用户账号（全局唯一，支持多宠物管理）
  └ 宠物档案（每只宠物独立档案）
      ├ 基础信息（品种 / 年龄 / 体重）
      ├ 绑定设备列表
      │   └ 设备详情（类型 / 电量 / 网络 / 产品信息）
      ├ 健康数据
      │   ├ 实时指标（设备上报：饮水量/饮食量/运动量/睡眠/体温/心率/排便）
      │   ├ 手动录入（体重/饮食量/饮水量/体温/排便）
      │   └ 指标可视化（24h / 7天趋势）
      ├ 健康档案
      │   ├ 就诊记录（诊断/处方/医嘱）
      │   └ 日常观察（自由文本/标签）
      ├ 电子疫苗本
      │   └ 疫苗记录（条形码扫描 + 接种提醒）
      ├ CareAI 记录
      │   ├ 健康问答历史
      │   ├ AI 诊断报告（口腔/粪便/皮肤/报告/药品）
      │   └ 每日小知识
      ├ 成长日记（照片 / 视频 / 里程碑）
      └ 行为分析（v3.0+）
```

## 核心数据模型

```
用户（User）— 保留 v1.0
  ├ id, email, passwordHash, nickname, avatar
  └ createdAt, updatedAt

宠物档案（Pet）— 保留 v1.0
  ├ id, userId, name, species, breed, birthday, gender, weight
  ├ avatar, personalityTags, status
  └ createdAt, updatedAt

设备商品（DeviceProduct）— v2.0 新增
  ├ id, name, type, brand
  ├ description, specs (JSON), imageUrl
  └ purchaseUrl, price, createdAt

绑定设备（Device）— v2.0 新增
  ├ id, userId, petId, productId
  ├ name, deviceType, serialNumber
  ├ status (online/offline), batteryLevel, networkStatus
  └ bindTime, createdAt, updatedAt

健康指标（HealthMetric）— v2.0 新增
  ├ id, petId, metricType, value, unit
  ├ source (device/manual), deviceId
  └ recordedAt, createdAt

健康日志（HealthLog）— 保留 v1.0
  ├ id, petId, date
  ├ weight, appetiteLevel, activityLevel, waterIntake
  ├ symptoms, notes
  ├ isAlert, alertType, severity
  └ createdAt, updatedAt

健康档案（HealthRecord）— v2.0 新增
  ├ id, petId, recordType (visit/observation)
  ├ visitDate, hospitalName, diagnosis, prescription, doctorAdvice
  ├ content, tags (JSON), inputMethod, attachments (JSON)
  └ createdAt, updatedAt

疫苗记录（Vaccination）— v2.0 新增
  ├ id, petId, vaccineName, barcode
  ├ vaccinationDate, expiryDate, nextDueDate
  ├ institution, batchNumber, notes
  └ createdAt, updatedAt

CareAI 会话（CareAiSession）— v2.0 新增（替换 AIConversation）
  ├ id, petId
  └ createdAt, updatedAt

CareAI 消息（CareAiMessage）— v2.0 新增（替换 Message）
  ├ id, sessionId, role (user/assistant), content
  └ createdAt

每日小知识（DailyTip）— v2.0 新增
  ├ id, title, content, summary
  ├ category, targetSpecies, source (fixed/ai_generated)
  └ isActive, publishDate, createdAt

AI 诊断报告（DiagnosisReport）— v2.0 新增
  ├ id, petId, sessionId
  ├ diagnosisType, imageUrl
  ├ resultSummary, resultDetail (JSON)
  └ savedToRecord, createdAt

成长记录（GrowthRecord）— 保留 v1.0
  ├ id, petId, type, content, mediaUrl
  └ createdAt

关联关系：
  - 用户 1 对多 宠物档案
  - 用户 1 对多 绑定设备
  - 宠物 1 对多 绑定设备
  - 宠物 1 对多 健康指标
  - 宠物 1 对多 健康档案
  - 宠物 1 对多 疫苗记录
  - 宠物 1 对多 CareAI 会话
  - 宠物 1 对多 诊断报告
  - 宠物 1 对多 成长记录
  - 设备 1 对多 健康指标（source=device）
  - 设备商品 1 对多 绑定设备
  - CareAI 会话 1 对多 CareAI 消息
  - 删除宠物档案时级联归档（不物理删除）
```

## 技术架构

```
┌──────────────────────────────────────────────────────────┐
│               移动端 (React Native + Expo)                 │
│  ┌────────┬──────────┬──────────┬──────────┬──────────┐ │
│  │  首页   │ CareAI   │   健康   │  成长册   │   我的   │ │
│  └───┬────┴────┬─────┴────┬─────┴────┬─────┴────┬────┘ │
│      └─────────┴──────────┴──────────┴──────────┘      │
│                 API 调用层 (services/)                    │
│                 Zustand 状态管理                          │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP / REST
┌───────────────────────┴──────────────────────────────────┐
│               后端 (NestJS + TypeORM)                      │
│  ┌──────┬──────┬─────────┬────────┬──────┬──────────┐  │
│  │ Auth │ Pet  │ CareAI  │ Health │Device│Vaccination│  │
│  └──┬───┴──┬───┴────┬────┴───┬────┴──┬───┴─────┬────┘  │
│     └──────┴────────┴────────┴───────┴─────────┘       │
│                      PostgreSQL                          │
└──────────────────────────────────────────────────────────┘
```

## AI 能力架构

```
触点 1：健康知识问答（对话级）— v2.0 新增
  - 能做：回答宠物健康相关问题，提供护理建议
  - 上下文：宠物档案（品种/年龄/体重）
  - v2.0 实现：Mock 回复（预置知识库关键词匹配）
  - 预留：AI API 接口，后续接入大语言模型

触点 2：AI 拍照诊断（功能级）— v2.0 新增
  - 能做：分析宠物口腔/粪便/皮肤照片，解读检验报告，识别药品
  - v2.0 实现：Mock 分析结果（UI 和流程完整）
  - 预留：多模态 AI API 接口

触点 3：健康异常检测（模块级）— 保留 v1.0
  - 能做：检测体征异常、判断严重程度、给出行动建议
  - 上下文：宠物健康基线 + 近 30 天健康数据 + 品种特征库

触点 4：成长报告生成（对象级）— 保留 v1.0
  - 能做：读取月度数据，生成有温度的图文总结
  - 上下文：当月所有成长记录 + 健康数据 + 里程碑事件
```

## 设计原则

| 原则 | 说明 |
|------|------|
| **数据驱动决策** | 健康指标给出明确的正常/异常判断和行动建议，不让用户自己解读原始数据 |
| **设备即服务** | 未绑定设备 = 营销机会，用「解锁功能」的方式引导用户购买设备 |
| **AI 透明可信** | 所有 AI 分析结果附带免责声明和数据来源说明，不过度承诺 AI 能力 |
| **输入零门槛** | 提供多种输入方式（打字/OCR/语音/扫码），降低记录门槛 |
| **降级而非崩溃** | AI 失败时保留基础功能；不因 AI 服务不可用让 App 无法使用 |

## 版本演进

| 版本 | 目标 |
|------|------|
| **v1.0 MVP** | 建档 → AI 对话 → 健康录入 → 成长记录，验证 AI 陪伴情感价值 |
| **v2.0 AI 健康管理（当前）** | 健康管理升级（多渠道数据 + 可视化 + 设备 + 疫苗本 + 档案）+ CareAI（问答 + 诊断） |
| **v3.0** | 宠物社区 + AI 行为分析 + 多人共养 / 宠物交友 |
