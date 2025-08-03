# Frontend Patterns Guide - React/TypeScript Application

## Quick Start Commands
```bash
# Create new React TypeScript app with Vite
npm create vite@latest my-app -- --template react-ts
cd my-app

# Install core dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @tanstack/react-query zustand axios
npm install react-hook-form @hookform/resolvers yup
npm install react-router-dom

# Install dev dependencies
npm install -D @types/react @types/react-dom
npm install -D vitest @testing-library/react @testing-library/user-event
npm install -D msw @playwright/test
```

## Tech Stack
- **React 18** + **TypeScript** (strict mode)
- **Material-UI (MUI)** for UI components
- **React Query (TanStack Query)** for server state
- **Zustand** for UI state
- **React Hook Form** + **Yup** for forms
- **Axios** for API calls
- **Vite** for build tooling

## Project Structure
```
src/
├── apis/           # API layer with domain-specific modules
├── components/     # Shared and feature components
├── hooks/          # Custom hooks
│   ├── queries/    # React Query hooks
│   └── mutations/  # React Query mutations
├── pages/          # Route-level components
├── stores/         # Zustand state management
├── schemas/        # Yup validation schemas
├── theme/          # MUI theming
├── test-utils/     # Testing utilities
└── utils/          # Helper functions
```

## Core Patterns

### 1. API Layer Pattern
```typescript
// Centralized API client
export const getApiClient = (token?: string | null): AxiosInstance => {
    return axios.create({
        baseURL: import.meta.env.VITE_API_URL || '/api',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 30000,
    });
};

// Standardized response type
interface ApiDataResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// API function with error handling
export const getUsers = async (token: string): Promise<ApiDataResponse<User[]>> => {
    const api = getApiClient(token);
    try {
        const response = await api.get('/v1/users');
        return { success: true, data: response.data };
    } catch (error) {
        return handleAxiosError(error, {
            networkErrorHandler: () => "Network error",
            defaultMessage: "Failed to load users"
        });
    }
};
```

### 2. State Management Pattern

**Server State (React Query):**
```typescript
// Query keys factory
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    detail: (id: string) => [...userKeys.all, 'detail', id] as const,
};

// Query hook
export function useUsers() {
    const token = useAuthStore((state) => state.token);
    
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: () => getUsers(token!),
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Mutation hook
export function useCreateUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
    });
}
```

**UI State (Zustand):**
```typescript
interface UIState {
    isDrawerOpen: boolean;
    searchTerm: string;
    setDrawerOpen: (open: boolean) => void;
    setSearchTerm: (term: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isDrawerOpen: false,
    searchTerm: '',
    setDrawerOpen: (open) => set({ isDrawerOpen: open }),
    setSearchTerm: (term) => set({ searchTerm: term }),
}));
```

### 3. Form Management Pattern
```typescript
// Form schema with Yup
const userSchema = yup.object({
    email: yup.string().email().required('Email is required'),
    name: yup.string().required('Name is required'),
    roles: yup.array().min(1, 'Select at least one role'),
});

// Form component with React Hook Form
export const UserForm: React.FC = () => {
    const form = useForm({
        resolver: yupResolver(userSchema),
        mode: 'onChange',
        defaultValues: { email: '', name: '', roles: [] }
    });

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
        </form>
    );
};
```

### 4. Performance Patterns
```typescript
// Memoize expensive computations
const filteredData = useMemo(() => 
    data.filter(item => item.name.includes(searchTerm)),
    [data, searchTerm]
);

// Stable callbacks
const handleClick = useCallback((id: string) => {
    // Handle click
}, [/* dependencies */]);

// Debounced search
const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
);
```

### 5. Component Pattern
```typescript
interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export const FeatureComponent: React.FC<Props> = ({ 
    open, onClose, onSuccess, onError 
}) => {
    // Queries
    const { data, isLoading } = useData();
    
    // Mutations
    const { mutate, isPending } = useCreateItem({
        onSuccess: (data) => {
            onSuccess('Item created!');
            onClose();
        },
        onError: (error) => {
            onError(error.message);
        }
    });

    // Render
    if (isLoading) return <CircularProgress />;
    
    return <>{/* Component JSX */}</>;
};
```

### 6. Testing Patterns
```typescript
// Unit test with mocked hooks
describe('useUsers', () => {
    it('fetches users successfully', async () => {
        const { result } = renderHook(() => useUsers(), {
            wrapper: AllProviders,
        });
        
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });
    });
});

// Integration test with MSW
describe('UserList', () => {
    const server = setupFileServer(...handlers);
    
    it('displays users', async () => {
        render(<UserList />, { wrapper: AllProviders });
        
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });
});
```

## Key Libraries Configuration

### React Query Setup
```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});
```

### MUI Theme
```typescript
const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});
```

## Best Practices
1. **Type Safety**: Use TypeScript strictly, avoid `any`
2. **Error Handling**: Consistent error boundaries and user feedback
3. **Performance**: Memoize expensive operations, lazy load routes
4. **Testing**: Test pyramid approach (unit → integration → e2e)
5. **State**: Separate server state (React Query) from UI state (Zustand)
6. **Forms**: Use React Hook Form for performance, Yup for validation
7. **API**: Centralized client with consistent error handling

## Common Pitfalls to Avoid
1. **State Management**:
   - Don't put server data in Zustand stores
   - Don't use React Query for UI state (modals, forms)
   - Don't forget to invalidate queries after mutations

2. **Performance**:
   - Avoid inline object/array creation in dependencies
   - Don't forget to memoize expensive filters/sorts
   - Avoid unnecessary re-renders with proper key usage

3. **TypeScript**:
   - Never use `any` - use `unknown` if type is truly unknown
   - Always type API responses
   - Use strict mode in tsconfig.json

4. **Forms**:
   - Don't use controlled components without React Hook Form
   - Always validate on both client and server
   - Handle loading states during submission

5. **Error Handling**:
   - Always handle both network and application errors
   - Provide user-friendly error messages
   - Don't expose internal error details to users

## Frontend-Backend Integration
```typescript
// Ensure frontend types match backend DTOs
interface UserDto {  // Should match C# UserDto
    id: string;
    email: string;
    name: string;
    roles: string[];
}

// Consistent error response format
interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
}

// Standardized API response wrapper
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}
```