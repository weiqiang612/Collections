# 原型与 UI 设计 (UI/UX Mockups)

## 1. 交互原型与 UI 视觉稿链接 (Figma / Mockup Links)
- **原型基调**：极客黑色终端风（Minimalist Dark + Geek Terminal），基于 Vanilla CSS，不使用 TailwindCSS。
- **配色系统**：
  *   Background: `#000000` (背景纯黑)
  *   Panel: `#0B0F14` (卡片/控制台面板)
  *   Cyan: `#8BE9FD` (青色高亮/标题/标签)
  *   Green: `#50FA7B` (绿色终端风/呼吸灯/命令行)
  *   Orange: `#FFB86C` (橙色外部链接/警告)

## 2. 核心交互流程
- **打字机终端交互**：首页 Hero 区展示虚拟命令行，流式输入个人技术宣言。
- **项目控制台卡片与选项卡**：上方为水平选项卡选择栏，选中项带有青色（Cyan）微发光底部指示线；下方为双栏详情卡片。切换 Tab 时触发 GSAP 过渡动效（旧卡片向左滑出 30px 并淡出，新卡片从右侧 30px 处滑入并淡入，总耗时 0.5s，缓动函数为 `power2.out`）。
- **智能 Agent 弹出层**：点击右下角按钮弹出独立悬浮聊天面板。
- **项目详情页 (Project Detail Page)**：
  * **布局与视觉**：顶部 Hero Split 左右结构，左侧展示 Tagline、技术标签与关键指标网格，右侧展示 16:9 霓虹暗金/青色发光边框的 Media 多媒体演示框（带骨架呼吸灯）；中部包含“演示背景”及“系统架构与核心工作流”（双 Mermaid 交互区域）；底部为“我的职责”（List 结构）与“项目复盘”（Problem-Solution 对照）。
  * **动效与交互**：页面左上角提供悬浮的“Back to Home”按钮（带有 hover 青色微发光及向左平移 3px 动画）；详情页内的 Mermaid 组件完全支持与首页相同的平移、缩放和全屏能力。
