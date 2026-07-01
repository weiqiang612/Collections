# TASK-004: Tasks

**Spec**: `spec.md`
**Status**: Completed

## Key decisions
- 复用现有 `/projects/:projectId` 详情页体系和 `src/data/i18n.js` 静态数据源，不新增路由结构或远程内容系统。
- Personal CRM 定位为“产品化全栈 CRM 系统”案例，重点展示业务闭环、账号安全、移动端适配、受控 Contact Agent 与部署交付能力。
- 截图资产从 Personal CRM 项目现有 `artifacts` 目录整理到 Collection 本仓库资产目录，避免详情页使用抽象占位内容。

## Progress

- [x] T1 — 更新 `docs/1-requirements/project_overview.md` 与 `docs/1-requirements/requirements_analysis.md`，将项目展示范围从三个项目扩展为四个项目，并补充 Personal CRM 的业务定位与访客浏览场景 · covers: doc-maintenance, AC-001, AC-002
- [x] T2 — 更新 `docs/2-designs/architecture.md`，补充第 4 个项目进入静态数据源、项目轮播和详情页体系后的结构说明 · covers: doc-maintenance, AC-001, AC-002, AC-004
- [x] T3 — 更新 `docs/2-designs/ui_prototype.md`，补充四项目 Case Strip、Personal CRM 详情页媒体/截图展示和 UI 验收要求 · covers: doc-maintenance, AC-001, AC-003, AC-UI-UX
- [x] T4 — 整理 Personal CRM 截图资产到 `src/assets/projects/personal-crm/`，优先覆盖看板、联系人详情、智能助手和移动端看板，并采用适合 Vite 打包的命名与格式 · covers: AC-003, AC-UI-UX
- [x] T5 — 在 `src/data/i18n.js` 中新增 Personal CRM 的 Mermaid 图定义，覆盖产品架构、Agent 受控写操作或部署拓扑等核心证明路径 · covers: AC-002, AC-003
- [x] T6 — 在 `src/data/i18n.js` 中文项目数组中新增 `personal-crm` 项目数据，包括首页卡片字段、详情页指标、媒体区、产品证明区、技术亮点、职责范围和复盘内容 · covers: AC-001, AC-002, AC-003, AC-004
- [x] T7 — 在 `src/data/i18n.js` 英文项目数组中新增同结构 `personal-crm` 项目数据，确保语言切换后字段完整且表达一致 · covers: AC-001, AC-002, AC-004
- [x] T8 — 必要时微调现有项目媒体或产品证明渲染逻辑，使 Personal CRM 的截图型展示可复用现有组件且不破坏原有三个项目 · covers: AC-002, AC-003, AC-004, AC-UI-UX
- [x] T9 — 检查 Resume Agent mock 内容和项目相关文案，确保第 4 个项目可被合理提及且不破坏现有回答风格 · covers: AC-004
- [x] T10 — 运行 `pnpm build`，确认生产构建通过 · covers: AC-001, AC-002, AC-003, AC-004
- [x] T11 — 执行 Chrome MCP UI 验收：检查 `/` 与 `/projects/personal-crm` 在 `1440x900`、`375x812` 下的布局、hover、轮播、返回按钮、媒体区、Mermaid、控制台，并归档 `task-004-home-desktop.png`、`task-004-home-mobile.png`、`task-004-personal-crm-detail-desktop.png`、`task-004-personal-crm-detail-mobile.png` · covers: AC-UI-UX
- [x] T12 — 对照 `spec.md` 验证全部 AC，通过后将对应 `passes` 更新为 `true` · covers: AC-001, AC-002, AC-003, AC-004, AC-UI-UX
- [x] T13 — 更新 `docs/4-tasks/CURRENT_PLAN.md`，在实现完成后标记 TASK-004 完成并保留历史 Completed 项 · covers: doc-maintenance

## Dependencies
- T1-T3 文档维护应先于实现任务完成，确保长期 Harness 文档与新增项目事实同步。
- T4 截图资产整理应先于 T6-T8 的媒体区和产品证明区数据接入。
- T5-T8 的静态数据和渲染接入应先于 T10-T12 的构建与验收。
- T13 只能在实现、构建、UI 验收和 AC 回写完成后执行。

## Blockers
<!-- Fill in if something is preventing progress -->



