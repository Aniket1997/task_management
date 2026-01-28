# Multi-Vendor Ecommerce Microservice

A production-ready multi-vendor ecommerce backend built with **Node.js**, **TypeScript**, **Express**, **PostgreSQL**, **Redis**, and **RabbitMQ** following a microservice architecture.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + TypeScript | Runtime & Language |
| Express | HTTP Framework |
| PostgreSQL | Primary Database |
| Sequelize | ORM |
| Redis | Token blacklisting & caching |
| RabbitMQ | Async inter-service communication |
| Docker | Containerization |
| JWT | Authentication (Access + Refresh tokens) |

---

## Folder Structure

```
backend/
├── docker-compose.yml                 # Orchestrates all services & infrastructure
├── .gitignore
├── README.md
│
├── gateway/                           # API Gateway (Port 3000)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                   # Entry point
│       ├── config/
│       │   └── index.ts               # Service URLs & port config
│       ├── middleware/
│       │   └── proxy.ts               # HTTP proxy to downstream services
│       └── routes/
│           └── index.ts               # Route mapping to services
│
├── services/
│   ├── auth-service/                  # Authentication Service (Port 3001)
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   └── src/
│   │       ├── index.ts               # Express app entry
│   │       ├── config/
│   │       │   ├── database.ts        # Sequelize/PostgreSQL config
│   │       │   ├── redis.ts           # Redis client
│   │       │   └── rabbitmq.ts        # RabbitMQ publisher
│   │       ├── models/
│   │       │   ├── index.ts           # Model registry & associations
│   │       │   ├── user.model.ts      # User model (email, password, role)
│   │       │   └── token.model.ts     # Refresh token storage
│   │       ├── controllers/
│   │       │   └── auth.controller.ts
│   │       ├── services/
│   │       │   └── auth.service.ts    # Business logic (register, login, etc.)
│   │       ├── routes/
│   │       │   └── auth.routes.ts
│   │       ├── middleware/
│   │       │   ├── auth.ts            # JWT verification & role authorization
│   │       │   └── validate.ts        # Joi request validation
│   │       ├── validators/
│   │       │   └── auth.validator.ts  # Joi schemas
│   │       └── utils/
│   │           ├── jwt.ts             # Token generation & verification
│   │           └── response.ts        # Standardized API response
│   │
│   └── user-service/                  # User Management Service (Port 3002)
│       ├── Dockerfile
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example
│       └── src/
│           ├── index.ts
│           ├── config/
│           │   ├── database.ts
│           │   ├── redis.ts
│           │   └── rabbitmq.ts        # RabbitMQ consumer
│           ├── models/
│           │   ├── index.ts
│           │   └── user.model.ts
│           ├── controllers/
│           │   └── user.controller.ts
│           ├── services/
│           │   └── user.service.ts
│           ├── routes/
│           │   └── user.routes.ts
│           ├── middleware/
│           │   ├── auth.ts
│           │   └── validate.ts
│           ├── validators/
│           │   └── user.validator.ts
│           └── utils/
│               └── response.ts
│
└── shared/                            # Shared utilities across services
    ├── tsconfig.json
    ├── middleware/
    │   └── errorHandler.ts            # Global error handler & AppError class
    ├── utils/
    │   └── logger.ts                  # Winston logger
    └── constants/
        └── index.ts                   # Roles, token types, queue names
```

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) v20+ (for local development only)

---

## Setup & Run

### Option 1: Docker (Recommended)

This starts everything — PostgreSQL, Redis, RabbitMQ, and all microservices.

```bash
# Clone the repo
git clone https://github.com/Aniket1997/task_management.git
cd task_management

# Start all services
docker-compose up --build
```

Once running, the following will be available:

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:3000 |
| Auth Service | http://localhost:3001 |
| User Service | http://localhost:3002 |
| RabbitMQ Management UI | http://localhost:15672 (guest/guest) |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### Option 2: Local Development (without Docker)

You need PostgreSQL, Redis, and RabbitMQ installed locally.

#### 1. Install PostgreSQL

- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: `brew install postgresql@16`
- **Linux**: `sudo apt install postgresql`

