# CLAUDE.md

> [!IMPORTANT]
> **Git 提交与推送安全限制规则（必须无条件遵守）**：
> - **未经用户明确允许或当面授权，Agent 严禁在后台或以前台方式擅自执行 `git commit`、`git push` 等任何不可逆的代码版本控制操作。**
> - 在有代码修改完成后，仅可进行本地编译与测试，严禁自动执行提交和推送到远程的操作。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
- 项目定位：Ethan 的个人作品集（品牌：`weiqiang / 围墙`），核心主题是“打破技术壁垒”，面向招聘方与技术面试。
- 现状：前端（Vue 3 + Vite）已放置于根目录；后端 `api/` 尚未落地。
- 项目指南来源：优先遵循 `AGENTS.md` 的产品/视觉方向与工程约束。

## Common Commands
直接在项目根目录下执行：

```sh
pnpm dev
```

```sh
pnpm build
```

```sh
pnpm preview
```

目前未配置 lint/test 脚本。

## Architecture (High-level)
### Frontend
- Vue 3 + Vite + Vue Router（SPA）。入口为 `src/main.js`，根组件 `src/App.vue` 渲染路由。
- 路由：`/` → `HomeView.vue`，其内部拼装 Hero/About/Projects/Resume Agent 等分区。
- 语言与内容：`src/data/i18n.js` 承载中英文内容；`src/composables/useLocale.js` 管理 URL 参数 + LocalStorage 语言切换。
- Resume Agent：`src/components/agent/ResumeAgentPanel.vue` 使用 `useChatMock` → `src/services/chatClient.js`；当 `VITE_API_BASE_URL` 未配置时走 mock，配置后调用 `POST /api/chat`。
- API 基地址：`src/services/chatClient.js` 读取 `VITE_API_BASE_URL` 并拼接路径。

### Backend (planned)
- 规划为 Spring Boot 3 + Spring AI（参考 `AGENTS.md`），提供 `/api/profile`、`/api/projects`、`/api/chat` 与 SSE 版 `/api/chat/stream`。
- 数据规划：MySQL 负责结构化数据，Redis 负责会话与向量检索（RAG）。

## Product & Visual Constraints (from AGENTS.md)
- 视觉：Minimalist Dark + Geek Terminal，深色基底与终端氛围。
- 作品集叙事强调：高并发系统、架构取舍、AI Agent/RAG 实践。
- Resume Agent：前端需要保留流式交互形态，后续可切换至 SSE。
