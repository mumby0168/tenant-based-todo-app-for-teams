# Sprint Planning - Team Todo Application

## Definition of Done (DoD)

A user story is considered **DONE** when ALL of the following criteria are met:

### 1. Code Complete
- [ ] All code is written and committed
- [ ] Code follows established patterns (Frontend/Backend guides)
- [ ] No commented-out code or TODOs remain
- [ ] Code is properly typed (no `any` in TypeScript, proper C# types)

### 2. Testing Requirements
#### Unit Tests
- [ ] Frontend: Component tests with React Testing Library (>80% coverage)
- [ ] Frontend: Hook tests for custom hooks
- [ ] Backend: Complex logic and small functions only

#### Integration Tests
- [ ] API integration tests with test database
- [ ] Frontend API client tests with MSW (Mock Service Worker)
- [ ] Authentication flow tests
- [ ] Database migration tests
- [ ] backend api driven tests using mvc testing

#### E2E Tests
- [ ] Critical user paths tested with Playwright
- [ ] Tests run on Chrome, Firefox, Safari
- [ ] Mobile viewport tests
- [ ] Accessibility tests (keyboard navigation, screen reader)

### 3. Documentation
- [ ] API endpoints documented with examples
- [ ] Complex business logic has inline comments
- [ ] README updated if setup changes
- [ ] User-facing features documented

### 4. Code Quality
- [ ] Passes all linting rules (ESLint, .NET analyzers)
- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] Passes security scanning (npm audit, dotnet outdated)

### 5. Performance
- [ ] No N+1 queries (verified with logging)
- [ ] API responses < 200ms (excluding external calls)
- [ ] Frontend bundle size monitored
- [ ] Lighthouse score > 90 for performance

### 6. Review & Approval
- [ ] Code reviewed by at least one team member
- [ ] UI/UX reviewed against wireframes
- [ ] Manually tested in development environment
- [ ] Acceptance criteria verified

---

## Sprint 0: Foundation & Setup

### Goal
Establish the development environment, CI/CD pipeline, and basic application structure with "Hello World" functionality across all tiers.

### User Stories

#### 0.1: Repository Setup
**As a** developer  
**I want** a properly structured repository  
**So that** I can start development with best practices

**Tasks:**
- Initialize Git repository with .gitignore
- Setup folder structure per architecture docs
- Create README with setup instructions
- Add LICENSE file
- Setup GitHub Actions workflow structure

**Testing:**
- Verify .gitignore covers all necessary files
- Ensure README instructions work on clean machine

#### 0.2: Backend Foundation
**As a** developer  
**I want** a working .NET API with database  
**So that** I can build features

**Tasks:**
- Create .NET 9 Minimal API project
- Setup PostgreSQL with Docker
- Configure Entity Framework Core
- Create health check endpoint
- Setup OpenTelemetry basics
- Add Swagger documentation

**Testing:**
- `dotnet test` runs successfully
- Health endpoint returns 200 OK
- Database migrations apply cleanly
- Swagger UI accessible at /swagger

#### 0.3: Frontend Foundation
**As a** developer  
**I want** a working React application  
**So that** I can build UI features

**Tasks:**
- Create React app with Vite and TypeScript
- Setup Material-UI with theme
- Configure React Query
- Setup Zustand store
- Create basic routing structure
- Add MSW for API mocking

**Testing:**
- `npm test` runs successfully
- `npm run build` produces no errors
- Basic component renders "Hello World"
- MSW intercepts API calls in tests

#### 0.4: Docker & Local Development
**As a** developer  
**I want** containerized development environment  
**So that** setup is consistent

**Tasks:**
- Create Dockerfiles for frontend and backend
- Setup docker-compose.yml with profiles
- Configure hot reload for development
- Add wait-for-healthy script
- Setup nginx configuration

**Testing:**
- `docker compose up` starts all services
- Frontend accessible at localhost:8080
- API accessible at localhost:8081
- Hot reload works for both tiers
- Database persists between restarts

#### 0.5: CI/CD Pipeline
**As a** developer  
**I want** automated testing and building  
**So that** code quality is maintained

**Tasks:**
- Setup GitHub Actions for unit tests
- Configure code coverage reporting
- Add security scanning (npm audit, Trivy)
- Setup build and push workflow
- Add PR checks and branch protection

**Testing:**
- Push triggers test workflow
- Coverage reports generated
- Failed tests block PR merge
- Docker images build successfully

---

## Sprint 1: Authentication Foundation

### Goal
Implement passwordless authentication with email verification, supporting single team creation for new users.

### User Stories

