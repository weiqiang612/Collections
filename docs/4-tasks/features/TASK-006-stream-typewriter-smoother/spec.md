# TASK-006: Agent SSE Stream Smoothing Buffer

**Status**: Completed
**Created**: 2026-09-19
**Feature dir**: `docs/4-tasks/features/TASK-006-stream-typewriter-smoother/`

## Objective
构建 Agent SSE 流式输出平滑缓冲队列与打字机动效，削平网络抖动与大块 Token 突发，提供丝滑匀速且自适应防滞后的流式交互体验。

## Scope

### In scope
- 封装通用的 Vue 3 Composable `useStreamSmoother.js`，实现基于生产者-消费者模型的字符缓冲队列。
- 动态自适应消费步长（根据 Buffer 积压量阶梯提速，防止假延迟；低积压时匀速打字；流结束信号后加速排空收尾）。
- 安全的流生命周期管理（支持中断 abort 清理、组件销毁时取消 RAF，防止内存泄漏）。
- 增强 `src/services/chatClient.js` 本地 mock 模式，支持模拟突发大 chunk（Bursty Chunks），便于离线直观验证削峰填谷效果。
- 在 `ResumeAgentPanel.vue` 中集成 `useStreamSmoother` 并配合节流平滑自动滚动。
- 同步维护 `docs/2-designs/ui_prototype.md`，记录 Agent 对话流式打字机交互规范。

### Out of scope
- 修改后端 `/api/chat` 的 SSE 协议或数据载荷格式。
- 修改其他页面的既有动效逻辑。

## Acceptance criteria

```json
[
  {
    "id": "AC-001",
    "category": "functional",
    "description": "缓冲队列能够平滑消费突发大 Chunk，并根据积压量自适应动态调速",
    "steps": [
      "向 useStreamSmoother 一次性 push 包含 80 个字符的突发文本 Chunk",
      "观察渲染输出文本并非一次性硬刷新，而是基于 RAF 逐帧平滑递增",
      "当缓冲区堆积较多（>50字）时自动提升步长快速排空，积压少（<10字）时恢复匀速打字",
      "触发 finish() 信号后，缓冲区剩余字符以加速曲线快速排空并收尾，isSmoothing 状态转为 false"
    ],
    "passes": true
  },
  {
    "id": "AC-002",
    "category": "functional",
    "description": "流式生命周期与安全中断机制",
    "steps": [
      "在打字机正在输出期间调用 abort() 或触发组件销毁（onUnmounted）",
      "确认正在执行的 requestAnimationFrame 立即取消",
      "未消费的 Buffer 队列立即清空，避免后台持续更新或内存泄漏"
    ],
    "passes": true
  },
  {
    "id": "AC-003",
    "category": "edge-case",
    "description": "多字节字符、Emoji 与空 chunk 边界安全处理",
    "steps": [
      "向缓冲队列推送包含 Emoji（如 🤖、✨）和中英混排的文本流",
      "验证在字符步进消费过程中未切碎代理对（Surrogate pairs），无乱码字符",
      "向缓冲队列推送空字符串或连续微小 chunk，验证调度器状态稳定无死循环"
    ],
    "passes": true
  },
  {
    "id": "AC-UI-UX",
    "category": "integration",
    "description": "Chrome MCP validates the UI/UX flow across desktop and mobile breakpoints with clean interactions and console state.",
    "steps": [
      "Open the affected route with Chrome MCP at 1440x900 and verify layout, spacing, visibility, and overflow are correct.",
      "Switch to 375x812 and verify the responsive layout, navigation, and primary actions remain usable without clipping or overlap.",
      "Hover each relevant interactive element and verify the expected visual feedback or expanded state appears.",
      "Audit the browser console during the flow and verify there are zero JavaScript errors.",
      "Archive named screenshots for the desktop and mobile checks using deterministic names agreed in the implementation approach."
    ],
    "passes": true
  }
]
```

## Notes
### Documentation impact
| Area | Impacted | Maintenance target |
|---|---:|---|
| requirements | false | `docs/1-requirements/project_overview.md`, `docs/1-requirements/requirements_analysis.md` |
| architecture | false | `docs/2-designs/architecture.md` |
| api | false | `docs/2-designs/api_contract.md` |
| db | false | `docs/2-designs/db_schema.md` |
| ui | true | `docs/2-designs/ui_prototype.md` |
| constraints | false | `docs/3-constraints/` |
| adr | false | `docs/3-constraints/adr/` |
| agent-runtime | false | `AGENTS.md`, `init.sh`, `init.ps1` |

### Approval-sensitive changes
- None

### Explicit non-maintenance
- `docs/1-requirements/project_overview.md`: 本次优化为对话渲染层交互与缓冲平滑优化，不改变项目整体目标定位与核心业务大盘。
- `docs/2-designs/api_contract.md`: 后端 `/api/chat` SSE 流协议、载荷结构保持完全兼容，不产生接口变更。
- `docs/2-designs/architecture.md`: 属于前端 Vue Composable 局部调优，不引入新外部服务、数据库或系统级依赖。
