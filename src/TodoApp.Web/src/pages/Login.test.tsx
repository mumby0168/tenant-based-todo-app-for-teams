import { useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../stores/auth-store';
import { act, renderWithProviders, screen, TEST_EMAIL, userEvent, waitFor } from '../test/test-utils';
import { Login } from './Login';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Login', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    // Clear auth store
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with correct elements', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByRole('heading', { name: /TodoApp V1/i })).toBeInTheDocument();
    expect(screen.getByText(/Sign in to continue to TodoApp/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
    expect(screen.getByText(/We'll send you a 6-digit code to sign in/i)).toBeInTheDocument();
  });

  it('disables submit button when email is empty', () => {
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /Continue/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger validation
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('enables submit button with valid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitButton = screen.getByRole('button', { name: /Continue/i });
    
    await user.type(emailInput, TEST_EMAIL);
    
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('submits form and navigates to verify page on success', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitButton = screen.getByRole('button', { name: /Continue/i });
    
    await user.type(emailInput, TEST_EMAIL);
    await user.click(submitButton);
    
    // Should navigate to verify page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verify');
    });
    
    // Should set pending email in auth store
    expect(useAuthStore.getState().pendingEmail).toBe(TEST_EMAIL);
  });

  it('shows error message when request fails', async () => {
    const user = userEvent.setup();
    
    // Override the handler to return an error
    const { server } = await import('../test/setup');
    const { http, HttpResponse } = await import('msw');
    
    server.use(
      http.post('/api/v1/auth/request-code', () => {
        return HttpResponse.json(
          { 
            title: 'Too Many Requests',
            detail: 'Rate limit exceeded',
            status: 429
          },
          { status: 429 }
        );
      })
    );
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitButton = screen.getByRole('button', { name: /Continue/i });
    
    await user.type(emailInput, TEST_EMAIL);
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/You've requested too many codes/i)).toBeInTheDocument();
    });
  });

  it('allows navigation to signup page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const signupLink = screen.getByRole('link', { name: /Sign up/i });
    expect(signupLink).toHaveAttribute('href', '/signup');
    
    await user.click(signupLink);
    // Navigation is handled by router, not our mock
  });

  it('validates email format correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitButton = screen.getByRole('button', { name: /Continue/i });
    
    // Test various email formats
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user@@example.com',
    ];
    
    for (const email of invalidEmails) {
      await user.clear(emailInput);
      await user.type(emailInput, email);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    }
    
    // Valid email should enable button
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');
    
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });
});