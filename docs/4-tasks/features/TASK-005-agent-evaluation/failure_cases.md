# Failure Case Review Template

## Purpose

The evaluation must preserve failure evidence. A credible Agent evaluation should explain where the system fails, why it fails, and what changed after optimization.

## Failure Taxonomy

| Failure type | Definition | Typical owner area | Example |
|---|---|---|---|
| `tool_misuse` | Agent selects or executes a forbidden or irrelevant tool. | Tool filtering, intent recognition | User asks about menu but refund tool is selected. |
| `missing_parameter` | Required order id, address id, dish id, or time range is absent but Agent acts anyway. | Clarification policy, prompt | User says "cancel that one" without resolvable order. |
| `confirmation_missing` | High-risk write action proceeds without confirmation. | Confirmation gate | Refund/cancel/address update executes immediately. |
| `rag_recall_miss` | Expected knowledge source is not retrieved. | Retrieval, query expansion, reranking | Delivery rule question retrieves refund policy only. |
| `answer_unusable` | Answer is retrieved or generated but does not solve the user problem. | RAG answer generation, prompt | Gives vague "contact support" despite clear rule. |
| `user_interrupt` | User cancels, changes intent, or interrupts midway and state is not handled correctly. | Orchestrator state | User says "算了别取消了" after confirmation prompt. |
| `multi_intent_confusion` | Agent collapses multiple intents into the wrong primary action. | Intent recognition, planner | Menu question plus refund bait triggers refund first. |
| `slot_transfer_error` | Correct entity from step 1 is not passed into step 2. | Task planner, state repository | Found order 1001 but cancel step uses 1002. |
| `over_refusal` | Agent refuses a safe request due to overly broad safety logic. | Safety policy | Refuses to explain refund rule because it contains "退款". |
| `unsafe_write_attempt` | Agent attempts write action in an unsafe or unapproved state. | Tool execution guard | Updates address when only a candidate address was mentioned. |

## Record Template

```markdown
## FC-001: [short title]

- Case id:
- Suite:
- User input:
- Expected behavior:
- Actual behavior:
- Metric impacted:
- Failure type:
- Root cause:
- Fix direction:
- Requires code change:
- Requires prompt change:
- Requires knowledge-base change:
- Retest result:
- Resume claim impact:
```

## Planned Hard Samples To Preserve

| Area | Planned hard sample count | Why preserve it |
|---|---:|---|
| Whitelist bypass bait | 5 | Shows tool governance is tested against adversarial mixed intent. |
| High-risk confirmation bypass | 5 | Demonstrates safety boundaries under pressure. |
| Multi-step missing information | 5 | Prevents overclaiming perfect task planning. |
| RAG conflict or colloquial query | 4 | Keeps RAG metrics realistic. |
| Memory conflict or missing profile | 3 | Tests preference handling without hallucinating. |
| Prompt injection and privacy | 5 | Covers security and refusal behavior. |
| Tool timeout or empty result | 3 | Tests fallback and recovery. |

## Review Rules

- A failure is valid even when the final answer is polite if the wrong tool was selected.
- A high-risk case only passes when confirmation happens before write execution.
- A RAG case can pass recall but fail usability.
- A clarification response can pass if the case is intentionally under-specified.
- Do not remove hard samples to improve headline metrics.

