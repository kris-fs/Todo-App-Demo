# Todo App - Full Stack Application

A modern, full-stack todo application with Django REST Framework backend, Vue 3 frontend, and PostgreSQL database. Features both a list view and calendar view for managing todos.

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
- **Database**: PostgreSQL in Docker

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
├── .env.example
├── .gitignore
└── README.md
```

## Quick Start with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- Git

### Setup

1. **Clone the repository** (if applicable)
   ```bash
   cd /home/kris/projects
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api
   - API Documentation: http://localhost:8000/api/docs
   - Admin Panel: http://localhost:8000/admin

### Stopping Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Local Development (Without Docker)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   cp ../.env.example .env
   ```

5. **Update .env for local PostgreSQL**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   ```

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

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

## Features in Detail

### List View
- Display all todos in a list format
- Filter by status: All, Pending, Completed
- Add new todos with title, description, and optional date
- Edit existing todos
- Delete todos
- Toggle completion status with checkbox
- Shows creation date and assigned date for each todo

### Calendar View
- Month grid calendar view
- Visual indicators for dates with todos
- Click on a date to view todos for that day
- Navigate between months
- Edit todos directly from calendar view
- Shows todo count for each date

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key-here
POSTGRES_DB=todo_db
POSTGRES_USER=todo_user
POSTGRES_PASSWORD=todo_password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests (if configured)
```bash
cd frontend
npm run test
```

## Production Deployment

### Backend
1. Set `DEBUG=False` in .env
2. Generate a secure `SECRET_KEY`
3. Update `ALLOWED_HOSTS` with your domain
4. Use a production WSGI server (Gunicorn, uWSGI)
5. Set up proper database backups
6. Use environment-specific settings

### Frontend
1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to a static hosting service
3. Update `VITE_API_BASE_URL` to point to production API

### Docker Production
1. Update docker-compose.yml for production
2. Use environment-specific .env files
3. Set up proper volume management for database
4. Configure reverse proxy (Nginx)
5. Set up SSL/TLS certificates

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify DB_HOST is correct (use 'db' in Docker, 'localhost' locally)

### CORS Errors
- Check CORS_ALLOWED_ORIGINS in backend .env
- Ensure frontend URL is included
- Verify API base URL in frontend .env

### Port Already in Use
- Change ports in docker-compose.yml or local development
- Kill existing processes: `lsof -i :8000` or `lsof -i :5173`

### Frontend Not Loading
- Clear browser cache
- Check that backend is running
- Verify API base URL in .env
- Check browser console for errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue in the repository.

---

**Happy Todo-ing! 📝✨**
