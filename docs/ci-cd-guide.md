# CI/CD Pipeline Guide

## Overview

This project uses a simplified GitHub Actions workflow for continuous integration. The pipeline focuses on running tests and linting to ensure code quality.

## CI Pipeline (`ci.yml`)

Runs on every push and pull request to the `main` branch.

### Jobs:

1. **Backend Tests**
   - Sets up .NET 9 SDK
   - Runs unit and integration tests
   - Uses PostgreSQL service container for database tests
   - Ensures all backend tests pass

2. **Frontend Tests and Linting**
   - Sets up Node.js 20
   - Runs ESLint for code quality
   - Runs TypeScript type checking
   - Executes Vitest test suite

## Running CI Checks Locally

Before pushing code, you can run the same checks locally:

### Backend
```bash
cd src
dotnet restore
dotnet build --configuration Release
dotnet test --configuration Release
```

### Frontend
```bash
cd src/TodoApp.Web
npm install
npm run lint
npm run type-check
npm run test:ci
```

## Troubleshooting

### Common Issues

1. **Linting failures**
   - Run `npm run lint` locally to see issues
   - The ESLint config is in `eslint.config.js`
   - Fix TypeScript type errors shown by the linter

2. **Test failures**
   - Check if database migrations are needed
   - Ensure test setup is correct
   - Review test output for specific failures

3. **Type check failures**
   - Run `npm run type-check` to see TypeScript errors
   - Fix any type mismatches or missing types

## Next Steps

As the project grows, consider adding:
- Code coverage reporting
- Docker image building
- Security scanning
- Automated deployments