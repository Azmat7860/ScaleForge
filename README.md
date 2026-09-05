# ScaleForge Admin Portal

ScaleForge is a full-stack SaaS practice monorepo built to learn how real-world product apps are structured across frontend, backend, database, and background job systems.

This project combines:

- Angular frontend with standalone components, guards, interceptors, dashboards, and admin pages
- Node.js + TypeScript API with Express
- MongoDB for users, notifications, and activity tracking
- Redis + BullMQ for queue-based email workflows
- JWT authentication and role-based access control

## Project Structure

```text
apps/
  api/   -> Express + TypeScript + MongoDB + Redis + BullMQ
  web/   -> Angular standalone app

deploy/
  nginx/
package.json
tsconfig.base.json
```

## What This Project Includes

### Backend

- signup, login, forgot password, and reset password
- JWT-based auth flow
- profile management and password updates
- user management and role-based control
- admin, manager, and user roles
- notifications collection with queue status tracking
- activity logs collection
- analytics overview endpoints
- Redis cache integration
- BullMQ welcome email queue
- structured logging with Pino
- security middleware including Helmet, rate limiting, CORS, and sanitization

### Frontend

- Angular standalone architecture
- auth and role guards
- dashboard and admin UI
- notification center and activity feed
- analytics charts using ApexCharts
- typed API services
- reusable shared components

## MongoDB Setup

You already created the `scaleforge` database and `users` collection, which matches the backend config.

The backend is set to use these collections:

- `users`
- `notifications`
- `activity_logs`

You do not need to manually create `notifications` or `activity_logs`; MongoDB will create them automatically when they are first written.

## Prerequisites

Before running the project, make sure you have:

1. Node.js 20+
2. npm
3. MongoDB running locally
4. Redis running locally

## Environment Configuration

The backend environment file is:

- `apps/api/.env`

A template is provided here:

- `apps/api/.env.example`

The default local values already point to:

- MongoDB: `mongodb://127.0.0.1:27017/scaleforge`
- Redis: `redis://localhost:6379`
- API: `http://localhost:5000`
- Frontend origin: `http://localhost:4200`

If you keep these defaults, you usually only need to set a secure `JWT_SECRET` for real usage.

## Install Dependencies

From the repo root:

```bash
npm install
```

## Start MongoDB and Redis

If MongoDB is already installed locally, start it normally for your machine.

Quick Docker options:

```bash
docker run -d --name scaleforge-mongo -p 27017:27017 mongo:7
docker run -d --name scaleforge-redis -p 6379:6379 redis:7
```

## Run the Project

Open two terminals from the repo root.

### Terminal 1: API

```bash
npm run dev:api
```

This starts the API server, MongoDB connection, Redis connection, and BullMQ email worker.

### Terminal 2: Frontend

```bash
npm run dev:web
```

## Local URLs

- Frontend: `http://localhost:4200`
- API: `http://localhost:5000/api/v1`
- Health check: `http://localhost:5000/health`

## First Local Test Flow

1. Open `http://localhost:4200/signup`
2. Create the first account
3. The first account becomes `admin`
4. Continue into the dashboard
5. Check notifications, activity feed, and analytics

## Email Workflow

If `EMAIL_PROVIDER=nodemailer`, welcome emails are sent through SMTP using Nodemailer.

If `EMAIL_PROVIDER=sendgrid` and `SENDGRID_API_KEY` is valid, emails are sent through SendGrid.

Relevant strategy files:

- `apps/api/src/services/email/nodemailer.strategy.ts`
- `apps/api/src/services/email/sendgrid.strategy.ts`

## Key API Areas

- `apps/api/src/modules/auth/auth.routes.ts`
- `apps/api/src/modules/user/user.routes.ts`
- `apps/api/src/modules/user/account.routes.ts`
- `apps/api/src/modules/notification/notification.routes.ts`
- `apps/api/src/modules/activity/activity.routes.ts`
- `apps/api/src/modules/analytics/analytics.routes.ts`

## What to Test in the UI

### Auth

- signup
- login
- forgot password
- reset password

### Dashboard

- total users
- active users
- queued email count
- notifications list
- activity feed

### Profile

- update profile
- change password

### Users

- search
- role filter
- pagination
- user details

### Admin

- analytics charts
- role distribution
- daily registrations
- queue delivery stats
- role updates
- create user modal

## Security Note

The repository is configured to avoid committing secrets and generated artifacts.

Sensitive files such as:

- `.env`
- `.env.*`
- `node_modules`
- build caches
- uploads/storage folders

are ignored by Git.

## Verification Status

The project has been validated with:

- `npm run typecheck --workspace @scaleforge/api`
- `npm run lint --workspace @scaleforge/api`
- `npm run build --workspace @scaleforge/api`
- `./node_modules/.bin/tsc -p apps/web/tsconfig.app.json --noEmit`

## Best Files to Study Next

If your goal is learning architecture and end-to-end flow, review these in order:

1. `apps/api/src/app.ts`
2. `apps/api/src/server.ts`
3. `apps/api/src/modules/auth/auth.service.ts`
4. `apps/api/src/modules/notification/notification.service.ts`
5. `apps/api/src/modules/activity/activity.service.ts`
6. `apps/api/src/modules/analytics/analytics.repository.ts`
7. `apps/web/src/core/services/engagement.service.ts`
8. `apps/web/src/features/dashboard/pages/dashboard.page.ts`
9. `apps/web/src/features/admin/pages/analytics-dashboard.page.ts`

This path covers the full flow from route -> controller -> service -> repository -> database, and back into the Angular UI.
