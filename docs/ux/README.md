# UX Documentation

This directory contains all UX design documentation, component guides, and wireframes.

## 📐 Documentation

### [UX Flows](./ux-flows.md)
Comprehensive user experience flows including:
- Authentication flows (signup, login, team joining)
- Main application navigation
- Team switching patterns
- Todo management interfaces
- Team administration
- Mobile responsive behaviors
- Common UI patterns (loading, empty states, errors)

### [Material-UI Component Guide](./mui-component-guide.md)
Implementation patterns and code examples:
- Theme configuration
- Authentication components
- Layout components (AppBar, Drawer)
- Data display (Lists, Cards, DataGrid)
- Form components with drawer patterns
- Responsive design patterns
- Performance optimizations
- Accessibility guidelines

### [Wireframes](./wireframes.md)
ASCII art wireframes showing:
- Authentication screens
- Desktop application layout
- Mobile views
- Data input drawers (desktop right-side, mobile bottom sheet)
- Empty states
- Team switching interface

## 🎨 Design Principles

1. **Mobile-First**: Responsive design that works on all devices
2. **Material Design**: Following Material-UI guidelines
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Fast, optimized interactions
5. **Consistency**: Unified patterns across the application

## 🔧 Key Design Decisions

### Drawer Pattern for Data Input
- **Desktop**: Right-side drawer (400px width)
- **Mobile**: Bottom sheet with swipe gestures
- Consistent header/footer structure
- Auto-focus on first input
- Backdrop to close (unless form is dirty)

### Navigation
- **Desktop**: Permanent navigation drawer
- **Mobile**: Bottom navigation + hamburger menu
- Team switcher in app header

### Component Usage
- Material-UI v5 components
- React Query for server state
- Zustand for UI state
- Drawer-based forms (not dialogs)

## 🔗 Related Documentation

- [User Stories](../stories/) - Feature requirements
- [Sprint Planning](../sprints/sprints.md) - Implementation timeline
- [System Architecture](../system-architecture.md) - Technical details