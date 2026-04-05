# memory.md

> Update this file at the end of every work session. An AI agent reads it cold at the start of the next one.

---

## Project Status

**Phase:** 1 (MVP)
**State:** Sections 0–4 complete — all 3 tabs, auth, RLS — committed to main
**Deployed:** Yes (https://homecrm.vercel.app/)
**Database:** Supabase project created, 3 tables live, RLS enabled with auth-based policies
**Last Commit:** `a5f49cb` — feat(auth): add Supabase email/password auth with RLS policies

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
- [x] Auth (email/password login + signup, session management)
- [x] RLS policies restored (users see only their own data)
- [x] Auto-create home on first signup
- [x] Sign Out button in header
- [x] CSS polish: animations, stagger, modal blur, centered container
- [x] Deployed to Vercel (https://homecrm.vercel.app/)

## Last Session

**Date:** 2026-04-04

**What happened:**

- Added Supabase email/password auth (useAuth hook, AuthPage component)
- Auth gate in App.jsx — shows login when logged out, main app when logged in
- Auto-creates a `homes` row on first signup (no address required)
- Switched hooks from DEV_HOME_ID to real homeId/userId from auth
- Re-enabled RLS with proper auth-based policies on all 3 tables
- Cleaned up old dev data (fake user_id rows)
- Added CSS polish pass: fade-in, slide-up, stagger animations, centered container, modal blur
- Added Sign Out button to header
- All 6 tests passing (updated to mock Supabase auth)
- Fixed race condition: `loadHome` wasn't awaited, causing `homeId = null` on page load
- Fixed `homes` insert: removed non-existent `name` column from auto-create
- Fixed loading guards in hooks: `setLoading(false)` when homeId/userId is null
- Locked roadmap phases: Phase 1 (MVP), Phase 2 (QoL), Phase 3+ (big ideas)
- Old test data deleted — users start fresh after auth migration

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
| RLS disabled on all 3 tables for dev | ✅ Fixed | RLS re-enabled with auth-based policies |
| homes.address is now nullable | ✅ Fixed | Updated db-schema.md to reflect this |
| DEV_HOME_ID constant still in repo | ✅ Fixed | Removed src/lib/constants.js |
| Old test@homebase.dev account may have broken home state | Open | Sign up fresh account to test; old account had home creation fail before bugfix |

## Next Action

The immediate next steps, in order:

1. **Phase 2 planning** — Kick off Phase 2 Quality of Life features by picking the next task.

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
│   ├── index.css                 # Tailwind + brand design tokens + animations
│   ├── App.jsx                   # Auth gate + MainApp: header, stats, tabs, modals
│   ├── App.test.jsx              # 6 tests: render, stats, tabs, auth
│   ├── lib/
│   │   ├── supabase.js           # Single Supabase client
│   │   ├── intervals.js          # Category → months mapping + calculator
│   │   └── constants.js          # DEV_HOME_ID (legacy, no longer used)
│   ├── hooks/
│   │   ├── useAuth.js            # Session mgmt: login, signup, logout, auto-create home
│   │   ├── useServiceRecords.js  # Fetch/add service records (takes homeId)
│   │   └── useProviders.js       # Fetch/add/update providers (takes userId)
│   ├── components/
│   │   ├── AuthPage.jsx          # Login/signup form
│   │   ├── LogServiceModal.jsx   # Log service form (6 fields max)
│   │   ├── EditProviderModal.jsx # Edit provider details modal
│   │   ├── ServiceHistory.jsx    # History list with ServiceRow
│   │   ├── UpcomingList.jsx      # Upcoming maintenance with urgency badges
│   │   ├── ProviderList.jsx      # Provider rolodex grid with search
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
