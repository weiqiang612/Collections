# Add Personal CRM Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Personal CRM 智能联系人管理平台作为第 4 个作品集项目接入首页 Case Strip、统一项目详情页、Resume Agent mock 文案和长期 Harness 文档。

**Architecture:** 继续复用现有 Vue Router `/projects/:projectId` 详情页和 `src/data/i18n.js` 静态数据源，不新增路由、依赖、API、数据库或构建配置。实现重点是补齐中英文同构项目数据、整理真实截图资产，并只在现有媒体组件无法承载截图展示时做小范围兼容调整。

**Tech Stack:** Vue 3.5, Vite 8, Vue Router 5, GSAP, Mermaid 11, 静态 WebP 图片资产。

---

## 当前状态

- 当前 active feature：`docs/4-tasks/features/TASK-004-add-personal-crm-project/`
- `spec.md`：已存在，验收项 AC-001、AC-002、AC-003、AC-004、AC-UI-UX 均为未通过状态。
- `tasks.md`：T1-T13 均未开始。
- 开发环境：`init.ps1` 已启动，`localhost:5173` 已监听。
- 工作区已有未提交内容：`docs/4-tasks/CURRENT_PLAN.md` 已修改，`docs/4-tasks/features/TASK-004-add-personal-crm-project/` 未跟踪，另有 `.playwright-mcp/` 和若干截图未跟踪；执行时不要回滚这些已有变更。
- Personal CRM 截图源目录：`D:\project\Personal CRM Intelligent Contact Management Platform\artifacts\`，已确认存在 `看板页.png`、`联系人详情页.png`、`智能助手页.png`、`移动端看板首页.jpg`、`移动端智能助手页.jpg` 等资产。

## 文件结构

- Modify: `docs/1-requirements/project_overview.md`
  - 将项目展示范围从三个项目更新为四个项目，并补充 Personal CRM 的业务定位。
- Modify: `docs/1-requirements/requirements_analysis.md`
  - 同步访客浏览场景、首页项目区、详情页体系和 Resume Agent mock 范围。
- Modify: `docs/2-designs/architecture.md`
  - 补充第 4 个项目如何进入静态数据源、轮播和统一详情页。
- Modify: `docs/2-designs/ui_prototype.md`
  - 补充四项目 Case Strip、Personal CRM 详情页截图区和桌面/移动验收要求。
- Create: `src/assets/projects/personal-crm/dashboard.webp`
  - 桌面看板截图，由 `看板页.png` 转换/压缩而来。
- Create: `src/assets/projects/personal-crm/contact-detail.webp`
  - 联系人详情截图，由 `联系人详情页.png` 转换/压缩而来。
- Create: `src/assets/projects/personal-crm/assistant.webp`
  - 智能助手截图，由 `智能助手页.png` 转换/压缩而来。
- Create: `src/assets/projects/personal-crm/mobile-dashboard.webp`
  - 移动端看板截图，由 `移动端看板首页.jpg` 转换/压缩而来。
- Modify: `src/data/i18n.js`
  - 新增 Personal CRM 图片 import、Mermaid 图、中文项目数据、英文项目数据和 agent mock 文案。
- Modify if needed: `src/components/projects/ProjectHeroMedia.vue`
  - 若现有 `media.frames` 卡片不足以展示真实截图，则为 `media.screens` 增加复用渲染分支。
- Modify if needed: `src/style.css`
  - 仅在新增截图媒体分支或响应式布局出现溢出时补充样式。
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/spec.md`
  - 验收完成后将 AC `passes` 回写为 `true`。
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`
  - 每完成一个 T 项即勾选。
- Modify: `docs/4-tasks/CURRENT_PLAN.md`
  - 全部通过后将 TASK-004 标记完成并移入 Completed。
- Create: `task-004-home-desktop.png`
- Create: `task-004-home-mobile.png`
- Create: `task-004-personal-crm-detail-desktop.png`
- Create: `task-004-personal-crm-detail-mobile.png`
  - UI 验收截图归档到仓库根目录，除非执行时发现项目已有更合适的截图归档目录。

---

### Task 1: 同步长期需求文档

**Files:**
- Modify: `docs/1-requirements/project_overview.md`
- Modify: `docs/1-requirements/requirements_analysis.md`
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`

