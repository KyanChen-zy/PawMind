# Git 工作流指南

## 分支策略

```
main                        ← 稳定发布分支，始终可部署
├── feature/{模块}-{简述}    ← 功能开发
├── fix/{简述}               ← Bug 修复
├── optimize/{简述}          ← 性能/UI 优化
└── release/v{版本}          ← 发布准备
```

## 日常开发流程

### 1. 开始新功能

```bash
# 从 main 创建功能分支
git checkout main
git pull origin main
git checkout -b feature/chat-voice-input
```

### 2. 开发过程中

```bash
# 频繁提交，每个提交做一件事
git add <specific-files>
git commit -m "feat(chat): add voice recording button"

# 定期推送到远程
git push -u origin feature/chat-voice-input
```

### 3. 完成功能

```bash
# 确保测试通过
cd apps/server && npm test
cd apps/mobile && npx tsc --noEmit

# 合并到 main
git checkout main
git merge --no-ff feature/chat-voice-input
git push origin main

# 删除功能分支
git branch -d feature/chat-voice-input
git push origin --delete feature/chat-voice-input
```

## 发布流程

```bash
# 1. 创建发布分支
git checkout -b release/v1.0.0

# 2. 更新版本号和 CHANGELOG
# 编辑 docs/changelog/CHANGELOG.md

# 3. 提交发布准备
git commit -am "chore: prepare release v1.0.0"

# 4. 合并到 main
git checkout main
git merge --no-ff release/v1.0.0

# 5. 打标签
git tag -a v1.0.0 -m "Release v1.0.0: MVP launch"

# 6. 推送
git push origin main --tags
```

## Commit 消息格式

```
<type>(<scope>): <description>
```

**type**: feat | fix | docs | style | refactor | test | chore
**scope**: auth | pet | chat | health | growth | home | profile | api | nav

### 示例

```
feat(chat): add voice input support
fix(home): resolve animation opacity stuck at 0
docs: update preview guide with proxy settings
refactor(api): extract error handling middleware
test(auth): add password validation edge cases
chore: upgrade expo to v55
```
