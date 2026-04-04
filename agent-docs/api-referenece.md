\# api-reference.md

> All data operations the app performs. HomeBase has no custom backend — all calls go through the Supabase JS client.



\---



\## How This Works



There are no REST endpoints to build or maintain. The Supabase JS client generates queries that hit Supabase's auto-generated API. This file documents every data operation the React app makes, organized by feature.



All operations require an active Supabase auth session unless marked otherwise.



\---



\## Authentication



\### Sign Up

```js

supabase.auth.signUp({ email, password })

```

\- \*\*Accepts:\*\* email (string, valid format), password (string, min 6 characters)

\- \*\*Returns:\*\* `{ data: { user, session }, error }`

\- \*\*Auth required:\*\* No

\- \*\*Notes:\*\* After signup, create a default home record for the user



\### Sign In

```js

supabase.auth.signInWithPassword({ email, password })

```

\- \*\*Accepts:\*\* email (string), password (string)

\- \*\*Returns:\*\* `{ data: { user, session }, error }`

\- \*\*Auth required:\*\* No



\### Sign Out

```js

supabase.auth.signOut()

```

\- \*\*Returns:\*\* `{ error }`

\- \*\*Auth required:\*\* Yes

\- \*\*Notes:\*\* Clear all React state after calling this



\### Get Current Session

```js

supabase.auth.getSession()

```

\- \*\*Returns:\*\* `{ data: { session }, error }`

\- \*\*Auth required:\*\* No (returns null session if not logged in)



\---



\## Homes



\### Get the user's home

```js

supabase.from('homes').select('\*').single()

```

\- \*\*Returns:\*\* Single home object or error

\- \*\*Auth required:\*\* Yes (RLS filters to user's own home)

\- \*\*Notes:\*\* Phase 1 supports one home only. Always use `.single()`



\### Create a home (on signup)

```js

supabase.from('homes').insert({ address, year\_built, sqft, heating\_type, notes })

```

\- \*\*Accepts:\*\* address (required), all others optional

\- \*\*Returns:\*\* `{ data, error }`

\- \*\*Auth required:\*\* Yes (user\_id auto-set via RLS default)



\### Update home details

```js

supabase.from('homes').update({ address, year\_built, sqft, heating\_type, notes }).eq('id', homeId)

```

\- \*\*Accepts:\*\* Any subset of columns

\- \*\*Returns:\*\* `{ data, error }`

\- \*\*Auth required:\*\* Yes



\---



\## Service Records



\### List all service records

```js

supabase.from('service\_records').select('\*, providers(name, company)').eq('home\_id', homeId).order('date', { ascending: false })

```

\- \*\*Returns:\*\* Array of service records with provider name/company joined

\- \*\*Auth required:\*\* Yes

\- \*\*Notes:\*\* Always join providers to avoid a second query. Always sort newest first.



\### Create a service record

```js

supabase.from('service\_records').insert({ home\_id, provider\_id, date, category, description, cost, notes, next\_recommended\_date })

```

\- \*\*Accepts:\*\* home\_id, date, category, description, cost (all required). provider\_id, notes, next\_recommended\_date (optional).

\- \*\*Returns:\*\* `{ data, error }`

\- \*\*Auth required:\*\* Yes

\- \*\*Notes:\*\* Calculate next\_recommended\_date in the React app before inserting: `date + category interval`



\### Update a service record

```js

supabase.from('service\_records').update({ date, category, description, cost, provider\_id, notes }).eq('id', recordId)

```

\- \*\*Accepts:\*\* Any subset of columns

\- \*\*Returns:\*\* `{ data, error }`

\- \*\*Auth required:\*\* Yes



\### Delete a service record

```js

supabase.from('service\_records').delete().eq('id', recordId)

```

\- \*\*Returns:\*\* `{ data, error }`

\- \*\*Auth required:\*\* Yes

\- \*\*Notes:\*\* Confirm with the user before deleting. This cannot be undone.



\### Get spending total for current year

```js

supabase.from('service\_records').select('cost').eq('home\_id', homeId).gte('date', '2026-01-01')

```

\- \*\*Returns:\*\* Array of `{ cost }` objects. Sum them in the React app.

\- \*\*Auth required:\*\* Yes



\### Get most recent service per category (for recommendations)

```js

supabase.from('service\_records').select('category, date').eq('home\_id', homeId).order('date', { ascending: false })

```

\- \*\*Returns:\*\* Array of records. In the React app, group by category and take the first (most recent) per group.

\- \*\*Auth required:\*\* Yes



\---



\## Providers



\### List all providers

```js

supabase.from('providers').select('\*').order('name', { ascending: true })

```

\- \*\*Returns:\*\* Array of provider objects, sorted alphabetically

\- \*\*Auth required:\*\* Yes



\### Search providers by name or trade

```js

supabase.from('providers').select('\*').or(`name.ilike.%${query}%,company.ilike.%${query}%,trade.ilike.%${query}%`)

```

\- \*\*Accepts:\*\* query (string, trimmed, minimum 1 character)

\- \*\*Returns:\*\* Array of matching providers

\- \*\*Auth required:\*\* Yes



\### Create a provider

```js

supabase.from('providers').insert({ name, company, trade, phone, email, rating, recommended, notes })

```

\- \*\*Accepts:\*\* name, trade (required). All others optional.

\- \*\*Returns:\*\* `{ data, error }` — data includes the new provider's id (use this to link to a service record)

\- \*\*Auth required:\*\* Yes



\### Update a provider

```js

supabase.from('providers').update({ name, company, trade, phone, email, rating, recommended, notes }).eq('id', providerId)

```

\- \*\*Accepts:\*\* Any subset of columns

\- \*\*Returns:\*\* `{ data, error }`

\- \*\*Auth required:\*\* Yes



\### Delete a provider

```js

supabase.from('providers').delete().eq('id', providerId)

```

\- \*\*Returns:\*\* `{ data, error }`

\- \*\*Auth required:\*\* Yes

\- \*\*Notes:\*\* Service records linked to this provider will have provider\_id set to null (not deleted). Confirm with user before deleting.



\### Get job count per provider

```js

supabase.from('service\_records').select('provider\_id').eq('home\_id', homeId)

```

\- \*\*Returns:\*\* Array of records. Count occurrences of each provider\_id in the React app.

\- \*\*Auth required:\*\* Yes



\---



\## Error Handling Pattern



Every Supabase call in the app must follow this pattern:



```js

try {

&#x20; const { data, error } = await supabase.from('table').select('\*');

&#x20; if (error) throw error;

&#x20; // use data

} catch (err) {

&#x20; console.error('Failed to load table:', err.message);

&#x20; // show generic error to user — never show err.message in the UI

}

```



Never show `error.message`, `error.details`, or `error.hint` to the user. Log them to the console for debugging only.

