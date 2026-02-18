# Testing Guide

## Backend Testing

### 1. Django Configuration Check
```bash
cd backend
source venv/bin/activate
python manage.py check
```
✅ **Status**: All system checks passed

### 2. Database Migrations
```bash
python manage.py migrate
```
This will create all necessary database tables.

### 3. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 4. Run Development Server
```bash
python manage.py runserver
```
- API Base: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin
- API Documentation: http://localhost:8000/api/docs

### 5. Test API Endpoints

#### Create a Todo
```bash
curl -X POST http://localhost:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Todo",
    "description": "This is a test",
    "date": "2024-02-20"
  }'
```

#### Get All Todos
```bash
curl http://localhost:8000/api/todos/
```

#### Get Todos by Date
```bash
curl "http://localhost:8000/api/todos/by_date/?date=2024-02-20"
```

#### Update a Todo
```bash
curl -X PATCH http://localhost:8000/api/todos/{id}/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "completed": true
  }'
```

#### Toggle Completion
```bash
curl -X POST http://localhost:8000/api/todos/{id}/toggle_completed/
```

#### Delete a Todo
```bash
curl -X DELETE http://localhost:8000/api/todos/{id}/
```

## Frontend Testing

### 1. Development Server
```bash
cd frontend
npm run dev
```
✅ **Status**: Dev server starts successfully on http://localhost:5173

### 2. Manual Testing Checklist

#### List View
- [ ] Page loads without errors
- [ ] Todos display in list format
- [ ] Can add new todo with title
- [ ] Can add todo with description
- [ ] Can add todo with date
- [ ] Can toggle completion status
- [ ] Can edit existing todo
- [ ] Can delete todo
- [ ] Filter buttons work (All, Pending, Completed)
- [ ] Todo counts update correctly

#### Calendar View
- [ ] Calendar displays current month
- [ ] Can navigate to previous month
- [ ] Can navigate to next month
- [ ] Dates with todos show indicator
- [ ] Can click date to view todos
- [ ] Can edit todos from calendar view
- [ ] Can delete todos from calendar view
- [ ] Month/year displays correctly

#### General
- [ ] Navigation between views works
- [ ] No console errors
- [ ] Responsive design works on mobile
- [ ] API calls complete successfully
- [ ] Error messages display properly

## Docker Testing

### 1. Start All Services
```bash
docker-compose up -d
```

### 2. Check Service Status
```bash
docker-compose ps
```

### 3. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### 4. Access Services
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- API Docs: http://localhost:8000/api/docs
- Database: localhost:5432

### 5. Run Migrations in Docker
```bash
docker-compose exec backend python manage.py migrate
```

### 6. Create Superuser in Docker
```bash
docker-compose exec backend python manage.py createsuperuser
```

### 7. Stop Services
```bash
docker-compose down
```

## Integration Testing

### Test Scenario 1: Create and View Todo
1. Open http://localhost:5173
2. Enter title "Buy groceries"
3. Click "Add Todo"
4. Verify todo appears in list
5. Verify API was called (check Network tab)

### Test Scenario 2: Todo with Date
1. Add todo with title "Team meeting"
2. Set date to tomorrow
3. Switch to Calendar view
4. Verify todo appears on correct date
5. Click date to view todo details

### Test Scenario 3: Edit Todo
1. Click "Edit" on a todo
2. Change title and description
3. Click "Save"
4. Verify changes appear in list
5. Verify changes persist on page refresh

### Test Scenario 4: Complete Todo
1. Click checkbox on a todo
2. Verify todo appears completed (strikethrough)
3. Switch to "Completed" filter
4. Verify todo appears in completed list
5. Click checkbox again to uncomplete

### Test Scenario 5: Delete Todo
1. Click "Delete" on a todo
2. Confirm deletion
3. Verify todo is removed from list
4. Verify todo count decreases

## Performance Testing

### Backend
- Response time for list todos: < 200ms
- Response time for create todo: < 200ms
- Database query optimization with select_related/prefetch_related

### Frontend
- Initial page load: < 2s
- API response handling: < 500ms
- Calendar rendering: < 1s

## Browser Compatibility

Tested on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Known Issues

None currently identified.

## Future Testing

- Unit tests for Vue components
- Unit tests for Django models and serializers
- E2E tests with Cypress or Playwright
- Load testing with Apache JMeter
- Security testing (OWASP Top 10)

---

**Last Updated**: 2024-02-18
