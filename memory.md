\# memory.md

> Update this file at the end of every work session. An AI agent reads it cold at the start of the next one.



\---



\## Project Status



\*\*Phase:\*\* 1 (MVP)

\*\*State:\*\* Scaffolding — repo created, no app code yet

\*\*Deployed:\*\* No

\*\*Database:\*\* Not set up



What exists today:

\- \[x] GitHub repo: https://github.com/FTBCP/homecrm.git

\- \[x] README.md

\- \[x] .gitignore (node\_modules, .env, dist, .DS\_Store)

\- \[x] .env and .env.example (empty, no keys yet)

\- \[x] AGENTS.md

\- \[ ] React app initialized

\- \[ ] Supabase project created

\- \[ ] Database tables created

\- \[ ] Auth wired up

\- \[ ] Dashboard UI

\- \[ ] Log Service form

\- \[ ] Deployed to Vercel



\## Last Session



\*\*Date:\*\* 2026-04-04

\*\*What happened:\*\*

\- Created GitHub repo (FTBCP/homecrm)

\- Initialized git, pushed first commit

\- Added .gitignore, .env, .env.example, AGENTS.md

\- Wrote product spec and finalized tech stack

\- No application code written yet



\## Decisions Made



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



\## Known Problems



None yet. Project just started.



\## Next Action



The immediate next steps, in order:



1\. \*\*Initialize the React app\*\* — Run `npm create vite@latest . -- --template react` inside the homecrm folder, then `npm install`

2\. \*\*Install Tailwind\*\* — Follow Tailwind + Vite setup guide

3\. \*\*Create Supabase project\*\* — Sign up at supabase.com, create project, copy URL and anon key into .env

4\. \*\*Create database tables\*\* — homes, service\_records, providers (schema in AGENTS.md)

5\. \*\*Build the Dashboard page\*\* — Stat cards, tabbed layout (History / Upcoming / Providers)

6\. \*\*Build the Log Service modal\*\* — Single form: category, description, cost, date, provider



Do step 1-2 first. Get a blank React + Tailwind app running locally before touching the database.



\## Gotchas



| Problem | Fix | Date |

|---------|-----|------|

| `touch` command not recognized | Windows doesn't have `touch`. Use `echo. > filename` instead. One file per command. | 2026-04-04 |

| `fatal: not a git repository` on remote add | Must run `git init` before `git remote add`. Order matters. | 2026-04-04 |

| `echo file1 file2` doesn't create files | `echo` without `>` just prints text. Must use `echo. > file1` then `echo. > file2` separately. | 2026-04-04 |

| Tutorials assume Mac/Linux | Most web dev guides use bash. On Windows, swap `touch` → `echo. >`, `cat` → `type`, `rm` → `del`. Or use Git Bash. | 2026-04-04 |

