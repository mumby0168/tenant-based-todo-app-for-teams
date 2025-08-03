# Docker Setup

This directory contains Docker configuration for the TodoApp development environment.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v2

## Services

### PostgreSQL Database
- **Image**: postgres:16-alpine
- **Port**: 5440 (mapped from internal 5432)
- **Database**: todoapp_db
- **Username**: todoapp
- **Password**: todoapp_password

### MailDev (Development only)
- **Image**: maildev/maildev
- **Web UI Port**: 1090
- **SMTP Port**: 1030

## Quick Start

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Start all services:
   ```bash
   docker compose up -d
   ```

3. Start only PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```

4. Check service status:
   ```bash
   docker compose ps
   ```

5. View logs:
   ```bash
   docker compose logs -f postgres
   ```

6. Stop services:
   ```bash
   docker compose down
   ```

7. Stop and remove volumes (reset database):
   ```bash
   docker compose down -v
   ```

## Accessing Services

- **PostgreSQL**: `postgresql://todoapp:todoapp_password@localhost:5440/todoapp_db`
- **MailDev Web UI**: http://localhost:1090
- **MailDev SMTP**: `smtp://localhost:1030`

## Troubleshooting

### Port Already in Use
If you get a "port is already allocated" error, check what's using the port:
```bash
lsof -i :5440  # For PostgreSQL
lsof -i :5050  # For API
lsof -i :5180  # For Frontend
lsof -i :1090  # For MailDev Web UI
lsof -i :1030  # For MailDev SMTP
```

### Database Connection Issues
Ensure the container is healthy:
```bash
docker compose ps
docker compose exec postgres pg_isready -U todoapp
```

### Reset Database
To completely reset the database:
```bash
docker compose down -v
docker compose up -d postgres
```