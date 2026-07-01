# TASK-004: Add Personal CRM Project

**Status**: Completed
**Created**: 2026-07-01
**Feature dir**: `docs/4-tasks/features/TASK-004-add-personal-crm-project/`

## Objective
将已上线的 Personal CRM 智能联系人管理平台纳入作品集项目展示体系，补齐第 4 个可展开的全栈产品化项目案例。

## Scope

### In scope
- 在首页项目轮播中新增 Personal CRM 项目卡片，保持现有 Case Strip 交互和数据驱动结构。
- 在 `/projects/:projectId` 统一详情页体系中新增 `/projects/personal-crm`，展示项目定位、核心指标、产品截图、架构图、职责范围和技术复盘。
- 整理 Personal CRM 现有截图资产，优先使用看板、联系人详情、智能助手和移动端看板截图，作为产品落地证据。
- 更新中英文 `i18n.js` 项目数据，使首页、详情页和 Resume Agent mock 内容能够识别第 4 个项目。
- 同步维护长期 Harness 文档中关于项目数量、项目展示范围、架构数据源和 UI 展示规则的描述。

### Out of scope
- 不新增或修改 Vue Router 路由结构，继续复用 `/projects/:projectId`。
- 不新增后端 API、数据库、远程 CMS、上传服务或运行时配置。
- 不新增依赖，不修改 Vite、Vercel、CI 或生产环境配置。
- 不在本任务中修改 Personal CRM 项目本身的业务代码或部署资产。

## Acceptance criteria

```json
[
  {
    "id": "AC-001",
    "category": "functional",
    "description": "首页项目轮播将 Personal CRM 作为第 4 个项目纳入现有 Case Strip 展示，并保持原有项目切换体验稳定。",
    "steps": [
      "打开 `/` 并滚动到 Projects 区域。",
      "连续点击项目轮播左右箭头，直到 Personal CRM 项目卡片进入 FOCUS 状态。",
      "验证 Personal CRM 卡片展示中文标题、价值定位、精简亮点、技术标签、成果标签和进入详情的 CTA。",
      "验证原有三个项目仍可正常切换、聚焦和进入详情页，轮播高度不因新增项目发生明显跳动。"
    ],
    "passes": true
  },
  {
    "id": "AC-002",
    "category": "functional",
    "description": "`/projects/personal-crm` 渲染完整项目详情页，而不是空白、404 或复用其他项目内容。",
    "steps": [
      "直接打开 `/projects/personal-crm`。",
      "验证详情页包含 Personal CRM 专属标题、Tagline、成果条、技术标签、关键指标、媒体区、项目定位、架构图、技术亮点、职责范围和复盘内容。",
      "验证详情页左上角 Back to Home 按钮可返回首页。",
      "验证输入无效项目 ID 时仍保持现有 Not Found 回退行为。"
    ],
    "passes": true
  },
  {
    "id": "AC-003",
    "category": "integration",
    "description": "Personal CRM 的详情页使用真实截图资产和 Mermaid 架构图证明产品化交付，而不是依赖抽象占位内容。",
    "steps": [
      "检查 `src/assets/projects/personal-crm/` 中存在已整理的 WebP 或同等优化图片资产。",
      "打开 `/projects/personal-crm`，验证媒体区或产品证明区使用 Personal CRM 的真实看板、联系人详情、智能助手和移动端截图。",
      "验证架构区展示与 Personal CRM 文档一致的前后端分离、Spring Boot、MySQL、Redis、Agent、邮件、天气与部署边界 Mermaid 图。",
      "验证图片具备合理 `alt` 文案、懒加载策略和不会造成页面横向溢出。"
    ],
    "passes": true
  },
  {
    "id": "AC-004",
    "category": "edge-case",
    "description": "新增第 4 个项目后，中英文静态内容模型和首页轮播测量逻辑保持一致，不出现语言切换或数组长度相关异常。",
    "steps": [
      "在中文环境和英文环境分别打开 `/` 与 `/projects/personal-crm`。",
      "验证两种语言下 Personal CRM 项目均存在，字段结构与其他项目一致。",
      "验证项目轮播计数从 `01 / 04` 到 `04 / 04` 正常显示。",
      "验证浏览器控制台没有因缺失字段、空图片、空 Mermaid 图或数组越界产生 JavaScript 错误。"
    ],
    "passes": true
  },
  {
    "id": "AC-UI-UX",
    "category": "integration",
    "description": "Chrome MCP validates the Personal CRM portfolio addition across desktop and mobile breakpoints with clean interactions and console state.",
    "steps": [
      "Open `/` and `/projects/personal-crm` in Chrome MCP at 1440x900 and verify layout, spacing, visibility, media rendering, Mermaid rendering, and overflow are correct.",
      "Switch to 375x812 and verify the homepage project carousel, Personal CRM card, detail-page hero, media area, product screenshots, and content sections remain usable without clipping or overlap.",
      "Hover the homepage Personal CRM card, carousel arrows, Personal CRM detail CTA, detail Back to Home button, and Mermaid controls, then verify expected visual feedback appears.",
      "Audit the browser console during the full flow and verify there are zero JavaScript errors.",
      "Archive screenshots as `task-004-home-desktop.png`, `task-004-home-mobile.png`, `task-004-personal-crm-detail-desktop.png`, and `task-004-personal-crm-detail-mobile.png`."
    ],
    "passes": true
  }
]
```

## Notes

### Documentation impact
| Area | Impacted | Maintenance target |
|---|---:|---|
| requirements | true | `docs/1-requirements/project_overview.md`, `docs/1-requirements/requirements_analysis.md` |
| architecture | true | `docs/2-designs/architecture.md` |
| api | false | `docs/2-designs/api_contract.md` |
| db | false | `docs/2-designs/db_schema.md` |
| ui | true | `docs/2-designs/ui_prototype.md` |
| constraints | false | `docs/3-constraints/` |
| adr | false | `docs/3-constraints/adr/` |
| agent-runtime | false | `AGENTS.md`, `.codex/session-start.js`, `init.sh`, `init.ps1` |

### Approval-sensitive changes
- 本任务不新增依赖、不升级依赖、不修改构建配置、不修改 Vercel 配置。
- 本任务不改 API、DB、生产环境配置或运行时启动脚本。
- 从 `D:\project\Personal CRM Intelligent Contact Management Platform\artifacts\` 复制截图到当前仓库资产目录属于实现 Personal CRM 展示所需的静态资产整理。

### Explicit non-maintenance
- `docs/2-designs/api_contract.md` 不需要维护，因为本任务不新增或修改 `/api/chat` 或其他接口契约。
- `docs/2-designs/db_schema.md` 不需要维护，因为作品集仍是纯前端静态数据模型，不引入物理数据库。
- `docs/3-constraints/` 不需要维护，因为本任务不新增长期禁止项、强制行为或审批规则。
- `AGENTS.md`、`.codex/session-start.js`、`init.sh`、`init.ps1` 不需要维护，因为本任务不改变端口、启动命令、健康检查或会话启动协议。
