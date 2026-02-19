# Docker Guide - Todo App

This guide provides comprehensive instructions for running the Todo App using Docker and Docker Compose.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Understanding Docker Compose](#understanding-docker-compose)
4. [Running the Application](#running-the-application)
5. [Managing Services](#managing-services)
6. [Accessing Services](#accessing-services)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)
9. [Docker Best Practices](#docker-best-practices)

## Prerequisites

### Required Software

- **Docker**: Version 20.10 or higher
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Compose)
  - Or [Install Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

- **Git**: For cloning the repository

### System Requirements

- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: Minimum 2GB free space
- **CPU**: 2 cores minimum

### Verify Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version

# Verify Docker is running
docker ps
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/kris-fs/Todo-App-Demo.git
cd Todo-App-Demo
```

### 2. Start the Application

```bash
docker-compose up
```

**Important**: The command will display logs from all containers. This is normal. Wait for approximately 30-45 seconds for all services to be ready.

### 3. Access the Application

Once you see the message:
```
todo_frontend | ➜  Local:   http://localhost:5173/
```

Open your browser and visit:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000/api
- **API Docs**: http://localhost:8000/api/docs

## Understanding Docker Compose

### What is Docker Compose?

Docker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML file (`docker-compose.yml`) to configure application services.

### Project Services

The Todo App consists of three services:

1. **PostgreSQL Database** (`todo_db`)
   - Image: `postgres:15`
   - Port: 5432
   - Stores all application data

2. **Django Backend** (`todo_backend`)
   - Built from `backend/Dockerfile`
   - Port: 8000
   - Provides REST API

3. **Vue Frontend** (`todo_frontend`)
   - Built from `frontend/Dockerfile`
   - Port: 5173
   - Provides web interface

### Docker Compose File Structure

```yaml
version: '3.8'                    # Docker Compose version

services:                         # Define services
  db:                            # Database service
    image: postgres:15           # Use official PostgreSQL image
    environment:                 # Environment variables
      POSTGRES_DB: todo_db
      POSTGRES_USER: todo_user
      POSTGRES_PASSWORD: todo_password
    volumes:                     # Persistent storage
      - postgres_data:/var/lib/postgresql/data
    ports:                       # Port mapping
      - "5432:5432"
    healthcheck:                 # Health check
      test: ["CMD-SHELL", "pg_isready -U todo_user -d todo_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:                    # Network configuration
      - todo_network

  backend:                       # Django backend service
    build:                       # Build from Dockerfile
      context: ./backend
      dockerfile: Dockerfile
    environment:                 # Environment variables
      DEBUG: True
      POSTGRES_DB: todo_db
      POSTGRES_USER: todo_user
      POSTGRES_PASSWORD: todo_password
      DB_HOST: db               # Service name (DNS resolution)
      DB_PORT: 5432
    volumes:
      - ./backend:/app          # Mount source code
    ports:
      - "8000:8000"
    depends_on:                 # Wait for database
      db:
        condition: service_healthy
    networks:
      - todo_network
    restart: on-failure         # Auto-restart on failure

  frontend:                     # Vue frontend service
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      VITE_API_BASE_URL: http://localhost:8000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    depends_on:
      - backend
    networks:
      - todo_network

volumes:                        # Define volumes
  postgres_data:               # Named volume for database

networks:                       # Define networks
  todo_network:                # Custom network for service communication
    driver: bridge
```

## Running the Application

### Start in Foreground (Development)

```bash
docker-compose up
```

**Behavior**:
- Starts all services
- Shows live logs from all containers
- Automatically runs database migrations
- Press `Ctrl+C` to stop (gracefully shuts down services)

**When to use**: Development, debugging, testing

### Start in Background (Production)

```bash
docker-compose up -d
```

**Behavior**:
- Starts all services in background
- Returns immediately to terminal
- Services continue running

**When to use**: Production, long-running deployments

### Check Service Status

```bash
docker-compose ps
```

Output example:
```
NAME                COMMAND                  STATE                PORTS
todo_backend        sh -c python manage...   Up                   0.0.0.0:8000->8000/tcp
todo_db             docker-entrypoint.sh     Up (healthy)         0.0.0.0:5432->5432/tcp
todo_frontend       docker-entrypoint.sh     Up                   0.0.0.0:5173->5173/tcp
```

### Stop Services

```bash
# Stop services (keep containers and data)
docker-compose stop

# Stop and remove containers (keep data)
docker-compose down

# Stop and remove everything (delete data)
docker-compose down -v
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Managing Services

### View Logs

```bash
# View all service logs (live)
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# View last 100 lines
docker-compose logs --tail=100

# View logs with timestamps
docker-compose logs -f --timestamps
```

### Execute Commands in Containers

```bash
# Run command in backend container
docker-compose exec -T backend python manage.py migrate

# Run command in frontend container
docker-compose exec -T frontend npm list

# Run command in database container
docker-compose exec db psql -U todo_user -d todo_db -c "SELECT * FROM todos_todo;"

# Interactive shell in backend
docker-compose exec backend bash

# Interactive shell in database
docker-compose exec db psql -U todo_user -d todo_db
```

### Rebuild Services

```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache

# Rebuild and start
docker-compose up --build
```

## Accessing Services

### Frontend Application

- **URL**: http://localhost:5173
- **Features**:
  - List view for managing todos
  - Calendar view for date-based organization
  - Real-time updates

### Backend API

- **Base URL**: http://localhost:8000/api
- **Documentation**: http://localhost:8000/api/docs (Swagger UI)
- **Admin Panel**: http://localhost:8000/admin

### Database

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U todo_user -d todo_db

# Common commands:
\dt                    # List tables
\d todos_todo         # Describe table
SELECT * FROM todos_todo;  # Query todos
\q                    # Exit
```

## Common Tasks

### Create Django Superuser

```bash
docker-compose exec -T backend python manage.py createsuperuser
```

Then access admin at: http://localhost:8000/admin

### Run Database Migrations

```bash
# Apply migrations
docker-compose exec -T backend python manage.py migrate

# Create new migrations
docker-compose exec -T backend python manage.py makemigrations

# Show migration status
docker-compose exec -T backend python manage.py showmigrations
```

### Install Frontend Dependencies

```bash
docker-compose exec -T frontend npm install <package-name>
```

### Build Frontend for Production

```bash
docker-compose exec -T frontend npm run build
```

### Access Django Shell

```bash
docker-compose exec -T backend python manage.py shell
```

### View Database Statistics

```bash
# Check container resource usage
docker stats

# Check specific container
docker stats todo_db
```

### Clean Up Docker Resources

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune
```

## Troubleshooting

### Services Won't Start

**Problem**: Services fail to start or crash immediately

**Solution**:
```bash
# Clean up and restart
docker-compose down -v
docker-compose up
```

### Database Connection Error

**Problem**: Backend can't connect to database

**Solution**:
```bash
# Check database logs
docker-compose logs db

# Verify database is healthy
docker-compose ps

# Check database is accepting connections
docker-compose exec db pg_isready -U todo_user -d todo_db
```

### Port Already in Use

**Problem**: Port 5173, 8000, or 5432 is already in use

**Solution**:
```bash
# Find process using port
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or change ports in docker-compose.yml
# Then restart
docker-compose down
docker-compose up
```

### Frontend Not Loading

**Problem**: Frontend page shows error or blank

**Solution**:
```bash
# Check frontend logs
docker-compose logs frontend

# Verify frontend is running
docker-compose ps

# Restart frontend
docker-compose restart frontend

# Check browser console for errors (F12)
```

### API Not Responding

**Problem**: API returns 500 error or no response

**Solution**:
```bash
# Check backend logs
docker-compose logs backend

# Verify backend is running
docker-compose ps

# Check database connection
docker-compose logs db

# Restart backend
docker-compose restart backend
```

### Migrations Not Applied

**Problem**: Database tables don't exist

**Solution**:
```bash
# Check migration status
docker-compose exec -T backend python manage.py showmigrations

# Apply migrations manually
docker-compose exec -T backend python manage.py migrate

# Check logs
docker-compose logs backend
```

### Out of Disk Space

**Problem**: Docker runs out of disk space

**Solution**:
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused containers
docker container prune

# Check disk usage
docker system df
```

### Memory Issues

**Problem**: Services crash due to memory limits

**Solution**:
```bash
# Check resource usage
docker stats

# Increase Docker memory limit (Docker Desktop settings)
# Or use resource limits in docker-compose.yml:
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## Docker Best Practices

### 1. Use Specific Image Versions

```yaml
# Good
image: postgres:15

# Avoid
image: postgres:latest
```

### 2. Use Named Volumes for Persistent Data

```yaml
volumes:
  postgres_data:
    driver: local
```

### 3. Set Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

### 4. Use Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/api/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### 5. Use Environment Variables

```yaml
environment:
  DEBUG: ${DEBUG:-False}
  SECRET_KEY: ${SECRET_KEY:-change-me}
```

### 6. Mount Source Code for Development

```yaml
volumes:
  - ./backend:/app  # Hot reload on file changes
```

### 7. Use .dockerignore

Create `.dockerignore` to exclude files from Docker build:
```
__pycache__
*.pyc
.git
.env
node_modules
```

### 8. Keep Images Small

- Use slim base images: `python:3.11-slim`
- Remove build dependencies after installation
- Use multi-stage builds for production

### 9. Security Best Practices

- Don't run containers as root
- Use read-only filesystems where possible
- Scan images for vulnerabilities
- Keep images updated

### 10. Logging

```bash
# View logs with timestamps
docker-compose logs -f --timestamps

# Save logs to file
docker-compose logs > app.log

# View specific time range
docker-compose logs --since 2026-02-18T09:00:00
```

## Performance Optimization

### 1. Use BuildKit for Faster Builds

```bash
DOCKER_BUILDKIT=1 docker-compose build
```

### 2. Cache Dependencies

```dockerfile
# Copy requirements first (cached)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy code (invalidates cache on changes)
COPY . .
```

### 3. Use .dockerignore

Exclude unnecessary files from build context

### 4. Parallel Service Startup

Services start in parallel by default. Use `depends_on` to control startup order.

### 5. Monitor Resource Usage

```bash
# Real-time resource monitoring
docker stats

# Historical data
docker stats --no-stream
```

## Advanced Topics

### Custom Networks

Services communicate via service names on the custom network:
```yaml
services:
  backend:
    networks:
      - todo_network
```

Backend can reach database as: `db:5432`

### Volume Types

- **Named volumes**: Managed by Docker
- **Bind mounts**: Mount host directories
- **tmpfs**: In-memory storage

### Environment Variables

```bash
# From .env file
docker-compose --env-file .env.production up

# From command line
DEBUG=False docker-compose up
```

### Compose Overrides

Create `docker-compose.override.yml` for local development overrides:
```yaml
services:
  backend:
    environment:
      DEBUG: True
```

## Getting Help

### Docker Documentation

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Debugging

```bash
# Inspect container
docker inspect todo_backend

# View container processes
docker top todo_backend

# Check network
docker network inspect projects_todo_network
```

---

**For more information, see [README.md](README.md)**
