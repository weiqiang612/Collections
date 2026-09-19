# TASK-005: Agent Evaluation

**Status**: Ready for acceptance
**Created**: 2026-07-03
**Feature dir**: `docs/4-tasks/features/TASK-005-agent-evaluation/`

## Objective
为 `D:\project\sky-take-out-project` 的餐饮 SaaS 智能客服 Agent 建立可复现的离线评测包，产出可解释、可面试追问、可用于简历表述的评测数据与失败样例复盘。

## Scope

### In scope
- 设计餐饮客服 Agent 离线测试集，覆盖订单查询、取消订单、退款/地址变更、菜品咨询、配送规则、售后说明、用户偏好、异常输入和多意图混合场景。
- 定义工具选择准确率、高风险操作确认覆盖率、多步任务完成率、RAG 回答可用率等核心评测指标和判定口径。
- 规划评测产物，包括 `eval_cases`、`eval_rubric`、`eval_report`、`failure_cases` 和 `resume_metrics_summary`。
- 明确评测数据来源、统计口径、失败样例归因和简历可用表述，避免把离线评测包装成真实线上业务结果。
- 优先复用 `D:\project\sky-take-out-project` 的既有接口、日志、Prompt、工具调用链路和知识库能力；如后续实现需要新增依赖或修改核心业务逻辑，必须另行确认。

### Out of scope
- 不在本任务中评测 `D:\project\hm-dianping`、`D:\project\equipment-management` 或 `D:\project\Personal CRM Intelligent Contact Management Platform`。
- 不新增线上埋点、真实用户数据采集、生产环境监控或商业业务指标。
- 不修改 `D:\project\sky-take-out-project` 的数据库结构、生产配置、核心业务接口契约或部署配置。
- 不在本任务中将评测结果直接写入 Collection 作品集页面或简历 PDF。

## Acceptance criteria

```json
[
  {
    "id": "AC-001",
    "category": "functional",
    "description": "Agent 离线测试集覆盖餐饮客服核心场景，并包含可判定的期望结果字段。",
    "steps": [
      "打开评测任务产物中的 Agent 测试集文件。",
      "验证测试集覆盖订单查询、取消订单、退款/地址变更、菜品咨询、配送规则、售后说明、用户偏好、异常输入和多意图混合场景。",
      "验证每条用例包含用户输入、场景类型、期望意图、期望工具、是否高风险、是否需要确认、期望知识来源、通过判定标准和失败归因字段。"
    ],
    "passes": true
  },
  {
    "id": "AC-002",
    "category": "functional",
    "description": "评测口径明确描述核心指标的计算方式、通过条件和人工复核边界。",
    "steps": [
      "打开评测口径文档。",
      "验证文档定义工具选择准确率、高风险操作确认覆盖率、多步任务完成率和 RAG 回答可用率。",
      "验证每个指标包含分子、分母、通过标准、人工复核规则和不计入统计的异常情况。"
    ],
    "passes": true
  },
  {
    "id": "AC-003",
    "category": "edge-case",
    "description": "评测方案能识别失败样例并输出可复盘的优化方向，而不是只产出总分。",
    "steps": [
      "查看失败样例记录模板或报告章节。",
      "验证失败类型至少包含工具误调用、参数缺失、高风险确认缺失、RAG 召回不准、回答不可用、用户中断和多意图混杂。",
      "验证每类失败样例能记录原因、影响指标、优化建议和是否需要修改 Prompt、工具过滤、确认机制或知识库内容。"
    ],
    "passes": true
  },
  {
    "id": "AC-004",
    "category": "integration",
    "description": "评测执行流程可以复用 sky-take-out-project 的既有运行方式，并明确不破坏项目现有业务链路。",
    "steps": [
      "查看评测执行说明。",
      "验证说明写明目标项目路径为 `D:\\project\\sky-take-out-project`。",
      "验证执行流程优先复用既有 Agent 接口、日志或本地测试入口，并声明不修改数据库结构、生产配置或核心业务接口契约。",
      "验证如需新增依赖、启动外部模型服务或修改核心代码，必须先单独确认。"
    ],
    "passes": true
  },
  {
    "id": "AC-005",
    "category": "functional",
    "description": "最终报告能产出简历可用的、来源清晰的量化表述。",
    "steps": [
      "打开 `resume_metrics_summary` 或等价报告章节。",
      "验证其中区分离线评测、本地测试和真实线上业务数据。",
      "验证简历可用表述包含测试集规模、覆盖场景、核心指标和失败样例优化闭环。",
      "验证报告不使用无法解释来源的虚高指标或真实线上业务效果表述。"
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
| ui | false | `docs/2-designs/ui_prototype.md` |
| constraints | false | `docs/3-constraints/` |
| adr | false | `docs/3-constraints/adr/` |
| agent-runtime | false | `AGENTS.md`, `.codex/session-start.js`, `init.sh`, `init.ps1` |

### Approval-sensitive changes
- 本任务若后续实现需要新增依赖、修改 `D:\project\sky-take-out-project` 的核心业务代码、修改数据库结构、修改生产配置或调用外部模型服务，必须先单独确认。
- 本任务不新增 Collection 仓库依赖、不修改 Vite/Vercel/CI 配置、不改变当前作品集页面行为。

### Explicit non-maintenance
- `docs/1-requirements/` 不需要维护，因为本任务是评测工作包，不改变 Collection 作品集的访客场景、项目展示范围或业务规则。
- `docs/2-designs/architecture.md` 不需要维护，因为本任务不改变 Collection 前端架构、路由、静态数据源或组件关系。
- `docs/2-designs/api_contract.md` 不需要维护，因为本任务不新增或修改 Collection 的 `/api/chat` 契约。
- `docs/2-designs/db_schema.md` 不需要维护，因为 Collection 仍为纯前端项目，本任务也不定义任何数据库迁移。
- `docs/2-designs/ui_prototype.md` 不需要维护，因为本任务不改变任何可见页面、交互状态或响应式布局。

