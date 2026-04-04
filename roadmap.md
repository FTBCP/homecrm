\# roadmap.md

> Checklist of everything to build. Each task is sized to be one AI prompt session. Check off tasks as they're completed and update memory.md.



\---



\## Phase 1 — MVP



\### 0. Project Setup

\- \[ ] Initialize React app with Vite in the homecrm folder

\- \[ ] Install and configure Tailwind CSS

\- \[ ] Install DM Sans and Fraunces fonts (Google Fonts)

\- \[ ] Create Supabase project and add URL + anon key to .env

\- \[ ] Create database tables: homes, service\_records, providers

\- \[ ] Install Supabase JS client and create `src/lib/supabase.js`

\- \[ ] Set up basic app shell with tab navigation (History / Upcoming / Providers)

\- \[ ] Deploy to Vercel and confirm the blank app loads at a live URL

\- \[ ] Write test: app renders without crashing



\### 1. Service History \& Spending

> As a homeowner, I want to log every maintenance job (what was done, who did it, what it cost, and when) so I can see a complete history and know exactly what I've spent.



\- \[ ] Build the "Log a Service" modal — single form with: category, description, cost, date, provider name

\- \[ ] Wire the form to insert a row into service\_records in Supabase

\- \[ ] If the provider name doesn't match an existing provider, auto-create a new provider row

\- \[ ] Build the Service History list view — each row shows date, category badge, description, provider, cost

\- \[ ] Sort history by date, newest first

\- \[ ] Build the stat card: "Spent This Year" — sum of all service\_records where date is in the current year

\- \[ ] Build the stat card: "Services Logged" — count of all service\_records

\- \[ ] Add pull-to-refresh or a refresh button to reload data from Supabase

\- \[ ] Write test: logging a service creates a row in the database and appears in the list

\- \[ ] Write test: stat cards display correct totals after adding a service



\### 2. Provider Rolodex

> As a homeowner, I want to keep a searchable list of my service providers with contact info and notes, so I never lose track of who I've used.



\- \[ ] Build the Providers tab view — grid of provider cards showing name, company, trade, phone, rating, recommended badge

\- \[ ] Make provider cards tappable to open a detail view or edit modal

\- \[ ] Build an "Add Provider" form — name, company, trade, phone, email, rating (1-5 stars), recommended (yes/no), notes

\- \[ ] Wire the form to insert a row into providers in Supabase

\- \[ ] Build an "Edit Provider" form — pre-filled with existing data, saves updates to Supabase

\- \[ ] Add a search/filter bar on the Providers tab — filter by name or trade

\- \[ ] On each provider card, show the number of jobs logged for that provider

\- \[ ] Write test: adding a provider creates a row and the card appears in the grid

\- \[ ] Write test: editing a provider updates the card without creating a duplicate

\- \[ ] Write test: search filters the provider list correctly



\### 3. Smart Maintenance Recommendations

> As a homeowner, I want the app to suggest upcoming tasks based on my service history and standard maintenance schedules, so nothing falls through the cracks.



\- \[ ] Create a default intervals table or config file — each category has a recommended interval in months (e.g. HVAC = 3, Plumbing = 12)

\- \[ ] Build logic: for each category, find the most recent service\_record date, add the interval, and calculate the next due date

\- \[ ] Build the Upcoming tab view — list of tasks sorted by due date, showing task name, category badge, due date, and urgency badge

\- \[ ] Urgency badges: "Overdue" (red) if past due, "Due Soon" (amber) if within 14 days, "Upcoming" (green) if further out

\- \[ ] Build the stat card: "Action Items" — count of overdue + due-soon tasks

\- \[ ] Allow the user to manually add a custom upcoming task (not tied to auto-schedule)

\- \[ ] Allow the user to mark a task as "Done" which logs it as a service record and resets the interval countdown

\- \[ ] Write test: completing a service in a category pushes the next due date forward by the correct interval

\- \[ ] Write test: overdue/due-soon/upcoming badges apply correctly based on today's date

\- \[ ] Write test: marking a task done creates a service record and removes it from upcoming



\### 4. Polish \& Ship

\- \[ ] Mobile layout pass — test every view at 375px width, fix anything that breaks

\- \[ ] Add empty states — friendly messages when there are no services, providers, or upcoming tasks yet

\- \[ ] Add loading spinners while data fetches from Supabase

\- \[ ] Add error handling — show a message if Supabase calls fail

\- \[ ] Add Supabase Auth — email/password signup and login

\- \[ ] Protect all pages behind login (redirect to login if not authenticated)

\- \[ ] Final deploy to Vercel, confirm everything works on the live URL

\- \[ ] Write test: unauthenticated user is redirected to login page



\---



\## Phase 2 — NOT building yet



These are explicitly out of scope for Phase 1. Do not start any of these until every Phase 1 box is checked.



\- \[ ] Multi-property support (tracking more than one home)

\- \[ ] Provider marketplace or booking integration

\- \[ ] Payment processing or invoice management

\- \[ ] Household sharing (multiple users per home)

\- \[ ] Social login (Google, Apple)

\- \[ ] Dark mode

\- \[ ] Push notifications for upcoming maintenance

\- \[ ] Photo attachments on service records

\- \[ ] CSV export of service history

\- \[ ] Recurring auto-scheduled reminders (email or SMS)



\---



\## How to Use This File



1\. Work through Phase 1 sections in order (0 → 1 → 2 → 3 → 4).

2\. Each unchecked box is one AI prompt session. Copy the task into your AI tool and let it build.

3\. After completing a task, check the box and update memory.md with what changed.

4\. Don't skip ahead. Each section depends on the one before it.

