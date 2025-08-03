# Wireframes - Team Todo Application

## Overview
ASCII art wireframes showing key screens and layouts for desktop and mobile views.

## Authentication Screens

### Sign Up - Email Entry (Desktop & Mobile)
```
┌─────────────────────────────────────────────┐
│                                             │
│              Team Todo App                  │
│         Collaborate with your team          │
│                                             │
│         ┌─────────────────────────┐         │
│         │  Email address          │         │
│         └─────────────────────────┘         │
│                                             │
│         [     Continue →     ]              │
│                                             │
│         Already have an account? Log in     │
│                                             │
└─────────────────────────────────────────────┘
```

### Email Verification Screen
```
┌─────────────────────────────────────────────┐
│  ← Back                                     │
│                                             │
│         Check your email                    │
│    We sent a code to user@email.com        │
│                                             │
│     ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│     │   │ │   │ │   │ │   │ │   │ │   │   │
│     └───┘ └───┘ └───┘ └───┘ └───┘ └───┘   │
│                                             │
│     Didn't receive code? Resend (0:45)     │
│                                             │
│         [     Verify →     ]                │
│                                             │
└─────────────────────────────────────────────┘
```

### Create Account & Team
```
┌─────────────────────────────────────────────┐
│                                             │
│         Welcome! Let's get started          │
│                                             │
│         ┌─────────────────────────┐         │
│         │  Your name              │         │
│         └─────────────────────────┘         │
│                                             │
│         ┌─────────────────────────┐         │
│         │  Team name              │         │
│         └─────────────────────────┘         │
│                                             │
│         [   Create Account   ]              │
│                                             │
└─────────────────────────────────────────────┘
```

