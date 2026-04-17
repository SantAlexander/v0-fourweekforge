# FourWeekForge - Project Structure

## Overview

FourWeekForge is a structured 4-week learning platform with a clean, organized architecture.

## Directory Structure

```
/
├── app/                          # Next.js app router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # User dashboard
│   ├── plan/[id]/              # Plan details
│   ├── planner/                # Plan creator
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   ├── api/                    # API routes
│   └── globals.css             # Global styles
│
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── common/                 # Shared layout components
│   │   ├── header.tsx         # App header
│   │   ├── language-switcher.tsx
│   │   └── theme-provider.tsx
│   ├── features/               # Feature-specific components
│   │   ├── feedback-widget.tsx
│   │   ├── export-dropdown.tsx
│   │   ├── onboarding-modal.tsx
│   │   └── completion-celebration.tsx
│   └── sections/               # Section/page components
│       ├── week-tasks.tsx
│       ├── plan-card.tsx
│       ├── calendar-view.tsx
│       ├── streak-badge.tsx
│       └── week-completion-card.tsx
│
├── lib/                        # Utilities and configuration
│   ├── types/                 # TypeScript type definitions
│   │   ├── plan.ts
│   │   ├── user.ts
│   │   ├── hobby.ts
│   │   └── common.ts
│   ├── services/              # API and business logic
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── plan.ts
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-plans.ts
│   │   └── use-tasks.ts
│   ├── schemas/               # Zod validation schemas
│   │   ├── plan.ts
│   │   ├── user.ts
│   │   └── task.ts
│   ├── constants/             # App constants
│   │   ├── app.ts
│   │   ├── hobbies.ts
│   │   └── ui.ts
│   ├── auth-context.tsx       # Auth provider
│   ├── i18n-context.tsx       # i18n provider
│   ├── db.ts                  # Database utilities
│   ├── hobby-icons.tsx        # Hobby icon mappings
│   ├── utils.ts               # Utility functions
│
└── public/                    # Static assets
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

### Before (cluttered)
```typescript
import { Header } from '@/components/header'
import { PlanCard } from '@/components/plan-card'
import { WeekTasks } from '@/components/week-tasks'
import { FeedbackWidget } from '@/components/feedback-widget'
```

### After (clean)
```typescript
import { Header } from '@/components/common'
import { PlanCard, WeekTasks } from '@/components/sections'
import { FeedbackWidget } from '@/components/features'
```

## Adding New Features

1. **New UI Component**: Place in `components/common`, `components/features`, or `components/sections`
2. **New Type**: Add to `lib/types/{domain}.ts`
3. **New Hook**: Add to `lib/hooks/use-{feature}.ts`
4. **New Constant**: Add to `lib/constants/{category}.ts`
5. **New Service**: Add to `lib/services/{domain}.ts`

## Migration Notes

- All component imports have been reorganized
- Index files in each directory provide convenient re-exports
- Core context providers remain at `lib/` root level
- No breaking changes - all functionality preserved
