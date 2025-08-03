#!/bin/bash
# dev-start.sh - Start development environment

set -e

echo "🚀 Starting TodoApp development environment..."

# Start postgres and wait for it to be healthy
echo "📦 Starting PostgreSQL..."
docker compose up -d postgres
./scripts/wait-for-healthy.sh todoapp-postgres

# Run migrations
echo "🔧 Running database migrations..."
cd src/TodoApp.Api
dotnet ef database update
cd ../..

# Start development services
echo "🔥 Starting development services..."
docker compose --profile development up -d

echo "✅ Development environment started!"
echo ""
echo "Services available at:"
echo "  - Frontend:  http://localhost:5180"
echo "  - API:       http://localhost:5050"
echo "  - API Docs:  http://localhost:5050/swagger"
echo "  - MailDev:   http://localhost:1090"
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop:      ./scripts/dev-stop.sh"