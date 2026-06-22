# TASK-003: Tasks

**Spec**: `spec.md`
**Status**: In Progress

## Key decisions
- Keep the unified `/projects/:projectId` route family and expand it through normalized static data instead of building three separate page implementations.
- Move deep technical evidence out of the homepage project cards and into dedicated detail pages, making the homepage a lighter preview layer.
- Generalize the detail hero media area into a reusable module that supports video and screenshot-oriented projects with one consistent shell.

## Progress

- [x] T1 — Update `docs/1-requirements/project_overview.md` and `docs/1-requirements/requirements_analysis.md` to reflect all-project detail coverage and the lighter homepage preview role · covers: doc-maintenance
- [x] T2 — Update `docs/2-designs/architecture.md` with the normalized all-project detail-page system and homepage-to-detail content split · covers: doc-maintenance, AC-002, AC-005
- [x] T3 — Update `docs/2-designs/ui_prototype.md` with the lightweight homepage preview-card pattern and the shared detail-page media module rules · covers: doc-maintenance, AC-001, AC-003, AC-004
- [x] T4 — Normalize the detail-page data model in `src/data/i18n.js` so all three projects share one reusable schema for preview and detail content · covers: AC-001, AC-003, AC-005
- [x] T5 — Add complete `hm-dianping` and `equipment-management` detail content, including media, section copy, and project-specific proof structure · covers: AC-002, AC-004
- [x] T6 — Refactor the homepage projects UI into lightweight preview cards and remove the large embedded architecture-diagram-first presentation · covers: AC-001
- [x] T7 — Refactor the project detail view and supporting components so the hero media region supports both video and screenshot-style projects consistently · covers: AC-002, AC-003, AC-005
- [x] T8 — Verify route behavior, preview-to-detail navigation, and invalid-project fallback across all detail pages · covers: AC-002
- [x] T9 — Refine styles, spacing, and responsive behavior for the homepage preview system and all-project detail-page layouts · covers: AC-001, AC-003, AC-004
- [x] T10 — Run browser acceptance for `AC-UI-UX`, including desktop `1440x900`, mobile `375x812`, console audit, and screenshot archival · covers: AC-UI-UX
- [x] T11 — Run `pnpm build` — build must pass with the expanded project-detail system
- [x] T12 — Verify ACs: update `passes` to `true` in spec.md for each passing criterion
- [x] T13 — Update `docs/4-tasks/CURRENT_PLAN.md` — mark this task complete

## Dependencies
- T4 depends on T1, T2, and T3.
- T5 depends on T4.
- T6 and T7 depend on T4 and T5.
- T8 depends on T6 and T7.
- T9 depends on T6, T7, and T8.
- T10 depends on T9.
- T11 depends on T10.
- T12 and T13 depend on T11.

## Blockers
<!-- Fill in if something is preventing progress -->
