import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, renderWithProviders, userEvent, NEW_USER_EMAIL, TEST_CODE } from '../test/test-utils';
import { CreateAccount } from './CreateAccount';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import { server } from '../test/setup';
import { http, HttpResponse } from 'msw';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('CreateAccount', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    useAuthStore.getState().setAwaitingRegistration(NEW_USER_EMAIL, TEST_CODE);
  });

  afterEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().logout();
  });

  it('redirects to login if unauthenticated', async () => {
    // Clear pending email
    useAuthStore.getState().reset();

    renderWithProviders(<CreateAccount />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('renders create account form with correct elements', async () => {
    renderWithProviders(<CreateAccount />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Your Account/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Let's set up your account and first team/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Team Name/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByText(/By creating an account, you'll become the admin of your team/i)).toBeInTheDocument();
  });

  it('shows helper text for inputs', async () => {
    renderWithProviders(<CreateAccount />);

    await waitFor(() => {
      expect(screen.getByText(/This is how you'll appear to your team/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/You can invite others to this team later/i)).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', async () => {
    renderWithProviders(<CreateAccount />);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      expect(submitButton).toBeDisabled();
    });
  });

  it('validates display name length', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateAccount />);

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    // Too short
    await user.type(displayNameInput, 'A');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/Must be at least 2 characters/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    // Valid length
    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'John Doe');

    // Still need team name
    expect(submitButton).toBeDisabled();
  });

  it('validates team name length', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateAccount />);

    const teamNameInput = screen.getByLabelText(/Team Name/i);
    const displayNameInput = screen.getByLabelText(/Display Name/i);

    // Fill display name first
    await user.type(displayNameInput, 'John Doe');

    // Too short team name
    await user.type(teamNameInput, 'AB');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/Team name must be at least 3 characters/i)).toBeInTheDocument();
    });

    // Valid team name
    await user.clear(teamNameInput);
    await user.type(teamNameInput, 'My Team');

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('validates maximum lengths', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateAccount />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Your Account/i })).toBeInTheDocument();
    });

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    const teamNameInput = screen.getByLabelText(/Team Name/i);

    // Type very long display name (more than 100 chars)
    const longDisplayName = 'A'.repeat(101);
    await user.type(displayNameInput, longDisplayName);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/Must not exceed 100 characters/i)).toBeInTheDocument();
    });

    // Type very long team name (more than 50 chars)
    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'John Doe');

    const longTeamName = 'T'.repeat(51);
    await user.type(teamNameInput, longTeamName);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/Team name must not exceed 50 characters/i)).toBeInTheDocument();
    });
  });

  it('submits form and navigates to dashboard on success', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateAccount />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Your Account/i })).toBeInTheDocument();
    });

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    const teamNameInput = screen.getByLabelText(/Team Name/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(displayNameInput, 'John Doe');
    await user.type(teamNameInput, 'My Awesome Team');

    await user.click(submitButton);

    // Should navigate to dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // Should set auth state
    const authState = useAuthStore.getState();
    expect(authState.status).toBe('authenticated');
    expect(authState.user?.displayName).toBe('John Doe');
    expect(authState.currentTeam?.name).toBe('My Awesome Team');
    expect(authState.currentTeam?.role).toBe('Admin');
  });

  it('shows error when registration fails', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('http://localhost:5050/api/v1/auth/complete-registration', () => {
        return HttpResponse.json(
          {
            title: 'Team name already exists',
            detail: 'A team with this name already exists',
            status: 400
          },
          { status: 400 }
        );
      })
    );

    renderWithProviders(<CreateAccount />);

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    const teamNameInput = screen.getByLabelText(/Team Name/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(displayNameInput, 'John Doe');
    await user.type(teamNameInput, 'Existing Team');

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/A team with this name already exists/i)).toBeInTheDocument();
    });
  });

  it('shows placeholders for inputs', async () => {
    renderWithProviders(<CreateAccount />);

    await waitFor(() => {
      const displayNameInput = screen.getByLabelText(/Display Name/i);
      expect(displayNameInput).toHaveAttribute('placeholder', 'John Doe');
    });

    const teamNameInput = screen.getByLabelText(/Team Name/i);
    expect(teamNameInput).toHaveAttribute('placeholder', 'My Team');
  });

  it('disables inputs while submitting', async () => {
    const user = userEvent.setup();

    // Add delay to mock handler to test loading state
    server.use(
      http.post('http://localhost:5050/api/v1/auth/complete-registration', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return HttpResponse.json({
          token: 'mock-jwt-token',
          user: { id: '1', email: NEW_USER_EMAIL, displayName: 'John Doe' },
          team: { id: '1', name: 'My Team', role: 'Admin' },
        });
      })
    );

    renderWithProviders(<CreateAccount />);

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    const teamNameInput = screen.getByLabelText(/Team Name/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    await user.type(displayNameInput, 'John Doe');
    await user.type(teamNameInput, 'My Team');

    await user.click(submitButton);

    // Inputs should be disabled during submission
    expect(displayNameInput).toBeDisabled();
    expect(teamNameInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});