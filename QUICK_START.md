# Quick Start Guide - Todo App (Docker Only)

Get the Todo App running in Docker in just 3 steps!

## ⚡ Quick Start (3 Steps)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kris-fs/Todo-App-Demo.git
cd Todo-App-Demo
```

### 2️⃣ Start the Application

```bash
docker-compose up
```

**Wait 30-45 seconds** for services to be ready. You'll see:
```
todo_frontend | ➜  Local:   http://localhost:5173/
todo_backend  | Starting development server at http://0.0.0.0:8000/
todo_db       | database system is ready to accept connections
```

### 3️⃣ Open in Browser

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/api/docs

## 🎯 What You Get

✅ Full-stack todo application
✅ PostgreSQL database
✅ REST API with documentation
✅ Vue 3 frontend with calendar view
✅ All running in Docker containers

## 🛑 Stop the Application

```bash
# Stop services (keep data)
docker-compose stop

# Stop and remove containers (keep data)
docker-compose down

# Stop and remove everything (delete data)
docker-compose down -v
```

## 📊 Check Service Status

```bash
docker-compose ps
```

## 📋 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## 🧪 Test the Application

### Create a Todo

1. Open http://localhost:5173
2. Enter a title in the form
3. Click "Add Todo"
4. See it appear in the list

### Switch to Calendar View

1. Click "📅 Calendar View" tab
2. See todos on their assigned dates
3. Click a date to view todos for that day

### Test the API

```bash
# Get all todos
curl http://localhost:8000/api/todos/

# Create a todo
curl -X POST http://localhost:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{"title": "My Todo", "date": "2026-02-20"}'

# View API documentation
open http://localhost:8000/api/docs
```

## 🔧 Common Commands

```bash
# Start in background
docker-compose up -d

# Restart services
docker-compose restart

# Rebuild images
docker-compose build

# Run Django commands
docker-compose exec -T backend python manage.py migrate

# Access database
docker-compose exec db psql -U todo_user -d todo_db

# Create superuser
docker-compose exec -T backend python manage.py createsuperuser
```

## ⚠️ Troubleshooting

### Services won't start
```bash
docker-compose down -v
docker-compose up
```

### Port already in use
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

### Check logs for errors
```bash
docker-compose logs backend
docker-compose logs db
```

## 📚 More Information

- **Full Documentation**: See [README.md](README.md)
- **Docker Guide**: See [DOCKER_GUIDE.md](DOCKER_GUIDE.md)
- **API Reference**: http://localhost:8000/api/docs (when running)

## 🎉 You're Ready!

The application is now running with:
- ✅ Frontend at http://localhost:5173
- ✅ API at http://localhost:8000/api
- ✅ Database at localhost:5432
- ✅ All migrations applied automatically

**Happy Todo-ing! 📝✨**
