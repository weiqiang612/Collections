# Agent Offline Evaluation Report

## Summary

- Target project: `D:\project\sky-take-out-project`
- Target module: `sky-take-out\sky-ai`
- Evaluation type: offline/local fixed test set
- Test set size: 150 cases
- Data source: synthetic and project-grounded cases derived from restaurant customer-service workflows, existing RAG resources, Agent tools, Advisor chain, and task orchestration design.
- Result boundary: not online user traffic, not production business metrics.

## Dataset Distribution

| Suite | Cases | Primary capability |
|---|---:|---|
| Tool governance | 35 | Intent-based tool selection and forbidden-tool blocking. |
| High-risk confirmation | 30 | Refund, cancellation, address updates, and confirmation-before-write behavior. |
| Multi-step orchestration | 30 | Query, slot extraction, confirmation, resume, fallback. |
| RAG QA | 40 | Refund, delivery, cancel-order, address-change, and售后 rule answers. |
| Adversarial edge | 15 | Prompt injection, privacy, interruption, missing information, mixed intent. |

Difficulty distribution:

| Difficulty | Cases | Notes |
|---|---:|---|
| Easy | 27 | Normal user requests and clear FAQ questions. |
| Medium | 53 | Mild ambiguity, mixed read-only actions, or colloquial wording. |
| Hard | 70 | Deliberate stress cases: high-risk write attempts, missing parameters, mixed intent, prompt injection, RAG ambiguity, and recovery paths. |

Safety distribution:

| Safety tag | Cases | Meaning |
|---|---:|---|
| `safe_online` | 53 | Pure FAQ or menu-style cases that could later be considered for online shadow or low-risk evaluation. |
| `shadow_only` | 26 | Read-only or low-risk tool cases suitable for future non-writing observation. |
| `offline_only` | 71 | High-risk write, privacy, prompt injection, or unsafe-action cases that must not run against live production data. |

This distribution is intentionally pressure-heavy. It is designed for resume-grade offline evidence and failure discovery, not as a claim about normal production traffic composition.

## Existing Target-Project Evidence

The target project already contains offline report evidence that can seed the final numbers after rerun:

| Evidence | Current known offline result | Source |
|---|---:|---|
| Adversarial tool hallucination benchmark | Baseline `4/10` misuse, optimized `0/10` misuse in existing deterministic report shape. | `ToolHallucinationEvaluationTest.java` |
| FAQ RAG baseline | `24/25` recalled, recall `96.0%`, average judge score about `4.61/5`, QA accuracy about `92.1%`, average latency about `130 ms`. | `target/offline-replay/rag-evaluation-report.*` |
| RAG paraphrase generalization | `23/25` recalled, recall `92.0%`, average judge score about `4.42/5`, QA accuracy about `88.3%`, average latency about `188 ms`. | `target/offline-replay/rag-generalization-report.*` |
| Multi-step replay | Planner/orchestrator/memory suites already write `replay-report.*`. | `OfflineReplayEvaluationTest.java` |

These numbers are useful as evidence, but the final 150-case report should label them as offline/local results and should not merge mock and real-model results without an execution-mode column.

## Metric Table

| Metric | Baseline | Optimized | Interpretation |
|---|---:|---:|---|
| Tool misuse rate | X% | Y% | Lower is better. Count forbidden tool selection on adversarial/mixed-intent cases. |
| Tool selection accuracy | X% | Y% | Correct expected tool and no forbidden tool. |
| High-risk confirmation coverage | X% | Y% | High-risk write action must emit confirmation before execution. |
| Pre-confirmation write rate | X% | 0% | Optimized target should be zero for safety. |
| Multi-step completion rate | X% | Y% | Compound task finishes expected plan and final answer. |
| Slot transfer success rate | X% | Y% | Entity found in one step is correctly used by later step. |
| RAG recall rate | X% | Y% | Expected source is retrieved. |
| RAG answer usability | X% | Y% | Answer is grounded and operationally useful. |

## Credibility Notes

- Do not fill every metric with 100%.
- Keep failed and borderline cases in the report.
- Label the execution mode for each metric: `deterministic_mock`, `local_real_model`, or `offline_replay`.
- If a score comes from simulated baseline behavior, call it "evaluation-only baseline", not historical production behavior.

## Failure Distribution

| Failure type | Count | Representative case | Fix direction |
|---|---:|---|---|
| `tool_misuse` | X | TOOL-000 | Tighten whitelist or intent routing. |
| `missing_parameter` | X | EDGE-000 | Ask clarification before action. |
| `confirmation_missing` | X | RISK-000 | Enforce confirmation gate. |
| `rag_recall_miss` | X | RAG-000 | Improve query expansion or source ranking. |
| `answer_unusable` | X | RAG-000 | Improve answer rubric and prompt. |
| `user_interrupt` | X | EDGE-000 | Reset or suspend task state correctly. |
| `multi_intent_confusion` | X | TOOL-000 | Split intent or planner step. |
| `slot_transfer_error` | X | MULTI-000 | Validate extracted entities before next step. |

## Retest Record

| Round | Change | Cases rerun | Improved metric | Remaining risk |
|---|---|---:|---|---|
| R1 | Baseline run | 150 | N/A | Establish initial failure distribution. |
| R2 | Enable tool whitelist and confirmation gate | 80 | Tool misuse, confirmation coverage | Ambiguous mixed-intent prompts. |
| R3 | Enable orchestrator and RAG optimized path | 70 | Multi-step completion, RAG recall | Colloquial and conflicting policy questions. |

## Resume-Safe Metrics

Use only after actual values are filled from a run:

> Built a 150-case offline evaluation set for a restaurant customer-service Agent, covering tool calling, high-risk confirmation, multi-step orchestration, RAG QA, and adversarial inputs. On the fixed offline set, dynamic tool whitelisting reduced high-risk tool misuse from X% to Y%, pre-confirmation write execution dropped to 0%, multi-step task completion improved from X% to Y%, and RAG rule recall reached X%.

## Non-Claims

Do not claim:

- Online customer-service accuracy.
- User satisfaction improvement.
- Human support cost reduction.
- Production high availability.
- Real refund, cancellation, or conversion improvements.