After installation, create the database:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create the database
CREATE DATABASE auth_db;
```

#### 2. Install Redis

- **Windows**: Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases) or use Docker: `docker run -d -p 6379:6379 redis:7-alpine`
- **Mac**: `brew install redis && brew services start redis`
- **Linux**: `sudo apt install redis-server && sudo systemctl start redis`

Verify Redis is running:

```bash
redis-cli ping
# Should return: PONG
```

#### 3. Install RabbitMQ

- **Windows**: Download from [rabbitmq.com](https://www.rabbitmq.com/install-windows.html)
- **Mac**: `brew install rabbitmq && brew services start rabbitmq`
- **Linux**: `sudo apt install rabbitmq-server && sudo systemctl start rabbitmq-server`

Enable the management UI:

```bash
rabbitmq-plugins enable rabbitmq_management
# Access at http://localhost:15672 (guest/guest)
```

#### 4. Configure Environment Variables

Copy `.env.example` to `.env` in each service and update values:

```bash
# For auth-service
cp services/auth-service/.env.example services/auth-service/.env

# For user-service
cp services/user-service/.env.example services/user-service/.env
```

Update the `.env` files for local setup:

```env
DB_HOST=localhost
REDIS_HOST=localhost
RABBITMQ_URL=amqp://localhost:5672
JWT_ACCESS_SECRET=your-secure-random-secret
JWT_REFRESH_SECRET=your-secure-random-secret
```

#### 5. Install Dependencies & Run

```bash
# Auth service
cd services/auth-service
npm install
npm run dev

# User service (in a new terminal)
cd services/user-service
npm install
npm run dev

# Gateway (in a new terminal)
cd gateway
npm install
npm run dev
```

---

## API Endpoints

All requests go through the API Gateway at `http://localhost:3000`.

### Auth Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login & get tokens | No |
| POST | `/api/auth/logout` | Logout & blacklist token | Yes |
| POST | `/api/auth/refresh-token` | Get new access token | No |

### User Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get own profile | Yes |
| PUT | `/api/users/profile` | Update own profile | Yes |
| GET | `/api/users/` | List all users | Yes (Admin) |
| GET | `/api/users/:id` | Get user by ID | Yes (Admin) |

### Health Checks

| Service | Endpoint |
|---------|----------|
| Gateway | `GET http://localhost:3000/health` |
| Auth | `GET http://localhost:3001/health` |
| User | `GET http://localhost:3002/health` |

---

## API Usage Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (use the accessToken from login response)

```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <access_token>"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    }
  }'
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refresh_token>"
  }'
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

---

## Architecture

```
Client Request
      │
      ▼
┌─────────────┐
│ API Gateway │  (Port 3000 - rate limiting, routing)
│  (Express)  │
└──────┬──────┘
       │
       ├──────────────────┐
       ▼                  ▼
┌──────────────┐   ┌──────────────┐
│ Auth Service │   │ User Service │
│  (Port 3001) │   │  (Port 3002) │
└──────┬───────┘   └──────┬───────┘
       │                  │
       ▼                  ▼
┌──────────────────────────────────┐
│          PostgreSQL              │
│        (Shared Database)        │
└──────────────────────────────────┘
       │                  │
       ▼                  ▼
┌─────────────┐   ┌───────────────┐
│    Redis    │   │   RabbitMQ    │
│ (Blacklist) │   │ (Event Queue) │
└─────────────┘   └───────────────┘
```

### Authentication Flow

1. **Register/Login** → Auth service creates user, returns access token (15min) + refresh token (7 days)
2. **Authenticated requests** → Gateway forwards to services, middleware verifies JWT & checks Redis blacklist
3. **Logout** → Access token blacklisted in Redis, refresh tokens deleted from DB
4. **Token refresh** → Old refresh token exchanged for new access + refresh token pair

### User Roles

| Role | Description |
|------|-------------|
| `customer` | Default role, can manage own profile |
| `vendor` | Can manage own profile + vendor features (future) |
| `admin` | Full access to all user management |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Service port | 3001/3002/3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | PostgreSQL host | postgres |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | auth_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `REDIS_HOST` | Redis host | redis |
| `REDIS_PORT` | Redis port | 6379 |
| `RABBITMQ_URL` | RabbitMQ connection URL | amqp://rabbitmq:5672 |
| `JWT_ACCESS_SECRET` | Secret for access tokens | - |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | - |
| `JWT_ACCESS_EXPIRY` | Access token lifetime | 15m |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime | 7d |