#### 1.1: Email Request & Verification API
**As a** backend developer  
**I want** email verification endpoints  
**So that** users can authenticate

**Acceptance Criteria:**
- POST /api/v1/auth/request-code accepts email
- Generates 6-digit code with 15-min expiry
- Sends email via configured service
- Rate limits to 3 attempts per hour
- Stores verification attempts in database

**Testing:**
- Unit: Code generation and expiry logic
- Integration: Database storage and retrieval
- API: Rate limiting behavior
- E2E: Full email request flow

#### 1.2: Email Verification UI
**As a** user  
**I want** to receive and enter verification codes  
**So that** I can access the application

**Acceptance Criteria:**
- Email input with validation
- 6-digit OTP input component
- Resend code functionality (with cooldown)
- Error messages for invalid/expired codes
- Loading states during verification

**Testing:**
- Component: Form validation and error states
- Integration: API call handling
- E2E: Complete verification flow
- Accessibility: Keyboard navigation

#### 1.3: New User Registration
**As a** new user  
**I want** to create an account and team  
**So that** I can start using the app

**Acceptance Criteria:**
- Detect new vs existing user after verification
- Collect display name and team name
- Create user, team, and membership records
- Generate JWT with team context
- Redirect to authenticated app

**Testing:**
- Unit: User/Team creation logic
- Integration: Transaction handling
- API: JWT generation and validation
- E2E: Complete signup flow

#### 1.4: Existing User Login
**As an** existing user  
**I want** to log in quickly  
**So that** I can access my team

**Acceptance Criteria:**
- Recognize returning users by email
- Skip profile creation for existing users
- Load user's team (single team for now)
- Generate JWT and redirect
- Remember me functionality

**Testing:**
- Unit: User lookup logic
- Integration: Session management
- E2E: Login flow for existing user
- Security: Token expiry and refresh

---

## Sprint 2: Todo Lists Foundation

### Goal
Enable users to create and manage todo lists within their team.

### User Stories

#### 2.1: Create Todo List API
**As a** backend developer  
**I want** CRUD endpoints for lists  
**So that** teams can organize todos

**Acceptance Criteria:**
- POST /api/v1/lists creates new list
- GET /api/v1/lists returns team's lists
- PUT /api/v1/lists/{id} updates list
- DELETE /api/v1/lists/{id} soft deletes
- Team isolation enforced

**Testing:**
- Unit: Business logic and validation
- Integration: Database operations
- API: Authorization and team filtering
- Performance: Query optimization

#### 2.2: Todo Lists UI
**As a** user  
**I want** to see and manage my team's lists  
**So that** I can organize work

**Acceptance Criteria:**
- Grid view of todo lists
- Create new list via drawer
- Edit list name and description
- Delete with confirmation
- Empty state for no lists

**Testing:**
- Component: List card rendering
- Integration: CRUD operations
- E2E: Create, edit, delete flows
- Accessibility: Screen reader support

#### 2.3: List Filtering & Search
**As a** user  
**I want** to find lists quickly  
**So that** I can be productive

**Acceptance Criteria:**
- Search by list name
- Filter by active/archived status
- Sort by date/name/item count
- Persist filter preferences
- Clear filters option

**Testing:**
- Component: Filter controls
- Integration: Search debouncing
- E2E: Filter combinations
- Performance: Large list count

---

## Sprint 3: Todo Items Core

### Goal
Implement core todo functionality within lists.

### User Stories

#### 3.1: Todo CRUD API
**As a** backend developer  
**I want** endpoints for todo items  
**So that** users can manage tasks

**Acceptance Criteria:**
- CRUD operations for todos
- Assignee and due date support
- Completion tracking with timestamp
- Audit trail for changes
- List association enforced

**Testing:**
- Unit: Todo state transitions
- Integration: List association
- API: Permission checks
- Performance: Bulk operations

#### 3.2: Todo Management UI
**As a** user  
**I want** to manage todos in my lists  
**So that** I can track work

**Acceptance Criteria:**
- Add todo with quick input
- Check/uncheck for completion
- Edit via drawer interface
- Delete with confirmation
- Assignee avatar display

**Testing:**
- Component: Todo item states
- Integration: Optimistic updates
- E2E: CRUD operations
- Accessibility: Checkbox labeling

#### 3.3: Todo Details & Assignment
**As a** user  
**I want** rich todo details  
**So that** I can add context

**Acceptance Criteria:**
- Description field
- Due date picker
- Priority levels
- Assignee selector (team members)
- Activity history

**Testing:**
- Component: Form controls
- Integration: Team member loading
- E2E: Assignment flow
- UI: Date picker localization

---

## Sprint 4: Team Management

