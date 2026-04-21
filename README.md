# FourWeekForge

**Master any hobby in 4 weeks** — AI-powered hobby learning platform that generates personalized 4-week plans with 8-12 tasks.

## What is this?

FourWeekForge helps users create structured learning plans for any hobby. The platform:
- Generates AI-powered personalized tasks using Groq (Llama 3.3 70B)
- Breaks learning into 4 weeks with progressive difficulty
- Tracks task completion and shows progress
- Supports Russian and English languages (i18n)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL (serverless)
- **AI**: Groq API with Llama 3.3 70B via AI SDK
- **Auth**: Custom JWT-based authentication with bcryptjs
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Deployment**: Vercel

## Project Structure

```
lib/
├── types/              # TypeScript интерфейсы и типы
│   ├── plan.ts        # Plan и Task типы
│   ├── user.ts        # User типы
│   ├── hobby.ts       # Hobby типы
│   ├── common.ts      # Общие типы
│   └── index.ts       # Экспорты
├── services/          # Бизнес-логика и API
│   ├── api.ts         # HTTP запросы
│   ├── auth.ts        # Аутентификация
│   ├── plan.ts        # План операции
│   └── index.ts       # Экспорты
├── hooks/             # Custom React hooks
│   ├── use-auth.ts    # Auth hook
│   ├── use-plans.ts   # Plans hook
│   ├── use-tasks.ts   # Tasks hook
│   └── index.ts       # Экспорты
├── schemas/           # Zod валидация
│   ├── plan.ts        # Plan схема
│   ├── user.ts        # User схема
│   ├── task.ts        # Task схема
│   └── index.ts       # Экспорты
├── constants/         # Константы приложения
│   ├── app.ts         # Основные константы
│   ├── hobbies.ts     # Список хобби
│   ├── ui.ts          # UI константы
│   └── index.ts       # Экспорты
├── i18n-context.tsx   # Переводы
├── db.ts              # Database конфиг
└── utils.ts           # Утилиты

components/
├── common/            # Переиспользуемые компоненты
│   ├── header.tsx
│   ├── language-switcher.tsx
│   ├── theme-provider.tsx
│   └── index.ts       # Экспорты
├── features/          # Функциональные компоненты
│   ├── feedback-widget.tsx
│   ├── export-dropdown.tsx
│   ├── onboarding-modal.tsx
│   ├── completion-celebration.tsx
│   └── index.ts       # Экспорты
├── sections/          # Секции страниц
│   ├── week-tasks.tsx
│   ├── plan-card.tsx
│   ├── calendar-view.tsx
│   ├── streak-badge.tsx
│   ├── week-completion-card.tsx
│   └── index.ts       # Экспорты
└── ui/                # shadcn/ui компоненты
    └── *.tsx
```

## Folder Organization Principles

### `/components`
- **`ui/`** - shadcn/ui components (don't modify)
- **`common/`** - Shared layout components used across multiple pages (Header, Navigation, Theme)
- **`features/`** - Feature-specific components (Feedback, Export, Modals, etc.)
- **`sections/`** - Page section components (Cards, Lists, Charts, etc.)

### `/lib`
- **`types/`** - TypeScript interfaces and types
- **`services/`** - API calls and business logic
- **`hooks/`** - Custom React hooks for state and logic
- **`schemas/`** - Zod validation schemas
- **`constants/`** - Static constants and configurations
- **Context files** - Auth, i18n providers at root level

## Import Patterns

```typescript
import { Header } from '@/components/common'
import { PlanCard, WeekTasks } from '@/components/sections'
import { FeedbackWidget } from '@/components/features'
```

## Database Schema

```sql
users (id, name, email, password_hash, created_at)
hobbies (id, name, icon, created_at)
plans (id, user_id, hobby_id, custom_hobby_name, goal, start_date, status, created_at)
tasks (id, plan_id, week_index, day_index, title, description, status, due_date, completed_at)
feedback (id, name, email, message, type, created_at)
```

## Key User Flows

1. **Registration** → Redirects to `/planner` (not dashboard) to start first plan immediately
2. **Plan Creation** (3 steps):
   - Step 1: Choose hobby from list OR enter custom
   - Step 2: Set specific goal + start date
   - Step 3: Review AI-generated tasks (editable)
3. **Dashboard**: Shows active plans with "Next Task" CTA, progress counters
4. **Task Completion**: Mark tasks done, see progress percentage

## Recent Changes (April 2026)

- Redesigned dashboard with "What to do next" primary CTA
- Redesigned planner with clearer 4-week structure
- Added specificity bar on landing ("8-12 tasks, 15-30 min/day")
- Positive progress messaging ("You're 75% done!")
- Added feedback widget (floating button on all pages)
- Full RU/EN localization for all new strings

## Built with v0

This repository is linked to a [v0](https://v0.app) project.

[Continue working on v0](https://v0.app/chat/projects/prj_P3889MNgReiQOVhRvFEZZKjDmmsU)

## Getting Started

```bash
pnpm install
pnpm dev
```

