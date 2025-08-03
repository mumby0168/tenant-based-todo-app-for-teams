# Docker Development Guide

## Overview

This project uses Docker with two distinct setups:
1. **Development** - Optimized for rapid development with hot reload
2. **Production** - Optimized for performance and security

## Development vs Production Containers

### Development Setup (`-dev` services)

The development setup uses special Dockerfile.dev files and `-dev` suffixed services:

- **api-dev**: .NET API with hot reload
- **web-dev**: React frontend with Vite hot reload
- **postgres**: Shared database
- **maildev**: Email testing interface

### Production Setup

The production setup uses optimized, multi-stage builds:

- **api**: Compiled .NET API in minimal runtime image
- **web**: Built React app served by nginx
- **postgres**: Same database (different data volume in real production)

## How Development Containers Work

### 1. Volume Mounts

Development containers mount your source code as volumes:

```yaml
api-dev:
  volumes:
    - ./src/TodoApp.Api:/app  # Source code mounted into container
    - todoapp_nuget_cache:/root/.nuget/packages  # Cache packages

web-dev:
  volumes:
    - ./src/TodoApp.Web:/app  # Source code mounted
    - /app/node_modules  # Preserve node_modules in container
```

This means:
- Changes on your host machine are immediately visible in the container
- No need to rebuild when you change code
- Dependencies stay in the container (node_modules, NuGet packages)

### 2. Hot Reload Mechanisms

#### .NET Hot Reload (api-dev)

The `Dockerfile.dev` for .NET uses:

```dockerfile
# Uses SDK image (not runtime) with development tools
FROM mcr.microsoft.com/dotnet/sdk:9.0

# File watcher for detecting changes
ENV DOTNET_USE_POLLING_FILE_WATCHER=true

# Run with dotnet watch
ENTRYPOINT ["dotnet", "watch", "run", "--no-launch-profile", "--urls", "http://0.0.0.0:5050"]
```

How it works:
1. `dotnet watch` monitors file changes in `/app` (your mounted source)
2. When you save a .cs file, it automatically:
   - Recompiles the changed code
   - Restarts the application
   - Preserves your database connections
3. Changes appear in 2-3 seconds

#### React/Vite Hot Reload (web-dev)

The `Dockerfile.dev` for React uses:

```dockerfile
# Node image with development dependencies
FROM node:20-alpine

# Vite dev server with HMR (Hot Module Replacement)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

How it works:
1. Vite dev server watches for file changes
2. When you save a .tsx/.ts file:
   - If it's a React component, it hot-swaps just that module
   - Preserves application state (form inputs, etc.)
   - Updates in milliseconds
3. For CSS changes, updates without page reload

### 3. Docker Compose Profiles

We use profiles to separate development and production:

```yaml
services:
  api:
    profiles:
      - production
  
  api-dev:
    profiles:
      - development
```

This allows:
- `docker compose --profile development up` - Starts only dev services
- `docker compose --profile production up` - Starts only prod services
- Services without profiles (postgres) run in both

## File Structure

```
├── Dockerfile           # Production: Multi-stage optimized build
├── Dockerfile.dev       # Development: Full SDK with hot reload
```

### Production Dockerfile Pattern

```dockerfile
# Build stage - compile the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage - minimal image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TodoApp.Api.dll"]
```

Benefits:
- Small image size (aspnet runtime vs SDK)
- No source code in final image
- Optimized for production
- Security hardened

### Development Dockerfile Pattern

```dockerfile
# Single stage - keeps all development tools
FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app

# Development tools available
RUN dotnet tool install --global dotnet-ef

# Source mounted as volume, not copied
# Dependencies restored on container start
ENTRYPOINT ["dotnet", "watch", "run"]
```

Benefits:
- Full SDK and tools available
- Source code changes without rebuild
- Debugging capabilities
- Development-specific environment variables

## Common Development Workflows

### Starting Development Environment

```bash
./scripts/dev-start.sh
```

This script:
1. Starts PostgreSQL and waits for it to be healthy
2. Runs database migrations
3. Starts all development services
4. Shows you the URLs

### Making Code Changes

#### Backend Changes (.NET)
1. Edit any .cs file
2. Save the file
3. Watch the docker logs: `docker compose logs -f api-dev`
4. See the recompilation happen
5. Test your changes immediately

#### Frontend Changes (React)
1. Edit any .tsx/.ts/.css file
2. Save the file
3. Browser auto-refreshes
4. Component state is preserved (in most cases)

### Adding Dependencies

#### Backend (.NET)
```bash
# Enter the container
docker exec -it todoapp-api-dev bash

# Add package
dotnet add package PackageName

# Exit container
exit

# Restart to ensure it's loaded
docker compose restart api-dev
```

#### Frontend (React)
```bash
# Add to package.json on host
cd src/TodoApp.Web
npm install package-name

# Rebuild container to include new dependency
docker compose build web-dev
docker compose up -d web-dev
```

### Database Migrations

```bash
# Run migrations
cd src/TodoApp.Api
dotnet ef database update

# Or from within container
docker exec -it todoapp-api-dev bash
dotnet ef database update
```

## Troubleshooting

### Hot Reload Not Working

#### .NET
1. Check `DOTNET_USE_POLLING_FILE_WATCHER=true` is set
2. Verify volume mount: `docker exec api-dev ls -la /app`
3. Check logs: `docker compose logs api-dev`

#### React
1. Verify Vite is running: `docker compose logs web-dev`
2. Check browser console for WebSocket errors
3. Ensure port 5180 is accessible

### Performance Issues

1. **Mac/Windows**: File watching can be slow
   - Consider using Docker Desktop's file sharing settings
   - Use .dockerignore to exclude unnecessary files

2. **Linux**: May need to increase inotify watchers
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

### Container Won't Start

1. Check ports aren't in use: `lsof -i :5050 -i :5180`
2. Clean rebuild: `docker compose build --no-cache api-dev`
3. Check logs: `docker compose logs api-dev`

## Best Practices

1. **Use profiles**: Keep development and production separate
2. **Cache dependencies**: Mount cache volumes for package managers
3. **Exclude node_modules**: Use anonymous volume to keep in container
4. **Environment variables**: Use .env files for configuration
5. **Health checks**: Ensure dependent services are ready
6. **Resource limits**: Set memory/CPU limits in production

## Quick Reference

### Development Commands
```bash
# Start everything
./scripts/dev-start.sh

# Start specific service
docker compose up -d api-dev

# View logs
docker compose logs -f api-dev

# Enter container
docker exec -it todoapp-api-dev bash

# Stop everything
./scripts/dev-stop.sh
```

### Production Commands
```bash
# Build images
./scripts/prod-build.sh

# Run production
docker compose --profile production up -d

# View production logs
docker compose logs -f api web
```

## Summary

The development setup prioritizes:
- **Fast feedback loops** with hot reload
- **Full development tools** in containers
- **Easy debugging** with source maps and logs
- **Consistent environment** across team members

While production prioritizes:
- **Small image sizes** for fast deployment
- **Security** with minimal attack surface
- **Performance** with optimized builds
- **Reproducibility** with immutable images