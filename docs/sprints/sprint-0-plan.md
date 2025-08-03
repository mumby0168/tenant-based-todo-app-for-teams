# Sprint 0 - Foundation Setup Plan

## Overview
Sprint 0 establishes the development environment and basic project structure. We'll build incrementally, verifying each piece works before moving to the next.

## Execution Order

### Phase 1: Repository & Basic Structure ✅ COMPLETED
- Git repository initialized
- Documentation structure created
- Branching strategy defined
- GitHub repository created

### Phase 2: Backend Foundation (Current Focus)
We'll start with the backend because:
1. It's independent and can be tested immediately
2. Sets up the database early
3. Provides API for frontend to consume

**Proposed Approach:**
1. Create .NET 8 Minimal API project structure
2. Add health check endpoint ("Hello World" for backend)
3. Setup PostgreSQL with Docker
4. Configure Entity Framework Core
5. Add basic Swagger documentation
6. Create first unit test

**Branch:** `feat/SP0-002-backend-foundation`

### Phase 3: Frontend Foundation
After backend is running:
1. Create React app with Vite
2. Setup Material-UI theme
3. Create "Hello World" component
4. Add routing structure
5. Configure MSW for mocking
6. Create first component test

**Branch:** `feat/SP0-003-frontend-foundation`

### Phase 4: Docker Integration
With both apps running independently:
1. Create Dockerfiles
2. Setup docker-compose.yml
3. Configure networking
4. Add development profiles
5. Test full stack locally

**Branch:** `feat/SP0-004-docker-setup`

### Phase 5: CI/CD Pipeline
Once everything runs locally:
1. GitHub Actions for tests
2. Build workflows
3. Security scanning
4. Branch protection rules

**Branch:** `ci/SP0-005-github-actions`

## First Task Details: Backend Foundation

### What We'll Build
```
src/
└── TodoApp.Api/
    ├── TodoApp.Api.csproj
    ├── Program.cs              # Minimal API setup
    ├── appsettings.json        # Configuration
    ├── appsettings.Development.json
    └── Features/
        └── HealthCheck/
            └── HealthCheckEndpoints.cs
```

### Endpoints
- `GET /health` - Returns 200 OK with status
- `GET /swagger` - API documentation

### Verification Steps
1. `dotnet run` - API starts on http://localhost:5000
2. `curl http://localhost:5000/health` - Returns healthy status
3. Browser to `/swagger` - Shows API documentation
4. `dotnet test` - Runs and passes

### Success Criteria
- [ ] .NET 8 project created with proper structure
- [ ] Health endpoint returns JSON response
- [ ] Swagger UI accessible
- [ ] At least one unit test passing
- [ ] Can connect to PostgreSQL (docker)
- [ ] EF Core configured (even if no models yet)

## Confirmed Decisions

1. **Technology Versions**
   - ✅ .NET 9
   - PostgreSQL (latest stable in Docker)

2. **Project Naming**
   - ✅ Solution: `TodoApp.sln`
   - ✅ API project: `TodoApp.Api`

3. **Initial Features**
   - ✅ Keep it slim - just health check
   - ✅ API integration tests using ASP.NET Core TestServer

## Next Steps
Once you approve this plan, I'll:
1. Create feature branch from develop
2. Generate .NET project structure
3. Implement health check endpoint
4. Setup PostgreSQL in docker-compose
5. Create unit test
6. Make PR to develop for review

Would you like to proceed with this plan, or would you prefer to adjust the approach?