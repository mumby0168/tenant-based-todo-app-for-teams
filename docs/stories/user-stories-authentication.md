# User Stories - Authentication & Sign-up

## Epic: User Authentication & Onboarding

### User Story 1: Initial Sign-up via Email
**As a** new user  
**I want to** sign up using my email address  
**So that** I can access the todo application

**Acceptance Criteria:**
- Public sign-up page is accessible without authentication
- User can enter their email address
- System sends a verification code to the email
- Invalid email formats are rejected with appropriate error message
- Rate limiting prevents abuse (max 3 attempts per email per hour)
- Success message confirms code has been sent

### User Story 2: Email Verification
**As a** user who has requested access  
**I want to** enter my verification code  
**So that** I can prove ownership of my email address

**Acceptance Criteria:**
- User can enter the 6-digit verification code
- Code expires after 15 minutes
- Invalid codes show appropriate error message
- After 3 failed attempts, user must request a new code
- Successful verification proceeds to next step

### User Story 3: New User Account Creation
**As a** new user without an existing account  
**I want to** create my account and first team  
**So that** I can start using the application

**Acceptance Criteria:**
- System detects if email has no existing account
- User provides their display name
- User creates their first team with a team name
- Team name must be between 3-50 characters
- User becomes the team admin automatically
- Account is created with ability to join multiple teams
- User is redirected to the main application

### User Story 4: Returning User Login
**As an** existing user  
**I want to** log in using my email  
**So that** I can access my teams and todos

**Acceptance Criteria:**
- Existing users enter email on login page
- System sends verification code to email
- Upon successful verification, user sees team selector if multiple teams
- If only one team, user goes directly to that team's workspace
- Session persists for 7 days (with "Remember me" option)
- User can log out manually

### User Story 5: Join Team via Invite Link
**As a** user (new or existing)  
**I want to** join a team using an invite link  
**So that** I can collaborate with that team

**Acceptance Criteria:**
- Invite link contains unique token
- Clicking link redirects to join team page
- Existing users: verify email and join team
- New users: create account with display name, then join team
- Email verification is always required
- User is added to the team with specified role
- If logged in to another team, can switch after joining
- User sees welcome message with team name

### User Story 6: Team Switching
**As a** user who belongs to multiple teams  
**I want to** switch between my teams  
**So that** I can work with different groups

**Acceptance Criteria:**
- Team switcher dropdown/menu in app header
- Shows all teams user belongs to
- Current team is highlighted
- Switching teams updates all content immediately
- User's role may differ between teams
- Last accessed team is remembered for next login
- Quick keyboard shortcut for team switching

### User Story 7: Session Management
**As a** logged-in user  
**I want** my session to be secure and persistent  
**So that** I don't have to log in repeatedly

**Acceptance Criteria:**
- JWT tokens include current team context
- Tokens expire after configured duration
- Refresh tokens allow seamless session extension
- Team switching updates token without re-login
- Logout invalidates all tokens across all teams
- Multiple device sessions are supported