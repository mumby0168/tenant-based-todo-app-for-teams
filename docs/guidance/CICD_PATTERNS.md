# CI/CD Patterns Guide - Docker & GitHub Actions

## Overview
This guide covers containerization and CI/CD patterns for a full-stack application using Docker, Docker Compose, and GitHub Actions.

## Docker Patterns

### 1. Backend Dockerfile (.NET)
```dockerfile
# Multi-stage build for optimized image size
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["MyApp.Api.csproj", "MyApp.Api/"]
RUN dotnet restore "MyApp.Api/MyApp.Api.csproj"
COPY . "MyApp.Api/"
WORKDIR "/src/MyApp.Api"
RUN dotnet build "./MyApp.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MyApp.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyApp.Api.dll"]
```

### 2. Frontend Dockerfile (React/Vite)
```dockerfile
# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
```

### 3. Docker Compose with Profiles
```yaml
services:
  frontend:
    profiles: [frontend]
    image: myapp-frontend
    ports:
      - "8080:8080"
    build:
      context: ./src/frontend
      dockerfile: Dockerfile
    environment:
      - VITE_API_URL=http://localhost:8081

  api:
    profiles: [backend]
    image: myapp-api
    ports:
      - "8081:8080"
    build:
      context: ./src/MyApp.Api
      dockerfile: Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Host=db;Database=myapp;Username=postgres;Password=postgres
    depends_on:
      db:
        condition: service_healthy

  db:
    profiles: [backend, dependencies]
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## GitHub Actions Workflows

### 1. Unit Tests Workflow
```yaml
name: Unit Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    paths:
      - 'src/**'
      - '*.json'
      - '.github/workflows/unit-tests.yml'

jobs:
  frontend-tests:
    name: Frontend Unit Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: 'src/frontend/package-lock.json'
      
      - name: Install dependencies
        working-directory: ./src/frontend
        run: npm ci
      
      - name: Run tests with coverage
        working-directory: ./src/frontend
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./src/frontend/coverage/lcov.info
          flags: frontend

  backend-tests:
    name: Backend Unit Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      
      - name: Restore dependencies
        working-directory: ./src
        run: dotnet restore
      
      - name: Build
        working-directory: ./src
        run: dotnet build --no-restore
      
      - name: Test with coverage
        working-directory: ./src
        run: dotnet test --no-build --verbosity normal --collect:"XPlat Code Coverage"
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./src/**/coverage.cobertura.xml
          flags: backend
```

### 2. E2E Tests Workflow
```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  e2e-tests:
    name: E2E Tests (${{ matrix.browser }})
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./src/frontend
        run: npm ci
      
      - name: Install Playwright
        working-directory: ./src/frontend
        run: npx playwright install --with-deps ${{ matrix.browser }}
      
      - name: Start services
        run: |
          docker compose --profile backend --profile dependencies up -d
          ./scripts/wait-for-healthy.sh
      
      - name: Run E2E tests
        working-directory: ./src/frontend
        env:
          VITE_API_URL: http://localhost:8081
        run: npx playwright test --project=${{ matrix.browser }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.browser }}
          path: src/frontend/playwright-report/
          retention-days: 30
      
      - name: Cleanup
        if: always()
        run: docker compose down -v
```

### 3. Build and Push Workflow
```yaml
name: Build and Push

on:
  push:
    branches: [main]
    tags: ['v*']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    name: Build and Push Images
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    strategy:
      matrix:
        include:
          - context: ./src/frontend
            image: frontend
          - context: ./src/MyApp.Api
            image: api
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-${{ matrix.image }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ${{ matrix.context }}
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Nginx Configuration
```nginx
server {
    server_tokens off;
    listen 8080;
    root /usr/share/nginx/html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # API proxy (if needed)
    location /api {
        proxy_pass http://api:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Suggested Improvements

### 1. Docker Improvements
- **Multi-platform builds**: Add `--platform linux/amd64,linux/arm64`
- **Layer caching**: Optimize COPY commands order
- **Security scanning**: Add Trivy or Snyk scanning
- **Non-root user**: Ensure containers run as non-root
- **Health checks**: Add HEALTHCHECK instructions

### 2. CI/CD Improvements
- **Parallel jobs**: Run tests in parallel where possible
- **Caching**: Better dependency caching strategies
- **Security scanning**: SAST/DAST integration
- **Performance testing**: Add lighthouse CI for frontend
- **Database migrations**: Automated migration running
- **Rollback strategy**: Implement blue-green deployments

### 3. Monitoring & Observability
- **Container metrics**: Prometheus/Grafana integration
- **Log aggregation**: ELK or Loki stack
- **Distributed tracing**: OpenTelemetry integration
- **Health endpoints**: Standardized health checks

### 4. Development Experience
- **Hot reload**: Ensure dev containers support hot reload
- **Debugger support**: Configure remote debugging
- **Seed data**: Automated test data generation
- **Local HTTPS**: Self-signed certificates for dev

## Best Practices

1. **Version pinning**: Always pin base image versions
2. **Build args**: Use build arguments for flexibility
3. **Secret management**: Never hardcode secrets
4. **Image size**: Use alpine variants where possible
5. **Layer optimization**: Combine RUN commands
6. **Cache invalidation**: Order COPY commands properly
7. **Health checks**: Implement proper health endpoints
8. **Graceful shutdown**: Handle SIGTERM properly
9. **Resource limits**: Set memory/CPU limits
10. **Network isolation**: Use custom networks

## Common Pitfalls to Avoid

1. **Running as root**: Always use non-root users
2. **Latest tags**: Avoid using :latest in production
3. **Missing health checks**: Containers starting before ready
4. **Hardcoded URLs**: Use environment variables
5. **No cleanup**: Not removing build artifacts
6. **Ignoring signals**: Not handling graceful shutdown
7. **Missing timeouts**: No timeout configurations
8. **Poor caching**: Rebuilding unchanged layers
9. **No resource limits**: Containers consuming all resources
10. **Missing monitoring**: No visibility into container health