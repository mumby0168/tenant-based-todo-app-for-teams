# Sprint 2: Todo Lists Foundation - E2E Implementation Plan

## Overview
Implement todo lists management using gradual E2E slices, following Material-UI patterns and established codebase conventions.

## Key Requirements
- **UX Pattern:** Drawer-based forms (not dialogs)
- **Responsive:** Desktop right-side drawers, mobile bottom sheets
- **Material-UI:** Consistent component usage per wireframes
- **Team Isolation:** All data filtered by current team
- **Testing:** E2E tests for each slice

---

## Implementation Slices

### **Slice 1: "View Empty Lists State"**
*Foundation slice with proper empty state*

**Goal:** User can navigate to /lists and see beautiful empty state

**Backend Tasks:**
1. Create `TodoList` entity in `Data/Models/TodoList.cs`
2. Add to `TodoAppDbContext` and create migration
3. Create GET `/api/v1/lists` endpoint in `Features/TodoLists/`
4. Add team filtering and authorization

**Frontend Tasks:**
1. Create API client (`apis/todo-lists.api.ts`)
2. Create empty state component with MUI styling
3. Create lists page with proper header and FAB
4. Add navigation in AppSidebar
5. Add route to App.tsx

**E2E Test:** Login → Navigate to lists → Verify empty state with icon and CTA

---

### **Slice 2: "Create First List"**
*Proper drawer implementation following UX patterns*

**Goal:** User can create a list via responsive drawer

**Backend Tasks:**
1. Add POST `/api/v1/lists` endpoint
2. Create DTOs (CreateTodoListRequest, TodoListResponse)
3. Add FluentValidation for list name

**Frontend Tasks:**
1. Create ResponsiveDrawer component (handles desktop/mobile)
2. Create CreateListDrawer with proper form handling
3. Create ListCard component for display
4. Add React Query mutation hook
5. Update lists page to show cards when data exists

**E2E Test:** Click FAB → Drawer opens → Fill form → Submit → See new card

---

### **Slice 3: "Multiple Lists"**
*Grid layout with responsive cards and loading states*

**Goal:** Multiple lists display correctly in responsive grid

**Backend Tasks:**
1. Add sorting by CreatedAt DESC
2. Optimize query performance

**Frontend Tasks:**
1. Implement responsive Grid layout
2. Create loading skeleton component
3. Add view toggle (grid vs list)
4. Add proper loading states

**E2E Test:** Create 3 lists → Verify responsive layout → Test view toggle

---

### **Slice 4: "Edit List"**
*Reuse drawer with edit mode*

**Goal:** User can edit list names with immediate feedback

**Backend Tasks:**
1. Add PUT `/api/v1/lists/{id}` endpoint
2. Ensure team authorization (user can only edit their team's lists)

**Frontend Tasks:**
1. Add edit menu to ListCard
2. Extend CreateListDrawer for edit mode
3. Add optimistic updates
4. Implement update mutation hook

**E2E Test:** Edit list name → Verify change persists on refresh

---

### **Slice 5: "Delete List"**
*Confirmation dialog with soft delete*

**Goal:** User can safely delete lists with confirmation

**Backend Tasks:**
1. Add soft delete (IsDeleted flag) to TodoList model
2. Add DELETE endpoint with soft delete logic
3. Update queries to filter deleted lists

**Frontend Tasks:**
1. Create confirmation dialog component
2. Add delete option to card menu
3. Implement optimistic removal with undo option
4. Add delete mutation hook

**E2E Test:** Delete list → Confirm → Verify removed permanently

---

## Technical Specifications

### Entity Model
```csharp
public class TodoList
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public Guid TeamId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    
    // Navigation properties
    public Team Team { get; set; } = null!;
}
```

### API Endpoints
```
GET    /api/v1/lists              - Get team's lists
POST   /api/v1/lists              - Create new list
PUT    /api/v1/lists/{id}         - Update list
DELETE /api/v1/lists/{id}         - Soft delete list
```

### Frontend Components Structure
```
src/
├── apis/
│   └── todo-lists.api.ts          # API client
├── components/
│   ├── common/
│   │   └── ResponsiveDrawer.tsx   # Reusable drawer
│   └── TodoLists/
│       ├── EmptyListsState.tsx    # Empty state
│       ├── CreateListDrawer.tsx   # Create/Edit form
│       ├── ListCard.tsx           # List display card
│       └── ListsSkeleton.tsx      # Loading state
├── hooks/
│   ├── queries/
│   │   └── useTodoLists.ts        # Query hook
│   └── mutations/
│       ├── useCreateTodoList.ts   # Create mutation
│       ├── useUpdateTodoList.ts   # Update mutation
│       └── useDeleteTodoList.ts   # Delete mutation
└── pages/
    └── TodoLists.tsx              # Main lists page
```

### UX Requirements
- **Empty State:** Icon + descriptive text + CTA button
- **Loading States:** Skeleton cards while loading
- **Responsive Drawers:** Right-side (desktop) / bottom sheet (mobile)
- **Confirmation Dialogs:** For destructive actions
- **Optimistic Updates:** Immediate UI feedback
- **Error Handling:** User-friendly error messages

### Performance Considerations
- React Query caching for server state
- Optimistic updates for better UX
- Proper loading states to prevent layout shift
- Memoized components where appropriate
- Debounced search (when implemented)

---

## Implementation Branch Strategy
**Branch:** `feat/SP2-001-todo-lists-foundation`

**Commit Strategy:**
- Slice 1: Multiple commits for backend + frontend + tests
- Slice 2: Multiple commits for drawer implementation
- Slice 3: Multiple commits for grid layout
- Slice 4: Multiple commits for edit functionality  
- Slice 5: Multiple commits for delete functionality

**Testing Strategy:**
- Unit tests for React Query hooks
- Integration tests for API endpoints
- E2E tests with Playwright for complete flows
- Component tests with React Testing Library

---

## Success Criteria
Each slice must be:
1. **Functional:** Core feature works end-to-end
2. **Tested:** E2E test passes
3. **Responsive:** Works on desktop and mobile
4. **Accessible:** Keyboard navigation and screen reader compatible
5. **Performant:** No unnecessary re-renders or API calls

**Definition of Done:** All 5 slices completed, tested, and ready for production deployment.