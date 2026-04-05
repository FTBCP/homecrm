# roadmap.md

> Checklist of everything to build. Each task is sized to be one AI prompt session. Check off tasks as they're completed and update memory.md.

---

## Phase 1 — MVP ✅ (COMPLETE except deploy)

### 0. Project Setup ✅

- [x] Initialize React app with Vite in the homecrm folder
- [x] Install and configure Tailwind CSS
- [x] Install DM Sans and Fraunces fonts (Google Fonts)
- [x] Create Supabase project and add URL + anon key to .env
- [x] Create database tables: homes, service_records, providers
- [x] Install Supabase JS client and create `src/lib/supabase.js`
- [x] Set up basic app shell with tab navigation (History / Upcoming / Providers)
- [x] Write test: app renders without crashing

### 1. Service History & Spending ✅

> As a homeowner, I want to log every maintenance job (what was done, who did it, what it cost, and when) so I can see a complete history and know exactly what I've spent.

- [x] Build the "Log a Service" modal — single form with: category, description, cost, date, provider name
- [x] Wire the form to insert a row into service_records in Supabase
- [x] If the provider name doesn't match an existing provider, auto-create a new provider row
- [x] Build the Service History list view — each row shows date, category badge, description, provider, cost
- [x] Sort history by date, newest first
- [x] Build the stat card: "Spent This Year" — sum of all service_records where date is in the current year
- [x] Build the stat card: "Services Logged" — count of all service_records
- [x] Write test: stat cards display correct totals after adding a service

### 2. Provider Rolodex ✅

> As a homeowner, I want to keep a searchable list of my service providers with contact info and notes, so I never lose track of who I've used.

- [x] Build the Providers tab view — grid of provider cards showing name, company, trade, phone, rating, recommended badge
- [x] Make provider cards tappable to open an edit modal
- [x] Build an "Edit Provider" form — pre-filled with existing data, saves updates to Supabase
- [x] Add a search/filter bar on the Providers tab — filter by name, trade, or company
- [x] On each provider card, show the number of jobs logged for that provider

### 3. Smart Maintenance Recommendations ✅

> As a homeowner, I want the app to suggest upcoming tasks based on my service history and standard maintenance schedules, so nothing falls through the cracks.

- [x] Create intervals config file — each category has a recommended interval in months (e.g. HVAC = 3, Plumbing = 12)
- [x] Build logic: for each service_record, calculate next_recommended_date = date + interval
- [x] Build the Upcoming tab view — list of tasks sorted by due date, urgency badges
- [x] Urgency badges: "Overdue" (red) if past due, "Due Soon" (amber) if within 30 days
- [x] Build the stat card: "Action Items" — count of overdue + due-soon tasks
- [x] Allow the user to "Log Again" which opens the Log Service modal pre-filled with that task's data

### 4. Polish & Ship ✅ (deploy remaining)

- [x] Add empty states — friendly messages when there are no services, providers, or upcoming tasks
- [x] Add loading spinners while data fetches from Supabase
- [x] Add error handling — show a message if Supabase calls fail
- [x] Add Supabase Auth — email/password signup and login
- [x] Protect all pages behind login (redirect to login if not authenticated)
- [x] Add Sign Out button to header
- [x] Re-enable RLS with proper auth-based policies
- [x] CSS polish — animations (fade-in, slide-up, stagger), centered container, modal blur
- [x] 6 tests passing (render, stats, tabs, auth mocking)
- [x] Deploy to production (Railway or Vercel), confirm everything works at live URL: https://homecrm.vercel.app/
- [ ] Cleanup: remove DEV_HOME_ID constant, update brand.md

---

## Phase 2 — Quality of Life (NOT building yet)

> These features improve the daily experience but aren't needed for a working MVP. Do not start any of these until Phase 1 deploy is complete and confirmed working.

**To kick off Phase 2:** Say "Let's start Phase 2. Run /new-feature to pick the next task."

- [ ] Multi-property support (track more than one home)
- [ ] Photo attachments on service records (before/after pics, receipts)
- [ ] CSV export of service history
- [ ] Dark mode
- [ ] Dashboard charts (spending by category over time)
- [ ] Provider notes and review history (track past experiences)
- [ ] Push notifications for upcoming maintenance (browser notifications)
- [ ] Recurring auto-scheduled reminders (email or SMS via Supabase Edge Functions)
- [ ] Household sharing (multiple users per home)

---

## Phase 3+ — Big Ideas (capture only, no planning yet)

> These are larger features that would require significant architecture changes or third-party integrations. Captured for future brainstorming.

- [ ] Provider marketplace or booking integration
- [ ] Payment processing or invoice management
- [ ] Social login (Google, Apple)
- [ ] AI-powered recommendations based on home age, location, climate
- [ ] Mobile app (React Native or PWA)
- [ ] Integration with home warranty providers
- [ ] Neighborhood provider recommendations from other HomeBase users

---

## How to Use This File

1. Work through phases in order (1 → 2 → 3).
2. Each unchecked box is one AI prompt session. Describe the task and let the AI build it.
3. After completing a task, check the box and update memory.md with what changed.
4. Don't skip phases. Each phase depends on the one before it.
5. Before building anything, the AI checks this file to confirm it's in the current phase.
