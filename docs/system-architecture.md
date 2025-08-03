# System Architecture - Team-Based Todo Application

## Overview

This document describes the high-level architecture of a multi-tenant todo application designed to showcase production-ready patterns using modern web technologies. The system supports team-based collaboration with secure authentication, real-time updates, and scalable architecture.

## Architecture Principles

1. **Multi-tenancy**: Complete data isolation between teams
2. **Security First**: JWT-based auth, email verification, role-based access
3. **Real-time Collaboration**: Live updates across team members
4. **Scalability**: Horizontally scalable architecture
5. **Developer Experience**: Type-safe, well-documented, testable
6. **Production Ready**: Monitoring, error handling, CI/CD

## System Components

### Frontend (React SPA)
- **Technology**: React 18, TypeScript, Material-UI
- **State Management**: 
  - React Query for server state (todos, users)
  - Zustand for UI state (modals, filters)
- **Forms**: React Hook Form + Yup validation
- **Build**: Vite with code splitting
- **Hosting**: Nginx container serving static files

### Backend (API)
- **Technology**: .NET 9 Minimal APIs
- **Database**: PostgreSQL with Entity Framework Core
- **Authentication**: JWT tokens with refresh mechanism
- **Architecture**: Feature-based vertical slices
- **Observability**: OpenTelemetry integration

### Infrastructure
- **Containers**: Docker for all components
- **Orchestration**: Docker Compose for local dev
- **CI/CD**: GitHub Actions for testing and deployment
- **Database**: PostgreSQL with automatic migrations

## Data Model

### Core Entities

```
User (Global Account)
├── Id (GUID)
├── Email (unique)
├── DisplayName
├── CreatedAt
├── LastActiveAt
└── TeamMemberships[]

Team
├── Id (GUID)
├── Name
├── CreatedAt
├── CreatedBy (FK)
└── Members[]

TeamMembership (Join Table)
├── Id (GUID)
├── UserId (FK)
├── TeamId (FK)
├── Role (Member|Admin)
├── JoinedAt
├── InvitedBy (FK)
└── LastAccessedAt

TodoList
├── Id (GUID)
├── TeamId (FK)
├── Title
├── Description
├── CreatedBy (FK)
├── CreatedAt
├── UpdatedAt
└── TodoItems[]

TodoItem
├── Id (GUID)
├── ListId (FK)
├── Title
├── Description
├── IsCompleted
├── CompletedAt
├── CompletedBy (FK)
├── AssignedTo (FK)
├── DueDate
├── CreatedBy (FK)
├── CreatedAt
└── UpdatedAt

Invitation
├── Id (GUID)
├── TeamId (FK)
├── Token (unique)
├── Email
├── Role
├── InvitedBy (FK)
├── ExpiresAt
├── AcceptedAt
└── CreatedAt

AuditLog
├── Id (GUID)
├── TeamId (FK)
├── UserId (FK)
├── Action
├── EntityType
├── EntityId
├── OldValues (JSON)
├── NewValues (JSON)
└── Timestamp
```

## Authentication Flow

### Sign-up Process
1. User enters email on public sign-up page
2. System sends 6-digit verification code
3. User enters code (15-minute expiry)
4. If new user:
   - Create user account with display name
   - Create first team
   - Add user as admin of team
5. If existing user with invite:
   - Add to invited team with specified role
6. Generate JWT with current team context
7. Redirect to team workspace

### Login Process
1. User enters email
2. System sends verification code
3. User enters code
4. If multiple teams → show team selector
5. If single team → auto-select
6. Generate JWT with selected team context
7. Redirect to team workspace

### Team Switching
1. User selects different team from switcher
2. Validate user has access to team
3. Generate new JWT with new team context
4. Update UI to show new team's data
5. Store last accessed team preference

### Invitation Flow
1. Admin generates invite link with token
2. Invitee clicks link → join team page
3. Existing users: verify email only
4. New users: create account first
5. Add user to team with specified role
6. If logged in, can switch to new team
7. If not logged in, redirect to login

## API Design

