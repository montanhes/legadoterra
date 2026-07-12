# Legado Terra

Monorepo: API Laravel (`backend/`) + SPA React (`frontend/`).

## Stack

**Backend** — Laravel 13, Sail (MariaDB + Redis), Sanctum (auth SPA por cookie), Pest.

**Frontend** — Vite + React 19 + TypeScript, Tailwind CSS v4, React Router, TanStack Query, Axios, React Hook Form + Zod.

## Rodando localmente

### Backend

```bash
cd backend
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
```

API sobe em `http://localhost`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

SPA sobe em `http://localhost:5173`.

> CORS e `SANCTUM_STATEFUL_DOMAINS` no backend estão fixados em `localhost:5173`. Se essa porta estiver ocupada, libere-a ou ajuste `FRONTEND_URL`/`SANCTUM_STATEFUL_DOMAINS` no `backend/.env`.

## Testes

```bash
cd backend
./vendor/bin/sail pest
```
