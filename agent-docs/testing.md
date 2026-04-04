\# testing.md

> How to write and run tests for HomeBase. AI agents follow these patterns for every new feature.



\---



\## Testing Tool



\*\*Vitest\*\* — it's the testing framework that works natively with Vite (our build tool). No extra configuration needed.



\*\*React Testing Library\*\* — for testing components. It tests what the user sees and does, not internal implementation details.



\### Install (one time)

```

npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

```



\### Add to package.json scripts

```json

"scripts": {

&#x20; "test": "vitest",

&#x20; "test:run": "vitest run"

}

```



\### Add to vite.config.js

```js

export default defineConfig({

&#x20; plugins: \[react()],

&#x20; test: {

&#x20;   environment: 'jsdom',

&#x20;   globals: true,

&#x20;   setupFiles: './src/test/setup.js',

&#x20; },

})

```



\### Create setup file at src/test/setup.js

```js

import '@testing-library/jest-dom';

```



\---



\## How to Run Tests



Run all tests once:

```

npm run test:run

```



Run tests in watch mode (re-runs when files change):

```

npm run test

```



Run a specific test file:

```

npx vitest run src/components/StatCard.test.jsx

```



\---



\## What Must Be Tested



Every feature in the roadmap includes specific test tasks. At minimum, test these for every component and feature:



\### Components

\- Renders without crashing

\- Displays the correct data when given props

\- Shows an empty state when no data exists

\- Shows a loading state while data is being fetched

\- Shows an error state when a fetch fails



\### Forms

\- Submitting with valid data calls the correct Supabase operation

\- Submitting with missing required fields shows validation errors

\- Submitting with invalid data (negative cost, future dates where inappropriate) shows validation errors

\- Form clears after successful submission



\### Data Operations

\- Creating a record adds it to the displayed list

\- Editing a record updates the displayed list

\- Deleting a record removes it from the displayed list

\- Stat cards update when data changes



\### Authentication

\- Unauthenticated user is redirected to login

\- Authenticated user sees the dashboard

\- Logout clears state and redirects to login



\---



\## Test File Naming and Location



Test files live next to the files they test:



```

src/

&#x20; components/

&#x20;   StatCard.jsx

&#x20;   StatCard.test.jsx

&#x20;   LogServiceModal.jsx

&#x20;   LogServiceModal.test.jsx

&#x20; hooks/

&#x20;   useServiceRecords.js

&#x20;   useServiceRecords.test.js

&#x20; lib/

&#x20;   intervals.js

&#x20;   intervals.test.js

```



Name every test file `\[filename].test.jsx` or `\[filename].test.js`.



\---



\## Mocking Supabase



Tests must never call the real Supabase database. Mock the Supabase client in every test file that uses it.



\### Create a mock at src/test/mocks/supabase.js

```js

export const mockSupabase = {

&#x20; from: vi.fn(() => mockSupabase),

&#x20; select: vi.fn(() => mockSupabase),

&#x20; insert: vi.fn(() => mockSupabase),

&#x20; update: vi.fn(() => mockSupabase),

&#x20; delete: vi.fn(() => mockSupabase),

&#x20; eq: vi.fn(() => mockSupabase),

&#x20; order: vi.fn(() => mockSupabase),

&#x20; single: vi.fn(() => mockSupabase),

&#x20; gte: vi.fn(() => mockSupabase),

&#x20; or: vi.fn(() => Promise.resolve({ data: \[], error: null })),

};



// Make terminal methods return data

mockSupabase.select.mockReturnValue(

&#x20; Promise.resolve({ data: \[], error: null })

);



vi.mock('../lib/supabase', () => ({

&#x20; supabase: mockSupabase,

}));

```



\---



\## Example Test Patterns



\### Pattern 1: Component renders with data



```jsx

import { render, screen } from '@testing-library/react';

import { describe, it, expect } from 'vitest';

import StatCard from './StatCard';



describe('StatCard', () => {

&#x20; it('displays the label and value', () => {

&#x20;   render(<StatCard label="Spent in 2026" value="$1,355" />);

&#x20;   expect(screen.getByText('Spent in 2026')).toBeInTheDocument();

&#x20;   expect(screen.getByText('$1,355')).toBeInTheDocument();

&#x20; });

});

```



\*\*What this tests in plain English:\*\* When you give the StatCard a label and a value, does it actually show those words on screen?



\### Pattern 2: Component shows empty state



```jsx

describe('ServiceHistory', () => {

&#x20; it('shows a message when there are no services', () => {

&#x20;   render(<ServiceHistory services={\[]} />);

&#x20;   expect(screen.getByText(/no services logged yet/i)).toBeInTheDocument();

&#x20; });

});

```



\*\*What this tests in plain English:\*\* When the history list has zero items, does the user see a helpful message instead of a blank screen?



\### Pattern 3: Form validation



```jsx

import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { describe, it, expect } from 'vitest';

import LogServiceModal from './LogServiceModal';



describe('LogServiceModal', () => {

&#x20; it('shows an error if description is empty', async () => {

&#x20;   render(<LogServiceModal />);

&#x20;   const saveButton = screen.getByText('Save');

&#x20;   await userEvent.click(saveButton);

&#x20;   expect(screen.getByText(/description is required/i)).toBeInTheDocument();

&#x20; });

});

```



\*\*What this tests in plain English:\*\* If the user clicks Save without typing a description, does the form show an error message?



\### Pattern 4: Data operation updates the UI



```jsx

describe('ServiceHistory', () => {

&#x20; it('adds a new service to the list after logging', async () => {

&#x20;   // Mock Supabase to return one existing record

&#x20;   // Simulate filling out and submitting the form

&#x20;   // Assert the new record appears in the list

&#x20;   // Assert the stat card total updated

&#x20; });

});

```



\*\*What this tests in plain English:\*\* After the user logs a new service, does it immediately show up in the list and update the spending total?



\---



\## Rules



\- Never call real Supabase in tests. Always mock it.

\- Every new component gets a test file before moving to the next roadmap task.

\- Test files must not import from `.env` or reference real API keys.

\- If a test requires fake data, define it at the top of the test file — not in a shared fixtures folder.

\- Keep tests simple. One behavior per `it()` block. The description should read like a sentence: "it displays the label and value."

\- After writing tests, run `npm run test:run` to confirm they pass before committing.

