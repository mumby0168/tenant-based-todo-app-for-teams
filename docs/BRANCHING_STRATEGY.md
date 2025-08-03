# Branching Strategy

This project follows a simplified feature branch workflow with conventional branch naming.

## Branch Types

### Main Branch
- **`main`** - Production-ready code. Protected branch with required reviews.

### Feature Branches
Branch naming: `<type>/<ticket-number>-<brief-description>`

#### Types (matching conventional commits):
- **`feat/`** - New features
- **`fix/`** - Bug fixes
- **`refactor/`** - Code refactoring
- **`docs/`** - Documentation updates
- **`test/`** - Test additions/updates
- **`ci/`** - CI/CD changes
- **`perf/`** - Performance improvements
- **`style/`** - Code style changes
- **`chore/`** - Maintenance tasks

### Special Branches
- **`hotfix/`** - Emergency fixes to production

## Examples

```bash
# Feature branch
feat/SP1-001-email-verification

# Bug fix
fix/SP2-045-todo-duplication

# Refactoring
refactor/SP3-023-api-service-layer

# CI/CD update
ci/add-e2e-tests-workflow

# Documentation
docs/api-endpoint-guide
```

## Workflow

### 1. Starting New Work
```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/SP1-001-user-authentication

# Work and commit using conventional commits
git add .
git commit -m "feat(auth): add email verification service"
```

### 2. Keeping Branch Updated
```bash
# Regularly sync with main
git checkout main
git pull origin main
git checkout feat/SP1-001-user-authentication
git rebase main
```

### 3. Completing Work
```bash
# Push branch
git push origin feat/SP1-001-user-authentication

# Create Pull Request to main
gh pr create --base main --title "feat(auth): email verification flow" --body "..."
```

### 4. After PR Approval
```bash
# Squash and merge via GitHub UI or:
gh pr merge --squash --delete-branch
```

## Branch Rules

### Protected Branch - Main
- Require pull request reviews (1 minimum)
- Require status checks to pass
- Require branches to be up to date
- Include administrators in restrictions
- No force pushes

### Branch Policies
1. **Delete after merge** - Keep repository clean
2. **No long-lived branches** - Merge within 1 week
3. **Rebase over merge** - Keep linear history on feature branches
4. **Squash on merge** - Clean commit history in main

## Pull Request Process

### PR Title Format
Follow conventional commits: `<type>(<scope>): <description>`

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.logs or debug code

## Related Issues
Closes #123
```

## Git Commands Reference

### Create Branch
```bash
# From main
git checkout -b feat/SP1-001-feature-name main
```

### Rename Branch
```bash
git branch -m old-name feat/SP1-001-new-name
```

### Delete Local Branch
```bash
git branch -d feat/SP1-001-feature-name
```

### Delete Remote Branch
```bash
git push origin --delete feat/SP1-001-feature-name
```

### View All Branches
```bash
# Local and remote
git branch -a

# With last commit info
git branch -vv
```

## CI/CD Integration

All feature branches and main trigger CI workflows:
- Run tests
- Build validation
- Linting checks

## Commit Guidelines

- **Feature branches**: Regular commits with clear messages
- **Main**: Clean history with squashed commits from PRs

## Emergency Hotfix Process

```bash
# Create from main
git checkout -b hotfix/critical-bug main

# Fix and commit
git commit -m "fix(api): critical security vulnerability"

# Push and create PR to main
git push origin hotfix/critical-bug
gh pr create --base main --title "hotfix: critical security fix"
```