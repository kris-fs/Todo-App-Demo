# Todo App - Full Stack Application

A modern, full-stack todo application with Django REST Framework backend, Vue 3 frontend, and PostgreSQL database. Features both a list view and calendar view for managing todos.

**This application runs entirely in Docker containers. No local installation required.**

## Features

- ✅ **List View**: Manage todos with filtering (all, pending, completed)
- 📅 **Calendar View**: Visualize todos by date in a traditional calendar grid
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, responsive design
- 🔄 **Real-time Updates**: Instant feedback on todo operations
- 📝 **Full CRUD**: Create, read, update, and delete todos
- 🏷️ **Date Support**: Assign dates to todos for better organization
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Framework**: Django 4.2 with Django REST Framework
- **Database**: PostgreSQL 15
- **API Documentation**: drf-spectacular (Swagger UI)
- **CORS**: django-cors-headers for cross-origin requests

### Frontend
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns
- **Routing**: Vue Router 4

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15 in Docker

## Project Structure

```
/home/kris/projects/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env
│   ├── todo_backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── todos/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── migrations/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   ├── .env
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router.js
│       ├── style.css
│       ├── components/
│       │   ├── TodoForm.vue
│       │   ├── TodoItem.vue
│       │   ├── TodoList.vue
│       │   └── TodoCalendar.vue
│       ├── views/
│       │   ├── ListView.vue
│       │   └── CalendarView.vue
│       └── stores/
│           └── todoStore.js
│       └── services/
│           └── api.js
├── docker-compose.yml
├── init-db.sql
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started with Docker

### Prerequisites

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start (3 Steps)

1. **Clone the repository**
   ```bash
   git clone https://github.com/kris-fs/Todo-App-Demo.git
   cd Todo-App-Demo
   ```

2. **Start the application**
   ```bash
   docker-compose up
   ```

   The application will start and display logs. This is normal behavior. Wait for the message:
   ```
   todo_frontend | ➜  Local:   http://localhost:5173/
   ```

3. **Open in your browser**
   - **Frontend**: http://localhost:5173
   - **API**: http://localhost:8000/api
   - **API Documentation**: http://localhost:8000/api/docs

## Running the Application

### Start Services (Foreground)

```bash
docker-compose up
```

This command:
- Starts all three services (PostgreSQL, Django, Vue)
- Shows live logs from all containers
- Automatically runs database migrations
- Initializes the database on first run

**Wait 30-45 seconds for all services to be ready.** You'll see:
```
todo_frontend | ➜  Local:   http://localhost:5173/
todo_backend  | Starting development server at http://0.0.0.0:8000/
todo_db       | database system is ready to accept connections
```

### Start Services (Background)

```bash
docker-compose up -d
```

This starts services in the background. Check status with:
```bash
docker-compose ps
```

### Stop Services

```bash
# Stop services (keep data)
docker-compose stop

# Stop and remove containers (keep data)
docker-compose down

# Stop and remove everything (delete data)
docker-compose down -v
```

## Accessing the Application

### Frontend
- **URL**: http://localhost:5173
- **Features**:
  - List view with todo management
  - Calendar view with date-based organization
  - Real-time updates

### Backend API
- **Base URL**: http://localhost:8000/api
- **Documentation**: http://localhost:8000/api/docs (Swagger UI)
- **Admin Panel**: http://localhost:8000/admin

### Database
- **Host**: localhost
- **Port**: 5432
- **Database**: todo_db
- **User**: todo_user
- **Password**: todo_password

## API Endpoints

### Todos
- `GET /api/todos/` - List all todos
- `POST /api/todos/` - Create a new todo
- `GET /api/todos/{id}/` - Get a specific todo
- `PATCH /api/todos/{id}/` - Update a todo
- `DELETE /api/todos/{id}/` - Delete a todo
- `POST /api/todos/{id}/toggle_completed/` - Toggle completion status
- `GET /api/todos/by_date/?date=YYYY-MM-DD` - Get todos for a specific date

### Query Parameters
- `completed` - Filter by completion status (true/false)
- `date` - Filter by date (YYYY-MM-DD)
- `ordering` - Sort by field (created_at, date, completed)

## Common Tasks

### View Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Access Database

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U todo_user -d todo_db

# List tables
\dt

# Exit
\q
```