### Goal
Enable team administration and multi-team support.

### User Stories

#### 4.1: Team Member Management API
**As a** backend developer  
**I want** team member endpoints  
**So that** admins can manage teams

**Acceptance Criteria:**
- List team members with roles
- Invite new members (generate tokens)
- Remove members (soft delete)
- Role management (Admin/Member)
- Invitation expiry handling

**Testing:**
- Unit: Role authorization logic
- Integration: Invitation tokens
- API: Admin-only endpoints
- Security: Token generation

#### 4.2: Team Settings UI
**As a** team admin  
**I want** to manage my team  
**So that** I can add/remove members

**Acceptance Criteria:**
- View team members list
- Invite via email with role
- Copy invitation link
- Remove members (with confirmation)
- Change member roles

**Testing:**
- Component: Member list rendering
- Integration: Invitation flow
- E2E: Admin operations
- Accessibility: Role badges

#### 4.3: Multi-Team Support
**As a** user  
**I want** to belong to multiple teams  
**So that** I can collaborate broadly

**Acceptance Criteria:**
- Team switcher in app header
- Create additional teams
- Join teams via invitation
- Per-team role support
- Last accessed team memory

**Testing:**
- Unit: Team membership logic
- Integration: Team switching
- E2E: Multi-team workflows
- Performance: Team list scaling

---

## Sprint 5: Search & Activity

### Goal
Implement search functionality and activity tracking.

### User Stories

#### 5.1: Global Search API
**As a** backend developer  
**I want** search endpoints  
**So that** users can find content

**Acceptance Criteria:**
- Search todos by title/description
- Search within current team only
- Return list context for todos
- Support pagination
- Highlight matching terms

**Testing:**
- Unit: Search algorithm
- Integration: Full-text search
- API: Result filtering
- Performance: Search indexing

#### 5.2: Search UI
**As a** user  
**I want** to search across todos  
**So that** I can find tasks quickly

**Acceptance Criteria:**
- Global search bar in header
- Real-time search results
- Navigate to todo from results
- Recent searches saved
- Clear search history

**Testing:**
- Component: Search input
- Integration: Debounced API calls
- E2E: Search and navigate
- Accessibility: Search announcements

#### 5.3: Activity Feed
**As a** user  
**I want** to see team activity  
**So that** I stay informed

**Acceptance Criteria:**
- Track create/update/complete actions
- Show user, action, and timestamp
- Filter by user or action type
- Relative timestamps
- Click to navigate to item

**Testing:**
- Unit: Activity recording
- Integration: Real-time updates
- E2E: Activity tracking
- Performance: Feed pagination

---

## Sprint 6: Polish & Optimization

### Goal
Improve performance, add final features, and polish the application.

### User Stories

#### 6.1: Performance Optimization
**As a** user  
**I want** fast application performance  
**So that** I can work efficiently

**Acceptance Criteria:**
- Implement virtual scrolling for long lists
- Add service worker for offline support
- Optimize bundle size (<500KB initial)
- Database query optimization
- CDN setup for static assets

**Testing:**
- Performance: Lighthouse audits
- Load: Stress testing with k6
- E2E: Offline functionality
- Monitoring: Performance metrics

#### 6.2: Email Notifications
**As a** user  
**I want** email notifications  
**So that** I stay updated

**Acceptance Criteria:**
- Assignment notifications
- Due date reminders
- Daily digest option
- Notification preferences
- Unsubscribe links

**Testing:**
- Unit: Notification logic
- Integration: Email sending
- E2E: Preference management
- Accessibility: Email templates

#### 6.3: Data Export
**As a** user  
**I want** to export my data  
**So that** I own my information

**Acceptance Criteria:**
- Export todos as CSV
- Export as JSON
- Include completed items
- GDPR compliance
- Audit trail export

**Testing:**
- Unit: Export formatting
- Integration: Data compilation
- E2E: Download flow
- Security: Data filtering

---

## Testing Strategy

### Test Pyramid
1. **Unit Tests (70%)**
   - Fast, isolated, numerous
   - Mock external dependencies
   - Focus on business logic

2. **Integration Tests (20%)**
   - Test component interactions
   - Use test database
   - Verify API contracts

3. **E2E Tests (10%)**
   - Critical user journeys
   - Cross-browser testing
   - Visual regression tests

### Continuous Testing
- Pre-commit hooks run unit tests
- PR checks run all test suites
- Nightly E2E test runs
- Performance testing weekly
- Security scanning daily

### Test Data Management
- Seed data for development
- Test fixtures for consistency
- Cleanup after test runs
- Separate test database
- Mock external services