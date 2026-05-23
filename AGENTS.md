# Ethan's Portfolio

Brand: `weiqiang / 围墙` · Domain: `weiqiang.me` (Vercel, Cloudflare DNS gray-cloud)

## Stack

- **Frontend only** — Vue 3 + Vite 8 + Vue Router 5 SPA (`web/`)
- **No backend** — Spring Boot (`api/`) was removed. All data is static JS files.

## Commands

All in `web/`:

| Command | Action |
|---------|--------|
| `pnpm dev` | Vite dev server (proxies `/api/chat` → `localhost:8080`) |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |

No lint, typecheck, or test commands configured.

## Architecture

```
web/
  api/chat.js          — Vercel Serverless Function stub for Agent chat proxy
  vercel.json          — SPA fallback + /api/* routing
  src/
    data/
      i18n.js           — Bilingual content (zh-CN + en-US): profile, projects, agent mock replies
      profile.js        — Sync profile data (used by profileClient)
    services/
      profileClient.js  — Sync export from profile.js
      chatClient.js     — Mock fallback by default; reads VITE_API_BASE_URL for real POST /api/chat
    composables/
      useChatMock.js    — Wraps chatClient, exposes isStreaming + sendMessage
      useLocale.js      — Locale from URL / localStorage
      useTypewriter.js  — Character-by-character reveal
    components/
      hero/             — HeroSection (terminal typewriter intro)
      about/            — AboutSection (methodology + tech stack)
      projects/         — ProjectsSection reads from i18n t.projects
      agent/            — ResumeAgentLauncher, ResumeAgentPanel, ChatMessage, StreamingCursor
      common/           — AppShell, SectionTitle, TerminalWindow
    router/index.js     — / → HomeView, catch-all → NotFoundView
```

## Data flow

- **Profile**: `data/profile.js` → `services/profileClient.js` → components (sync, no async)
- **Projects**: embedded in `data/i18n.js` as `t.projects` (bilingual)
- **Chat**: `ResumeAgentPanel` → `useChatMock` → `chatClient.sendMessage()` → mock or real `POST /api/chat`
- **No remote profile/projects API** — if a backend appears later, the API contract is in `requirements.md`

## Chat architecture

- `VITE_API_BASE_URL` env var controls mock vs real API
- No env var → mock (character-by-character streaming from i18n.js)
- With env var → `POST ${apiBaseUrl}/api/chat` (JSON, non-streaming)
- Vercel function `web/api/chat.js` is a stub awaiting a real Agent service URL

## Design system

Minimalist Dark + Geek Terminal. No Tailwind — pure CSS in `web/src/style.css`.

| Role | Color | Usage |
|------|-------|-------|
| Background | `#000000` | Page |
| Panel | `#0B0F14` | Cards, sections |
| Text | `#F8F8F2` | Primary |
| Cyan | `#8BE9FD` | Accent |
| Green | `#50FA7B` | Terminal accent |
| Orange | `#FFB86C` | Warning |
| Red | `#FF5555` | Critical |

## Vercel deployment

- Connected to `weiqiang612s-projects` team
- Production: `weiqiang.me` (CNAME → `741cce93e42bedd7.vercel-dns-017.com`, gray cloud in Cloudflare)
- `note.weiqiang.me` is the Ethan's Notes project (separate VitePress site, different Vercel project)
- Cloudflare API token in opencode config has DNS:Edit scope
- `vercel.json` rewrites: `/api/*` → Vercel functions, `/*` → `index.html` (SPA)

## Gotchas

- `data/projects.js` and `data/tech-stack.js` were deleted — all content lives in `i18n.js`
- `services/apiClient.js` was deleted — no remote profile/projects calls exist
- Components import profile sync, no `onMounted` async fetch
- The `api/` Spring Boot directory was fully removed from the repo
- Locale is persisted in localStorage keyed by `locale`
