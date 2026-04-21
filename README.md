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
v0-fourweekforge/
├── app/                          # Next.js App Router pages and routes
│   ├── admin/                    # Admin dashboard and management
│   ├── api/                      # API routes for backend logic
│   ├── dashboard/                # User dashboard
│   ├── login/                    # Authentication login page
│   ├── register/                 # User registration page
│   ├── planner/                  # Interactive 4-week plan creator
│   ├── plan/[id]/                # Individual plan detail view
│   ├── layout.tsx                # Root layout with i18n provider
│   └── page.tsx                  # Home/landing page
│
├── components/                   # Reusable React components
│   ├── common/                   # Common/shared components (Header, Navigation)
│   ├── features/                 # Feature-specific components (Modals, Widgets)
│   ├── sections/                 # Page section components (Cards, Lists, Charts)
│   └── ui/                       # Shadcn/ui components and primitives
│
├── hooks/                        # Custom React hooks
│
├── lib/                          # Shared utilities and configuration
│   ├── constants/                # Application constants and hobbies list
│   ├── hooks/                    # Custom hooks library
│   ├── schemas/                  # Zod validation schemas
│   ├── services/                 # API and external services (Groq, Auth, DB)
│   ├── types/                    # TypeScript type definitions
│   ├── i18n-context.tsx          # i18n translations (EN/RU)
│   ├── db.ts                     # Database configuration
│   └── [utility files]           # Helper functions and utilities
│
├── public/                       # Static assets (images, icons, etc.)
│
├── scripts/                      # Database setup scripts and migrations
│
├── package.json                  # Dependencies and project metadata
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

### Folder Organization Principles

**`/components`**
- `ui/` - Shadcn/ui components (don't modify)
- `common/` - Shared layout components (Header, Navigation, Theme Provider)
- `features/` - Feature-specific components (Feedback Widget, Export, Modals)
- `sections/` - Page section components (Plan Cards, Week Tasks, Calendar View)

**`/lib`**
- `types/` - TypeScript interfaces and types
- `services/` - API calls and business logic
- `hooks/` - Custom React hooks for state and logic
- `schemas/` - Zod validation schemas
- `constants/` - Static constants and configurations
- Context files - Auth, i18n providers at root level

**`/app`**
- Each route has its own folder with `page.tsx` and optional `layout.tsx`
- API routes in `/api` for backend endpoints
- Dynamic routes use `[id]` folder naming convention

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

