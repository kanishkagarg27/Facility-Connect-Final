# Docker Setup for FacilityConnect

This guide explains how to run FacilityConnect using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### Development Environment

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd facility-connect
   \`\`\`

2. **Run the setup script**
   \`\`\`bash
   chmod +x scripts/docker-setup.sh
   ./scripts/docker-setup.sh
   \`\`\`

3. **Or manually start development**
   \`\`\`bash
   npm run docker:dev
   \`\`\`

4. **Access the application**
   - Open http://localhost:3000 in your browser

### Production Environment

1. **Build and run production containers**
   \`\`\`bash
   npm run docker:prod
   \`\`\`

2. **Access the application**
   - HTTP: http://localhost
   - HTTPS: https://localhost (after SSL configuration)

## Available Commands

\`\`\`bash
# Development
npm run docker:dev          # Start development environment
npm run docker:logs         # View container logs
npm run docker:stop         # Stop all containers

# Production
npm run docker:prod         # Start production environment
npm run docker:build        # Build Docker image
npm run docker:run          # Run single container

# Direct Docker commands
docker-compose up --build   # Build and start
docker-compose down         # Stop and remove containers
docker-compose logs -f      # Follow logs
\`\`\`

## Configuration

### Environment Variables

Create a `.env.local` file for environment-specific variables:

\`\`\`env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
# Add your custom environment variables here
\`\`\`

### SSL Configuration (Production)

1. **Place SSL certificates in the `ssl/` directory:**
   \`\`\`
   ssl/
   ├── cert.pem
   └── key.pem
   \`\`\`

2. **Update `nginx.conf` with your domain name**

3. **Uncomment HTTPS server block in `nginx.conf`**

### Custom Nginx Configuration

Modify `nginx.conf` to customize:
- Domain names
- SSL settings
- Rate limiting
- Caching policies
- Security headers

## Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │  FacilityConnect│
│   (Port 80/443) │────│   (Port 3000)   │
│   Load Balancer │    │   Next.js App   │
└─────────────────┘    └─────────────────┘
\`\`\`

## Volumes and Data Persistence

- **Node modules**: Cached in Docker volume
- **Build cache**: Optimized for faster rebuilds
- **Logs**: Stored in `logs/` directory
- **SSL certificates**: Mounted from `ssl/` directory

## Troubleshooting

### Common Issues

1. **Port already in use**
   \`\`\`bash
   docker-compose down
   # Or change ports in docker-compose.yml
   \`\`\`

2. **Permission denied**
   \`\`\`bash
   sudo chown -R $USER:$USER .
   chmod +x scripts/docker-setup.sh
   \`\`\`

3. **Build failures**
   \`\`\`bash
   docker system prune -a  # Clean up Docker
   npm run docker:build    # Rebuild
   \`\`\`

### Logs and Debugging

\`\`\`bash
# View application logs
docker-compose logs facility-connect

# View nginx logs
docker-compose logs nginx

# Enter container for debugging
docker-compose exec facility-connect sh
\`\`\`

## Performance Optimization

### Production Optimizations

- **Multi-stage builds**: Reduces image size
- **Nginx caching**: Static assets cached for 1 year
- **Gzip compression**: Enabled for text files
- **Rate limiting**: API and login endpoints protected

### Development Optimizations

- **Volume mounting**: Live code reloading
- **Separate dev image**: Faster development builds
- **Hot reloading**: Enabled by default

## Security

### Security Features

- **Rate limiting**: Prevents abuse
- **Security headers**: XSS, CSRF protection
- **SSL/TLS**: HTTPS encryption
- **Non-root user**: Container runs as non-root
- **Minimal base image**: Alpine Linux for security

### Security Best Practices

1. **Keep images updated**
   \`\`\`bash
   docker-compose pull
   docker-compose up --build
   \`\`\`

2. **Use secrets for sensitive data**
   \`\`\`bash
   docker secret create db_password password.txt
   \`\`\`

3. **Regular security scans**
   \`\`\`bash
   docker scan facility-connect
   \`\`\`

## Monitoring and Logging

### Log Management

- Application logs: JSON format
- Nginx access logs: Combined format
- Error logs: Separate error streams

### Health Checks

\`\`\`bash
# Check container health
docker-compose ps

# Check application health
curl http://localhost:3000/api/health
\`\`\`

## Deployment

### CI/CD Pipeline

The included GitHub Actions workflow:
- Builds Docker images on push
- Pushes to GitHub Container Registry
- Deploys to production (configure as needed)

### Manual Deployment

\`\`\`bash
# Build for production
docker build -t facility-connect:latest .

# Tag for registry
docker tag facility-connect:latest your-registry/facility-connect:latest

# Push to registry
docker push your-registry/facility-connect:latest
\`\`\`

## Support

For issues related to Docker setup:
1. Check the logs: `npm run docker:logs`
2. Verify Docker installation: `docker --version`
3. Check available ports: `netstat -tulpn`
4. Review configuration files
