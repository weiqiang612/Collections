# TASK-001: Add Project Tabs Carousel

**Status**: Draft
**Created**: 2026-06-17
**Feature dir**: `docs/4-tasks/features/TASK-001-add-project-tabs-carousel/`

## Objective
Add the third project (Equipment Management System) to the portfolio and restructure the project section into a console tabs switcher with GSAP slide/fade transition animations to avoid visual clutter and maintain page height.

## Scope

### In scope
- Add the complete bilingual project data for "企业设备资产管理系统" (Equipment Management System) to `i18n.js` (including highlights and Mermaid diagrams).
- Implement a horizontal, high-tech Console Tabs selector at the top of the Projects section.
- Animate project card transitions using GSAP (horizontal slide and opacity fade out/in).
- Preserve all interactive controls (drag, zoom, full screen) of the Mermaid diagram renderer.

### Out of scope
- Adding remote database calls or API endpoints (keep the static JS data model).
- Overhauling the page color schemes (must strictly reuse and inherit from the existing `style.css`).

## Acceptance criteria

```json
[
  {
    "id": "AC-001",
    "category": "functional",
    "description": "User can switch between the three projects using the top console tabs",
    "steps": [
      "Load the portfolio website and scroll to the Projects section.",
      "Observe three horizontal tabs at the top: '01. 苍穹外卖', '02. 黑马点评', and '03. 企业设备资产管理系统'.",
      "Click on the '03. 企业设备资产管理系统' tab.",
      "Verify: The project details below instantly load the new project info and its Mermaid diagram."
    ],
    "passes": true
  },
  {
    "id": "AC-002",
    "category": "functional",
    "description": "GSAP slide and fade transition animation triggers when switching tabs",
    "steps": [
      "Click on another tab (e.g. '01. 苍穹外卖').",
      "Verify: The active project details card slides out to the left and fades out, while the new project details card slides in from the right and fades in smoothly.",
      "Verify: The animation runs with high performance and no lag."
    ],
    "passes": true
  },
  {
    "id": "AC-003",
    "category": "functional",
    "description": "Mermaid diagrams maintain full interactive zoom and pan capabilities after switching tabs",
    "steps": [
      "Select the '03. 企业设备资产管理系统' tab.",
      "Verify: The database E-R diagram or workflow diagrams render correctly.",
      "Drag the mouse inside the diagram panel to pan the diagram.",
      "Use the mouse wheel to zoom in and out of the diagram.",
      "Verify: The diagram remains fully responsive and interactive."
    ],
    "passes": true
  }
]
```

## Notes

### Documentation impact
- **Requirements**: true (Update requirements_analysis.md and project_overview.md to cover the tab selector user scenario and new project outline)
- **Architecture**: true (Update architecture.md to reflect the restructured Vue component tree)
- **API Contract**: false (N/A)
- **DB Schema**: false (N/A)
- **UI Prototype**: true (Update ui_prototype.md to define the console tab styling guidelines)
- **Constraints**: false (N/A)
- **ADR**: false (N/A)
- **Agent Runtime**: false (N/A)
- **High-risk Items/Approvals**: None
