# TASK-002: Tasks

**Spec**: `spec.md`
**Status**: Completed

## Key decisions
- Use a reusable `/projects/:projectId` route shape, but only ship complete detail content for `sky-takeout` in this task.
- Keep the homepage as the summary layer and use the detail page as an evidence-driven case-study layer with value-first messaging and deeper technical proof below the fold.
- Reuse the existing bilingual static-data model and Mermaid renderer instead of introducing new content systems or visualization components.

## Progress

- [x] T1 — Update `docs/1-requirements/project_overview.md` and `docs/1-requirements/requirements_analysis.md` to include project-detail browsing and case-study expectations · covers: doc-maintenance
- [x] T2 — Update `docs/2-designs/architecture.md` with the new project-detail route, view composition, and homepage-to-detail navigation flow · covers: doc-maintenance, AC-001, AC-005
- [x] T3 — Update `docs/2-designs/ui_prototype.md` with the `sky-takeout` detail-page structure, hero composition, and section ordering rules · covers: doc-maintenance, AC-002, AC-004
- [x] T4 — Extend `src/data/i18n.js` with reusable project-detail data fields and complete bilingual `sky-takeout` detail content, including the two diagrams sourced from `SKY-AI-FLOWCHARTS.md` · covers: AC-002, AC-003, AC-004
- [x] T5 — Add the project-detail route, route-level data resolution, and invalid-project fallback behavior · covers: AC-005
- [x] T6 — Implement the `sky-takeout` detail-page view and supporting sections for hero/media, diagrams, technical highlights, ownership, and retrospective content · covers: AC-002, AC-003, AC-004
- [x] T7 — Update the homepage projects UI so the `sky-takeout` card supports both full-card navigation and an explicit detail CTA without regressing tab switching · covers: AC-001
- [x] T8 — Add or refine styles and motion for the detail page and homepage entry states, keeping the existing dark terminal aesthetic while supporting the new split hero layout · covers: AC-001, AC-002, AC-004
- [x] T9 — Run Chrome MCP acceptance for `AC-UI-UX`, including desktop `1440x900`, mobile `375x812`, hover checks, console audit, and screenshot archival · covers: AC-UI-UX
- [x] T10 — Run `pnpm build` — build must pass with the new route and detail-page content
- [x] T11 — Verify ACs: update `passes` to `true` in spec.md for each passing criterion
- [x] T12 — Update `docs/4-tasks/CURRENT_PLAN.md` — mark this task complete

## Dependencies
- T4 depends on T1, T2, and T3 so the content and structure align with maintained Harness docs.
- T5 depends on T4.
- T6 depends on T4 and T5.
- T7 and T8 depend on T5 and T6.
- T9 depends on T6, T7, and T8.
- T10 depends on T9.
- T11 and T12 depend on T10.

## Blockers
<!-- Fill in if something is preventing progress -->
