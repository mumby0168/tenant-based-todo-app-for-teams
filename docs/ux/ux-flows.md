# UX Flows - Team Todo Application

## Overview
This document details the user experience flows for the multi-team todo application, including screen-by-screen interactions, navigation patterns, and Material-UI component usage.

## 1. Authentication Flows

### 1.1 Initial Landing (Public)
**URL**: `/`
- User arrives at public landing page
- CTA buttons: "Sign Up" and "Log In"
- Brief app description and benefits
- **Components**: Hero section with `Typography`, `Button` components

### 1.2 Sign Up Flow

#### Step 1: Email Entry
**URL**: `/signup`
- Single input field for email
- "Continue" button (disabled until valid email)
- Link to "Already have an account? Log in"
- **Components**: `TextField` with email validation, `Button`, `Link`

#### Step 2: Email Verification
**URL**: `/signup/verify`
- Display: "We sent a code to {email}"
- 6-digit code input (auto-advance on completion)
- "Resend code" link (disabled for 60 seconds)
- Expires in 15 minutes countdown
- **Components**: `TextField` with OTP input pattern, `LinearProgress` for timer

#### Step 3a: New User - Account Creation
**URL**: `/signup/create-account`
- Display name input (required)
- Team name input (required, 3-50 chars)
- "Create Account" button
- **Components**: `TextField` × 2, `Button`, form validation

#### Step 3b: Invited User - Join Team
**URL**: `/join/{inviteToken}`
- Shows team name user is joining
- Display name input (required)
- Role badge showing assigned role
- "Join Team" button
- **Components**: `Alert` with team info, `TextField`, `Chip` for role

### 1.3 Login Flow

#### Step 1: Email Entry
**URL**: `/login`
- Email input field
- "Send Code" button
- "New user? Sign up" link
- **Components**: `TextField`, `Button`, `Link`

#### Step 2: Verification
**URL**: `/login/verify`
- 6-digit code input
- Remember me checkbox
- **Components**: OTP `TextField`, `Checkbox`

#### Step 3: Team Selection (if multiple teams)
**URL**: `/login/select-team`
- List of user's teams with:
  - Team name
  - Member count
  - Last accessed date
  - User's role in team
- "Continue to {TeamName}" button
- **Components**: `List`, `ListItem`, `Avatar`, `Chip` for roles

## 2. Main Application Navigation

### 2.1 App Shell Structure
```
┌─────────────────────────────────────────────┐
│ AppBar with Team Switcher                  │
├─────────────────────────────────────────────┤
│ Drawer │  Main Content Area                 │
│ (Nav)  │                                    │
│        │                                    │
│        │                                    │
└────────┴────────────────────────────────────┘
```

**Components**:
- `AppBar` with `Toolbar`
- `Drawer` (permanent on desktop, temporary on mobile)
- `Container` for main content

### 2.2 Team Switcher Component
Located in `AppBar`, shows:
- Current team name
- Dropdown arrow
- On click, opens menu with:
  - Search teams input
  - List of teams (with role badges)
  - "Create New Team" option
  - Divider
  - "Manage Teams" link

**Components**: `Select` or `Menu` with `MenuItem`, `TextField` for search, `Divider`

### 2.3 Navigation Drawer
**Desktop**: Permanent mini-drawer, expands on hover
**Mobile**: Temporary drawer with hamburger menu

Items:
- Dashboard (icon: Dashboard)
- Todo Lists (icon: FormatListBulleted)
- Team Members (icon: Group)
- Settings (icon: Settings)
- Divider
- User Profile (bottom)
- Logout (bottom)

**Components**: `List`, `ListItem`, `ListItemIcon`, `ListItemText`, `Divider`

## 3. Todo Management Interfaces

### 3.1 Todo Dashboard
**URL**: `/dashboard`
- Stats cards showing:
  - Active todos
  - Completed today
  - Overdue items
  - Team members online
- Recent activity feed
- Quick add todo input

**Components**: `Grid` with `Card` components, `Typography`, `LinearProgress`

### 3.2 Todo Lists View
**URL**: `/lists`
- Grid/List view toggle
- "Create New List" FAB (bottom right)
- Search bar
- Filter chips (All, Active, Archived)
- List cards showing:
  - Title
  - Item count (X active, Y completed)
  - Last updated
  - Contributors avatars
- Click FAB opens Create List drawer

**Components**: `ToggleButtonGroup`, `Fab`, `TextField`, `Chip`, `Card`, `AvatarGroup`

### 3.2.1 Create/Edit List Drawer
Triggered by FAB or edit action:
- **Desktop**: Right drawer (400px)
- **Mobile**: Bottom sheet
- List name input (required)
- Description textarea
- Color/icon selector (optional)
- Create/Update button

