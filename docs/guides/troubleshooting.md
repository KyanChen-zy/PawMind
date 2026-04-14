# PawMind 常见问题排查指南

> 记录开发过程中遇到的问题、根因分析和解决方案，避免重复踩坑。

---

## 问题一：Required property 'android.package' is not found

**日期：** 2026-04-13

**现象：**
运行 `npx expo run:android` 或构建 Android 应用时报错：
```
CommandError: Required property 'android.package' is not found
in the project app.json. This is required to open the app.
```

**根因：**
`apps/mobile/app.json` 的 `expo.android` 配置中缺少 `package`
字段。Expo 构建 Android 原生项目时需要该字段作为应用的唯一
标识符（等同于 Android 的 `applicationId`）。

**解决方案：**
在 `apps/mobile/app.json` 的 `android` 配置中添加 `package`：
```json
{
  "expo": {
    "android": {
      "package": "com.pawmind.mobile",
      ...
    }
  }
}
```

**备注：**
- `package` 命名遵循反向域名规范：`com.{组织}.{应用}`
- 一旦发布到 Google Play，包名不可更改
- 开发阶段使用 Expo Go 时不需要此字段，但生成原生项目
  （`expo prebuild` / `expo run:android`）时必须配置

---

## 问题二：Network Request Failed（API 请求失败）

**日期：** 2026-04-13

**现象：**
App 在真机上运行时，所有 API 请求报错 `Network request failed`，
Metro bundler 终端同时输出类似日志：
```
mobile/index.ts.bundle?platform=android&dev=true&hot=false
&lazy=true&transform.engine=hermes&transform.bytecode=1
&transform.routerRoot=app
&unstable_transformProfile=hermes-stable:97859
```

**根因：**
`apps/mobile/src/constants/api.ts` 中硬编码的开发环境 IP 地址
已过期。电脑的局域网 IP 从 `192.168.3.145` 变成了
`192.168.3.148`（路由器 DHCP 重新分配），导致手机无法连接到
后端服务器。

```typescript
// 问题配置
export const API_BASE_URL = __DEV__
  ? 'http://192.168.3.145:3000/api'  // ← IP 已变更
  : 'https://api.pawmind.app/api';
```

**解决方案：**
1. **即时修复** — 更新为当前 IP：
   ```typescript
   export const API_BASE_URL = __DEV__
     ? 'http://192.168.3.148:3000/api'
     : 'https://api.pawmind.app/api';
   ```
2. **长期方案（推荐）** — 在路由器中为开发电脑绑定固定
   局域网 IP（静态 DHCP），避免 IP 漂移：
   - 进入路由器管理页面（通常 `192.168.3.1`）
   - 找到 DHCP 静态绑定 / 地址预留
   - 将电脑 MAC 地址绑定到固定 IP（如 `192.168.3.100`）
   - 更新 `api.ts` 为绑定后的固定 IP

**排查步骤（供后续参考）：**
1. 确认后端服务器已启动：
   ```bash
   lsof -i :3000 -P -n
   ```
2. 查看电脑当前局域网 IP：
   ```bash
   # macOS
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Linux
   hostname -I
   ```
3. 测试后端是否可达：
   ```bash
   curl -s -o /dev/null -w "%{http_code}" \
     http://<你的IP>:3000/api
   ```
4. 在手机浏览器中访问 `http://<你的IP>:3000/api`
   确认手机能访问到后端
5. 检查 `app.json` 中 Android 是否配置了明文流量许可：
   ```json
   "android": {
     "usesCleartextTraffic": true
   }
   ```

**相关文件：**
- `apps/mobile/app.json` — Expo 应用配置
- `apps/mobile/src/constants/api.ts` — API 地址常量

---

## 快速诊断清单

遇到问题时可按以下顺序排查：

| 序号 | 检查项 | 命令/位置 |
|------|--------|----------|
| 1 | Metro bundler 是否运行 | 终端是否有 Metro 输出 |
| 2 | 后端服务器是否运行 | `lsof -i :3000` |
| 3 | IP 地址是否正确 | `ifconfig` 对比 `api.ts` |
| 4 | 手机和电脑是否同一网络 | 手机浏览器访问后端 |
| 5 | Android 明文流量 | `app.json` 中 `usesCleartextTraffic` |
| 6 | app.json 必填字段 | `android.package` 是否存在 |
