# Branch Protection Rules

This document describes the recommended branch protection rules for this repository.

## Main Branch Protection

Apply these rules to the `main` branch:

### Required
- [x] Require a pull request before merging
  - [x] Require approvals: 1
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from CODEOWNERS
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Required status checks:
    - `Backend Tests`
    - `Frontend Tests`
    - `Build Docker Images`
    - `Security Scanning`
    - `Conventional Commits`
- [x] Require conversation resolution before merging
- [x] Require linear history
- [x] Include administrators

### Optional
- [ ] Require signed commits
- [ ] Lock branch
- [ ] Restrict who can push to matching branches

## Develop Branch Protection

Apply these rules to the `develop` branch:

### Required
- [x] Require a pull request before merging
  - [x] Require approvals: 1
  - [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
  - Required status checks:
    - `Backend Tests`
    - `Frontend Tests`
    - `Code Quality`
- [x] Require conversation resolution before merging
- [x] Include administrators

## Setting Up Branch Protection

1. Go to Settings → Branches in your GitHub repository
2. Click "Add rule"
3. Enter the branch name pattern (e.g., `main` or `develop`)
4. Configure the protection rules as listed above
5. Click "Create" or "Save changes"

## Pull Request Requirements

All pull requests should:

1. Have a descriptive title following conventional commits
2. Include a clear description of changes
3. Link to any related issues
4. Pass all CI checks
5. Have at least one approval
6. Have all conversations resolved

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semicolons, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `ci:` CI/CD changes

Example: `feat: add user authentication`