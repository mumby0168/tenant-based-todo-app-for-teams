# Claude Code Pattern Guidance

This repository contains pattern guidance extracted from a production-ready application to help Claude Code generate high-quality, consistent code.

## Contents

- **FRONTEND_PATTERNS.md** - React/TypeScript patterns with Material-UI, React Query, and Zustand
- **BACKEND_PATTERNS.md** - .NET/C# API patterns with Entity Framework Core and JWT authentication
- **CICD_PATTERNS.md** - Docker containerization and GitHub Actions CI/CD patterns
- **scripts/** - Helper scripts for development and CI/CD
- **.dockerignore** - Example Docker ignore file
- **docker-compose.override.yml** - Development environment overrides

## How to Use with Claude Code

### 1. Starting a New Project

When creating a new application with Claude Code, provide these patterns as context:

```
"I want to create a [your app description]. Please use the patterns from FRONTEND_PATTERNS.md and BACKEND_PATTERNS.md as guidance."
```

### 2. Specific Feature Implementation

For implementing specific features:

```
"Implement user authentication following the JWT pattern in BACKEND_PATTERNS.md and the auth store pattern in FRONTEND_PATTERNS.md"
```

### 3. Best Practices Reminder

When reviewing code:

```
"Please check this code against the best practices and common pitfalls mentioned in the pattern guides"
```

## Pattern Overview

### Frontend Stack
- React 18 with TypeScript
- Material-UI for components
- React Query for server state
- Zustand for UI state
- React Hook Form + Yup for forms
- Vite for build tooling

### Backend Stack
- .NET 8 with Minimal APIs
- Entity Framework Core with PostgreSQL
- JWT Authentication
- Feature-based architecture
- OpenTelemetry for observability

## Key Principles

1. **Type Safety** - Full TypeScript/C# typing throughout
2. **State Separation** - Server state (React Query) vs UI state (Zustand)
3. **Feature Organization** - Group by feature, not by file type
4. **Consistent Patterns** - Reusable patterns for common operations
5. **Error Handling** - Comprehensive error handling on both ends
6. **Testing** - Unit, integration, and E2E testing patterns

## Quick Reference

### Creating a New Feature

1. **Backend**: Create a new folder under `/Features/[FeatureName]/`
2. **Frontend**: Create hooks in `/hooks/queries/` and `/hooks/mutations/`
3. **API Integration**: Ensure DTOs match between frontend and backend
4. **Testing**: Write tests following the patterns shown

### Common Tasks

- **CRUD Operations**: See user management examples
- **Authentication**: JWT pattern with organization context
- **Forms**: Multi-step form with React Hook Form
- **State Management**: Query/mutation hooks with Zustand for UI
- **Error Handling**: Centralized error handling patterns

## Benefits

Using these patterns ensures:
- ✅ Consistent code structure
- ✅ Best practices built-in
- ✅ Avoid common pitfalls
- ✅ Production-ready architecture
- ✅ Maintainable and scalable code