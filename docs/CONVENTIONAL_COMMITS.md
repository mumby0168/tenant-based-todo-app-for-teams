# Conventional Commits Guide

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

## Scope

The scope should be the area of the codebase affected:

- **auth**: Authentication related changes
- **todos**: Todo management features
- **teams**: Team management features
- **api**: Backend API changes
- **ui**: Frontend UI changes
- **db**: Database changes
- **deps**: Dependency updates

## Examples

### Feature
```
feat(auth): add email verification flow

Implement passwordless authentication using email verification codes.
Codes expire after 15 minutes and are rate limited to 3 attempts per hour.

Closes #123
```

### Bug Fix
```
fix(todos): prevent duplicate todo creation on double-click

Add loading state to submit button and disable during API call
to prevent users from accidentally creating duplicate todos.
```

### Breaking Change
```
feat(api): change team membership endpoint response format

BREAKING CHANGE: The /api/v1/teams endpoint now returns
a nested structure with role information included.

Old format: { teams: [...] }
New format: { teams: [{ team: {...}, role: "Admin" }] }
```

### Documentation
```
docs(sprints): add sprint planning and definition of done

Create comprehensive sprint documentation including user stories,
testing requirements, and clear completion criteria.
```

## Commit Message Rules

1. **Subject line** (first line):
   - Use imperative mood ("add" not "added" or "adds")
   - Don't capitalize first letter
   - No period at the end
   - Maximum 50 characters

2. **Body** (optional):
   - Separate from subject with blank line
   - Wrap at 72 characters
   - Explain what and why, not how
   - Can use bullet points

3. **Footer** (optional):
   - Reference issues (e.g., "Fixes #123")
   - Note breaking changes
   - Co-authored-by for pair programming

## Git Hooks

Consider using tools like:
- **commitizen**: Interactive CLI for creating commits
- **commitlint**: Lint commit messages
- **husky**: Git hooks made easy

## Why Conventional Commits?

1. **Automated versioning**: Tools can determine version bumps
2. **Automated changelog**: Generate CHANGELOG.md automatically
3. **Better readability**: Consistent format makes history cleaner
4. **Easier navigation**: Filter commits by type
5. **CI/CD integration**: Trigger different workflows based on commit type

## Quick Reference

```bash
# Feature
git commit -m "feat(todos): add bulk delete functionality"

# Bug fix
git commit -m "fix(auth): correct token expiry calculation"

# Docs
git commit -m "docs: update API documentation"

# Breaking change (note the ! after type)
git commit -m "feat(api)!: restructure authentication endpoints"

# With scope and body
git commit -m "refactor(ui): reorganize component folder structure

Move all shared components to a common directory and update
imports throughout the application for better maintainability."
```