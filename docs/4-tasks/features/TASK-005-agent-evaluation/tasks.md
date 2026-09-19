# TASK-005: Tasks

**Spec**: `spec.md`
**Status**: Completed

## Key decisions
- 本任务先评测 `D:\project\sky-take-out-project` 的餐饮 SaaS 智能客服 Agent，不混入高并发、设备管理或 Personal CRM 项目。
- 评测数据只作为离线测试、本地验证和简历可解释指标使用，不包装成真实线上业务数据。
- 优先复用目标项目既有接口、日志、Prompt、工具链路和运行方式；新增依赖、外部模型调用或核心代码变更必须另行确认。

## Progress

- [x] T1 — 梳理 `D:\project\sky-take-out-project` 的 Agent 入口、可调用工具、RAG 知识库、确认机制、日志位置和本地运行方式，形成评测接入说明 · covers: AC-004
- [x] T2 — 设计 Agent 离线测试集字段与场景分布，覆盖订单查询、取消订单、退款/地址变更、菜品咨询、配送规则、售后说明、用户偏好、异常输入和多意图混合 · covers: AC-001
- [x] T3 — 编写首版 Agent 测试集，确保每条用例包含用户输入、场景类型、期望意图、期望工具、是否高风险、是否需要确认、期望知识来源、通过判定标准和失败归因字段 · covers: AC-001
- [x] T4 — 编写评测口径文档，定义工具选择准确率、高风险操作确认覆盖率、多步任务完成率、RAG 回答可用率的分子、分母、通过条件、人工复核边界和异常排除规则 · covers: AC-002
- [x] T5 — 设计失败样例记录模板，覆盖工具误调用、参数缺失、高风险确认缺失、RAG 召回不准、回答不可用、用户中断和多意图混杂等失败类型 · covers: AC-003
- [x] T6 — 规划评测执行流程，明确如何复用目标项目既有接口、日志或本地测试入口，并标出新增依赖、外部模型服务和核心代码变更的确认边界 · covers: AC-004
- [x] T7 — 输出评测报告模板，包含测试集概况、指标汇总、失败样例分析、优化建议、复测记录和限制说明 · covers: AC-002, AC-003, AC-005
- [x] T8 — 输出 `resume_metrics_summary`，沉淀可用于简历的量化表述，并明确数据来源属于离线评测或本地测试 · covers: AC-005
- [x] T9 — 对照 `spec.md` 验证全部 AC，通过后将对应 `passes` 更新为 `true` · covers: AC-001, AC-002, AC-003, AC-004, AC-005
- [x] T10 — 运行 `pnpm build`，确认 Collection 仓库仍可构建 · covers: AC-001, AC-002, AC-003, AC-004, AC-005
- [x] T11 — 更新 `docs/4-tasks/CURRENT_PLAN.md`，在评测任务完成后标记 TASK-005 完成并保留历史 Completed 项 · covers: doc-maintenance

## Dependencies
- T1 必须先完成，避免测试集和评测流程脱离目标项目真实入口。
- T2-T4 定义测试集和指标口径，是 T5-T8 报告与简历表述的前置条件。
- T6 在实际执行评测前完成，确保不越过新增依赖、外部模型服务或核心代码变更边界。
- T9-T11 只能在评测产物完成并复核后执行。

## Blockers
<!-- Fill in if something is preventing progress -->



