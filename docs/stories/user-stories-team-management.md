# User Stories - Team Management

## Epic: Team Administration & User Management

### User Story 0: Create Additional Teams
**As an** existing user  
**I want to** create additional teams  
**So that** I can organize work with different groups

**Acceptance Criteria:**
- "Create New Team" option in team switcher
- User provides team name (3-50 characters)
- User becomes admin of the new team
- Can immediately switch to the new team
- New team starts with no other members
- No limit on number of teams per user

### User Story 1: View Team Members
**As a** team member  
**I want to** see all members of my current team  
**So that** I can understand who I'm collaborating with

**Acceptance Criteria:**
- User management page shows members of current team only
- Display: name, email, role (in this team), join date, last active
- Members sorted alphabetically by default
- Can search/filter members by name or email
- Shows member count and active user indicators
- Role shown is specific to this team

### User Story 2: Invite New Team Members
**As a** team admin  
**I want to** invite new members to join our team  
**So that** we can collaborate on todos

**Acceptance Criteria:**
- "Invite Member" button visible to admins only
- Can generate unique invite link
- Link expires after 7 days
- Can set role for invited member (Member/Admin)
- Can copy link to clipboard with one click
- Shows list of pending invitations
- Can revoke pending invitations

### User Story 3: Manage Team Member Roles
**As a** team admin  
**I want to** manage team member roles  
**So that** I can control access and permissions

**Acceptance Criteria:**
- Admins can change member roles (Member ↔ Admin) for current team
- User's roles in other teams are unaffected
- Cannot remove the last admin
- Role changes take effect immediately
- Activity log records role changes
- Email notification sent to affected user
- Notification specifies which team's role changed

### User Story 4: Remove Team Members
**As a** team admin  
**I want to** remove members from the team  
**So that** I can manage team composition

**Acceptance Criteria:**
- Remove option available in member actions menu
- Confirmation dialog prevents accidental removal
- Removed user loses access to this team only
- User can still access their other teams
- Their todos remain but show as "Former member"
- Cannot remove self or last admin
- Removal is logged in activity history
- User receives notification about removal

### User Story 5: View Team Settings
**As a** team admin  
**I want to** view and edit team settings  
**So that** I can customize our workspace

**Acceptance Criteria:**
- Team settings page shows team name, creation date
- Can edit team name (3-50 characters)
- Shows team statistics (members, todos, lists)
- Shows team ID for support purposes
- Changes require admin role

### User Story 6: Transfer Team Ownership
**As a** team admin  
**I want to** transfer primary ownership to another admin  
**So that** leadership can change when needed

**Acceptance Criteria:**
- Only primary owner sees transfer option
- Can only transfer to other admins
- Requires email confirmation from both parties
- New owner gets full control
- Previous owner remains as admin
- Transfer is logged permanently

### User Story 7: View Personal Profile
**As a** user  
**I want to** view and edit my profile  
**So that** my teams know who I am

**Acceptance Criteria:**
- Profile shows display name, email, list of teams
- Can edit display name (used across all teams)
- Shows role in each team I belong to
- Can update global notification preferences
- Can view my activity history across all teams
- Can download my data (GDPR compliance)
- Can see "Member since" date for account

### User Story 8: Leave Team
**As a** team member  
**I want to** leave a team voluntarily  
**So that** I can manage my memberships

**Acceptance Criteria:**
- "Leave Team" option in team settings
- Confirmation dialog explains consequences
- Cannot leave if only admin
- Cannot leave if it's user's only team
- Immediately loses access to this team only
- Other team memberships unaffected
- Todos remain with attribution to "Former member"
- Can rejoin only via new invitation

### User Story 9: View Invite History
**As a** team admin  
**I want to** see invitation history  
**So that** I can track team growth

**Acceptance Criteria:**
- Shows all invitations (pending, accepted, expired)
- Displays: invited email, inviter, date, status
- Can filter by status
- Can resend expired invitations
- Can export invitation data

### User Story 10: Bulk User Management
**As a** team admin  
**I want to** perform bulk actions on users  
**So that** I can efficiently manage larger teams

**Acceptance Criteria:**
- Multi-select checkboxes on user list
- Bulk actions: change role, remove users
- Confirmation shows affected user count
- Progress indicator for bulk operations
- Error handling for partial failures
- Activity log shows bulk operations

### User Story 11: View My Teams
**As a** user  
**I want to** see all teams I belong to  
**So that** I can manage my memberships

**Acceptance Criteria:**
- "My Teams" page shows all teams
- Display: team name, my role, member count, last activity
- Can navigate to any team workspace
- Can leave teams from this view
- Shows invitation status for pending teams
- Can create new team from this view