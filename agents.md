\# AGENTS.md



\## Project



HomeBase — A personal home maintenance tracker that logs service history and spending, organizes provider contacts, and proactively recommends what needs doing next. Phase 1 is single-user, single-property.



\## Stack



| Layer | Tool | Purpose |

|-------|------|---------|

| Frontend | React | UI components and interactive views |

| Styling | Tailwind CSS | Utility-class styling, no separate CSS files |

| Database + Auth | Supabase | Postgres database, authentication, row-level security |

| Hosting | Vercel | Auto-deploy from GitHub on push |

| Language | JavaScript (ES6+) | No TypeScript in Phase 1 |



\## Folder Structure



```

homecrm/

├── public/

├── src/

│   ├── components/      # Reusable UI components (buttons, cards, modals)

│   ├── pages/           # Top-level views (Dashboard, History, Providers, Upcoming)

│   ├── lib/             # Supabase client, helpers, constants

│   ├── hooks/           # Custom React hooks

│   └── App.jsx

├── .env                 # Local secrets (SUPABASE\_URL, SUPABASE\_ANON\_KEY) — never committed

├── .env.example         # Template showing required env vars without values

├── .gitignore

├── AGENTS.md

├── package.json

└── README.md

```



\## Commands



```bash

\# Install dependencies

npm install



\# Start local dev server

npm run dev



\# Build for production

npm run build



\# Push to GitHub (triggers Vercel auto-deploy)

git add .

git commit -m "description of change"

git push



\# Reset local database (if using Supabase CLI)

npx supabase db reset

```



\## Rules



\### Data Model



Three core tables. Every query and mutation must respect these relationships:



\- \*\*homes\*\* — id, address, year\_built, sqft, heating\_type, notes

\- \*\*service\_records\*\* — id, home\_id (FK → homes), provider\_id (FK → providers, nullable), date, category, description, cost, notes, next\_recommended\_date

\- \*\*providers\*\* — id, name, company, trade, phone, email, rating (1-5), recommended (boolean), notes



A home has many service\_records. A service\_record optionally belongs to one provider.



\### Categories



Use this fixed list for the `category` field. Do not invent new ones without updating this file:



HVAC, Plumbing, Electrical, Roofing, Appliance, Exterior, Safety, Landscaping, Pest Control, General



\### Recommendations Engine (Phase 1)



Keep it dead simple. Each category has a default maintenance interval in months. The app counts forward from the last service\_record date for that category. That is the entire engine. Do not add rules, scoring, priority weighting, or any other complexity.



\### UI Principles



\- Mobile-first. Every layout must work at 375px width before scaling up.

\- Minimize required form fields. The "Log a Service" flow must capture category, description, cost, date, and provider in a single form — not multi-step.

\- Use color-coded category badges consistently across all views.



\### State Management



Use React useState and useEffect. No Redux, Zustand, or other state libraries in Phase 1.



\### Authentication



Phase 1 is single-user. Supabase Auth with email/password only. No social logins, no multi-user, no household sharing.



\## Permissions



\- AI tools may create, edit, and delete files inside `src/`.

\- AI tools may install npm packages using `npm install <package>`.

\- AI tools may modify `package.json`, `tailwind.config.js`, and config files in the project root.

\- AI tools must never modify `.env` with real credentials.

\- AI tools must ask before modifying the database schema (adding/removing columns or tables).

\- AI tools must ask before deleting any file outside `src/`.



\## NEVER



\- Never store API keys, Supabase URLs, or secrets anywhere except `.env`. Never hardcode them in source files.

\- Never commit `.env` to git. Verify it is listed in `.gitignore` before any commit.

\- Never add multi-property support. Phase 1 is one home only.

\- Never add a provider marketplace, booking integration, or payment processing.

\- Never add sharing, collaboration, or multi-user household features.

\- Never add social login (Google, Apple, OAuth). Email/password only.

\- Never install a state management library (Redux, Zustand, MobX, Jotai).

\- Never install an ORM (Prisma, Drizzle, TypeORM). Use the Supabase JS client directly.

\- Never add TypeScript. This project uses plain JavaScript.

\- Never create separate CSS files. All styling goes through Tailwind utility classes.

\- Never make the recommendation engine more complex than "last service date + default interval = next due date."

\- Never add more than 6 required fields to any single form.

\- Never delete or overwrite AGENTS.md without explicit user approval.



\## Key Files



| File | Purpose |

|------|---------|

| `AGENTS.md` | This file. Read first every session. |

| `.env.example` | Lists required environment variables |

| `src/lib/supabase.js` | Supabase client initialization |

| `src/pages/Dashboard.jsx` | Main dashboard view with stat cards and tabs |

| `src/components/LogServiceModal.jsx` | The single-form service logging flow |



\## Reference Docs



\- React: https://react.dev

\- Supabase JS client: https://supabase.com/docs/reference/javascript

\- Supabase Auth: https://supabase.com/docs/guides/auth

\- Tailwind CSS: https://tailwindcss.com/docs

\- Vercel deployment: https://vercel.com/docs

