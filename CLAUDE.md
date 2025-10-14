# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Express.js REST API with TypeScript, Prisma ORM, MongoDB, JWT authentication, and bcrypt password hashing. Uses ES modules throughout.

## Development Commands

**Package Manager**: This project uses `pnpm` (v10.15.1)

### Core Commands
- `pnpm dev` - Start development server with hot reload (uses tsx watch via nodemon)
- `pnpm build` - Compile TypeScript to JavaScript (outputs to `./dist`)
- `pnpm start` - Run compiled production server

### Docker Commands
- `pnpm docker:up` - Start all services (MongoDB replica set + backend) in detached mode
- `pnpm docker:up:db` - Start only MongoDB and replica set initialization
- `pnpm docker:down` - Stop and remove all containers
- `pnpm docker:watch` - Start with file watching (syncs `./src` changes without rebuild)
- `pnpm docker:logs` - Follow backend container logs
- `pnpm docker:restart` - Restart backend container only

### Prisma Commands
- `pnpm exec prisma generate` - Generate Prisma Client after schema changes (required after schema.prisma edits)
- `pnpm exec prisma db push` - Push schema changes to MongoDB
- `pnpm exec prisma studio` - Open Prisma Studio for database inspection

## Architecture

### Path Aliases
- `@/*` → `./src/*` - Application source code
- `@orm/*` → `./prisma/generated/*` - Generated Prisma Client

### Directory Structure
```
src/
├── server.ts           # Express app entry point (port 3000)
├── database/           # Prisma client singleton export
├── lib/                # Shared utilities (JWT functions using jose library)
├── middleware/         # Express middleware (authMiddleware validates JWT)
├── models/             # Zod schemas and type definitions (User types with pwd field)
├── services/           # Business logic (user CRUD, password hashing, login flow)
└── routers/
    ├── index.ts        # Main router composition with /health endpoint
    ├── public/         # Unauthenticated routes (user registration, auth)
    └── private/        # JWT-protected routes (authenticated user operations)
```

### Router Organization
- **Public routes** (`/routers/public/*`): No authentication required
- **Private routes** (`/routers/private/*`): Protected by `authMiddleware`
- Main router (`/routers/index.ts`) combines all routes:
  - `/health` - Health check endpoint
  - `/user` - User operations (public + private routes combined)
  - `/auth` - Authentication endpoints

### Authentication Flow
1. JWT tokens generated via `gerarToken()` in `src/lib/jwt.ts`
2. Tokens expire in 2 hours
3. `authMiddleware` validates Bearer tokens on private routes
4. JWT secret from `JWT_SECRET` environment variable (required)

### Database & Validation
- **ORM**: Prisma with MongoDB connector
- **Custom output**: Prisma Client generated to `./prisma/generated/prisma`
- **Binary targets**: `native` + `debian-openssl-1.1.x` (for Docker/Debian compatibility)
- **Connection**: `DATABASE_URL_MONGO` environment variable
- **Singleton**: `prisma` client exported from `src/database/index.ts`
- **Validation**: Zod v4 with async transforms for automatic password hashing in model schemas
- **Password Hashing**: Automatic via Zod transform in `userForCreateSchema` and `userForUpdateSchema`
- **Local Development**: Docker Compose provides MongoDB 8 in replica set mode (required for Prisma transactions)
- **Database Schema**: User model has `id`, `email` (unique), `name`, and `pwd` fields

### TypeScript Configuration
- **Strict mode** enabled with additional strictness flags
- **ES Modules**: Uses `"type": "module"` with `nodenext` module resolution
- **Isolated modules**: `verbatimModuleSyntax` and `isolatedModules` enabled
- **No emit**: TypeScript used for type checking only during dev (tsx handles execution)

## Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URL_MONGO` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing (throws error if missing)

## Important Notes

### Development Workflow
- **Local**: Server runs on port 3000 (hardcoded in `server.ts`)
- **Docker**: Includes hot-reload via `docker compose watch` (syncs `./src` changes)
- **MongoDB Setup**: Docker creates replica set automatically via `init-replica` service
- **TypeScript**: Compilation outputs to `./dist` but development uses tsx directly via nodemon

### Security & Authentication
- JWT tokens use `jose` library (not `jsonwebtoken`)
- Authentication uses Bearer token format: `Authorization: Bearer <token>`
- Password hashing uses bcrypt with salt rounds of 10
- JWT tokens include `sub` (user ID) and `name` claims
- Token validation extracts user data but **doesn't attach it to `req` object** (authMiddleware validates but doesn't populate req.user)

### Service Layer Responsibilities
- User CRUD operations (`createUser`, `updateUser`, `deleteUser`, `findOneByEmail`, `findOneById`, `findMany`)
- Password hashing (`hashPwd` with bcrypt salt rounds of 10) and validation (`validatePwd`)
- Login flow: validates credentials → generates JWT token
- All database interactions go through Prisma client singleton

### Data Flow & Validation Pattern
1. Request received → Zod schema validation in models layer
2. Zod async transform automatically hashes passwords before database operations
3. Service layer receives pre-hashed passwords from Zod transforms
4. Service layer performs business logic and database operations via Prisma
5. Response returned with appropriate status codes