### Team Selection (Multiple Teams)
```
┌─────────────────────────────────────────────┐
│                                             │
│         Select a team                       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🏢 Marketing Team              Admin │   │
│  │    12 members • Last active today    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🏗️ Engineering              Member │   │
│  │    8 members • Last active 2d ago    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ➕ Create New Team                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

## Main Application - Desktop

### Dashboard with Navigation
```
┌─────────────────────────────────────────────────────────────────────┐
│ ☰  Team Todo    [Marketing Team ▼]    🔔  👤 John Doe              │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│ 📊 Dashboard│  Welcome back, John!                                 │
│             │                                                       │
│ ✓ Todos     │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│             │  │ Active: 12  │ │ Done Today: 5│ │ Overdue: 2  │   │
│ 👥 Team     │  └─────────────┘ └─────────────┘ └─────────────┘   │
│             │                                                       │
│ ⚙️ Settings │  Recent Activity                                     │
│             │  ┌───────────────────────────────────────────────┐   │
│ ─────────── │  │ • Sarah completed "Update homepage"     2h ago│   │
│             │  │ • Mike assigned "Fix bug #123" to you   3h ago│   │
│ 👤 Profile  │  │ • You created "Team meeting notes"      5h ago│   │
│             │  └───────────────────────────────────────────────┘   │
│ 🚪 Logout   │                                                       │
│             │  Quick Add Todo                                      │
│             │  ┌─────────────────────────────────────┐ [Add]      │
│             │  │ What needs to be done?              │            │
│             │  └─────────────────────────────────────┘            │
└─────────────┴───────────────────────────────────────────────────────┘
```

### Todo Lists View
```
┌─────────────────────────────────────────────────────────────────────┐
│ ☰  Team Todo    [Marketing Team ▼]    🔔  👤                       │
├─────────────┬───────────────────────────────────────────────────────┤
│             │  Todo Lists                      [🔍 Search] [➕ New] │
│ 📊 Dashboard│                                                       │
│             │  [All] [Active] [Archived]       [⊞ Grid] [☰ List]  │
│ ✓ Todos     │                                                       │
│             │  ┌──────────────────┐ ┌──────────────────┐           │
│ 👥 Team     │  │ Q4 Marketing Plan │ │ Website Redesign │           │
│             │  │                   │ │                  │           │
│ ⚙️ Settings │  │ 8 active, 3 done  │ │ 15 active, 0 done│           │
│             │  │ Updated 2h ago    │ │ Updated today    │           │
│             │  │ 👤👤👤            │ │ 👤👤             │           │
│             │  └──────────────────┘ └──────────────────┘           │
│             │                                                       │
│             │  ┌──────────────────┐ ┌──────────────────┐           │
│             │  │ Bug Fixes         │ │ Team Onboarding  │           │
│             │  │                   │ │                  │           │
│             │  │ 3 active, 12 done │ │ 0 active, 5 done │           │
│             │  │ Updated yesterday │ │ Updated 3d ago   │           │
│             │  │ 👤👤              │ │ 👤               │           │
│             │  └──────────────────┘ └──────────────────┘           │
└─────────────┴───────────────────────────────────────────────────────┘
```

### Single Todo List View
```
┌─────────────────────────────────────────────────────────────────────┐
│ ☰  Team Todo    [Marketing Team ▼]    🔔  👤                       │
├─────────────┬───────────────────────────────────────────────────────┤
│             │  ← Back to Lists                                     │
│ 📊 Dashboard│                                                       │
│             │  Q4 Marketing Plan                           [⋮ Menu] │
│ ✓ Todos     │  Quarterly marketing initiatives and campaigns        │
│             │                                                       │
│ 👥 Team     │  ┌─────────────────────────────────────┐ [Add Todo] │
│             │  │ Add a new task...                    │            │
│ ⚙️ Settings │  └─────────────────────────────────────┘            │
│             │                                                       │
│             │  Filter: [All ▼] [Anyone ▼]  Sort: [Due Date ▼]     │
│             │                                                       │
│             │  ┌─────────────────────────────────────────────────┐ │
│             │  │ ☐ Launch social media campaign         👤 Sarah  │ │
│             │  │   Due Oct 15 • High priority                    │ │
│             │  ├─────────────────────────────────────────────────┤ │
│             │  │ ☑ Create content calendar              👤 Mike   │ │
│             │  │   Completed Oct 1 • Medium priority              │ │
│             │  ├─────────────────────────────────────────────────┤ │
│             │  │ ☐ Review competitor strategies         👤 You    │ │
│             │  │   Due Oct 20 • Low priority                     │ │
│             │  └─────────────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────┘
```

### Team Members View
```
┌─────────────────────────────────────────────────────────────────────┐
│ ☰  Team Todo    [Marketing Team ▼]    🔔  👤                       │
├─────────────┬───────────────────────────────────────────────────────┤
│             │  Team Members (12)                    [Invite Member] │
│ 📊 Dashboard│                                                       │
│             │  [🔍 Search members...]                              │
│ ✓ Todos     │                                                       │
│             │  ┌─────────────────────────────────────────────────┐ │
│ 👥 Team     │  │ 👤 John Doe (You)                      Admin  ⋮ │ │
│             │  │    john@company.com • Active now               │ │
│ ⚙️ Settings │  ├─────────────────────────────────────────────────┤ │
│             │  │ 👤 Sarah Johnson                       Admin  ⋮ │ │
│             │  │    sarah@company.com • Active 2h ago           │ │
│             │  ├─────────────────────────────────────────────────┤ │
│             │  │ 👤 Mike Chen                          Member  ⋮ │ │
│             │  │    mike@company.com • Active yesterday         │ │
│             │  ├─────────────────────────────────────────────────┤ │
│             │  │ 👤 Emma Wilson                        Member  ⋮ │ │
│             │  │    emma@company.com • Active 3d ago            │ │
│             │  └─────────────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────────────┘
```

## Mobile Views

### Mobile Dashboard
```
┌─────────────────────┐
│ ☰ Marketing Team ▼  │
├─────────────────────┤
│                     │
│ Welcome back!       │
│                     │
│ ┌─────────────────┐ │
│ │ Active: 12      │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Done Today: 5   │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Overdue: 2      │ │
│ └─────────────────┘ │
│                     │
│ Recent Activity     │
│ ┌─────────────────┐ │
│ │ Sarah completed  │ │
│ │ "Update site"    │ │
│ │ 2 hours ago      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ + Quick Add Todo│ │
│ └─────────────────┘ │
├─────────────────────┤
│ 🏠  ✓  👥  ⚙️  👤  │
└─────────────────────┘
```

### Mobile Todo List
```
┌─────────────────────┐
│ ← Q4 Marketing  ⋮  │
├─────────────────────┤
│                     │
│ [+ Add Todo]        │
│                     │
│ ┌─────────────────┐ │
│ │ ☐ Social campaign│ │
│ │ 👤 Sarah • Oct 15│ │
│ │ High priority    │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ ☑ Content plan   │ │
│ │ 👤 Mike • Done   │ │
│ │ Medium priority  │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ ☐ Competitor     │ │
│ │ 👤 You • Oct 20  │ │
│ │ Low priority     │ │
│ └─────────────────┘ │
│                     │
├─────────────────────┤
│ 🏠  ✓  👥  ⚙️  👤  │
└─────────────────────┘
```

### Mobile Team Switcher
```
┌─────────────────────┐
│ ✕  Switch Team      │
├─────────────────────┤
│                     │
│ Current Team        │
│ ┌─────────────────┐ │
│ │ ✓ Marketing      │ │
│ │   Admin • 12     │ │
│ └─────────────────┘ │
│                     │
│ Other Teams         │
│ ┌─────────────────┐ │
│ │   Engineering    │ │
│ │   Member • 8     │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │   Design Team    │ │
│ │   Admin • 5      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ + Create New Team│ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```

## Data Input Drawers

### Desktop - Right Side Drawer (Todo Creation)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ☰  Team Todo    [Marketing Team ▼]    🔔  👤                       │
├─────────────┬───────────────────────────────────┬───────────────────┤
│             │  Todo Lists                       │                   │
│ 📊 Dashboard│                                   │ Create New Todo ✕ │
│             │  ┌──────────────────┐             ├───────────────────┤
│ ✓ Todos     │  │ Q4 Marketing     │             │                   │
│             │  │ 8 active, 3 done │◄────────────│ Title *           │
│ 👥 Team     │  └──────────────────┘             │ ┌───────────────┐ │
│             │                                   │ │               │ │
│ ⚙️ Settings │  ┌──────────────────┐             │ └───────────────┘ │
│             │  │ Website Redesign │             │                   │
│             │  │ 15 active        │             │ Description       │
│             │  └──────────────────┘             │ ┌───────────────┐ │
│             │                                   │ │               │ │
│             │  [Darkened Background]            │ │               │ │
│             │                                   │ └───────────────┘ │
│             │                                   │                   │
│             │                                   │ Assignee   ▼      │
│             │                                   │ Due Date   📅     │
│             │                                   │                   │
│             │                                   │ Priority          │
│             │                                   │ [Low][Med][High]  │
│             │                                   │                   │
│             │                                   ├───────────────────┤
│             │                                   │ [Cancel] [Create] │
└─────────────┴───────────────────────────────────┴───────────────────┘
```

