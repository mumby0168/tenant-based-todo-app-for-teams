#!/bin/bash
# prod-build.sh - Build production images

set -e

echo "🏗️  Building TodoApp production images..."

# Build production images
docker compose --profile production build

echo "✅ Production images built successfully"
echo ""
echo "To run production: docker compose --profile production up -d"