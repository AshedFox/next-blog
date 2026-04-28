# Memora Blog

<img alt="home_page" src="https://github.com/user-attachments/assets/9c22f5dd-2b60-4830-856c-c028a88fbe5f" />

Blog web app with rich-text articles, moderation workflows, comments, voting and user lists.

## Features

### User flows

- Sign up, login, logout, JWT access token with authomated rotations with refresh token.
- Public article catalog and article details pages.
- Create and edit article drafts.
- User profile with tabs for articles, comments, and lists.
- Article comments (including replies).
- Upvotes/downvotes for articles and comments.
- Custom and system article lists (favorites and read later).
- Admin moderation flow for articles (approve/reject/publish + moderation log).

### Content editor

- Block-based article format: paragraphs, headings, quotes, code, video, images, lists.
- YouTube/Vimeo support with URL validation on form layer.
- Code highlighting and dedicated block rendering on article pages.

### Backend infrastructure

- NestJS API modules: auth, article, moderation, comment, votes (article and comment), list, file, user.
- Prisma + PostgreSQL with migrations and strongly typed data model.
- Redis for user caching and distributed lock on tokens refresh.
- S3-compatible storage (MinIO) for file uploads.
- Swagger API docs (`/api/swagger`).

## Architectural notes

- **Turborepo monorepo + workspace packages** (`ui`, `contracts`, `eslint-config`, `typescript-config`): shared tooling and reusable modules.
- **BFF proxy in Next.js (`/app/api/[...slug]`)**: frontend proxies requests to backend, centralizing access/refresh tokens handling and cookies updates.
- **Route access checks in proxy/middleware**: pattern matching for protected, guest-only, and admin routes, including transparent token refresh.
- **Shared contracts package (`@workspace/contracts`)**: reusable zod schemas/types/enums for both web and api apps.
- **Global Zod validation in NestJS** (`ZodValidationPipe` + `ZodSerializerInterceptor`): request/response validation at app level.
- **PostgreSQL full-text search for articles**: `tsvector` + GIN index for fast search by title/content.
- **JSON block content model**: rich article content with consistent rendering on client and simple extension with new block types.

## Tech stack

### Frontend (`apps/web`)

- Next.js 16 (App Router)
- React 19
- TypeScript
- TanStack Query
- TipTap editor
- Tailwind 4
- Shared UI package from `packages/ui`

### Backend (`apps/api`)

- NestJS 11
- Prisma 7 + PostgreSQL 17
- Redis
- S3/MinIO
- JWT
- Swagger

## Repository structure

```txt
apps/
  web/        # Next.js app
  api/        # NestJS API
packages/
  contracts/  # Shared schemas/types (zod + ts)
  ui/         # Reusable UI components
  eslint-config/
  typescript-config/
```

## Quick start

### Prerequisites

- Node.js >= 20
- pnpm 10+
- Docker + Docker Compose (for full local environment)

### Local development

1. Install dependencies:

```bash
pnpm install
```

2. Copy the example env files and fill in the values:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

3. Start all apps via Turborepo:

```bash
pnpm dev
```

### Docker

1. Set up env files as described above.
2. Build and start all services:

```bash
docker compose up --build
```

## Gallery

1. **Home page**
   
   <img alt="home_page" src="https://github.com/user-attachments/assets/349739a2-d371-455b-80f8-fe7ccbb817fa" />

2. **Profile page**
  
   <img alt="profile_page" src="https://github.com/user-attachments/assets/9a5bf7d7-7728-4e0a-b876-e2aa747f0a1b" />

3. **Article page**

   <img alt="articles_5-unexpected-lessons-from-a-month-without-social-media_page" src="https://github.com/user-attachments/assets/073f1c94-f9ef-4127-8ec5-4ef96e326773" />

4. **Editor page**

   <img alt="editor_page" src="https://github.com/user-attachments/assets/ebca1ab8-72bd-4d65-a0f0-f831ace4bac5" />


## License

MIT
