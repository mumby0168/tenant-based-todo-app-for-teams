# CI/CD Pipeline Guide

## Overview

This project uses GitHub Actions for continuous integration and deployment. The pipeline ensures code quality, runs tests, performs security scanning, and automates releases.

## Workflows

### 1. CI Pipeline (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

#### Jobs:

1. **Backend Tests**
   - Sets up .NET 9 SDK
   - Runs unit and integration tests
   - Uses PostgreSQL service container
   - Uploads coverage to Codecov

2. **Frontend Tests**
   - Sets up Node.js 20
   - Runs linting, type checking, and tests
   - Executes Vitest with coverage
   - Uploads coverage to Codecov

3. **Build Docker Images**
   - Builds production Docker images
   - Uses BuildKit for optimal caching
   - Verifies images build successfully

4. **Integration Tests**
   - Starts full Docker Compose stack
   - Runs health checks
   - Placeholder for E2E tests

5. **Security Scanning**
   - Uses Trivy for vulnerability scanning
   - Scans both backend and frontend code
   - Reports findings to GitHub Security tab

### 2. PR Checks (`pr-checks.yml`)

Additional checks for pull requests:

1. **Conventional Commits**
   - Ensures commit messages follow convention
   - Helps with automated changelog generation

2. **PR Size Check**
   - Automatically labels PRs by size
   - Helps reviewers prioritize

3. **Code Quality**
   - Checks code formatting (.NET and Prettier)
   - Ensures consistent code style

4. **Dependency Review**
   - Reviews new dependencies for vulnerabilities
   - Fails on high-severity issues

### 3. Release Workflow (`release.yml`)

Triggered by version tags (e.g., `v1.0.0`):

1. **Build and Publish**
   - Builds production images
   - Pushes to GitHub Container Registry
   - Tags with version numbers

2. **Create Release**
   - Generates changelog from PRs
   - Creates GitHub release
   - Includes release notes

## Local Testing

### Running CI Checks Locally

```bash
# Backend tests
cd src
dotnet test

# Frontend tests
cd src/TodoApp.Web
npm run test:ci
npm run lint
npm run type-check

# Docker build test
docker compose --profile production build
```

### Pre-commit Checks

Consider setting up a pre-commit hook:

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run backend format check
dotnet format --verify-no-changes

# Run frontend checks
cd src/TodoApp.Web
npm run lint
npm run type-check
```

## Security Scanning

The pipeline includes multiple security layers:

1. **Dependency scanning** - Checks for vulnerable packages
2. **Container scanning** - Scans Docker images
3. **Code scanning** - Static analysis for security issues

## Coverage Requirements

- Backend: Collected but no threshold enforced yet
- Frontend: 70% coverage threshold for:
  - Branches
  - Functions
  - Lines
  - Statements

## Deployment Strategy

Currently, the pipeline builds and validates but doesn't deploy. Future enhancements:

1. **Staging deployment** - Auto-deploy PRs to preview environments
2. **Production deployment** - Deploy tagged releases
3. **Rollback capability** - Automated rollback on failures

## Monitoring CI/CD

1. **GitHub Actions tab** - View workflow runs
2. **Codecov dashboard** - Track coverage trends
3. **Security tab** - Review vulnerability reports
4. **Release page** - See deployment history

## Troubleshooting

### Common Issues

1. **Test failures**
   - Check if database migrations are applied
   - Verify test data setup
   - Review test logs in GitHub Actions

2. **Docker build failures**
   - Clear GitHub Actions cache
   - Check Dockerfile syntax
   - Verify base image availability

3. **Coverage drops**
   - New code needs tests
   - Tests might be skipped
   - Coverage configuration changed

### Debugging Workflows

```yaml
# Add debug logging to workflows
- name: Debug step
  run: |
    echo "Current directory: $(pwd)"
    echo "Files: $(ls -la)"
  env:
    ACTIONS_STEP_DEBUG: true
```

## Best Practices

1. **Keep workflows DRY** - Use composite actions for repeated steps
2. **Cache aggressively** - Cache dependencies and Docker layers
3. **Fail fast** - Run quick checks first
4. **Parallelize** - Run independent jobs concurrently
5. **Monitor costs** - GitHub Actions usage and storage

## Future Enhancements

1. **Performance testing** - Add load testing to pipeline
2. **Accessibility testing** - Automated a11y checks
3. **Visual regression** - Screenshot comparison
4. **Database migrations** - Automated migration testing
5. **Multi-environment** - Deploy to dev/staging/prod