- [ ] **Step 1: 读取当前需求文档中的三项目表述**

Run:
```powershell
rg -n "三个|3 个|三张|Project|项目|mockReplies|Personal CRM|CRM" docs/1-requirements
```
Expected: 找到首页项目预览层、详情页体系、Resume Agent mock 等长期描述。

- [ ] **Step 2: 修改 `project_overview.md`**

将项目预览层描述改成四项目体系，内容要覆盖：
```markdown
- **Project 预览层 + 详情页体系**：首页以四张轻量预览卡片展示《餐饮场景 AI 智能客服 Agent 平台》(Spring AI / RAG)、《高并发本地生活交易平台》(Redis 高并发)、《企业设备资产管理系统》(Spring Boot / 数据治理) 和《Personal CRM 智能联系人管理平台》(Vue 3 / Spring Boot / Agent) 四个代表性项目。每个项目均拥有专属的「项目详情页」，用于承载统一结构的 Hero 媒体区、核心指标、Mermaid 图、职责范围和技术复盘内容。
```

- [ ] **Step 3: 修改 `requirements_analysis.md`**

补充 Personal CRM 浏览场景：
```markdown
- 访客可以在首页项目轮播中看到第 4 个 Personal CRM 项目，理解其作为产品化全栈 CRM 系统的定位。
- 访客可以进入 `/projects/personal-crm`，查看看板、联系人详情、智能助手和移动端看板等真实截图证据。
- Resume Agent 的本地 mock 回复需要能合理提及 Personal CRM 的业务闭环、账号安全、移动端适配和受控 Contact Agent。
```

- [ ] **Step 4: 勾选 T1**

在 `tasks.md` 中将 T1 改为：
```markdown
- [x] T1 — 更新 `docs/1-requirements/project_overview.md` 与 `docs/1-requirements/requirements_analysis.md`，将项目展示范围从三个项目扩展为四个项目，并补充 Personal CRM 的业务定位与访客浏览场景 · covers: doc-maintenance, AC-001, AC-002
```

- [ ] **Step 5: 构建检查**

Run:
```powershell
pnpm build
```
Expected: `vite build` 成功，无 JavaScript 构建错误。

Commit:
```powershell
git add docs/1-requirements/project_overview.md docs/1-requirements/requirements_analysis.md docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "docs: add personal crm portfolio requirements"
```

---

### Task 2: 同步设计文档

