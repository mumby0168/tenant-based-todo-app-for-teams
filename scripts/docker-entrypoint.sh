#!/bin/bash
set -e

echo "Starting .NET API in development mode..."
echo "Working directory: $(pwd)"
echo "Files in directory:"
ls -la

# Restore packages
echo "Restoring packages..."
dotnet restore

# Run with watch
echo "Starting dotnet watch..."
exec dotnet watch run --urls http://0.0.0.0:5050