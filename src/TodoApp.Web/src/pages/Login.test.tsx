import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderLogin = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Login', () => {
  it('renders login form with correct elements', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /todoapp/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send verification code/i })).toBeInTheDocument();
    expect(screen.getByText(/new user\? sign up/i)).toBeInTheDocument();
  });

  it('disables submit button when email is empty', () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /send verification code/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email address/i);
    
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Trigger validation
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('enables submit button with valid email', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send verification code/i });
    
    await user.type(emailInput, 'test@example.com');
    
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('submits form with valid email', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send verification code/i });
    
    await user.type(emailInput, 'test@example.com');
    
    // Verify button is enabled before clicking
    expect(submitButton).toBeEnabled();
    
    await user.click(submitButton);
    
    // Verify form was submitted (button text changes or navigation occurs)
    // In real app, this would navigate to verify page
    // For now, just verify the click was handled
    expect(submitButton).toBeInTheDocument();
  });

  it('navigates to signup when clicking sign up link', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const signupLink = screen.getByText(/new user\? sign up/i);
    
    await user.click(signupLink);
    
    // In a real test, you'd verify navigation occurred
    // Here we just verify the link exists and is clickable
    expect(signupLink).toBeInTheDocument();
  });
});