**Files:**
- Modify: `docs/2-designs/architecture.md`
- Modify: `docs/2-designs/ui_prototype.md`
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`

- [ ] **Step 1: 定位三项目架构和 UI 旧描述**

Run:
```powershell
rg -n "三个|3 个|三张|Case Strip|轮播|详情页|i18n|Personal CRM|项目" docs/2-designs/architecture.md docs/2-designs/ui_prototype.md
```
Expected: 找到静态数据源、首页轮播、详情页和 UI 验收相关段落。

- [ ] **Step 2: 修改 `architecture.md`**

补充结构说明：
```markdown
Personal CRM 作为第 4 个项目继续进入 `src/data/i18n.js` 的 `messages[locale].projects` 数组。首页 `ProjectsSection.vue` 通过数组长度和取模逻辑自动显示 `01 / 04` 到 `04 / 04`；详情页 `ProjectDetailView.vue` 继续通过 `/projects/:projectId` 查找 `project.id === "personal-crm"` 的数据，不新增路由结构。
```

- [ ] **Step 3: 修改 `ui_prototype.md`**

补充 UI 约束：
```markdown
- 首页 Case Strip 需要支持四项目循环，Personal CRM 卡片在 FOCUS 状态下展示中文/英文标题、价值定位、两条精简亮点、技术标签、成果标签和进入详情 CTA。
- `/projects/personal-crm` 详情页首屏需要展示产品化全栈 CRM 定位、成果条、指标、技术标签和真实截图媒体区。
- 产品证明区至少使用看板、联系人详情、智能助手、移动端看板四类截图，图片必须具备清晰 alt 文案、懒加载和移动端无横向溢出。
```

- [ ] **Step 4: 勾选 T2、T3**

在 `tasks.md` 中将 T2、T3 改为 `[x]`。

- [ ] **Step 5: 构建检查并提交**

Run:
```powershell
pnpm build
```
Expected: 构建成功。

Commit:
```powershell
git add docs/2-designs/architecture.md docs/2-designs/ui_prototype.md docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "docs: describe personal crm project presentation"
```

---

### Task 3: 整理 Personal CRM 截图资产

**Files:**
- Create: `src/assets/projects/personal-crm/dashboard.webp`
- Create: `src/assets/projects/personal-crm/contact-detail.webp`
- Create: `src/assets/projects/personal-crm/assistant.webp`
- Create: `src/assets/projects/personal-crm/mobile-dashboard.webp`
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`

- [ ] **Step 1: 创建资产目录**

Run:
```powershell
New-Item -ItemType Directory -Force src/assets/projects/personal-crm
```
Expected: 目录存在。

- [ ] **Step 2: 转换并压缩截图**

优先使用 Vite 可直接导入的 WebP 文件名：
```powershell
magick "D:\project\Personal CRM Intelligent Contact Management Platform\artifacts\看板页.png" -quality 82 src/assets/projects/personal-crm/dashboard.webp
magick "D:\project\Personal CRM Intelligent Contact Management Platform\artifacts\联系人详情页.png" -quality 82 src/assets/projects/personal-crm/contact-detail.webp
magick "D:\project\Personal CRM Intelligent Contact Management Platform\artifacts\智能助手页.png" -quality 82 src/assets/projects/personal-crm/assistant.webp
magick "D:\project\Personal CRM Intelligent Contact Management Platform\artifacts\移动端看板首页.jpg" -quality 82 src/assets/projects/personal-crm/mobile-dashboard.webp
```
Expected: 四个 WebP 文件生成；若本机无 `magick`，改用项目已可用的图片压缩方式，但输出文件名保持一致。

- [ ] **Step 3: 检查资产大小**

Run:
```powershell
Get-ChildItem src/assets/projects/personal-crm | Select-Object Name,Length
```
Expected: 四个文件存在，单文件大小适合 Vite 打包；若某张明显过大，降低 WebP quality 到 76 后重新生成。

- [ ] **Step 4: 勾选 T4**

在 `tasks.md` 中将 T4 改为 `[x]`。

- [ ] **Step 5: 构建检查并提交**

Run:
```powershell
pnpm build
```
Expected: 构建成功。

Commit:
```powershell
git add src/assets/projects/personal-crm docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "feat: add personal crm screenshot assets"
```

---

### Task 4: 新增 Personal CRM Mermaid 图和中英文项目数据

