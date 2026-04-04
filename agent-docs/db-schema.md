\# db-schema.md

> Complete database schema. AI agents reference this before any database read, write, or migration.



\---



\## Overview



Three tables, two relationships. Supabase Postgres.



```

homes

&#x20; └── has many → service\_records

&#x20;                   └── optionally belongs to → providers

```



\---



\## Tables



\### homes



Stores the single property being tracked in Phase 1.



| Column | Type | Nullable | Default | Notes |

|--------|------|----------|---------|-------|

| id | uuid | no | `gen\_random\_uuid()` | Primary key |

| user\_id | uuid | no | `auth.uid()` | FK → Supabase auth.users. Owner of this home. |

| address | text | no | — | Street address |

| year\_built | integer | yes | — | Four-digit year |

| sqft | integer | yes | — | Square footage |

| heating\_type | text | yes | — | e.g. "forced air", "radiant", "heat pump" |

| notes | text | yes | — | Freeform notes |

| created\_at | timestamptz | no | `now()` | Auto-set on insert |



\### service\_records



Every maintenance job logged by the user.



| Column | Type | Nullable | Default | Notes |

|--------|------|----------|---------|-------|

| id | uuid | no | `gen\_random\_uuid()` | Primary key |

| home\_id | uuid | no | — | FK → homes.id |

| provider\_id | uuid | yes | — | FK → providers.id. Null if no provider assigned. |

| date | date | no | — | When the service was performed |

| category | text | no | — | One of the fixed category list (see below) |

| description | text | no | — | What was done |

| cost | numeric(10,2) | no | — | Total cost in dollars |

| notes | text | yes | — | Optional freeform notes |

| next\_recommended\_date | date | yes | — | Auto-calculated: date + category interval |

| created\_at | timestamptz | no | `now()` | Auto-set on insert |



\### providers



The user's rolodex of service providers.



| Column | Type | Nullable | Default | Notes |

|--------|------|----------|---------|-------|

| id | uuid | no | `gen\_random\_uuid()` | Primary key |

| user\_id | uuid | no | `auth.uid()` | FK → Supabase auth.users. Owner of this provider. |

| name | text | no | — | Contact person name |

| company | text | yes | — | Business name |

| trade | text | no | — | One of the fixed category list |

| phone | text | yes | — | Phone number |

| email | text | yes | — | Email address |

| rating | integer | yes | — | 1–5 star rating |

| recommended | boolean | no | `false` | Whether the user recommends this provider |

| notes | text | yes | — | Freeform notes |

| created\_at | timestamptz | no | `now()` | Auto-set on insert |



\---



\## Fixed Category List



Use this exact list for the `category` column in service\_records and the `trade` column in providers. Do not add new categories without updating AGENTS.md and brand.md (which define badge colors).



```

HVAC, Plumbing, Electrical, Roofing, Appliance, Exterior, Safety, Landscaping, Pest Control, General

```



\---



\## Relationships



| From | To | Type | FK Column | On Delete |

|------|----|------|-----------|-----------|

| service\_records | homes | many-to-one | service\_records.home\_id | CASCADE (delete home → delete its records) |

| service\_records | providers | many-to-one | service\_records.provider\_id | SET NULL (delete provider → records keep existing, provider\_id becomes null) |

| homes | auth.users | many-to-one | homes.user\_id | CASCADE |

| providers | auth.users | many-to-one | providers.user\_id | CASCADE |



\---



\## Row Level Security (RLS)



Enable RLS on all three tables. Policies:



\- \*\*homes:\*\* Users can only SELECT, INSERT, UPDATE, DELETE rows where `user\_id = auth.uid()`

\- \*\*service\_records:\*\* Users can only access records where `home\_id` belongs to a home they own

\- \*\*providers:\*\* Users can only SELECT, INSERT, UPDATE, DELETE rows where `user\_id = auth.uid()`



\---



\## Default Maintenance Intervals



These are NOT stored in the database. They live in a config file in the React app (`src/lib/intervals.js`). The database only stores `next\_recommended\_date` as a calculated value.



| Category | Interval (months) |

|----------|-------------------|

| HVAC | 3 |

| Plumbing | 12 |

| Electrical | 12 |

| Roofing | 12 |

| Appliance | 6 |

| Exterior | 12 |

| Safety | 6 |

| Landscaping | 3 |

| Pest Control | 6 |

| General | 12 |



\---



\## How to Safely Change the Schema



1\. \*\*Never modify tables directly in the Supabase dashboard without asking first.\*\* Changes to column types, names, or deletions can break the running app.

2\. Write all schema changes as SQL migrations so they can be tracked and reversed.

3\. Before adding a column: check if the React app, custom hooks, and forms need updating.

4\. Before deleting a column: confirm no component reads or writes to it by searching `src/`.

5\. After any schema change: update this file immediately.

6\. Never rename a table. If the structure needs to change fundamentally, create a new table and migrate data.

