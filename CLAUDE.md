# Claude Code Development Guide

## Project Overview
Multi-tenant todo application with team-based collaboration, built with production-ready patterns.

## Tech Stack
- **Frontend**: React 18, TypeScript, Material-UI v5, React Query, Zustand, Vite
- **Backend**: .NET 8 Minimal APIs, Entity Framework Core, PostgreSQL, JWT Auth
- **Infrastructure**: Docker, Docker Compose, GitHub Actions

## Key Architecture Decisions
1. **Multi-tenancy**: Users can belong to multiple teams with different roles per team
2. **Authentication**: Passwordless email verification (no passwords stored)
3. **Data Input**: Use drawers (right-side desktop, bottom sheet mobile) instead of dialogs
4. **State Management**: React Query for server state, Zustand for UI state only

## Development Commands
```bash
# Frontend
cd src/frontend
npm install
npm run dev         # Start dev server
npm test           # Run tests
npm run build      # Build for production

# Backend
cd src/TodoApp.Api
dotnet watch run   # Start with hot reload
dotnet test        # Run tests
dotnet ef migrations add <Name>  # Add migration

# Docker
docker compose up -d              # Start all services
docker compose --profile backend up  # Backend only
docker compose down -v           # Stop and clean
```

## Code Patterns

### Frontend Patterns
```typescript
// API calls with error handling
export const getUsers = async (token: string): Promise<ApiDataResponse<User[]>> => {
    const api = getApiClient(token);
    try {
        const response = await api.get('/v1/users');
        return { success: true, data: response.data };
    } catch (error) {
        return handleAxiosError(error);
    }
};

// React Query hooks
export function useUsers() {
    const token = useAuthStore((state) => state.token);
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: () => getUsers(token!),
        enabled: !!token,
    });
}

// Drawer pattern for forms
<ResponsiveDrawer open={open} onClose={onClose}>
    <DrawerHeader title="Create Todo" onClose={onClose} />
    <DrawerContent>{/* form fields */}</DrawerContent>
    <DrawerFooter>{/* action buttons */}</DrawerFooter>
</ResponsiveDrawer>
```

### Backend Patterns
```csharp
// Minimal API endpoints
app.MapGet("/api/v1/users", GetUsers)
    .RequireAuthorization(nameof(Roles.Administrator));

// Service with team filtering
public async Task<GetUsersResponse> GetUsersAsync(Guid teamId, CancellationToken ct)
{
    var users = await _context.Users
        .Include(u => u.TeamMemberships)
        .Where(u => u.TeamMemberships.Any(tm => tm.TeamId == teamId))
        .ToListAsync(ct);
    return new GetUsersResponse(users);
}

// JWT with team context
var claims = new[]
{
    new Claim("sub", user.Id.ToString()),
    new Claim("current_team_id", teamId.ToString()),
    new Claim("role", membership.Role.ToString())
};
```

## Testing Requirements
- **Unit Tests**: >80% coverage, use React Testing Library & xUnit
- **Integration Tests**: Test API with real database, use MSW for frontend
- **E2E Tests**: Playwright for critical paths, test on Chrome/Firefox/Safari
- **Performance**: API responses <200ms, Lighthouse score >90

## Definition of Done
- [ ] Code follows established patterns
- [ ] Unit/Integration/E2E tests written
- [ ] No TypeScript errors or build warnings
- [ ] Passes linting and security scans
- [ ] Manually tested in development
- [ ] Documentation updated if needed

## Common Tasks

### Add a New Feature
1. Review relevant user stories in `docs/stories/`
2. Check UX flows and wireframes in `docs/ux/`
3. Implement API endpoints first (with tests)
4. Build UI components (with tests)
5. Add E2E tests for the complete flow

### Create a New API Endpoint
1. Add endpoint in feature folder (e.g., `/Features/Todos/`)
2. Create DTOs for request/response
3. Implement service layer with team filtering
4. Add authorization attributes
5. Write integration tests

### Add a New UI Form
1. Use drawer pattern (not dialog)
2. Create with React Hook Form + Yup validation
3. Use Material-UI components consistently
4. Add loading and error states
5. Implement optimistic updates with React Query

## Important Rules
1. **Never** expose data from other teams
2. **Always** validate team membership in API calls
3. **Use** TypeScript strictly (no `any` types)
4. **Follow** Material-UI theme for consistency
5. **Test** accessibility (keyboard nav, screen readers)

## File Organization
```
src/
├── frontend/
│   ├── src/
│   │   ├── apis/        # API client modules
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Route pages
│   │   ├── stores/      # Zustand stores
│   │   └── utils/       # Helpers
│   └── tests/          # Test files
└── TodoApp.Api/
    ├── Features/       # Feature modules
    ├── Data/          # EF Core context
    └── Program.cs     # App configuration
```

## Branching Strategy

Create branches following the pattern: `<type>/<ticket>-<description>`

```bash
# Examples
feat/SP1-001-email-verification
fix/SP2-045-todo-duplication
refactor/SP3-023-service-layer
ci/add-e2e-tests

# Workflow
git checkout develop
git pull origin develop
git checkout -b feat/SP1-001-new-feature
# ... work and commit ...
git push origin feat/SP1-001-new-feature
gh pr create --base develop
```

See [Branching Strategy](docs/BRANCHING_STRATEGY.md) for full details.

## Quick Checklist
Before committing:
- [ ] Run `npm test` (frontend)
- [ ] Run `dotnet test` (backend)
- [ ] Check for console.logs or debug code
- [ ] Verify no hardcoded values
- [ ] Ensure proper error handling
- [ ] Update tests for new code
- [ ] Branch follows naming convention
- [ ] Commits follow conventional format