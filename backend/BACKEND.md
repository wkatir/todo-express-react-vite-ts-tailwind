# Backend Documentation

## Technology Stack

### Core Dependencies

- **Express** (v5.1.0): Fast, minimalist web framework for Node.js. Used to create the REST API server and handle HTTP requests/responses.

- **Prisma** (v6.18.0): Modern ORM (Object-Relational Mapping) for database management. Provides type-safe database queries and automated migrations.

- **@prisma/client**: Auto-generated query builder for database operations with full TypeScript support.

- **bcryptjs** (v3.0.2): Library for hashing passwords. Used to securely store user passwords in the database.

- **jsonwebtoken** (v9.0.2): Implementation of JSON Web Tokens for authentication. Used to create and verify user session tokens.

- **cors** (v2.8.5): Express middleware to enable Cross-Origin Resource Sharing. Allows the frontend to communicate with the backend API.

- **express-validator** (v7.3.0): Middleware for validating and sanitizing request data. Ensures data integrity before processing.

- **dotenv** (v17.2.3): Loads environment variables from .env file. Used for configuration management.

### Development Dependencies

- **TypeScript** (v5.9.3): Strongly typed programming language. Provides type safety and better developer experience.

- **ts-node-dev** (v2.0.0): Development tool that automatically restarts the server on file changes. Improves development workflow.

- **@types/**: TypeScript type definitions for JavaScript libraries.

## Database Schema

The application uses SQLite with two models:

- **User**: Stores user information (id, name, email, password, createdAt)
- **Task**: Stores tasks (id, userId, title, description, completed, createdAt, updatedAt)

## How to Run the Backend

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation Steps

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pnpm install
```

3. Generate Prisma client:
```bash
pnpm run prisma:generate
```

4. Run database migrations:
```bash
pnpm run prisma:migrate
```

5. Start the development server:
```bash
pnpm run dev
```

The backend will run on `http://localhost:3000`

### Available Scripts

- `pnpm run dev`: Start development server with hot reload
- `pnpm run build`: Build TypeScript to JavaScript
- `pnpm run start`: Run production build
- `pnpm run prisma:migrate`: Run database migrations
- `pnpm run prisma:generate`: Generate Prisma client
- `pnpm run prisma:studio`: Open Prisma Studio (database GUI)

## API Endpoints

- `GET /`: Health check endpoint
- `POST /api/auth/register`: Register new user
- `POST /api/auth/login`: Login user
- `GET /api/tasks`: Get all tasks (authenticated)
- `POST /api/tasks`: Create new task (authenticated)
- `PUT /api/tasks/:id`: Update task (authenticated)
- `DELETE /api/tasks/:id`: Delete task (authenticated)

