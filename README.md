# Express.js REST API for practice

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-green.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17-2D3748.svg)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green.svg)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Modern REST API built with Express.js, TypeScript, Prisma ORM, MongoDB, JWT authentication, and bcrypt password hashing.

## 🚀 Features

- **TypeScript** - Type-safe development with strict mode enabled
- **Express.js 5** - Modern, fast web framework with ES modules
- **Prisma ORM** - Type-safe database client with MongoDB connector
- **JWT Authentication** - Secure token-based authentication using `jose` library
- **Password Hashing** - bcrypt integration for secure password storage
- **Zod Validation** - Schema validation with async transforms for automatic password hashing
- **Docker Support** - Containerized development environment with hot-reload
- **Path Aliases** - Clean imports with `@/*` and `@orm/*` aliases

## 📋 Prerequisites

- **Node.js** 20+ (recommended: Node 24)
- **pnpm** 10.15.1 or higher
- **Docker** & **Docker Compose** (for local MongoDB)
- **MongoDB** 8.0+ (via Docker or external instance)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Romiro13/express-rest-api

cd express-rest-api
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Required variables:

```sh
# Local MongoDB (with Docker)
DATABASE_URL_MONGO="mongodb://localhost:27017/Users?replicaSet=rs0&retryWrites=true&w=majority"

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
JWT_SECRET="your-secret-key-here"
```

### 4. Generate Prisma Client

```bash
pnpm exec prisma generate
```

### 5. Start MongoDB with Docker

```bash
pnpm docker:up:db
```

This command starts MongoDB 8.0 with replica set configuration (required for Prisma transactions).

## 🚀 Running the Application

### 6. Development Mode (Local without docker)

```bash
pnpm dev

# Or Development Mode with docker
pnpm docker:watch
```

Runs the application in Docker with file watching and hot-reload.

Server runs on `http://localhost:3000` with hot-reload enabled.

### Production Mode

```bash
# Build TypeScript
pnpm build

# Start server
pnpm start
```

## 📦 Available Scripts

### Core Commands

| Command      | Description                                             |
| ------------ | ------------------------------------------------------- |
| `pnpm dev`   | Start development server with hot-reload without docker |
| `pnpm build` | Compile TypeScript to JavaScript (`./dist`)             |
| `pnpm start` | Run production server from compiled code                |

### Docker Commands

| Command               | Description                                     |
| --------------------- | ----------------------------------------------- |
| `pnpm docker:up`      | Start MongoDB replica set + backend (detached)  |
| `pnpm docker:up:db`   | Start only MongoDB and replica set init         |
| `pnpm docker:down`    | Stop and remove all containers                  |
| `pnpm docker:watch`   | Start with file watching (hot-reload in Docker) |
| `pnpm docker:logs`    | Follow backend container logs                   |
| `pnpm docker:restart` | Restart backend container only                  |

### Prisma Commands

| Command                     | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| `pnpm exec prisma generate` | Generate Prisma Client (required after schema changes) |
| `pnpm exec prisma db push`  | Push schema changes to MongoDB                         |
| `pnpm exec prisma studio`   | Open Prisma Studio for database inspection             |

## 📁 Project Structure

```
src/
├── server.ts           # Express app entry point (port 3000)
├── database/           # Prisma client singleton export
├── lib/                # Shared utilities (JWT functions using jose)
├── middleware/         # Express middleware (authMiddleware)
├── models/             # Zod schemas with async transforms (User types)
├── services/           # Business logic (user CRUD, auth, password hashing)
└── routers/
    ├── index.ts        # Main router with /health endpoint
    ├── public/         # Unauthenticated routes (registration, login)
    └── private/        # JWT-protected routes (user operations)

prisma/
├── schema.prisma       # Prisma schema definition (MongoDB)
└── generated/
    └── prisma/         # Generated Prisma Client (custom output path)
```

## 🔐 Authentication Flow