### Run Django Commands

```bash
# Create superuser
docker-compose exec -T backend python manage.py createsuperuser

# Run migrations
docker-compose exec -T backend python manage.py migrate

# Create migrations
docker-compose exec -T backend python manage.py makemigrations

# Django shell
docker-compose exec -T backend python manage.py shell
```

### Run Frontend Commands

```bash
# Install new npm packages
docker-compose exec -T frontend npm install <package-name>

# Build for production
docker-compose exec -T frontend npm run build
```

## Testing the Application

### Test API with curl

```bash
# Get all todos
curl http://localhost:8000/api/todos/

# Create a todo
curl -X POST http://localhost:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{"title": "My Todo", "description": "Test", "date": "2026-02-20"}'

# Get todos for a specific date
curl "http://localhost:8000/api/todos/by_date/?date=2026-02-20"
```

### Test Frontend

1. Open http://localhost:5173 in your browser
2. Create a new todo in the List View
3. Switch to Calendar View to see it on the calendar
4. Edit and delete todos to test functionality

## Environment Configuration

### Default Environment Variables

The application uses these default values (defined in docker-compose.yml):

```
POSTGRES_DB=todo_db
POSTGRES_USER=todo_user
POSTGRES_PASSWORD=todo_password
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production
VITE_API_BASE_URL=http://localhost:8000/api
```

### Custom Configuration

To use custom values, create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
POSTGRES_DB=my_database
POSTGRES_USER=my_user
POSTGRES_PASSWORD=my_password
DEBUG=False
SECRET_KEY=your-secret-key-here
```

Then start with:
```bash
docker-compose up
```

## Troubleshooting

### Services Won't Start

```bash
# Clean up and restart
docker-compose down -v
docker-compose up
```

### Database Connection Error

```bash
# Check database logs
docker-compose logs db

# Verify database is healthy
docker-compose ps
```

### Port Already in Use

If ports 5173, 8000, or 5432 are already in use:

```bash
# Change ports in docker-compose.yml
# Or kill existing processes:
lsof -i :5173  # Find process on port 5173
kill -9 <PID>  # Kill the process
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend service
docker-compose restart frontend
```

### API Not Responding

```bash
# Check backend logs
docker-compose logs backend

# Restart backend service
docker-compose restart backend
```

## Database Schema

### Todo Model
```python
- id: UUID (Primary Key)
- title: CharField (max_length=255, required)
- description: TextField (optional)
- date: DateField (optional)
- completed: BooleanField (default=False)
- created_at: DateTimeField (auto_now_add=True)
- updated_at: DateTimeField (auto_now=True)
```

## Performance Tips

1. **Use background mode for production**:
   ```bash
   docker-compose up -d
   ```

2. **Monitor resource usage**:
   ```bash
   docker stats
   ```

3. **Clean up unused resources**:
   ```bash
   docker system prune
   ```

4. **View container resource limits**:
   ```bash
   docker-compose ps
   ```

## Security Notes

⚠️ **Development Only**: The default configuration is for development. For production:

1. Change `SECRET_KEY` to a secure random value
2. Set `DEBUG=False`
3. Update `ALLOWED_HOSTS` with your domain
4. Use strong database password
5. Configure HTTPS/SSL
6. Use environment-specific settings

## Deployment

### Docker Hub

To deploy to Docker Hub:

```bash
# Build images
docker-compose build

# Tag images
docker tag projects_backend:latest yourusername/todo-backend:latest
docker tag projects_frontend:latest yourusername/todo-frontend:latest

# Push to Docker Hub
docker push yourusername/todo-backend:latest
docker push yourusername/todo-frontend:latest
```

### Cloud Deployment

For cloud deployment (AWS, GCP, Azure, Heroku):

1. Push images to container registry
2. Update docker-compose.yml with registry URLs
3. Deploy using cloud provider's container orchestration
4. Configure environment variables in cloud platform
5. Set up persistent volumes for database

## Contributing

1. Create a feature branch
2. Make your changes
3. Test in Docker
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Docker logs: `docker-compose logs`
3. Open an issue in the repository

---

**Happy Todo-ing! 📝✨**

For more information, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for detailed Docker instructions.
