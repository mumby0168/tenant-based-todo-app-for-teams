#!/bin/bash
# wait-for-healthy.sh - Wait for a Docker container to be healthy

set -e

CONTAINER=$1
MAX_WAIT=${2:-60}

if [ -z "$CONTAINER" ]; then
    echo "Usage: $0 <container_name> [max_wait_seconds]"
    exit 1
fi

echo "Waiting for $CONTAINER to be healthy (max ${MAX_WAIT}s)..."

WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' $CONTAINER 2>/dev/null || echo "not-found")
    
    if [ "$HEALTH_STATUS" = "healthy" ]; then
        echo "✓ $CONTAINER is healthy!"
        exit 0
    elif [ "$HEALTH_STATUS" = "not-found" ]; then
        echo "Container $CONTAINER not found. Waiting..."
    else
        echo "Container $CONTAINER status: $HEALTH_STATUS"
    fi
    
    sleep 2
    WAITED=$((WAITED + 2))
done

echo "✗ Timeout waiting for $CONTAINER to be healthy"
exit 1