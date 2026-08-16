# DevTrack

**A full-stack developer productivity platform for managing projects and tasks.**

DevTrack is a production-deployed web application that lets developers organize their work through projects, tasks, and a Kanban-style board — combining a FastAPI backend, a PostgreSQL database, and a modern React frontend into a single, cohesive tool.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Docker / Docker Compose](#docker--docker-compose)
- [API Documentation](#api-documentation)
- [CI/CD](#cicd)
- [Production Deployment](#production-deployment)
- [Engineering Practices](#engineering-practices)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Live Demo

| Resource | Link |
|---|---|
| Live App | [https://devtrack-frontend-jr0v.onrender.com](https://devtrack-frontend-jr0v.onrender.com) |
| Backend API | [https://devtrack-backend-rnde.onrender.com](https://devtrack-backend-rnde.onrender.com) |
| API Docs (Swagger) | [https://devtrack-backend-rnde.onrender.com/docs](https://devtrack-backend-rnde.onrender.com/docs) |

> **Note:** The backend is hosted on Render's free tier, so the first request after a period of inactivity may take up to a minute to respond while the service spins up.

---

## Screenshots

| Login | Dashboard |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Tasks (Kanban) | Projects |
|---|---|
| ![Tasks Kanban](docs/screenshots/tasks-kanban.png) | ![Projects](docs/screenshots/projects.png) |

---

## Overview

DevTrack is built as a decoupled full-stack application: a FastAPI backend exposes a REST API backed by PostgreSQL, while a React + TypeScript single-page application consumes that API to deliver an interactive dashboard and Kanban board. Authentication is handled with JWTs, and the whole system is containerized with Docker and deployed via a GitHub Actions CI/CD pipeline to Render.

The goal of the project was to build something that reflects real engineering practices — typed code end-to-end, database migrations, automated CI, and a polished, responsive UI — rather than a minimal CRUD exercise.

---

## Features

### Authentication & Security
- User registration and login
- JWT-based authentication
- Password hashing
- Protected routes on the frontend

### Project & Task Management
- Full CRUD for projects and tasks
- Project search and status filtering
- Task search, status filtering, and priority filtering
- Kanban board with drag-and-drop task management
- Todo / In Progress / Completed workflow
- Priority management (e.g., low/medium/high)

### Dashboard
- Dashboard statistics
- Completion percentage tracking
- Recent projects overview
- Upcoming tasks view

### UI/UX
- Responsive UI across devices
- Loading skeletons
- Toast notifications
- Edit/delete confirmation dialogs
- Client-side form validation

---

## Tech Stack

### Languages
Python · JavaScript · TypeScript · SQL

### Frontend

| Technology | Purpose |
|---|---|
| React | UI library |
| TypeScript | Static typing |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side routing |
| TanStack React Query | Server-state management and caching |
| Axios | HTTP client |
| React Hook Form | Form state management |
| Zod | Schema validation |
| shadcn/ui | Accessible, composable UI components |
| Lucide React | Icon set |

### Backend

| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| SQLAlchemy | ORM |
| Alembic | Database migrations |
| JWT | Authentication tokens |
| Password hashing | Secure credential storage |

### Database
PostgreSQL

### DevOps
Docker · Docker Compose · Git · GitHub Actions · CI/CD

### Deployment
Render

---

## Architecture

DevTrack follows a decoupled client-server architecture: the React frontend communicates with the FastAPI backend exclusively through a versioned REST API, and the backend is the sole owner of the PostgreSQL database.

```
┌─────────────────────┐        REST API (HTTPS)        ┌──────────────────────┐
│   React Frontend     │ ─────────────────────────────► │   FastAPI Backend     │
│  (TypeScript, Vite)  │ ◄───────────────────────────── │  (Python, SQLAlchemy) │
└─────────────────────┘        JSON + JWT Auth          └──────────┬────────────┘
                                                                    │
                                                                    │ SQL
                                                                    ▼
                                                          ┌──────────────────────┐
                                                          │     PostgreSQL         │
                                                          │      Database          │
                                                          └──────────────────────┘
```

**Request flow:**
1. The React app sends authenticated requests (JWT in headers) to the FastAPI backend via Axios.
2. FastAPI validates the request, applies business logic, and interacts with PostgreSQL through SQLAlchemy.
3. Alembic manages schema changes as the data model evolves.
4. TanStack React Query caches and synchronizes server state on the frontend.

---

## Project Structure

```
devtrack/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── alembic/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── docs/
├── frontend/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── lib/
│       ├── pages/
│       ├── routes/
│       └── types/
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Python 3.12+
- Node.js 22+
- PostgreSQL (or use the provided Docker Compose setup)
- Git

### Clone the repository

```bash
git clone https://github.com/ranahitesh07/DevTrack.git
cd DevTrack
```

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Apply database migrations
alembic upgrade head

# Run the development server
uvicorn app.main:app --reload
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend runs on `http://localhost:5173` and the backend on `http://localhost:8000`.

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables (values below are placeholders only):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/devtrack
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> **Note:** Never commit real secrets. Use your platform's secret management (e.g., Render environment variables) in production.

---

## Docker / Docker Compose

DevTrack ships with a `docker-compose.yml` that runs the full stack — PostgreSQL, the FastAPI backend, and the React frontend — as three services.

```bash
docker compose up --build
```

| Service | Port |
|---|---|
| PostgreSQL | `5432` |
| Backend (FastAPI) | `8000` |
| Frontend (React) | `5173` |

---

## API Documentation

FastAPI automatically generates interactive API documentation:

- Swagger UI: `https://devtrack-backend-rnde.onrender.com/docs`
- ReDoc: `https://devtrack-backend-rnde.onrender.com/redoc`

In production, these are available at: **[[API Documentation URL](https://devtrack-backend-rnde.onrender.com/docs)]**

---

## CI/CD

Continuous integration is configured via GitHub Actions (`.github/workflows/ci.yml`), triggered on every push and pull request targeting `main`.

**Frontend CI**
```bash
# Node.js 22
npm ci
npm run build
```

**Backend CI**
```bash
# Python 3.12
pip install -r requirements.txt
python -m compileall app
```

**Docker CI**
```bash
docker compose build
```

This ensures that both the frontend build and backend code compile cleanly, and that Docker images build successfully, before code is merged into `main`.

---

## Production Deployment

DevTrack is deployed on **Render**, with the frontend, FastAPI backend, and PostgreSQL database each running as separate production services.

| Component | Service |
|---|---|
| Frontend | Render (Static/Web Service) |
| Backend | Render (Web Service) |
| Database | Render (PostgreSQL) |

Live URLs:
- App: [https://devtrack-frontend-jr0v.onrender.com](https://devtrack-frontend-jr0v.onrender.com)
- API: [https://devtrack-backend-rnde.onrender.com](https://devtrack-backend-rnde.onrender.com)

---

## Engineering Practices

- **Type safety** across the stack — TypeScript on the frontend, typed Python models on the backend
- **Schema validation** with Zod (frontend) and SQLAlchemy models (backend)
- **Database migrations** managed with Alembic rather than manual schema changes
- **Containerization** with Docker and Docker Compose for consistent local and production environments
- **Automated CI** validating builds on every push/PR before merge
- **Separation of concerns** between API layer, business logic, and data access
- **Secure authentication** using JWTs and hashed passwords

---

## Future Improvements

- Add automated test coverage reporting to CI
- Add production monitoring and structured logging
- Add role-based access control for team collaboration
- Add real-time updates (e.g., WebSockets) for the Kanban board
- Add pagination and infinite scroll for large project/task lists

---

## Author

**Hitesh Rana**
GitHub: [@ranahitesh07](https://github.com/ranahitesh07)
Repository: [DevTrack](https://github.com/ranahitesh07/DevTrack)
