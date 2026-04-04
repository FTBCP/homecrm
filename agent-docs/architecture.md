\# architecture.md

> How the system is designed, how data flows, and what patterns to follow.



\---



\## System Overview



HomeBase is a single-page React app that talks directly to Supabase. There is no custom backend server. The architecture has two layers:



```

\[User's Browser]

&#x20;     │

&#x20;     ▼

\[React App on Vercel]  ──── reads/writes ────▶  \[Supabase]

&#x20; - UI components                                - Postgres database

&#x20; - Routing                                      - Auth (email/password)

&#x20; - State management                             - Row Level Security

&#x20; - Form validation                              - Auto-generated REST API

```



The React app handles all UI logic and form validation. Supabase handles data storage, authentication, and access control. There is no middleware, no server functions, no API layer we build ourselves.



\## How Data Flows



\### Reading data (e.g. loading the Service History list)



1\. User navigates to the History tab

2\. React component mounts and calls `supabase.from('service\_records').select()` inside a useEffect

3\. Supabase returns rows as JSON

4\. Component stores the rows in useState and renders them

5\. If the call fails, component shows a generic error message



\### Writing data (e.g. logging a new service)



1\. User fills out the Log Service form and clicks Save

2\. React validates inputs (no empty fields, cost is a number, date is valid)

3\. If provider name doesn't match an existing provider, insert a new row into `providers` first

4\. Insert a new row into `service\_records` with the provider\_id

5\. On success, close the modal and refresh the list

6\. On failure, show a generic error message — do not expose database errors



\### Authentication flow



1\. User loads the app

2\. React checks for an active Supabase session via `supabase.auth.getSession()`

3\. If no session → redirect to login page

4\. If session exists → load the dashboard

5\. On logout → call `supabase.auth.signOut()`, clear all React state, redirect to login



\## Patterns to Follow



\### One Supabase client, one file

All Supabase calls go through the client created in `src/lib/supabase.js`. Never create a second client. Never import `createClient` anywhere else.



\### Data fetching in custom hooks

Wrap Supabase queries in custom hooks inside `src/hooks/`. Example: `useServiceRecords()` returns `{ data, loading, error, refresh }`. Components call the hook, never call Supabase directly.



\### Form validation before submission

Validate all inputs in the React component before calling Supabase. Never rely on database constraints as the only validation — the user should see an error message before a bad query is even attempted.



\### One component, one job

Each component does one thing. A `ServiceRow` renders a single row. A `StatCard` renders a single stat. A `LogServiceModal` handles the form. Don't combine unrelated responsibilities.



\### Keep state local

Use useState inside the component that needs it. Lift state up only when two sibling components need the same data. No global state library.



\## Anti-Patterns to Avoid



\### Never build a custom API layer

Do not create Express routes, serverless functions, or any backend code. The Supabase JS client is the API. Adding a backend doubles the architecture for zero benefit at this scale.



\### Never fetch data in event handlers

Data fetching goes in useEffect or custom hooks, not inside onClick or onSubmit handlers. Event handlers should call a mutation (insert/update/delete), then trigger a refresh.



\### Never store Supabase responses in global variables

All data lives in React state (useState). Never store query results in a variable outside a component.



\### Never skip error handling

Every Supabase call must be wrapped in try/catch. Every catch block must update the UI. A silent failure is worse than a crash.



\### Never put business logic in the database

Recommendation intervals, badge color logic, and display formatting all live in the React app. The database stores raw data only.