### Mobile - Bottom Sheet Drawer
```
┌─────────────────────┐
│ ← Todo Lists        │
├─────────────────────┤
│                     │
│ [Darkened Content]  │
│                     │
│ ┌─────────────────┐ │
│ │ Q4 Marketing    │ │
│ │ 8 active        │ │
│ └─────────────────┘ │
│                     │
├─────────────────────┤
│╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱│ ← Swipe down handle
├─────────────────────┤
│ Create New Todo  ✕  │
├─────────────────────┤
│ Title *             │
│ ┌─────────────────┐ │
│ │                 │ │
│ └─────────────────┘ │
│                     │
│ Description         │
│ ┌─────────────────┐ │
│ │                 │ │
│ └─────────────────┘ │
│                     │
│ Assignee       ▼    │
│ Due Date       📅   │
│                     │
│ Priority            │
│ [Low] [Med] [High]  │
│                     │
├─────────────────────┤
│ [Cancel]   [Create] │
└─────────────────────┘
```

### Desktop - List Creation Drawer
```
┌─────────────────────────────────────────────────────────────────────┐
│ ☰  Team Todo    [Marketing Team ▼]    🔔  👤                       │
├─────────────┬───────────────────────────────────┬───────────────────┤
│             │  Todo Lists        [+ FAB clicked] │                   │
│ 📊 Dashboard│                                   │ Create List    ✕  │
│             │  [All] [Active] [Archived]        ├───────────────────┤
│ ✓ Todos     │                                   │                   │
│             │  ┌──────────────────┐             │ List Name *       │
│ 👥 Team     │  │ Q4 Marketing     │             │ ┌───────────────┐ │
│             │  │ 8 active         │             │ │               │ │
│ ⚙️ Settings │  └──────────────────┘             │ └───────────────┘ │
│             │                                   │                   │
│             │  ┌──────────────────┐             │ Description       │
│             │  │ Website Redesign │             │ ┌───────────────┐ │
│             │  │ 15 active        │             │ │               │ │
│             │  └──────────────────┘             │ └───────────────┘ │
│             │                                   │                   │
│             │  [Darkened Background]            │ Color             │
│             │                                   │ [🔴][🟡][🟢][🔵] │
│             │                                   │                   │
│             │                    [➕]            ├───────────────────┤
│             │                                   │ [Cancel] [Create] │
└─────────────┴───────────────────────────────────┴───────────────────┘
```

