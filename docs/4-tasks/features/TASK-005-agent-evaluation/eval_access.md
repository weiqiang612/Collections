# Agent Evaluation Access Notes

## Target

- Project path: `D:\project\sky-take-out-project`
- Module: `sky-take-out\sky-ai`
- Evaluation mode: offline/local fixed test set
- Data claim boundary: evaluation results can support resume claims only as offline/local metrics, not production business outcomes.

## Reusable Entrypoints

| Area | Evidence path | How it supports evaluation |
|---|---|---|
| Overall Agent flow | `D:\project\sky-take-out-project\SKY-AI-FLOWCHARTS.md` | Documents WebSocket entry, Advisor chain, high-risk confirmation, tool execution, multi-step orchestration, and memory persistence. |
| WebSocket interaction | `sky-take-out\sky-ai\src\main\java\com\weiqiang\skyai\websocket\AgentChatWebSocketHandler.java` | Supports frame-level evaluation for token, done, error, confirmation, and cancellation behavior. |
| Agent service | `sky-take-out\sky-ai\src\main\java\com\weiqiang\skyai\websocket\AgentChatService.java` | Main Agent execution surface for intent, prompt, Advisor chain, and step execution. |
| Advisor chain | `sky-take-out\sky-ai\src\main\java\com\weiqiang\skyai\advisor\` | Supports optimized-mode evaluation for intent recognition, context injection, RAG attachment, tool filtering, FAQ cache, and safe tool-call limits. |
| Tool layer | `sky-take-out\sky-ai\src\main\java\com\weiqiang\skyai\tools\` | Provides tool names and business domains for tool-selection and forbidden-tool checks. |
| Multi-step orchestration | `sky-take-out\sky-ai\src\main\java\com\weiqiang\skyai\task\` | Supports multi-step completion, slot transfer, confirmation suspension, timeout, and recovery metrics. |
| RAG resources | `sky-take-out\sky-ai\src\main\resources\rag\` | Provides FAQ and rule material for refund, cancel-order, delivery, address-change, and overview test cases. |
| Existing evaluation tests | `sky-take-out\sky-ai\src\test\java\com\weiqiang\skyai\evaluation\` | Existing offline tests can guide report structure and baseline/optimized comparison, but final claims must state the execution mode. |

## Existing Evaluation Evidence To Reuse

- `ToolHallucinationEvaluationTest.java`: useful for adversarial tool-call bait cases and baseline-vs-filtered comparison.
- `OfflineReplayEvaluationTest.java`: useful for planner, orchestrator, confirmation, timeout, and memory replay cases.
- `RagEvaluationTest.java`: useful for FAQ and paraphrased RAG evaluation, recall, judge score, and generated report shape.
- `OrchestratorAvailabilityTest.java`: useful for fault-injection ideas, but avoid claiming production high availability from local simulation.
- `MemoryConfidenceEvaluationTest.java`: useful for memory confidence and write-back boundaries.

## Execution Boundaries

- Do not modify the target project's database schema.
- Do not modify production, staging, or deployment configuration.
- Do not change core API request or response contracts.
- Do not execute real refund, cancel-order, address-update, cart-write, or payment actions against production data.
- Do not introduce new dependencies, external model services, or target-project code changes without separate user approval.
- Do not present local mock, deterministic replay, or fixed-test-set results as online business results.

## Baseline vs Optimized Strategy

Baseline is not fabricated failure. It must be represented by evaluation-only old or weaker behavior:

- Tool governance baseline: all tools exposed or no intent-based whitelist filtering.
- Confirmation baseline: high-risk write intent recognized, but no confirmation suspension gate.
- Multi-step baseline: single-turn Agent handles compound task without orchestrator state.
- RAG baseline: keyword-only or single retrieval path, without fusion, reranking, or query expansion.

Optimized mode maps to current project mechanisms:

- `IntentRecognitionAdvisor`, `UserContextAdvisor`, `ToolFilterAdvisor`, `SafeToolCallAdvisor`.
- Confirmation frame plus suspended state and resume-after-confirmation flow.
- `TaskOrchestratorService` and `TaskExecutionStateRepository`.
- Hybrid RAG with keyword/vector retrieval, RRF fusion, Reranker, and Query Expansion where available.

## Recommended Local Execution Shape

This task package currently defines the evaluation artifacts only. A future runner can be added after approval using one of these non-destructive approaches:

- A JUnit offline replay test under `sky-ai/src/test/java/.../evaluation`, using mocks and deterministic fixtures.
- A standalone local script that reads `eval_cases.jsonl` and writes reports under `target/offline-replay`.
- A Spring test profile with write tools stubbed, not connected to production data.