### Endpoints Structure
```
/api/v1/
├── auth/
│   ├── POST   /request-code
│   ├── POST   /verify-code
│   ├── POST   /refresh
│   ├── POST   /switch-team
│   └── POST   /logout
├── teams/
│   ├── GET    /            # List user's teams
│   ├── POST   /            # Create new team
│   ├── GET    /current     # Current team details
│   ├── PUT    /current     # Update current team
│   ├── POST   /current/invitations
│   └── DELETE /{id}/leave  # Leave a team
├── users/
│   ├── GET    /            # Users in current team
│   ├── GET    /{id}
│   ├── PUT    /{id}/role   # Role in current team
│   ├── DELETE /{id}        # Remove from current team
│   ├── GET    /me          # Current user profile
│   └── PUT    /me          # Update profile
├── lists/
│   ├── GET    /            # Lists for current team
│   ├── POST   /
│   ├── GET    /{id}
│   ├── PUT    /{id}
│   └── DELETE /{id}
├── todos/
│   ├── GET    /            # Todos for current team
│   ├── POST   /
│   ├── GET    /{id}
│   ├── PUT    /{id}
│   ├── DELETE /{id}
│   └── PUT    /{id}/complete
└── activity/
    └── GET    /            # Activity for current team
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": {
    "message": "Human readable error",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

## Security Considerations

### Authentication & Authorization
- JWT tokens include user ID + current team ID
- Role-based access control per team (Member, Admin)
- Team context validated on each request
- Refresh token rotation
- Session management across devices
- Team switching updates JWT without re-login

### Data Protection
- Team-based data isolation
- SQL injection prevention via EF Core
- XSS protection via React
- CSRF tokens for state-changing operations
- Rate limiting on all endpoints

### Email Verification
- Time-limited verification codes
- Rate limiting per email
- Secure random code generation
- No user enumeration

## Real-time Features

### WebSocket Events (Future Enhancement)
- Todo created/updated/deleted
- User joined/left team
- List created/deleted
- Presence indicators

### Optimistic Updates
- Immediate UI updates
- Background sync with server
- Conflict resolution
- Error recovery

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy loading of components
- Image optimization
- Bundle size monitoring
- Service worker for offline support

### Backend
- Database query optimization
- Caching strategy (Redis future)
- Pagination for large datasets
- Async/await throughout
- Connection pooling

### Database
- Proper indexing strategy
- Soft deletes for recovery
- Audit trail without impacting performance
- Regular maintenance jobs

## Monitoring & Observability

### Application Monitoring
- OpenTelemetry for tracing
- Structured logging
- Error tracking (Sentry integration ready)
- Performance metrics

### Infrastructure Monitoring
- Container health checks
- Database connection monitoring
- API response time tracking
- Resource utilization alerts

## Development Workflow

### Local Development
1. Docker Compose starts all services
2. Hot reload for frontend and backend
3. Automatic database migrations
4. Seed data for testing

### Testing Strategy
- Unit tests for business logic
- Integration tests for API
- E2E tests with Playwright
- Load testing for performance

### CI/CD Pipeline
1. PR triggers test suite
2. Main branch builds containers
3. Automated security scanning
4. Deploy to staging
5. Production deployment (manual approval)

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Load balancer ready
- Database read replicas
- Caching layer (Redis)

### Multi-region (Future)
- CDN for static assets
- Geographic database distribution
- Regional API endpoints
- Data residency compliance

## Multi-Team Considerations

### JWT Token Structure
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "Display Name",
  "current_team": {
    "id": "team-id",
    "name": "Team Name",
    "role": "Admin"
  },
  "exp": 1234567890
}
```

### Database Query Patterns
- All queries filtered by current team context
- Team membership validated before data access
- Soft deletes preserve data when users leave
- Audit logs maintain team context

### UI State Management
- Current team stored in global state
- Team switcher in app header
- Data refetch on team switch
- Role-based UI elements per team

## Future Enhancements

### Phase 2 Features
- Real-time collaboration via WebSockets
- File attachments for todos
- Comments and discussions
- Email notifications
- Mobile applications
- Team templates for quick setup

### Phase 3 Features
- Advanced permissions system
- Todo templates
- Recurring todos
- Time tracking
- Third-party integrations (Slack, etc.)
- Cross-team reporting for users

### Technical Improvements
- GraphQL API option
- Event sourcing for audit trail
- CQRS for complex queries
- Microservices architecture
- Kubernetes deployment