# Task Manager - Full Stack Application

A modern full-stack task management application built with React, Express, and Prisma.

## Project Structure

```
├── backend/          # Express API server with Prisma ORM
│   ├── src/         # TypeScript source files
│   ├── prisma/      # Database schema and migrations
│   └── package.json
│
└── frontend/        # React application with Vite
    ├── src/         # TypeScript source files
    ├── components/  # React components
    └── package.json
```

## Tech Stack Overview

### Backend
- **Express**: REST API server
- **Prisma**: ORM with SQLite database
- **JWT**: Authentication
- **TypeScript**: Type safety

### Frontend
- **React 19**: UI framework
- **Vite**: Build tool
- **TanStack Router**: Type-safe routing
- **TanStack Query**: Server state management
- **Zustand**: Client state management
- **Tailwind CSS**: Styling
- **Radix UI**: Accessible components
- **TypeScript**: Type safety

## Quick Start Guide

### Prerequisites

Before running the project, make sure you have:

- **Node.js** (v18 or higher)
- **pnpm** package manager

To install pnpm globally:
```bash
npm install -g pnpm
```

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Generate Prisma client
pnpm run prisma:generate

# Run database migrations
pnpm run prisma:migrate

# Start backend server
pnpm run dev
```

The backend will start on `http://localhost:3000`

### Step 2: Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Start frontend development server
pnpm run dev
```

The frontend will start on `http://localhost:5173`

### Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You can now:
1. Register a new user account
2. Login with your credentials
3. Create, edit, and manage tasks
4. Toggle between light/dark themes

## Development Workflow

### Running Both Servers

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
pnpm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm run dev
```

### Database Management

View and edit database with Prisma Studio:
```bash
cd backend
pnpm run prisma:studio
```

This opens a GUI at `http://localhost:5555`

## Production Build

### Build Backend
```bash
cd backend
pnpm run build
pnpm run start
```

### Build Frontend
```bash
cd frontend
pnpm run build
pnpm run preview
```

## API Configuration

The frontend connects to the backend API at `http://localhost:3000/api`

If you need to change the API URL, update the configuration in:
```
frontend/src/lib/api.ts
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

**Backend:** Change PORT in backend/.env
**Frontend:** Vite will automatically use next available port

### Database Issues

Reset database:
```bash
cd backend
rm prisma/dev.db
pnpm run prisma:migrate
```

### Dependencies Issues

Clear node_modules and reinstall:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Architecture Highlights

### Why These Technologies?

**Express**: Minimal, flexible, and widely adopted Node.js framework perfect for REST APIs.

**Prisma**: Modern ORM with excellent TypeScript support, type-safe queries, and automated migrations.

**React 19**: Latest React version with improved performance and developer experience.

**Vite**: Extremely fast build tool that significantly improves development experience.

**TanStack Router**: Type-safe routing eliminates common routing bugs.

**TanStack Query**: Simplifies server state management, caching, and data synchronization.

**Zustand**: Simple and lightweight state management without boilerplate.

**Tailwind CSS**: Utility-first approach enables rapid UI development.

**Radix UI**: Provides accessible, unstyled components that can be fully customized.

**TypeScript**: Type safety across the entire stack reduces bugs and improves maintainability.