**Files:**
- Modify: `src/data/i18n.js`
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`

- [ ] **Step 1: 在 `src/data/i18n.js` 顶部导入截图**

在 sky-takeout 资产 import 后新增：
```js
import personalCrmDashboardScreen from "../assets/projects/personal-crm/dashboard.webp";
import personalCrmContactDetailScreen from "../assets/projects/personal-crm/contact-detail.webp";
import personalCrmAssistantScreen from "../assets/projects/personal-crm/assistant.webp";
import personalCrmMobileDashboardScreen from "../assets/projects/personal-crm/mobile-dashboard.webp";
```

- [ ] **Step 2: 在 `diagrams` 对象中新增 `personalCrm`**

新增内容：
```js
  personalCrm: [
    {
      title: "Personal CRM 产品架构 / Product Architecture",
      code: `flowchart LR
    U["Web / Mobile User"] --> FE["Vue 3 + Vite<br><small>Dashboard / Contacts / Agent UI</small>"]
    FE --> API["Spring Boot API<br><small>Auth / Contacts / Reminders</small>"]
    API --> MYSQL[("MySQL<br><small>Contacts / Notes / Tasks</small>")]
    API --> REDIS[("Redis<br><small>Session / Rate Limit / Cache</small>")]
    FE --> AGENT["Contact Agent Panel<br><small>Controlled write assistant</small>"]
    AGENT --> GUARD["Confirmation Guard<br><small>Preview before mutation</small>"]
    GUARD --> API
    API --> MAIL["Email Service<br><small>Reset / reminder delivery</small>"]
    API --> WEATHER["Weather API<br><small>Context enrichment</small>"]
    API --> DEPLOY["Deployment Boundary<br><small>Static frontend + backend service</small>"]`,
    },
    {
      title: "受控 Contact Agent 写操作 / Controlled Agent Write Flow",
      code: `sequenceDiagram
    participant User as User
    participant UI as Vue Agent Panel
    participant Agent as Contact Agent
    participant API as Spring Boot API
    participant DB as MySQL

    User->>UI: Ask to create or update contact task
    UI->>Agent: Send intent and current contact context
    Agent-->>UI: Return structured draft operation
    UI-->>User: Show confirmation preview
    alt User confirms
        UI->>API: Submit validated write request
        API->>API: Auth and input validation
        API->>DB: Persist contact / reminder change
        DB-->>API: Success
        API-->>UI: Updated entity snapshot
    else User cancels
        UI-->>Agent: Abort without mutation
    end`,
    },
  ],
