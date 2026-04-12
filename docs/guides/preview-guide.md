# PawMind 项目预览配置指南

## 环境要求

- Node.js >= 18
- PostgreSQL
- Expo Go App（手机端，App Store / Google Play 搜索 "Expo Go"）
- 手机与电脑在同一 WiFi 网络

## 1. 安装依赖

```bash
# 项目根目录
npm install
```

## 2. 数据库配置

```bash
# 创建数据库（替换为你的 PostgreSQL 密码）
PGPASSWORD=你的密码 /opt/homebrew/opt/libpq/bin/psql -U postgres -d postgres -c "CREATE DATABASE pawmind;"
```

编辑 `apps/server/.env`，填入你的 PostgreSQL 密码：

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=你的密码
DB_DATABASE=pawmind
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
```

首次启动后端时 TypeORM 会自动创建所有表（`synchronize: true`）。

## 3. 启动后端

```bash
npm run server:dev
```

## 4. 创建演示账号

```bash
# 注册用户
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@pawmind.com","password":"123456","nickname":"演示用户"}'

# 用返回的 accessToken 创建宠物
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"name":"毛球","species":"cat","breed":"英短蓝猫","birthday":"2023-06-15","gender":"male","weight":4.5}'
```

演示账号信息也保存在 `apps/server/.env.demo` 中。

## 5. 配置前端 API 地址

编辑 `apps/mobile/src/constants/api.ts`，将 IP 改为你电脑的局域网地址：

```bash
# 查看本机 IP
ipconfig getifaddr en0
```

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://你的局域网IP:3000/api'
  : 'https://api.pawmind.app/api';
```

## 6. 启动前端

```bash
npm run mobile:start
```

用手机扫描终端中的二维码：
- iOS：系统相机扫码
- Android：Expo Go 内扫码

## 7. 登录

使用演示账号登录：
- 邮箱：`demo@pawmind.com`
- 密码：`123456`

## 常见问题

### Network request failed

1. 确认手机和电脑在同一 WiFi
2. 确认 `api.ts` 中的 IP 地址正确
3. 确认 `app.json` 中已配置 ATS（iOS）和 cleartext（Android）：
   ```json
   "ios": {
     "infoPlist": {
       "NSAppTransportSecurity": { "NSAllowsArbitraryLoads": true }
     }
   },
   "android": {
     "usesCleartextTraffic": true
   }
   ```
4. 修改 `app.json` 后需重启 Expo

### nest: command not found

`apps/server/package.json` 中的 dev 脚本已改为 `node --require ts-node/register src/main.ts`，无需全局安装 `@nestjs/cli`。

### watchman 警告

```bash
watchman watch-del '/项目路径' ; watchman watch-project '/项目路径'
```

### Git 推送超时

设置代理后推送：
```bash
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
git push -u origin main
```
