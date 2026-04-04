import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock Supabase client
vi.mock('./lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
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
    expect(screen.getByText('HomeBase')).toBeInTheDocument();
  });

  it('displays all three stat cards', async () => {
    render(<App />);
    expect(screen.getByText('Spent This Year')).toBeInTheDocument();
    expect(screen.getByText('Services Logged')).toBeInTheDocument();
    expect(screen.getByText('Action Items')).toBeInTheDocument();
  });

  it('shows History tab loading then empty state', async () => {
    render(<App />);
    // After data loads, should show empty state
    await waitFor(() => {
      expect(screen.getByText(/no services logged yet/i)).toBeInTheDocument();
    });
  });

  it('switches to Providers tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Providers'));
    await waitFor(() => {
      expect(screen.getByText(/no providers added yet/i)).toBeInTheDocument();
    });
  });

  it('switches to Upcoming tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Upcoming'));
    await waitFor(() => {
      expect(screen.getByText(/no upcoming maintenance yet/i)).toBeInTheDocument();
    });
  });

  it('opens Log Service modal when + is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Log a service'));
    expect(screen.getByText('Log a Service')).toBeInTheDocument();
  });
});
