# TASK-002: Add Sky Takeout Project Detail Page

**Status**: Draft
**Created**: 2026-06-22
**Feature dir**: `docs/4-tasks/features/TASK-002-project-detail-page/`

## Objective
Add a reusable project detail route with a first implementation for `sky-takeout`, so the portfolio can present a deeper Agent case study with demo media, explicit business value, and technical evidence beyond the homepage summary card.

## Scope

### In scope
- Add a reusable `/projects/:projectId` route and implement the first detail page at `/projects/sky-takeout`.
- Add homepage entry affordances for the `sky-takeout` card: full-card navigation plus an explicit detail CTA.
- Build the `sky-takeout` detail page with a hero layout that uses left-side value copy and right-side media.
- Include the two Mermaid diagrams sourced from `D:/project/sky-take-out-project/SKY-AI-FLOWCHARTS.md`: the overall business flowchart and the multi-step cancel-order sequence diagram.
- Add dedicated sections for demo context, technical highlights, personal ownership, and project retrospective.
- Extend the existing bilingual static data model so the detail-page structure can later support other projects.

### Out of scope
- Adding detail pages for `hm-dianping` or `equipment-management` in this task.
- Introducing new backend APIs, database storage, or external CMS/content systems.
- Embedding a finalized real video source; v1 can ship with a structured media placeholder that is easy to replace later.

## Acceptance criteria

```json
[
  {
    "id": "AC-001",
    "category": "functional",
    "description": "Homepage users can enter the Sky Takeout detail page through both full-card interaction and an explicit detail CTA.",
    "steps": [
      "Load `/` and scroll to the Projects section.",
      "Focus the `sky-takeout` project card and verify the card exposes a clear detail entry affordance in addition to its summary content.",
      "Click the dedicated detail CTA and verify the app navigates to `/projects/sky-takeout`.",
      "Return to `/`, click the main interactive surface of the `sky-takeout` card, and verify it also navigates to `/projects/sky-takeout` without breaking the other project tabs."
    ],
    "passes": true
  },
  {
    "id": "AC-002",
    "category": "functional",
    "description": "The Sky Takeout detail hero communicates business value first, while keeping demo media visible in the first screen.",
    "steps": [
      "Open `/projects/sky-takeout`.",
      "Verify the first screen uses a split hero layout with left-side title/value copy and right-side media content or placeholder.",
      "Verify the hero includes a one-sentence business-value positioning statement, a compact tag group, and a concrete result/status strip rather than only raw technology names.",
      "Verify the hero can be understood in a few seconds by a recruiter or technical reviewer without scrolling into the deeper technical sections."
    ],
    "passes": true
  },
  {
    "id": "AC-003",
    "category": "integration",
    "description": "The detail page includes the two specified Mermaid diagrams with contextual explanation, not as unlabeled technical dumps.",
    "steps": [
      "Open `/projects/sky-takeout` and scroll to the process and architecture sections.",
      "Verify the page renders the overall business flowchart from `SKY-AI-FLOWCHARTS.md` with surrounding explanatory copy that frames the Agent execution path.",
      "Verify the page renders the multi-step cancel-order sequence diagram from `SKY-AI-FLOWCHARTS.md` with copy that explains the query, slot injection, confirmation, execution, and async memory write sequence.",
      "Verify both diagrams remain readable and preserve the portfolio's existing Mermaid interaction quality."
    ],
    "passes": true
  },
  {
    "id": "AC-004",
    "category": "functional",
    "description": "The detail page clarifies the author's independent ownership and reflective engineering thinking.",
    "steps": [
      "Open `/projects/sky-takeout` and navigate to the lower content sections.",
      "Verify there is a dedicated `我的职责` or equivalent ownership section that states the core design and implementation areas independently handled by the author.",
      "Verify there is a dedicated retrospective section that pairs concrete problems with corresponding solutions or tradeoffs.",
      "Verify these sections read as evidence-based project explanation rather than generic skill-list filler."
    ],
    "passes": true
  },
  {
    "id": "AC-005",
    "category": "edge-case",
    "description": "Unknown project detail routes fail safely instead of rendering a broken or empty detail page.",
    "steps": [
      "Navigate directly to `/projects/not-a-real-project`.",
      "Verify the app falls back to the existing not-found behavior or an equivalent safe route-level failure state.",
      "Verify the app does not render an empty detail shell, undefined content, or JavaScript crash output."
    ],
    "passes": true
  },
  {
    "id": "AC-UI-UX",
    "category": "integration",
    "description": "Chrome MCP validates the UI/UX flow across desktop and mobile breakpoints with clean interactions and console state.",
    "steps": [
      "Open `/` and `/projects/sky-takeout` in Chrome MCP at 1440x900 and verify layout, spacing, visibility, and overflow are correct for the homepage entry and detail-page hero plus content sections.",
      "Switch to 375x812 and verify the responsive layout, navigation, media block, Mermaid sections, and primary actions remain usable without clipping or overlap.",
      "Hover the `sky-takeout` project card entry surface, the detail CTA, and the detail-page return path plus any primary interactive hero element, and verify expected visual feedback appears.",
      "Audit the browser console during the flow and verify there are zero JavaScript errors.",
      "Archive screenshots as `task-002-home-desktop.png`, `task-002-home-mobile.png`, `task-002-detail-desktop.png`, and `task-002-detail-mobile.png`."
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
- The route structure will change by adding `/projects/:projectId`; this was explicitly reviewed in advance through the task-design checkpoint.
- No new dependencies, environment variables, backend APIs, or database changes are required.

### Explicit non-maintenance
- `docs/2-designs/api_contract.md` does not need maintenance because the feature remains a frontend-only route/content expansion with no API contract changes.
- `docs/2-designs/db_schema.md` does not need maintenance because the project remains static-data driven and no persistence model changes are introduced.
