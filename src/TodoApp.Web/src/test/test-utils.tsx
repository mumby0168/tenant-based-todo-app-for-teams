import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { theme } from '../theme/theme';

// Create a custom render function that includes all providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  useMemoryRouter?: boolean;
}

// Create a new QueryClient for each test to ensure isolation
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { 
      retry: false,
      staleTime: 0,
      cacheTime: 0,
    },
    mutations: { 
      retry: false 
    },
  },
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {},
  }
});

export function renderWithProviders(
  ui: ReactElement,
  {
    initialRoute = '/',
    useMemoryRouter = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const queryClient = createTestQueryClient();

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    const Router = useMemoryRouter ? MemoryRouter : BrowserRouter;
    const routerProps = useMemoryRouter ? { initialEntries: [initialRoute] } : {};

    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Router {...routerProps}>
            {children}
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

  return {
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions }),
    queryClient,
  };
}

// Re-export everything from testing library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Test data factories
export const createTestUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  displayName: 'Test User',
  ...overrides,
});

export const createTestTeam = (overrides = {}) => ({
  id: '1',
  name: 'Test Team',
  role: 'Admin',
  ...overrides,
});

// Auth test helpers
export const TEST_EMAIL = 'test@example.com';
export const TEST_CODE = '123456';
export const TEST_INVALID_CODE = '000000';
export const NEW_USER_EMAIL = 'newuser@example.com';
export const EXISTING_USER_EMAIL = 'existing@example.com';