**Components**: `Drawer`, `TextField`, `Button`

### 3.3 Single List View
**URL**: `/lists/{listId}`
- List header with:
  - Editable title (click to edit)
  - Description
  - Action menu (Archive, Delete)
- Quick add todo input at top
- Filter/Sort toolbar:
  - Status filter (All, Active, Completed)
  - Assignee filter
  - Sort options
- Todo items with:
  - Checkbox
  - Title (click to expand)
  - Assignee avatar
  - Due date chip
  - Priority indicator

**Components**: `Typography` (editable), `TextField`, `Checkbox`, `Avatar`, `Chip`, `IconButton`

### 3.4 Todo Detail Drawer
Opens when clicking todo item:
- **Desktop**: Slides in from right side (400px width)
- **Mobile**: Slides up from bottom (full width)
- Close button or click outside to dismiss
- Editable title
- Description field
- Assignee selector
- Due date picker
- Priority selector
- Activity/Comments section
- Delete button (if permitted)

**Components**: `Drawer` (anchor="right" desktop, anchor="bottom" mobile), `TextField`, `Select`, `DatePicker`, `ToggleButtonGroup`

## 4. Team Management Interfaces

### 4.1 Team Members View
**URL**: `/team/members`
- Member count header
- "Invite Member" button (admin only)
- Search bar
- Member list/cards with:
  - Avatar
  - Name and email
  - Role badge
  - Last active
  - Action menu (admin only)

**Components**: `DataGrid` or `List`, `Avatar`, `Chip`, `Menu`

### 4.2 Invite Member Drawer
Triggered by "Invite Member" button:
- **Desktop**: Right drawer (400px)
- **Mobile**: Bottom sheet
- Role selector (Member/Admin)
- Generate invite link button
- Generated link display with:
  - Copy button
  - QR code (optional)
  - Expiration info
- Active invitations list

**Components**: `Drawer`, `RadioGroup`, `TextField` (read-only), `IconButton`, `List`

### 4.3 Team Settings
**URL**: `/team/settings`
- Team name (editable for admin)
- Team ID (read-only)
- Creation date
- Member statistics
- Danger zone (admin only):
  - Transfer ownership
  - Delete team

**Components**: `TextField`, `Card`, `Button` with warning colors

### 4.4 My Teams View
**URL**: `/account/teams`
- List of all user's teams
- Each team card shows:
  - Team name
  - Role badge
  - Member count
  - Last activity
  - "Switch to Team" button
  - "Leave Team" option
- "Create New Team" card

**Components**: `Grid` with `Card`, `Chip`, `Button`

## 5. Common UI Patterns

### 5.1 Loading States
- Skeleton screens for lists
- Circular progress for actions
- Linear progress for multi-step operations

### 5.2 Empty States
- Illustration or icon
- Descriptive text
- CTA button to create first item
- **Components**: `Box` with `SvgIcon`, `Typography`, `Button`

### 5.3 Error States
- Toast notifications for minor errors
- Alert banners for form errors
- Full-page error for critical failures
- **Components**: `Snackbar`, `Alert`, error boundary

### 5.4 Confirmation Dialogs
- Title describing action
- Warning text for destructive actions
- Cancel and Confirm buttons
- **Components**: `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`

### 5.5 Data Input Drawers Pattern
- **Desktop**: Right-side drawer (400px width)
  - Slides in from right
  - Overlay backdrop
  - Close via X button or clicking outside
- **Mobile**: Bottom sheet (full width)
  - Slides up from bottom
  - Drag handle for dismissal
  - Max height 90% of viewport
- Consistent header with title and close button
- Footer with action buttons (Cancel/Save)
- Auto-focus first input field
- **Components**: `Drawer`, `SwipeableDrawer` (mobile), `Box` for layout

## 6. Mobile Responsive Behaviors

### 6.1 Navigation
- Hamburger menu replaces permanent drawer
- Bottom navigation for primary actions
- Swipe gestures for drawer

### 6.2 Lists and Grids
- Single column on mobile
- Larger touch targets
- Swipe actions for todo items

### 6.3 Forms
- Full-screen dialogs on mobile
- Keyboard avoidance
- Input focus management

## 7. Accessibility Considerations

- All interactive elements keyboard accessible
- ARIA labels for icon buttons
- Form validation messages announced
- Focus management in modals
- Color contrast compliance
- Screen reader announcements for dynamic content

## 8. Performance Optimizations

- Virtualized lists for large datasets
- Lazy loading for team switching
- Optimistic UI updates
- Debounced search inputs
- Code splitting by route