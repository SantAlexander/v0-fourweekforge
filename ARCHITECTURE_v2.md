# FourWeekForge - New Architecture (v2)

## Overview

This is a production-ready refactored version of FourWeekForge following **Clean Architecture** and **Feature-Sliced Design (FSD)** patterns.

## Directory Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── dashboard/
│   ├── plan/[id]/
│   └── layout.tsx
├── shared/                   # Shared across all features
│   ├── config/              # App configuration
│   ├── types/               # TypeScript types
│   ├── ui/                  # Reusable UI components
│   └── lib/                 # Utilities & constants
├── entities/                # Business entities (models + APIs)
│   ├── user/
│   ├── plan/
│   └── task/
├── features/                # Feature slices
│   ├── auth/               # Authentication
│   ├── plan-management/    # Plan features
│   └── task-management/    # Task features
├── processes/              # Page orchestration & workflows
├── widgets/                # Composite UI widgets
├── hooks/                  # Custom React hooks
└── server/                 # Server-side code
    ├── db/                # Database connection
    ├── repositories/      # Data access layer
    ├── services/          # Business logic
    └── auth/              # Authentication logic
```

## Layer Descriptions

### 1. **Shared Layer** (`src/shared/`)
- **config**: Application-wide configuration
- **types**: TypeScript interfaces & types
- **ui**: Reusable UI components (Button, Card, etc.)
- **lib**: Utilities, constants, helpers

### 2. **Entities** (`src/entities/`)
Each entity (User, Plan, Task) contains:
- **model**: Pure business logic (no side effects)
- **api**: REST API client functions

### 3. **Features** (`src/features/`)
Self-contained feature slices:
- State definitions (Redux slices)
- Feature-specific logic
- UI components for the feature

### 4. **Processes** (`src/processes/`)
Orchestration logic:
- Page-level workflows
- Multi-step processes
- Data aggregation

### 5. **Widgets** (`src/widgets/`)
Composite UI components:
- Combine multiple UI elements
- Pre-configured for common use cases
- Reusable across pages

### 6. **Hooks** (`src/hooks/`)
Custom React hooks:
- `useAsync`: Generic async handler
- `useLocalStorage`: localStorage management
- Feature-specific hooks

### 7. **Server** (`src/server/`)
Server-side code:
- **db**: Database connection
- **repositories**: Data access layer
- **services**: Business logic
- **auth**: Authentication logic

### 8. **App** (`src/app/`)
Next.js App Router pages:
- Uses processes for orchestration
- Uses widgets for UI
- Minimal component logic

## Benefits

✅ **Scalability**: Each feature is isolated and independently deployable
✅ **Maintainability**: Clear separation of concerns
✅ **Testability**: Pure functions and dependency injection
✅ **Type Safety**: Full TypeScript coverage
✅ **Consistency**: Uniform patterns across the codebase
✅ **Documentation**: Self-documenting file structure

## Migration Checklist

- [ ] Move existing components to `src/shared/ui/` or `src/widgets/`
- [ ] Extract business logic to `src/entities/*/model/`
- [ ] Create API clients in `src/entities/*/api/`
- [ ] Implement repository layer in `src/server/repositories/`
- [ ] Create process orchestrators for each page
- [ ] Update Next.js configuration to use `src/` directory
- [ ] Remove old directory structure after verification

## Getting Started

1. All new code should follow this structure
2. Import from established paths (e.g., `@/shared/ui`, `@/entities`)
3. Use process layer for page orchestration
4. Keep components pure and presentational

---

**Last Updated**: 2024
**Architecture**: Clean Architecture + Feature-Sliced Design
