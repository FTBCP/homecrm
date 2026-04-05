# memory.md

> Update this file at the end of every work session. An AI agent reads it cold at the start of the next one.

---

## Project Status

**Phase:** 1 (MVP)
**State:** Sections 0–3 complete — all 3 tabs functional, committed to main
**Deployed:** No (local only at http://localhost:5173/)
**Database:** Supabase project created, 3 tables live, RLS temporarily disabled for dev
**Last Commit:** `1f86e59` — feat(mvp): add service history, provider rolodex, and upcoming tabs

What exists today:

- [x] GitHub repo: https://github.com/FTBCP/homecrm.git
- [x] README.md
- [x] .gitignore (node_modules, .env, dist, .DS_Store)
- [x] .env with Supabase URL and anon key
- [x] React app initialized (Vite + React 19)
- [x] Tailwind CSS v4 configured with brand tokens
- [x] Vitest + React Testing Library installed (6 tests passing)
- [x] Supabase project created (project ref: bhgtyilutzgpptneuzbz)
- [x] Database tables created (homes, service_records, providers)
- [x] Supabase JS client wired up (src/lib/supabase.js)
- [x] App shell with tab navigation (History / Upcoming / Providers)
- [x] Log Service modal — fully working, saves to Supabase
- [x] Service History list — displays records from Supabase
- [x] Stat cards — Spent This Year, Services Logged, Action Items (live)
- [x] Category badges with brand colors
- [x] Provider auto-creation when logging a service
- [x] Intervals config (src/lib/intervals.js)
- [x] Provider Rolodex tab — searchable grid, edit modal, star ratings, job counts
- [x] Upcoming tab — sorted by urgency, overdue/due-soon badges, Log Again flow
- [ ] Auth (email/password login)
- [ ] Deployed to Vercel

## Last Session

**Date:** 2026-04-04

**What happened:**

- Ran brainstorming skill to validate Phase 1 plan
- Identified 5 gaps: missing home_id seed, shadcn/ui mismatch, provider auto-creation complexity, no router needed, testing setup timing
- Decided to drop shadcn/ui (brand.md still references it — needs updating)
- Decided no React Router needed — using state-based tab switching
- Created full Phase 1 analysis with resequenced build order (see phase1_analysis.md artifact)
- Completed Section 0 (Foundation): Vite, Tailwind, Vitest, Supabase client, app shell
- Completed Section 1 (Service History): Log Service modal, history list, stat cards, provider auto-create
- All data flows end-to-end: form → Supabase → UI refresh
- Test home seeded with ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

## Decisions Made

| # | Decision | Reason | Date |
|---|----------|--------|------|
| 1 | React for frontend | Already familiar from PLO course project | 2026-04-04 |
| 2 | Supabase for DB + auth | Free tier, Postgres, auth bundled, no server code needed | 2026-04-04 |
| 3 | Tailwind for styling | Faster prototyping, no separate CSS files | 2026-04-04 |
| 4 | Vercel for hosting | Zero-config React deploys, free tier | 2026-04-04 |
| 5 | No TypeScript | Reducing complexity for Phase 1 | 2026-04-04 |
| 6 | No state management library | useState/useEffect only, keep it simple | 2026-04-04 |
| 7 | Single-user, single-property | Phase 1 scope control — no multi-user, no household sharing | 2026-04-04 |
| 8 | Recommendations = last date + interval | No rules engine, no scoring, no priority weighting | 2026-04-04 |
| 9 | Skip auth for initial build | Can add Supabase Auth later without rearchitecting | 2026-04-04 |
| 10 | Drop shadcn/ui, use plain Tailwind | shadcn/ui designed for Next.js + TS, doesn't fit our stack | 2026-04-04 |
| 11 | No React Router for Phase 1 | Tab switching via state is simpler, no extra library needed | 2026-04-04 |
| 12 | Seed test home for dev | Hardcoded home_id in src/lib/constants.js, replaced with auth in Section 4 | 2026-04-04 |
| 13 | intervals.js built early | Log Service form needs it to calculate next_recommended_date | 2026-04-04 |

## Known Problems

| Problem | Status | Notes |
|---------|--------|-------|
| brand.md still references shadcn/ui on line ~189 | Open | Need to update to say "plain Tailwind" |
| RLS disabled on all 3 tables for dev | Open | Must re-enable + create proper policies when adding auth in Section 4 |
| homes.user_id FK constraint dropped for dev | Open | Must restore when adding auth in Section 4 |
| providers.user_id FK constraint dropped for dev | Open | Must restore when adding auth in Section 4 |
| homes.user_id is nullable (was NOT NULL) | Open | Must restore NOT NULL when adding auth in Section 4 |
| providers.user_id is nullable (was NOT NULL) | Open | Must restore NOT NULL when adding auth in Section 4 |

## Next Action

The immediate next steps, in order:

1. **Polish & Ship (Section 4)** — mobile layout pass, loading/error polish, auth (Supabase Auth), deploy to Vercel
2. **Re-enable RLS** — restore FK constraints, NOT NULL on user_id, create proper auth-based policies
3. **Update brand.md** — remove shadcn/ui references, document actual component patterns

## Gotchas

| Problem | Fix | Date |
|---------|-----|------|
| `touch` command not recognized | Windows doesn't have `touch`. Use `echo. > filename` instead. One file per command. | 2026-04-04 |
| `fatal: not a git repository` on remote add | Must run `git init` before `git remote add`. Order matters. | 2026-04-04 |
| `echo file1 file2` doesn't create files | `echo` without `>` just prints text. Must use `echo. > file1` then `echo. > file2` separately. | 2026-04-04 |
| Tutorials assume Mac/Linux | Most web dev guides use bash. On Windows, swap `touch` → `echo. >`, `cat` → `type`, `rm` → `del`. Or use Git Bash. | 2026-04-04 |
| PowerShell doesn't support `&&` | Use `;` or run commands separately. `npm install a && npm install b` fails in PS. | 2026-04-04 |
| `npm create vite@latest ./` fails in non-empty dir | Scaffold manually: create package.json with `npm init -y`, install deps individually. | 2026-04-04 |
| Supabase RLS blocks anon writes even when disabled | Must also drop all existing RLS policies AND drop FK constraints on user_id columns. Disable alone is not enough. | 2026-04-04 |
| Fake user_id violates FK constraint | Can't insert a row with a user_id that doesn't exist in auth.users. Drop FK + make nullable instead. | 2026-04-04 |

## File Structure

```
homecrm/
├── index.html                    # Entry HTML with Google Fonts
├── vite.config.js                # Vite + React + Tailwind + Vitest config
├── package.json                  # Dependencies and scripts
├── .env                          # Supabase credentials (gitignored)
├── .env.example                  # Template showing required env vars
├── supabase/
│   └── migration.sql             # Full table creation + RLS SQL
├── src/
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Tailwind + brand design tokens
│   ├── App.jsx                   # Main app: header, stats, tabs, modal
│   ├── App.test.jsx              # 4 tests: render, stats, tabs
│   ├── lib/
│   │   ├── supabase.js           # Single Supabase client
│   │   ├── intervals.js          # Category → months mapping + calculator
│   │   └── constants.js          # DEV_HOME_ID (temp, removed in Section 4)
│   ├── hooks/
│   │   ├── useServiceRecords.js  # Fetch/add service records
│   │   └── useProviders.js       # Fetch/add/update/find-or-create providers
│   ├── components/
│   │   ├── LogServiceModal.jsx   # Log service form (6 fields max)
│   │   ├── ServiceHistory.jsx    # History list with ServiceRow
│   │   ├── CategoryBadge.jsx     # Color-coded category pills
│   │   └── StatCard.jsx          # Stat display card
│   └── test/
│       └── setup.js              # Vitest setup (jest-dom matchers)
├── agent-docs/                   # AI reference docs
│   ├── architecture.md
│   ├── db-schema.md
│   ├── api-referenece.md
│   └── testing.md
├── brand.md                      # Visual design system
├── roadmap.md                    # Phase 1 & 2 task checklist
├── security.md                   # Security rules
├── memory.md                     # This file
└── about-me.md                   # User context
```