```

- [ ] **Step 3: 在中文 `projects` 数组末尾新增 `personal-crm`**

字段必须与现有项目同构，至少包含：
```js
      {
        id: "personal-crm",
        name: "Personal CRM 智能联系人管理平台",
        subtitle: "面向个人关系维护、事项提醒与受控 Contact Agent 的产品化全栈 CRM 系统",
        summary: "将联系人、互动记录、提醒事项、移动端看板和智能助手整合为一个可部署的个人 CRM 产品，用真实业务闭环证明全栈交付能力。",
        highlights: [
          "**产品化业务闭环**：覆盖注册登录、联系人管理、详情记录、事项提醒、黑名单与设置等完整 CRM 使用路径。",
          "**受控 Contact Agent**：将智能助手限制在草稿生成、上下文解释和确认后写入流程中，避免模型直接越权修改核心数据。",
          "**跨端体验与交付**：同时整理桌面看板、移动端看板和助手页面，证明系统不是停留在后端接口层。"
        ],
        techStack: ["Vue 3", "Spring Boot", "MySQL", "Redis", "JWT", "Agent", "Email", "Responsive UI"],
        diagrams: diagrams.personalCrm,
        detail: {
          tagline: "一个围绕关系维护、提醒闭环、移动端适配和受控智能助手构建的产品化全栈 CRM 平台",
          outcomes: ["已完成产品闭环", "支持移动端适配", "具备 Agent 助手", "具备部署交付证据"],
          tags: ["Vue 3", "Spring Boot", "MySQL", "Redis", "Contact Agent"],
          metrics: [
            { label: "核心模块", value: "8+" },
            { label: "跨端页面", value: "Desktop + Mobile" },
            { label: "Agent 写入", value: "确认后执行" }
          ],
          media: {
            type: "screens",
            label: "Personal CRM / Product Proof",
            eyebrow: "真实产品截图证明",
            headline: "从看板、联系人详情到智能助手的完整 CRM 使用链路",
            description: "媒体区使用 Personal CRM 已交付页面截图，突出产品闭环、跨端体验和受控 Agent 能力。",
            badges: ["Real Screens", "Full-stack Product", "Mobile Ready"],
            frames: [
              { title: "看板总览", description: "集中展示联系人、提醒和近期互动，帮助用户快速进入关系维护状态。" },
              { title: "联系人详情", description: "承载联系人画像、互动记录和后续事项，是 CRM 业务闭环的核心页面。" },
              { title: "智能助手", description: "围绕联系人上下文生成建议，并通过确认流程控制写操作边界。" }
            ],
            footer: { label: "Evidence", value: "Dashboard / Contact detail / Assistant / Mobile dashboard screenshots" }
          },
          sections: {
            overview: {
              title: "项目定位与业务场景",
              content: "Personal CRM 面向个人关系维护场景，将联系人档案、互动记录、提醒事项、移动端看板和智能助手组织成一个可部署的全栈产品。作品集详情页重点展示它的产品完整度、账号安全、跨端体验和受控 Agent 写操作边界。",
              proofPoints: [
                { title: "产品闭环", description: "从注册登录到联系人管理、事项提醒、黑名单和设置页面，覆盖真实 CRM 使用链路。" },
                { title: "Agent 边界", description: "智能助手用于生成草稿和解释上下文，真正写入必须经过用户确认和后端校验。" },
                { title: "交付证据", description: "桌面与移动端截图证明系统已经具备产品化界面，而不是只有接口或概念图。" }
              ]
            },
            architecture: {
              title: "系统架构与 Agent 控制边界",
              description: "架构图展示 Vue 前端、Spring Boot API、MySQL、Redis、邮件、天气服务和部署边界；时序图说明 Contact Agent 如何通过确认预览完成受控写操作。",
              diagrams: diagrams.personalCrm
            },
            productProof: {
              title: "产品截图与交付证明",
              description: "以下截图来自 Personal CRM 已有 artifacts，覆盖桌面看板、联系人详情、智能助手和移动端看板。",
              screens: [
                { title: "Personal CRM 看板页", description: "总览联系人、提醒和近期互动状态。", src: personalCrmDashboardScreen },
                { title: "联系人详情页", description: "呈现联系人资料、互动记录和关系维护上下文。", src: personalCrmContactDetailScreen },
                { title: "智能助手页", description: "围绕联系人上下文提供建议和可确认的操作草稿。", src: personalCrmAssistantScreen },
                { title: "移动端看板首页", description: "验证核心 CRM 能力在移动端仍可访问和阅读。", src: personalCrmMobileDashboardScreen }
              ]
            },
            ownership: {
              title: "我的职责",
              items: [
                "**搭建全栈产品闭环**：围绕联系人、提醒、黑名单、设置和账号体系完成端到端功能组织。",
                "**设计受控 Agent 写入边界**：将 AI 输出限制为可确认草稿，关键写操作交由后端鉴权和校验执行。",
                "**完成跨端体验整理**：让桌面看板、详情页和移动端页面保持一致的信息层级与可用性。",
                "**沉淀作品集展示证据**：将真实截图、架构图和职责复盘整理为可面试展开的项目案例。"
              ]
            },
            retrospective: {
              title: "技术复盘",
              challenges: [
                { problem: "**个人 CRM 容易退化成普通 CRUD。** 如果只展示联系人列表，无法证明产品价值。", solution: "我围绕关系维护闭环组织页面和数据，将提醒、互动记录、黑名单和助手能力串成完整使用场景。" },
                { problem: "**让 Agent 直接修改联系人数据存在越权和误写风险。**", solution: "我把 Agent 放在草稿和建议层，用户确认后才通过后端 API 执行写入，并保留鉴权与参数校验。" },
                { problem: "**全栈项目如果缺少真实界面证据，很难让访客判断完成度。**", solution: "我将桌面和移动端关键截图纳入详情页，使系统能力能够被直接检查。" }
              ]
            }
          }
        }
      }
