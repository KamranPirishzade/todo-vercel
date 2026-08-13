# Todo App

A todo app split into two independent projects:

- [`frontend/`](frontend) — React + TypeScript + Vite
- [`backend/`](backend) — Express + TypeScript + PostgreSQL (via Prisma), with Swagger docs

## Prerequisites

- Node.js 20+
- A PostgreSQL database (the easiest option is Docker, see below)

## 1. Start PostgreSQL

From the repo root:

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with user `todo`, password `todo`, database `todos`.

If you'd rather use an existing Postgres instance, skip this step and point `DATABASE_URL` (see below) at it instead.

## 2. Run the backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

The API runs at `http://localhost:4000`, with interactive Swagger docs at `http://localhost:4000/api-docs`.

## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and talks to the backend via `VITE_API_URL` (see `frontend/.env.development`).

## API overview

| Method | Path                      | Description                    |
| ------ | ------------------------- | ------------------------------ |
| GET    | `/api/todos`               | List todos (`?filter=all\|active\|completed`) |
| POST   | `/api/todos`               | Create a todo                  |
| PATCH  | `/api/todos/:id`           | Edit text and/or toggle completed |
| DELETE | `/api/todos/:id`           | Delete a todo                  |
| DELETE | `/api/todos/clear-completed` | Delete all completed todos   |

Full request/response schemas are in Swagger UI at `/api-docs`.
