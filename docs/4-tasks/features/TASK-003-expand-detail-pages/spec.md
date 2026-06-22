# TASK-003: Expand Detail Pages To All Projects

**Status**: Draft
**Created**: 2026-06-22
**Feature dir**: `docs/4-tasks/features/TASK-003-expand-detail-pages/`

## Objective
Expand the project detail-page system from the current `sky-takeout` pilot into a consistent all-project portfolio experience, while refactoring the homepage project area into lighter preview cards that hand off deep technical evidence to each dedicated detail page.

## Scope

### In scope
- Add complete detail-page content for `hm-dianping` and `equipment-management` under the existing `/projects/:projectId` route family.
- Refactor the homepage project area so all three projects use a consistent lightweight preview-card presentation instead of pairing the homepage summary with a large embedded architecture diagram.
- Replace the fixed “video-first” detail hero assumption with a reusable media module that supports video, screenshots, or cover image plus caption depending on the project.
- Keep `sky-takeout` using a video-capable media presentation, while allowing the other two projects to use screenshot-oriented media content without degrading the shared layout.
- Normalize the detail-page schema in `src/data/i18n.js` so all three projects can share one structural model while keeping project-specific content.

### Out of scope
- Adding new backend APIs, database storage, admin content management, or remote asset pipelines.
- Requiring recorded video for every project.
- Replacing the overall dark terminal visual system with a new design language.

## Acceptance criteria

```json
[
  {
    "id": "AC-001",
    "category": "functional",
    "description": "The homepage project section becomes a lightweight preview layer for all projects instead of showing a large embedded technical diagram as the main project presentation.",
    "steps": [
      "Open `/` and scroll to the Projects section.",
      "Verify all three projects are presented with a consistent lightweight preview format centered on title, short value proposition, compact highlights, tags, and a clear detail-entry action.",
      "Verify the homepage no longer depends on a large architecture diagram as the main content block for project browsing.",
      "Verify the homepage still makes it easy to distinguish the three projects without overloading the first-read experience."
    ],
    "passes": true
  },
  {
    "id": "AC-002",
    "category": "functional",
    "description": "All three projects expose working detail pages through the unified `/projects/:projectId` route pattern.",
    "steps": [
      "Open `/projects/sky-takeout`, `/projects/hm-dianping`, and `/projects/equipment-management` directly.",
      "Verify each route renders a complete project-specific detail page instead of reusing incomplete placeholder content.",
      "Verify each homepage project preview offers a working navigation path into its corresponding detail page.",
      "Verify all routes maintain the existing fallback behavior for invalid project ids."
    ],
    "passes": true
  },
  {
    "id": "AC-003",
    "category": "integration",
    "description": "The detail-page hero uses one reusable media module that can present video for some projects and screenshots or static preview media for others.",
    "steps": [
      "Open the `sky-takeout` detail page and verify the hero media module supports video-style presentation.",
      "Open the `hm-dianping` and `equipment-management` detail pages and verify the same media region can present screenshot-oriented or static preview content without breaking the layout.",
      "Verify the media module keeps a consistent shell, captioning, and hierarchy across projects even when the underlying content type differs.",
      "Verify no project detail page visually depends on having an actual video in order to look complete."
    ],
    "passes": true
  },
  {
    "id": "AC-004",
    "category": "functional",
    "description": "Each project detail page presents deep content that is appropriate to that project's nature instead of forcing the same evidence density or media style everywhere.",
    "steps": [
      "Inspect the `sky-takeout` detail page and verify it emphasizes Agent workflow evidence, technical diagrams, ownership, and retrospective content.",
      "Inspect the `hm-dianping` detail page and verify it emphasizes concurrency, Redis strategy, request flow, and implementation tradeoffs in a way that fits that project.",
      "Inspect the `equipment-management` detail page and verify it emphasizes lifecycle workflow, governance, RBAC, and product-facing system proof in a way that fits that project.",
      "Verify the shared structure still feels consistent across all three pages."
    ],
    "passes": true
  },
  {
    "id": "AC-005",
    "category": "edge-case",
    "description": "Project preview and detail content remain maintainable through one normalized static-data structure instead of drifting into three unrelated one-off page implementations.",
    "steps": [
      "Inspect the detail-page data model in `src/data/i18n.js` or its equivalent static content source.",
      "Verify all three projects use the same high-level detail schema for hero, media, sections, and metadata.",
      "Verify project-specific variation is expressed through data fields and limited rendering branches, not through copy-pasted independent page implementations.",
      "Verify future addition of a fourth project would not require inventing a separate detail-page architecture."
    ],
    "passes": true
  },
  {
    "id": "AC-UI-UX",
    "category": "integration",
    "description": "Chrome MCP validates the homepage preview flow and all-project detail-page experience across desktop and mobile breakpoints with clean interactions and console state.",
    "steps": [
      "Open `/`, `/projects/sky-takeout`, `/projects/hm-dianping`, and `/projects/equipment-management` in Chrome MCP at 1440x900 and verify layout, spacing, visibility, and overflow are correct for homepage previews and all detail-page hero plus content sections.",
      "Switch to 375x812 and verify the responsive layout, homepage project previews, detail navigation, media modules, and deep-content sections remain usable without clipping or overlap.",
      "Hover each homepage project entry surface, each detail CTA, and the main return-path interactions on the detail pages, and verify expected visual feedback appears.",
      "Audit the browser console during the full flow and verify there are zero JavaScript errors.",
      "Archive screenshots as `task-003-home-desktop.png`, `task-003-home-mobile.png`, `task-003-sky-detail-desktop.png`, `task-003-hm-detail-desktop.png`, and `task-003-equipment-detail-desktop.png`."
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
- The route family remains `/projects/:projectId`, but this task expands the number of valid detail pages and refactors the homepage project presentation pattern.
- No new dependencies, environment variables, APIs, or persistence layers are required.

### Explicit non-maintenance
- `docs/2-designs/api_contract.md` does not require maintenance because the feature remains frontend-only and does not add or change request/response contracts.
- `docs/2-designs/db_schema.md` does not require maintenance because project details remain static-content driven without schema or persistence changes.
