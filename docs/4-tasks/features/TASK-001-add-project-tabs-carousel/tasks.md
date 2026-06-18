# TASK-001: Tasks

**Spec**: `spec.md`
**Status**: Complete

## Key decisions
- **GSAP Transition Integration**: Animate project transitions inside `ProjectCard.vue` using Vue-watch triggered GSAP timelines (translating `x` and `autoAlpha`) to maintain high performance and clean markup.
- **i18n Centralization**: Put the new "企业设备资产管理系统" project metadata and Mermaid diagrams directly in `i18n.js` to ensure sync with current translation composables.

## Progress

<!-- Document Maintenance Tasks -->
- [x] T1 — Update requirements: `docs/1-requirements/requirements_analysis.md` & `project_overview.md` · covers: doc-maintenance
- [x] T2 — Update architecture design: `docs/2-designs/architecture.md` · covers: doc-maintenance
- [x] T3 — Update UI prototype: `docs/2-designs/ui_prototype.md` · covers: doc-maintenance

<!-- Implementation Tasks -->
- [x] T4 — Define new Equipment Management System project data in `src/data/i18n.js` · covers: AC-001
- [x] T5 — Refactor `ProjectsSection.vue` to add a horizontal tabs console selector · covers: AC-001
- [x] T6 — Refactor `ProjectCard.vue` to implement GSAP slide & fade transition animations on tab change · covers: AC-002
- [x] T7 — Add UI Styles for console tabs and transitions in `src/style.css` · covers: AC-001, AC-002
- [x] T8 — Verify Mermaid diagram interactivity (pan/zoom/fullscreen) under tabs switching · covers: AC-003

<!-- Gates & Housekeeping -->
- [x] T9 — Run `pnpm build` to verify there are no compilation errors
- [x] T10 — Verify ACs: update `passes` to `true` in spec.md for each passing criterion
- [x] T11 — Update `docs/4-tasks/CURRENT_PLAN.md` — mark this task complete

## Dependencies
- T2 requires T1
- T3 requires T2
- T4, T5, T6, T7 require T3
- T8 requires T4, T5, T6, T7
- T9 requires T8
- T10, T11 require T9
