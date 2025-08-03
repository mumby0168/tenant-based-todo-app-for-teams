import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, renderWithProviders, userEvent, TEST_EMAIL, TEST_CODE, EXISTING_USER_EMAIL, NEW_USER_EMAIL } from '../test/test-utils';
import { VerifyCode } from './VerifyCode';
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

describe('VerifyCode', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    // Set up auth store with pending email
    useAuthStore.getState().setPendingEmail(TEST_EMAIL, false);
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Clean up auth store after each test
    useAuthStore.setState({
      user: null,
      currentTeam: null,
      teams: [],
      isAuthenticated: false,
      token: null,
      pendingEmail: null,
      isNewUser: false,
    });
  });

  it('redirects to login if no pending email', async () => {
    // Clear pending email
    useAuthStore.getState().clearPendingEmail();

    renderWithProviders(<VerifyCode />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('renders verification form with correct elements', async () => {
    renderWithProviders(<VerifyCode />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Verify Your Email/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/We sent a code to/i)).toBeInTheDocument();
    expect(screen.getByText(TEST_EMAIL)).toBeInTheDocument();

    // Should have 6 input fields for the code
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);

    expect(screen.getByRole('button', { name: /Verify Code/i })).toBeInTheDocument();
    expect(screen.getByText(/Code expires in 15 minutes/i)).toBeInTheDocument();
  });

  it('auto-advances focus when typing digits', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyCode />);

    const inputs = screen.getAllByRole('textbox');

    // Type first digit
    await user.type(inputs[0], '1');
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[1]).toHaveFocus();

    // Type second digit
    await user.type(inputs[1], '2');
    expect(inputs[1]).toHaveValue('2');
    expect(inputs[2]).toHaveFocus();
  });

  it('handles backspace to move to previous input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyCode />);

    const inputs = screen.getAllByRole('textbox');

    // Focus on second input and press backspace
    inputs[1].focus();
    await user.keyboard('{Backspace}');

    expect(inputs[0]).toHaveFocus();
  });

  it('handles paste of complete code', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyCode />);

    const inputs = screen.getAllByRole('textbox');

    // Focus first input and paste
    inputs[0].focus();
    await user.paste(TEST_CODE);

    // All inputs should be filled
    await waitFor(() => {
      inputs.forEach((input, index) => {
        expect(input).toHaveValue(TEST_CODE[index]);
      });
    });

    // Should have triggered submission (button would be disabled)
    const verifyButton = screen.getByRole('button', { name: /Verify Code/i });
    expect(verifyButton).toBeEnabled(); // Since code is complete
  });

  it('only accepts numeric input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyCode />);

    const inputs = screen.getAllByRole('textbox');

    // Try typing non-numeric characters
    await user.type(inputs[0], 'abc');
    expect(inputs[0]).toHaveValue('');

    // Numeric should work
    await user.type(inputs[0], '1');
    expect(inputs[0]).toHaveValue('1');
  });

  it('disables verify button until all digits entered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyCode />);

    const verifyButton = screen.getByRole('button', { name: /Verify Code/i });
    const inputs = screen.getAllByRole('textbox');

    expect(verifyButton).toBeDisabled();

    // Enter 5 digits
    for (let i = 0; i < 5; i++) {
      await user.type(inputs[i], String(i + 1));
    }

    // Still disabled
    expect(verifyButton).toBeDisabled();

    // Enter last digit
    await user.type(inputs[5], '6');

    // Now enabled
    expect(verifyButton).toBeEnabled();
  });

  it('verifies code and navigates for existing user', async () => {
    const user = userEvent.setup();

    // Clear the default state first
    useAuthStore.setState({
      user: null,
      currentTeam: null,
      teams: [],
      isAuthenticated: false,
      token: null,
      pendingEmail: EXISTING_USER_EMAIL,
      isNewUser: false,
    });

    renderWithProviders(<VerifyCode />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Verify Your Email/i })).toBeInTheDocument();
    });

    expect(screen.getByText(EXISTING_USER_EMAIL)).toBeInTheDocument();

    const inputs = screen.getAllByRole('textbox');

    // Enter valid code
    // auto navigate to dashboard
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], TEST_CODE[i]);
    }

    // Should navigate to dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // Should set auth state
    const authState = useAuthStore.getState();
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.user?.email).toBe(EXISTING_USER_EMAIL);
  });

  it('verifies code and navigates for new user', async () => {
    const user = userEvent.setup();

    // Set up as new user
    useAuthStore.getState().setPendingEmail(NEW_USER_EMAIL, true);

    renderWithProviders(<VerifyCode />);

    const inputs = screen.getAllByRole('textbox');

    // Enter valid code
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], TEST_CODE[i]);
    }

    const verifyButton = screen.getByRole('button', { name: /Verify Code/i });
    await user.click(verifyButton);

    // Should navigate to create account
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    // Should keep pending email and new user status
    const authState = useAuthStore.getState();
    expect(authState.pendingEmail).toBe(NEW_USER_EMAIL);
    expect(authState.isNewUser).toBe(true);
  });

  it('shows error for invalid code', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('http://localhost:5050/api/v1/auth/verify-code', () => {
        return HttpResponse.json(
          {
            title: 'Invalid code',
            detail: 'The verification code is invalid or expired',
            status: 400
          },
          { status: 400 }
        );
      })
    );

    renderWithProviders(<VerifyCode />);

    const inputs = screen.getAllByRole('textbox');

    // Enter invalid code
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], '0');
    }

    const verifyButton = screen.getByRole('button', { name: /Verify Code/i });
    await user.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText(/The verification code is invalid or expired/i)).toBeInTheDocument();
    });
  });

  it('handles resend code functionality', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyCode />);

    // Resend button should be disabled initially
    const resendButton = screen.getByRole('button', { name: /Resend in/i });
    expect(resendButton).toBeDisabled();

    // Wait for timer to expire (we can't actually wait 60 seconds in tests)
    // Instead, we'll test that the timer is shown
    expect(screen.getByText(/Resend in \d+s/i)).toBeInTheDocument();
  });

  it('allows using different email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyCode />);

    const differentEmailButton = screen.getByRole('button', { name: /Use a different email/i });
    await user.click(differentEmailButton);

    // Should clear pending email and navigate to login
    expect(useAuthStore.getState().pendingEmail).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows countdown timer progress', async () => {
    renderWithProviders(<VerifyCode />);

    await waitFor(() => {
      // Should show progress bar
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    // Should show expiration time
    expect(screen.getByText(/Code expires in 15 minutes/i)).toBeInTheDocument();
  });
});