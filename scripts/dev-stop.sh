#!/bin/bash
# dev-stop.sh - Stop development environment

echo "🛑 Stopping TodoApp development environment..."

# Stop all services but keep volumes
docker compose --profile development down

echo "✅ Development environment stopped"
echo ""
echo "Note: Database data is preserved in volumes"
echo "To completely reset, run: docker compose down -v"