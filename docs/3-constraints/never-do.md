# Never Do

🚫 These are absolute prohibitions. No exceptions, regardless of how convenient
it might seem. If you believe a rule should be broken, stop and ask the user first.

## Security & secrets

- 🚫 Commit secrets, credentials, API keys, or tokens to the repository
- 🚫 Log sensitive user data (passwords, tokens, full card numbers, PII)
- 🚫 Output un-sanitised or un-escaped user data to HTML or API responses
- 🚫 Skip server-side input validation on any public API endpoint

## File boundaries

- 🚫 Edit `node_modules/` or any auto-generated directory
- 🚫 Modify `.github/workflows/` or CI pipeline files without explicit approval
- 🚫 Modify production environment configuration files
- 🚫 Modify files outside the scope defined in the active Spec

## Database & API Design Contracts

- 🚫 Modify database schemas or table structures without a corresponding migration script
- 🚫 Modify any API request or response structure without first updating the API contract in `docs/2-designs/api_contract.md`

## Tests

- 🚫 Delete or comment out a failing test to make a build pass
- 🚫 Modify a test's assertions to match wrong behaviour — fix the implementation
- 🚫 Use `console.log` in tests — use assertions

## Vue 3 — Component model

- 🚫 Use Options API in new components — always use Composition API + `<script setup>`
- 🚫 Mutate props directly — emit an event and let the parent update state
- 🚫 Produce side effects inside a `computed` property (mutations, API calls, assignments)
- 🚫 Use `reactive()` at all — standardize on `ref()` only
- 🚫 Access `$parent` or `$root` — use props/emits or provide/inject instead

## Vue 3 — State & reactivity

- 🚫 Use Vuex — always use Pinia for state management (if state is shared)
- 🚫 Store derived values in state — use `computed`
