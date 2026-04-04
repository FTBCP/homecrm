\# security.md

> AI agents read this every session. These rules are non-negotiable. No exceptions, no shortcuts, no "just for testing."



\---



\## Never Print or Log



Do not print, log, or display any of the following anywhere — not in the terminal, not in the browser console, not in error messages, not in comments:



\- Supabase URL or anon key

\- Any value from the `.env` file

\- User passwords (plain text or hashed)

\- Authentication tokens or session IDs

\- Raw database responses that contain user credentials or auth data

\- Email addresses in console.log or terminal output

\- Full error stack traces that expose file paths or database structure to the end user



If you need to debug an auth issue, log `"auth failed"` or `"session invalid"` — never log the actual token or password that was attempted.



\## How to Handle Secrets



\*\*The only place secrets live is in `.env` files. Period.\*\*



\- `VITE\_SUPABASE\_URL` and `VITE\_SUPABASE\_ANON\_KEY` go in `.env`

\- Access them in code using `import.meta.env.VITE\_SUPABASE\_URL` — never paste the raw value

\- `.env` must be listed in `.gitignore` at all times

\- `.env.example` shows the variable names with empty values so other developers (or AI agents) know what's needed:

&#x20; ```

&#x20; VITE\_SUPABASE\_URL=

&#x20; VITE\_SUPABASE\_ANON\_KEY=

&#x20; ```

\- Never put secrets in any file that gets committed to git

\- Never put secrets in any file that gets sent to the browser (HTML, public folder, client-side JS bundles)

\- Never pass secrets as URL parameters

\- If Vercel needs environment variables, add them through the Vercel dashboard — never in the codebase



\## Never Put In Code



\- Hardcoded API keys, passwords, URLs with credentials, or database connection strings

\- Commented-out passwords or keys, even with a note like "// temporary" or "// for testing"

\- Debug endpoints or routes that expose internal state (e.g. `/debug`, `/test-db`, `/admin`)

\- `console.log` statements that print request bodies, auth headers, or user data

\- Inline Supabase credentials like `createClient("https://abc.supabase.co", "eyJ...")`

\- Any string that looks like a key or token — if it's longer than 20 characters and random-looking, it belongs in `.env`



\## App Security Checklist



Apply all of these before considering any feature complete:



\*\*Authentication\*\*

\- \[ ] Every page except the login/signup page requires an active Supabase session

\- \[ ] If no session exists, redirect to the login page — never show a blank screen or partial data

\- \[ ] After logout, clear all local state and redirect to login



\*\*User Input\*\*

\- \[ ] All user input is validated before saving — no empty required fields, no negative costs, dates must be real dates

\- \[ ] Text inputs are trimmed of leading/trailing whitespace before saving

\- \[ ] No user input is ever inserted directly into a database query string

\- \[ ] Use the Supabase JS client's built-in methods (`.insert()`, `.update()`, `.select()`) which handle parameterization automatically — never build SQL by joining strings

\- \[ ] Cost fields only accept numbers — strip or reject non-numeric characters

\- \[ ] Phone and email fields are validated for basic format before saving



\*\*Error Handling\*\*

\- \[ ] Error messages shown to the user are always generic: "Something went wrong. Please try again."

\- \[ ] Detailed error information (stack traces, database errors, Supabase error codes) is never shown to the user

\- \[ ] Failed database calls do not crash the app — wrap all Supabase calls in try/catch

\- \[ ] If a Supabase call fails, the UI shows a clear error state, not a blank screen



\*\*Data Access\*\*

\- \[ ] Users can only see and edit their own data (enforce via Supabase Row Level Security when auth is added)

\- \[ ] No API call returns more data than the UI needs — select only the columns you're displaying



\## Before Every Commit



Run through this checklist before every `git add` and `git commit`:



1\. \*\*Check .gitignore is working:\*\*

&#x20;  ```

&#x20;  type .gitignore

&#x20;  ```

&#x20;  Confirm `.env` is listed. If it's not, stop and add it before doing anything else.



2\. \*\*Check what you're about to commit:\*\*

&#x20;  ```

&#x20;  git diff --cached

&#x20;  ```

&#x20;  Scan the output for anything that looks like a key, token, password, or URL with credentials. If you see one, remove it.



3\. \*\*Search for accidental secrets:\*\*

&#x20;  ```

&#x20;  findstr /s /i "supabase" src\\\*.js src\\\*.jsx

&#x20;  ```

&#x20;  Every match should reference `import.meta.env`, never a raw URL or key.



4\. \*\*Search for debug logs:\*\*

&#x20;  ```

&#x20;  findstr /s "console.log" src\\\*.js src\\\*.jsx

&#x20;  ```

&#x20;  Remove or review any that print user data, auth tokens, or request/response bodies.



5\. \*\*Confirm .env is not staged:\*\*

&#x20;  ```

&#x20;  git status

&#x20;  ```

&#x20;  If `.env` appears in the list of files to be committed, run `git reset HEAD .env` immediately.

