# JobBoard Pro

Portal de empleos full-stack para portafolio: **Next.js** (web) + **NestJS** (API) + **PostgreSQL** + **Prisma**.

## Stack

| Capa | Tecnología |
|------|------------|
| Web | Next.js 15 (App Router), TypeScript, Tailwind |
| API | NestJS, JWT (access + refresh), Swagger |
| DB | PostgreSQL 16, Prisma 6 |
| Monorepo | pnpm workspaces |

## Features (MVP)

- Registro/login con roles `CANDIDATE` y `EMPLOYER`
- Listado público de ofertas con filtros y paginación
- Postulación con carta de presentación (1 por oferta)
- Panel candidato: mis postulaciones + estado
- Panel empresa: perfil de compañía, CRUD de ofertas, gestión de postulantes
- Swagger en `/api/docs`

## Estructura

```
jobboard-pro/
  apps/web/          # Frontend Next.js
  apps/api/          # Backend NestJS + Prisma
  packages/shared/   # Enums y labels compartidos
  docker-compose.yml # PostgreSQL
```

## Requisitos

- Node.js 20+
- pnpm 10+
- Docker Desktop

> **Nota:** Postgres del proyecto usa el puerto **5433** en el host (para no chocar con un Postgres local en 5432).

## Setup

```bash
# 1) Dependencias
pnpm install

# 2) Base de datos
docker compose up -d

# 3) Shared + migraciones + seed
pnpm --filter @jobboard/shared build
pnpm db:generate
pnpm --filter @jobboard/api exec prisma migrate dev
pnpm db:seed

# 4) Dev (API :3001 + Web :3000)
pnpm dev
```

También puedes correr por separado:

```bash
pnpm dev:api
pnpm dev:web
```

## Cuentas demo

| Rol | Email | Password |
|-----|-------|----------|
| Empresa | `empresa@demo.com` | `demo1234` |
| Candidato | `candidato@demo.com` | `demo1234` |

## URLs

- Web: http://localhost:3000
- API: http://localhost:3001/api
- Swagger: http://localhost:3001/api/docs

## Variables de entorno

Copia los ejemplos:

- `apps/api/.env.example` → `apps/api/.env`
- `apps/web/.env.example` → `apps/web/.env.local`

## Flujo demo sugerido

1. Entra como **empresa** → revisa ofertas en `/dashboard/jobs`
2. Entra como **candidato** → postúlate a una oferta en `/jobs`
3. Vuelve como empresa → abre la oferta → cambia el estado de la postulación

## API principal

- `POST /api/auth/register` `POST /api/auth/login` `POST /api/auth/refresh` `GET /api/auth/me`
- `GET /api/jobs` `GET /api/jobs/:id`
- `POST /api/jobs` `PATCH /api/jobs/:id` `DELETE /api/jobs/:id`
- `GET /api/jobs/mine` `GET /api/jobs/:id/manage`
- `PUT /api/companies/me` `GET /api/companies/me`
- `POST /api/jobs/:id/applications`
- `GET /api/applications/me`
- `GET /api/jobs/:id/applications`
- `PATCH /api/applications/:id/status`

## Licencia

UNLICENSED — proyecto de portafolio.
