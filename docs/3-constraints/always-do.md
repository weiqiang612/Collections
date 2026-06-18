# Always Do

✅ These behaviours are mandatory in every session, for every task.
Not optional even for "quick" or "small" changes.

## Session start

- ✅ Run the Session Start diagnostics checklist to verify that the dev server is running, git state is healthy, and the active task is loaded
- ✅ If the dev server is not running, run `.\init.ps1` (Windows) or `bash init.sh` (UNIX) before coding
- ✅ Read the active feature's `spec.md` in `docs/4-tasks/features/` before implementing
- ✅ Check `docs/3-constraints/never-do.md` before any non-trivial change
- ✅ Read requirements in `docs/1-requirements/` and system designs in `docs/2-designs/` before coding

## Before committing

- ✅ Run `pnpm build` to verify the build compiles successfully and has no errors
- ✅ Confirm no secrets or credentials are staged: `git diff --cached`
- ✅ Update `docs/4-tasks/features/<active-task>/tasks.md` — check off completed tasks
- ✅ Update `docs/4-tasks/CURRENT_PLAN.md` — mark feature complete when all tasks done
- ✅ Keep `docs/2-designs/` documents up to date with any implementation deviations
- ✅ When modifying facts described by a long-lived Harness document, update the corresponding document synchronously; do not postpone documentation maintenance. (修改某个长期 Harness 文档所描述的事实时，同步更新对应文档，不把文档维护推迟到以后。)

## General

- ✅ Define constants for any value used more than once
- ✅ Run `pnpm build` after every logical change — fix failures before continuing

## Vue 3

- ✅ Use Composition API + `<script setup>` for all components
- ✅ Type all `defineProps` and `defineEmits` with generic syntax if using TypeScript (or clear prop-types in Vue 3)
- ✅ Keep source state minimal — derive everything possible with `computed`
- ✅ Use `ref()` for all reactive state — never use `reactive()`
- ✅ Split a component when it has more than one clear responsibility