```

- [ ] **Step 4: 在英文 `projects` 数组末尾新增同构数据**

英文对象必须使用相同 `id: "personal-crm"`、相同字段结构、相同截图 import 和 `diagrams.personalCrm`，文案表达对应中文内容。不要省略 `productProof.screens`。

- [ ] **Step 5: 勾选 T5、T6、T7**

在 `tasks.md` 中将 T5、T6、T7 改为 `[x]`。

- [ ] **Step 6: 构建检查并提交**

Run:
```powershell
pnpm build
```
Expected: 构建成功；若 Mermaid 语法失败，优先修正 `diagrams.personalCrm`，不要移除架构图。

Commit:
```powershell
git add src/data/i18n.js docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "feat: add personal crm project data"
```

---

### Task 5: 必要时增强媒体截图渲染

**Files:**
- Modify if needed: `src/components/projects/ProjectHeroMedia.vue`
- Modify if needed: `src/style.css`
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`

- [ ] **Step 1: 本地检查现有渲染是否足够**

Run:
```powershell
pnpm build
```
Expected: 构建成功。随后打开 `http://localhost:5173/projects/personal-crm`，确认详情页至少在 `productProof` 区域展示真实截图。

- [ ] **Step 2: 如果媒体首屏也需要真实截图，扩展 `ProjectHeroMedia.vue`**

在 `project-media-surface` 中支持 `media.screens`：
```vue
<div v-if="media.screens?.length" class="project-media-screens-grid">
  <article
    v-for="screen in media.screens"
    :key="screen.title"
    class="project-media-screen-card"
  >
    <img
      class="project-media-screen-image"
      :src="screen.src"
      :alt="screen.title"
      loading="lazy"
    />
    <p class="project-media-frame-title">{{ screen.title }}</p>
    <p class="project-media-frame-text">{{ screen.description }}</p>
  </article>
</div>
<div v-else class="project-media-grid">
  ...
</div>
```

- [ ] **Step 3: 如果 Step 2 执行，补充 CSS**

在 `src/style.css` 的 project media 样式附近新增：
```css
.project-media-screens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.project-media-screen-card {
  min-width: 0;
  border: 1px solid var(--border-muted);
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
}

.project-media-screen-image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
```

- [ ] **Step 4: 保持 T8 语义准确**

如果没有改组件，仍将 T8 勾选并在 `tasks.md` Blockers 下方追加一行：
```markdown
T8 note: 现有 `ProjectDetailView.vue` 的 `productProof.screens` 已可展示 Personal CRM 截图，未扩大媒体组件行为。
```
如果改了组件，则只勾选 T8。

- [ ] **Step 5: 构建检查并提交**

Run:
```powershell
pnpm build
```
Expected: 构建成功。

Commit:
```powershell
git add src/components/projects/ProjectHeroMedia.vue src/style.css docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "feat: support personal crm media proof"
```
如果没有改组件和样式：
```powershell
git add docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "chore: record personal crm media compatibility"
```

---

### Task 6: 更新 Resume Agent mock 文案

**Files:**
- Modify: `src/data/i18n.js`
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`

- [ ] **Step 1: 扩展中英文 `agent.mockReplies`**

中文新增第 4 条：
```js
"「Personal CRM 智能联系人管理平台」展示的是产品化全栈交付能力：我把联系人管理、互动记录、事项提醒、账号安全、移动端适配和受控 Contact Agent 组织成完整业务闭环。Agent 只生成可确认的操作草稿，真正写入仍经过用户确认和后端校验。"
```

英文新增第 4 条：
```js
"The Personal CRM project demonstrates full-stack product delivery: contact management, interaction history, reminders, account safety, mobile adaptation, and a controlled Contact Agent are organized into one usable workflow. The Agent only drafts confirmable operations; actual writes still go through user confirmation and backend validation."
```

- [ ] **Step 2: 更新 mock 选择逻辑以识别 CRM**

在 `src/services/chatClient.js` 和 `src/components/agent/ResumeAgentPanel.vue` 的 fallback 逻辑中，在 Redis/API/RAG 判断之前加入：
```js
  const reply = normalized.includes("crm") || normalized.includes("联系人") || normalized.includes("contact")
    ? agentCopy.mockReplies[3]
    : normalized.includes("点评") || normalized.includes("redis")
      ? agentCopy.mockReplies[1]
      : normalized.includes("api") || normalized.includes("rag")
        ? agentCopy.mockReplies[2]
        : agentCopy.mockReplies[0];
