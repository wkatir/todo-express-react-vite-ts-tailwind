# Frontend Documentation

## Technology Stack

### Core Dependencies

- **React** (v19.1.1): JavaScript library for building user interfaces. Core framework for the application.

- **Vite** (v7.1.14 - rolldown-vite): Next-generation frontend build tool. Provides fast development server and optimized production builds.

- **TypeScript** (v5.9.3): Strongly typed programming language. Provides type safety and better developer experience.

- **Tailwind CSS** (v4.1.14): Utility-first CSS framework. Used for styling the application with modern, responsive design.

### Routing & State Management

- **@tanstack/react-router** (v1.133.13): Type-safe routing library. Handles navigation and route management with full TypeScript support.

- **Zustand** (v5.0.8): Lightweight state management library. Used for managing global application state (authentication).

- **@tanstack/react-query** (v5.90.5): Powerful data fetching and caching library. Manages server state, caching, and synchronization.

### UI Component Libraries

- **@radix-ui/react-***: Collection of unstyled, accessible UI components. Provides foundation for dialog, dropdown, select, tabs, and other interactive elements.

- **Lucide React** (v0.546.0): Icon library with beautiful, consistent icons.

- **Sonner** (v2.0.7): Toast notification library. Used for user feedback messages.

- **Vaul** (v1.1.2): Drawer component for mobile-friendly slide-out panels.

- **next-themes** (v0.4.6): Theme management for dark/light mode support.

### Forms & Validation

- **react-hook-form** (v7.65.0): Performant form library with easy validation. Handles form state and validation logic.

- **Zod** (v3.24.1): TypeScript-first schema validation. Validates form inputs with type safety.

- **@hookform/resolvers** (v5.2.2): Connects Zod validation with react-hook-form.

### Drag & Drop

- **@dnd-kit/core** (v6.3.1): Modern drag-and-drop toolkit. Used for task reordering and organization.

- **@dnd-kit/sortable** (v10.0.0): Sortable preset for drag-and-drop lists.

- **@dnd-kit/modifiers** (v9.0.0): Modifiers for drag-and-drop behavior.

### Data Visualization

- **Recharts** (v2.15.4): Chart library built on React components. Used for displaying task statistics and analytics.

- **@tanstack/react-table** (v8.21.3): Headless table library. Used for displaying and managing tabular data.

### HTTP Client

- **Axios** (v1.12.2): Promise-based HTTP client. Handles API requests to the backend.

### Utilities

- **clsx** (v2.1.1): Utility for constructing className strings conditionally.

- **tailwind-merge** (v3.3.1): Merges Tailwind CSS classes without conflicts.

- **class-variance-authority** (v0.7.1): Tool for creating variant-based component styles.

## How to Run the Frontend

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Backend server running on port 3000

### Installation Steps

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

The frontend will run on `http://localhost:5173`

### Available Scripts

- `pnpm run dev`: Start development server with hot reload
- `pnpm run build`: Build for production
- `pnpm run preview`: Preview production build locally
- `pnpm run lint`: Run ESLint to check code quality

## Features

- User authentication (register/login)
- Task management (create, read, update, delete)
- Task filtering and sorting
- Drag-and-drop task reordering
- Responsive design with dark/light theme
- Real-time task synchronization
- Form validation
- Toast notifications

