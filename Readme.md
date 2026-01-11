# VPSIE Task Manager

Full-stack task management app using Vue (Quasar), Node.js, and MySQL.

## Features

- Add, list, edit, delete tasks
- Loading states & error feedback
- JWT authentication (optional but implemented)
- MySQL via Sequelize (auto-sync models)

## Prerequisites

- Node.js 18+
- Docker Desktop (optional, for MySQL)

## Quick Start

### 1) Start MySQL (Docker)

```bash
# from repository root
docker compose up -d
```

This starts MySQL on port 3306 with database `tasks_db` and root password `example`.

### 2) Backend setup

```bash
cd backend
copy .env.example .env
# If not on PowerShell, edit .env manually
# Ensure DB_HOST, DB_USER, DB_PASS match your MySQL
npm install
npm run dev
```

Backend runs on http://localhost:4000.

### 3) Frontend setup

```bash
cd ../frontend
copy .env.example .env
# Ensure VITE_API_URL points to http://localhost:4000/api
npm install
npm run dev
```

Frontend runs on http://localhost:5173.

## API

- POST /api/auth/signup { email, password }
- POST /api/auth/login { email, password }
- GET /api/tasks (auth)
- POST /api/tasks { title, description?, status? } (auth)
- PUT /api/tasks/:id { title?, description?, status? } (auth)
- DELETE /api/tasks/:id (auth)

## Git Instructions

Initialize local repo and push to GitHub:

```bash
# from repository root
git init
git add .
git commit -m "Initial commit: Task Manager"
git branch -M main
# create a new empty repo on GitHub (via UI), then:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Notes

- Sequelize `sync()` creates tables if missing; suitable for this assignment.
- Update `JWT_SECRET` in `.env` for production.