```
`ResumeAgentPanel.vue` 中变量名是 `fallbackText`，保持同样条件顺序。

- [ ] **Step 3: 勾选 T9**

在 `tasks.md` 中将 T9 改为 `[x]`。

- [ ] **Step 4: 构建检查并提交**

Run:
```powershell
pnpm build
```
Expected: 构建成功。

Commit:
```powershell
git add src/data/i18n.js src/services/chatClient.js src/components/agent/ResumeAgentPanel.vue docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "feat: mention personal crm in resume agent mock"
```

---

### Task 7: 生产构建与基础功能验证

**Files:**
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`

- [ ] **Step 1: 运行生产构建**

Run:
```powershell
pnpm build
```
Expected: `vite build` 成功，无 Mermaid、图片 import 或 Vue template 错误。

- [ ] **Step 2: 检查关键路由**

在浏览器打开：
```text
http://localhost:5173/
http://localhost:5173/projects/personal-crm
http://localhost:5173/projects/not-a-real-project
```
Expected:
- 首页项目计数可以到 `04 / 04`。
- `/projects/personal-crm` 渲染 Personal CRM 专属内容。
- 无效项目 ID 保持现有 Not Found 回退。

- [ ] **Step 3: 勾选 T10**

在 `tasks.md` 中将 T10 改为 `[x]`。

Commit:
```powershell
git add docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "chore: verify personal crm production build"
```

---

### Task 8: Chrome MCP UI 验收与截图归档

**Files:**
- Create: `task-004-home-desktop.png`
- Create: `task-004-home-mobile.png`
- Create: `task-004-personal-crm-detail-desktop.png`
- Create: `task-004-personal-crm-detail-mobile.png`
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`

- [ ] **Step 1: 桌面首页验收**

Browser viewport: `1440x900`

Open:
```text
http://localhost:5173/
```
Actions:
- 滚动到 Projects 区域。
- 连续点击右箭头直到 Personal CRM 进入 FOCUS。
- hover Personal CRM 卡片和左右箭头。
- 截图保存为 `task-004-home-desktop.png`。

Expected:
- 计数显示 `04 / 04`。
- 卡片文字、CTA、技术标签、成果标签无重叠。
- 原有三个项目仍可切换。
- 控制台无 JavaScript error。

- [ ] **Step 2: 桌面详情页验收**

Open:
```text
http://localhost:5173/projects/personal-crm
```
Actions:
- hover Back to Home、媒体区、Mermaid 控件。
- 截图保存为 `task-004-personal-crm-detail-desktop.png`。

Expected:
- 标题、Tagline、成果条、技术标签、指标、媒体区、定位、Mermaid、技术亮点、职责、复盘均为 Personal CRM 内容。
- 图片加载成功，Mermaid 渲染成功。
- Back to Home 返回首页。

- [ ] **Step 3: 移动端首页验收**

Browser viewport: `375x812`

Open:
```text
http://localhost:5173/
```
Actions:
- 滚动到 Projects 区域。
- 切换到 Personal CRM。
- 截图保存为 `task-004-home-mobile.png`。

Expected:
- 轮播卡片无横向溢出、文字裁切或按钮遮挡。

- [ ] **Step 4: 移动端详情页验收**

Open:
```text
http://localhost:5173/projects/personal-crm
```
Actions:
- 滚动检查 hero、媒体区、产品截图、Mermaid、底部复盘。
- 截图保存为 `task-004-personal-crm-detail-mobile.png`。

Expected:
- 图片、Mermaid、长文本均不造成横向滚动。
- 控制台无 JavaScript error。

- [ ] **Step 5: 勾选 T11 并提交**

在 `tasks.md` 中将 T11 改为 `[x]`。

Commit:
```powershell
git add task-004-home-desktop.png task-004-home-mobile.png task-004-personal-crm-detail-desktop.png task-004-personal-crm-detail-mobile.png docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md
git commit -m "test: capture personal crm ui acceptance"
```

---

### Task 9: 验收项回写与任务收尾

**Files:**
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/spec.md`
- Modify: `docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md`
- Modify: `docs/4-tasks/CURRENT_PLAN.md`

