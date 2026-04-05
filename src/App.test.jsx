import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock Supabase client
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({
        data: {
          session: {
            user: { id: 'test-user-id', email: 'test@test.com' },
          },
        },
      }),
      onAuthStateChange: (callback) => {
        // Simulate logged-in user
        callback('SIGNED_IN', {
          user: { id: 'test-user-id', email: 'test@test.com' },
        });
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          limit: () => Promise.resolve({ data: [{ id: 'test-home-id' }], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [{ id: '1' }], error: null }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  },
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('HomeBase')).toBeInTheDocument();
    });
  });

  it('shows main app when authenticated', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Spent This Year')).toBeInTheDocument();
      expect(screen.getByText('Services Logged')).toBeInTheDocument();
      expect(screen.getByText('Action Items')).toBeInTheDocument();
    });
  });

  it('shows sign out button when logged in', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  it('shows Dashboard tab by default with onboarding wizard', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome to HomeBase!/i)).toBeInTheDocument();
    });
  });

  it('switches to Providers tab', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => screen.getByText('Providers'));
    await user.click(screen.getByText('Providers'));
    await waitFor(() => {
      expect(screen.getByText(/no providers added yet/i)).toBeInTheDocument();
    });
  });

  it('switches to History tab', async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => screen.getByText('History'));
    await user.click(screen.getByText('History'));
    await waitFor(() => {
      expect(screen.getByText(/no services logged yet/i)).toBeInTheDocument();
    });
  });
});