### Mobile - Team Invite Bottom Sheet
```
┌─────────────────────┐
│ ← Team Members      │
├─────────────────────┤
│                     │
│ [Darkened Content]  │
│                     │
├─────────────────────┤
│╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱│
├─────────────────────┤
│ Invite Member    ✕  │
├─────────────────────┤
│ Set Role            │
│ ○ Member            │
│ ● Admin             │
│                     │
│ ┌─────────────────┐ │
│ │ Generate Link   │ │
│ └─────────────────┘ │
│                     │
│ ─────────────────── │
│                     │
│ Invite Link         │
│ ┌─────────────────┐ │
│ │ app.todo/inv/123│ │
│ │              📋 │ │
│ └─────────────────┘ │
│                     │
│ Expires in 7 days   │
│                     │
├─────────────────────┤
│         [Done]      │
└─────────────────────┘
```

## Empty States

### No Todos
```
┌─────────────────────────────────────┐
│                                     │
│          📝                         │
│                                     │
│     No todos yet!                   │
│                                     │
│  Create your first todo to          │
│  get started with your team         │
│                                     │
│     [Create First Todo]             │
│                                     │
└─────────────────────────────────────┘
```

### No Team Members
```
┌─────────────────────────────────────┐
│                                     │
│          👥                         │
│                                     │
│   You're the only one here          │
│                                     │
│  Invite team members to start       │
│  collaborating on todos             │
│                                     │
│     [Invite Members]                │
│                                     │
└─────────────────────────────────────┘
```

## Legend
- ☰ = Menu/Hamburger icon
- ▼ = Dropdown indicator
- ✓ = Checkmark
- 👤 = User avatar
- 🔔 = Notifications
- ⋮ = More options menu
- ← = Back arrow
- ✕ = Close
- 📊 = Dashboard icon
- 👥 = Team icon
- ⚙️ = Settings icon
- 🚪 = Logout icon
- [Button] = Clickable button
- ┌─┐ = Container/Card borders