- [ ] **Step 1: 对照 AC 逐项验证**

Checklist:
- AC-001：首页轮播包含第 4 个 Personal CRM，原有项目切换稳定。
- AC-002：`/projects/personal-crm` 是完整专属详情页，无效 ID 仍 Not Found。
- AC-003：使用真实 Personal CRM 截图和 Mermaid 架构图。
- AC-004：中英文字段完整，计数 `01 / 04` 到 `04 / 04` 正常，无数组长度异常。
- AC-UI-UX：桌面和移动截图已归档，hover、布局、控制台状态通过。

- [ ] **Step 2: 将 `spec.md` 中全部 `passes` 改为 `true`**

Expected:
```json
"passes": true
```
五个 AC 均为 true。

- [ ] **Step 3: 勾选 T12、T13**

在 `tasks.md` 中将 T12、T13 改为 `[x]`。

- [ ] **Step 4: 更新 `CURRENT_PLAN.md`**

将 active stage 改为完成状态：
```markdown
## Active feature
No active feature

## Stages
### TASK-004: Add Personal CRM Project
- [x] Implementation (13 tasks)
```

在 Completed 增加：
```markdown
- **TASK-004: Add Personal CRM Project** (Completed: 2026-07-01)
```

- [ ] **Step 5: 最终构建和状态检查**

Run:
```powershell
pnpm build
git status -s
```
Expected:
- 构建成功。
- `git status -s` 只显示本任务计划内的最终变更，且无意外删除或无关回滚。

Commit:
```powershell
git add docs/4-tasks/features/TASK-004-add-personal-crm-project/spec.md docs/4-tasks/features/TASK-004-add-personal-crm-project/tasks.md docs/4-tasks/CURRENT_PLAN.md
git commit -m "chore: complete personal crm portfolio task"
```

---

## Self-Review

- Spec coverage:
  - AC-001 覆盖于 Task 4、Task 7、Task 8。
  - AC-002 覆盖于 Task 4、Task 7、Task 8。
  - AC-003 覆盖于 Task 3、Task 4、Task 8。
  - AC-004 覆盖于 Task 4、Task 6、Task 7、Task 8。
  - AC-UI-UX 覆盖于 Task 8。
  - 文档维护覆盖于 Task 1、Task 2、Task 9。
- Placeholder scan:
  - 本计划没有使用 TBD、TODO、implement later 或未定义的后续占位。
- Type and field consistency:
  - `personal-crm` 数据结构与现有 `ProjectDetailView.vue` 消费字段一致：`id`、`name`、`subtitle`、`summary`、`highlights`、`techStack`、`diagrams`、`detail.tagline`、`detail.outcomes`、`detail.tags`、`detail.metrics`、`detail.media`、`detail.sections.overview`、`detail.sections.architecture`、`detail.sections.productProof`、`detail.sections.ownership`、`detail.sections.retrospective`。
  - 图片字段使用 Vite 静态 import，不使用运行时字符串路径。
  - `ProjectsSection.vue` 已基于 `t.projects.length` 和取模逻辑工作，四项目不需要改路由或轮播核心算法。

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-01-add-personal-crm-project.md`. Two execution options:

**1. Subagent-Driven (recommended)** - dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** - execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
