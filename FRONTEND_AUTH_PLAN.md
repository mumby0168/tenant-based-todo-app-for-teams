# Frontend Authentication Implementation Plan

## Overview
Align frontend authentication with the backend implementation, following the same patterns and conventions.

## Phase 1: Update Types and API Client (Test checkpoint 1)
1. **Update auth types to match backend DTOs**
   - Fix RequestCodeRequest/Response
   - Fix VerifyCodeRequest/Response  
   - Fix CompleteRegistrationRequest/Response
   - Update role from "Owner" to "Admin"
   - Add proper error types

2. **Update API endpoints and error handling**
   - Update endpoints to match backend routes
   - Implement proper error handling for validation errors
   - Add rate limiting error handling

## Phase 2: Refactor Auth Store (Test checkpoint 2)
1. **Update auth store for new flow**
   - Add verification state management
   - Store email during verification process
   - Handle new user vs existing user flows
   - Fix JWT token parsing for team claims

2. **Add auth constants**
   - Mirror backend constants where applicable
   - Add UI-specific constants (timeouts, retry limits)

## Phase 3: Update Components (Test checkpoint 3)
1. **Login Component**
   - Single email input form
   - Show loading/success states
   - Handle rate limiting errors

2. **Verify Code Component**
   - 6-digit code input with auto-focus
   - Resend code functionality with cooldown
   - Show countdown timer for expiration
   - Different flows for new vs existing users

3. **Complete Registration Component**
   - Display name and team name inputs
   - Form validation matching backend rules
   - Success transition to dashboard

## Phase 4: Navigation and Guards (Test checkpoint 4)
1. **Update routing**
   - Protect routes based on auth state
   - Handle verification flow navigation
   - Redirect logic for authenticated users

2. **Update Protected Route component**
   - Check JWT expiration
   - Handle token refresh (future feature)

## Phase 5: Error Handling and UX (Test checkpoint 5)
1. **Implement proper error displays**
   - Toast notifications for errors
   - Field-level validation errors
   - Network error handling

2. **Add loading states**
   - Button loading states
   - Page transitions
   - Skeleton loaders

## Test Checkpoints:
1. After Phase 1: Test API calls match backend expectations
2. After Phase 2: Test state management flows correctly
3. After Phase 3: Test component interactions and validations
4. After Phase 4: Test navigation flows and guards
5. After Phase 5: Full E2E test of authentication flow

## Success Criteria:
- All API calls match backend endpoints and DTOs
- Proper error handling for all edge cases
- Smooth UX with loading states and transitions
- Code follows existing patterns in the codebase
- All tests pass