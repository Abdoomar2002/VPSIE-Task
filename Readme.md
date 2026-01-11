# VPSIE Task Manager

A full-stack task management application with user authentication, built with Vue 3 (Quasar), Node.js, and MySQL.

## Features

- ✅ User authentication with JWT tokens
- ✅ Create, read, update, delete tasks
- ✅ Task archiving system
- ✅ Real-time navbar updates after login
- ✅ Dark mode support
- ✅ Docker containerization with health checks
- ✅ Responsive UI with Quasar components
- ✅ Database auto-sync with Sequelize

## Tech Stack

- **Frontend**: Vue 3, Quasar, Vite
- **Backend**: Node.js, Express
- **Database**: MySQL 8.0
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 20+ (for local development)
- Docker Desktop (for containerized deployment)
- Git

## Quick Start with Docker (Recommended)

### 1) Start All Services

```bash
# from repository root
docker compose up -d --build
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **MySQL**: localhost:3310

All services are configured to communicate on the internal `task-network`.

### 2) Access the Application

Open http://localhost:5173 in your browser and sign up or log in.

## Local Development

### 1) Start MySQL with Docker

```bash
docker compose up -d mysql
```

MySQL runs on `localhost:3310` with:
- Root password: `example`
- Database: `tasks_db`

### 2) Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:4000.

### 3) Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173.

## API Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

### Tasks (All require Authorization header: `Bearer <token>`)
- `GET /api/tasks` - Get all active tasks
- `GET /api/tasks/archive` - Get archived tasks
- `POST /api/tasks` - Create new task
  ```json
  {
    "title": "Task title",
    "description": "Optional description",
    "status": "pending"
  }
  ```
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Environment Configuration

### Backend (.env)
```
DB_HOST=mysql
DB_USER=root
DB_PASS=example
DB_NAME=tasks_db
DB_PORT=3306
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=http://backend:4000/api
```

## Docker Services

### Health Checks
- **MySQL**: Checks connectivity every 10s
- **Frontend**: Checks HTTP connectivity every 30s
- **Backend**: Depends on MySQL health

### Container Names
- `task-manager-frontend`
- `task-manager-backend`
- `task-manager-mysql`

### Volumes
- `mysql_data`: Persists MySQL data between restarts

## Recent Fixes

### Navbar Not Loading After Login (Fixed)
- Issue: The navbar wasn't displaying immediately after successful login
- Solution: Added reactive token updates in App.vue that listen to storage changes and router navigation events
- The navbar now appears instantly after login without requiring a page reload

### Docker Updates (v3.9)
- Upgraded Node.js from 18 to 20-alpine (LTS)
- Changed npm install to npm ci for better reproducibility
- Added health checks for all services
- Configured proper service dependencies
- Added container names and custom network for better isolation

## Development Notes

- Sequelize auto-syncs models on startup (suitable for development)
- For production, consider implementing proper database migrations
- Update `JWT_SECRET` in backend `.env` with a strong, random value
- CORS is configured to accept requests from the frontend

## Troubleshooting

### Containers won't start
```bash
docker compose down
docker compose up -d --build
```

### Port already in use
- Frontend: 5173
- Backend: 4000
- MySQL: 3310

### Database connection issues
```bash
docker compose logs mysql
docker compose logs backend
```

## Git Workflow

```bash
git add .
git commit -m "Describe changes"
git push
```