1. **User Registration** - POST `/user` with email, name, and password
2. **Automatic Password Hashing** - Zod async transform automatically hashes password with bcrypt (10 salt rounds)
3. **User Login** - POST `/auth/login` validates credentials
4. **JWT Generation** - Token generated with 2-hour expiration using `jose` library
5. **Protected Routes** - Bearer token required: `Authorization: Bearer <token>`
6. **Token Validation** - `authMiddleware` validates JWT on private routes (doesn't attach user to `req`)

### JWT Token Structure

```json
{
  "sub": "user-id",
  "name": "User Name",
  "exp": 1234567890
}
```

## 🛣️ API Routes

### Public Routes (No Authentication)

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| `GET`  | `/health`     | Health check endpoint |
| `POST` | `/user`       | User registration     |
| `POST` | `/auth/login` | User authentication   |

### Private Routes (Requires JWT)

| Method   | Endpoint    | Description    |
| -------- | ----------- | -------------- |
| `GET`    | `/user`     | Get all users  |
| `GET`    | `/user/:id` | Get user by ID |
| `PUT`    | `/user`     | Update user    |
| `DELETE` | `/user/:id` | Delete user    |

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  email String @unique
  name  String
  pwd   String
}
```

## 🔧 Configuration

### TypeScript Configuration

- **Strict mode** enabled with additional strictness flags
- **ES Modules** - `"type": "module"` with `nodenext` resolution
- **Path aliases** - `@/*` → `./src/*`, `@orm/*` → `./prisma/generated/*`
- **Isolated modules** - `verbatimModuleSyntax` enabled

### Prisma Configuration

- **Provider**: MongoDB
- **Output**: Custom path `./prisma/generated/prisma`
- **Binary targets**: `native` + `debian-openssl-1.1.x` (Docker compatibility)
- **Replica Set**: Required for transactions (configured in Docker Compose)

## 🐳 Docker Setup

### Services

- **MongoDB 8.0** - Primary database with replica set configuration
- **Backend** - Node.js application with hot-reload support
- **Init Replica** - Automatic replica set initialization

### Docker Compose Features

- Automatic MongoDB replica set configuration
- Hot-reload with file watching (`docker compose watch`)
- Health checks and dependency management
- Volume persistence for MongoDB data

## 🧪 Development Workflow

### 1. Local Development (Recommended)

```bash
# Start MongoDB
pnpm docker:up:db

# Run development server
pnpm dev
```

### 2. Full Docker Development

```bash
# Start MongoDB
pnpm docker:up:db

# Start with hot-reload
pnpm docker:watch

# View logs
pnpm docker:logs
```

### 3. Schema Changes

```bash
# Edit prisma/schema.prisma

# Generate new Prisma Client
pnpm exec prisma generate

# Push changes to database
pnpm exec prisma db push
```

## 📝 Environment Variables

| Variable             | Description                | Required |
| -------------------- | -------------------------- | -------- |
| `DATABASE_URL_MONGO` | MongoDB connection string  | Yes      |
| `JWT_SECRET`         | Secret key for JWT signing | Yes      |

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with 10 salt rounds
- **JWT Tokens** - Secure token generation using `jose` library
- **Token Expiration** - 2-hour token lifetime
- **Bearer Token Authentication** - Standard HTTP Authorization header
- **Environment Variables** - Sensitive data stored in `.env` (gitignored)

## 📚 Tech Stack

| Technology     | Version | Purpose                 |
| -------------- | ------- | ----------------------- |
| **Node.js**    | 24      | JavaScript runtime      |
| **TypeScript** | 5.9     | Type-safe development   |
| **Express.js** | 5.1     | Web framework           |
| **Prisma**     | 6.17    | ORM and database client |
| **MongoDB**    | 8.0     | NoSQL database          |
| **jose**       | 6.1     | JWT implementation      |
| **bcrypt**     | 6.0     | Password hashing        |
| **Zod**        | 4.1     | Schema validation       |
| **tsx**        | 4.20    | TypeScript execution    |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Access MongoDB Database

```bash
# Open Prisma Studio to inspect/edit database
pnpm exec prisma studio
```

### Port Already in Use

```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill the process
kill -9 <PID>
```

## 📧 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---
