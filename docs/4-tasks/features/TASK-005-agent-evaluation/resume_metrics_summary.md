# Resume Metrics Summary

## Recommended Resume Claim

Use this only after the placeholders are filled with actual offline run results:

> 构建 150 条餐饮客服 Agent 离线评测集，覆盖工具调用、高风险确认、多步任务编排、RAG 问答和异常输入；基于固定离线测试集，通过动态工具白名单将高风险工具误调用率由 X% 降至 Y%，确认前写操作执行率降至 0%，多步任务完成率由 X% 提升至 Y%，RAG 规则问答召回率达到 X%。

## Current Evidence-Based Candidate Wording

The target project already has smaller offline reports. Before the full 150-case runner is implemented, the most defensible wording is:

> 构建餐饮客服 Agent 离线评测方案，覆盖工具调用、高风险确认、多步任务编排、RAG 问答和异常输入；现有对抗性工具调用评测中，动态工具白名单将高风险工具误调用由 `4/10` 降至 `0/10`；现有 25 条 FAQ RAG 离线评测召回率为 `96.0%`，25 条口语化泛化集召回率为 `92.0%`。

This version is more conservative because it separates existing small reports from the new 150-case evaluation package.

## Strong Metric Candidates

| Metric | Why it fits the resume | Interview explanation |
|---|---|---|
| High-risk tool misuse rate | Directly supports Agent tool governance. | Denominator is adversarial/mixed-intent cases; numerator is forbidden high-risk tool selection. |
| Pre-confirmation write rate | Directly supports high-risk safety boundary. | Denominator is high-risk write cases; numerator is write execution before confirmation. |
| Multi-step completion rate | Directly supports task orchestration. | Denominator is compound tasks; numerator is tasks that complete plan, slot transfer, confirmation, and answer. |
| RAG recall rate | Directly supports Hybrid RAG. | Denominator is rule/FAQ cases; numerator is cases where expected knowledge source is retrieved. |
| RAG answer usability | Supports practical customer-service quality. | Manual/LLM judge checks grounding, completeness, and useful next step. |

## Good Wording

- "离线评测集"
- "固定测试集"
- "本地回放"
- "对抗性工具调用测试"
- "确认前写操作执行率"
- "RAG 规则问答召回率"
- "失败样例复盘"

## Avoid This Wording

- "线上客服准确率 X%"
- "用户满意度提升 X%"
- "人工客服成本降低 X%"
- "生产环境高可用 X%"
- "真实退款成功率提升 X%"
- "大幅提升业务转化率"

## Interview Defense

If asked "这个数字怎么来的？", answer with this structure:

1. It is an offline/local fixed test set, not production user traffic.
2. The test set has 150 cases across five suites.
3. Each metric has a clear denominator and numerator.
4. Baseline is an evaluation-only weaker strategy, such as full-tool exposure or keyword-only retrieval.
5. Optimized uses the current project mechanisms: Advisor chain, dynamic tool whitelist, confirmation gate, orchestrator, and Hybrid RAG.
6. Failed cases were preserved and classified instead of removed.


