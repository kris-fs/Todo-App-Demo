# Quick Start Guide - Todo App

## 🚀 Start in 30 Seconds (Docker)

```bash
cd /home/kris/projects
cp .env.example .env
docker-compose up -d
```

Then open:
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/api/docs

## 🛑 Stop Services

```bash
docker-compose down
```

## 📊 Check Status

```bash
docker-compose ps
docker-compose logs -f
```

## 💻 Local Development (Without Docker)

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Test the App

### Create a Todo
1. Open http://localhost:5173
2. Enter title: "Buy groceries"
3. Click "Add Todo"

### View in Calendar
1. Click "📅 Calendar View"
2. See todo on today's date
3. Click date to view details

### Edit a Todo
1. Click "Edit" button
2. Change title or date
3. Click "Save"

### Delete a Todo
1. Click "Delete" button
2. Confirm deletion

## 📚 Documentation

- **README.md** - Full setup and features guide
- **TESTING.md** - Testing procedures and scenarios
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **VERIFICATION_CHECKLIST.md** - All items verified

## 🔗 API Endpoints

```
GET    /api/todos/                    - List all todos
POST   /api/todos/                    - Create todo
GET    /api/todos/{id}/               - Get single todo
PATCH  /api/todos/{id}/               - Update todo
DELETE /api/todos/{id}/               - Delete todo
POST   /api/todos/{id}/toggle_completed/ - Toggle status
GET    /api/todos/by_date/?date=YYYY-MM-DD - Get by date
```

## 🔧 Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
POSTGRES_DB=todo_db
POSTGRES_USER=todo_user
POSTGRES_PASSWORD=todo_password
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps db

# Restart database
docker-compose restart db
```

### Frontend Not Loading
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📱 Features at a Glance

| Feature | List View | Calendar View |
|---------|-----------|---------------|
| View Todos | ✅ | ✅ |
| Add Todo | ✅ | ❌ |
| Edit Todo | ✅ | ✅ |
| Delete Todo | ✅ | ✅ |
| Toggle Status | ✅ | ✅ |
| Filter by Status | ✅ | ❌ |
| View by Date | ❌ | ✅ |
| Navigate Months | ❌ | ✅ |

## 🎯 Next Steps

1. **Explore the Code**
   - Backend: `/home/kris/projects/backend/todos/`
   - Frontend: `/home/kris/projects/frontend/src/`

2. **Make Changes**
   - Edit files and see hot reload
   - Backend: Restart server
   - Frontend: Auto-reload

3. **Deploy**
   - See README.md for production setup
   - Use Docker Compose for easy deployment

## 📞 Support

- Check TESTING.md for test scenarios
- Check README.md for detailed documentation
- Check IMPLEMENTATION_SUMMARY.md for architecture

---

**Happy Todo-ing! 📝✨**
