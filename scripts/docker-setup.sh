#!/bin/bash

# Docker setup script for FacilityConnect

echo "🐳 Setting up Docker for FacilityConnect..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build and run development environment
echo "🔨 Building development environment..."
docker-compose -f docker-compose.dev.yml build

echo "🚀 Starting development environment..."
docker-compose -f docker-compose.dev.yml up -d

echo "✅ FacilityConnect is now running in development mode!"
echo "🌐 Access the application at: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: npm run docker:logs"
echo "  - Stop containers: npm run docker:stop"
echo "  - Production mode: npm run docker:prod"
