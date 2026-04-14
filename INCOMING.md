# INCOMING: Planned Changes

This file contains detailed specifications for upcoming UI/UX improvements.
Another v0 session can use this as a guide to implement these changes.

---

# CURRENT PRIORITY: ANTI-DRIBBBLE REDESIGN v3

## Context

After completing Design System v2 (gradient-heavy, achievement-driven), we received critical feedback:

**Problem:** The redesign looks like a "nice startup UI", not a world-class product.

It relies too much on:
- Gradients everywhere
- Bright colors as decoration
- Surface-level motivation (streaks, celebrations)
- Visual noise

**Target:** Transform into Linear/Stripe/Notion quality:
- Clarity over decoration
- Hierarchy over effects
- Purposeful color (meaning, not decoration)
- Calm, controlled, intelligent feel

---

## ANTI-DRIBBBLE TASK LIST

### PHASE 1: VISUAL CLEANUP (Color & Effects)

- [ ] **TASK 1.1:** Remove gradient backgrounds from cards
  - Files: `plan-card.tsx`, `dashboard/page.tsx`, `page.tsx`
  - Replace `bg-gradient-to-*` with solid `bg-card` or `bg-muted`

- [ ] **TASK 1.2:** Simplify button styling
  - Files: `page.tsx`, `dashboard/page.tsx`, `onboarding-modal.tsx`
  - Remove `bg-gradient-to-r from-primary to-primary/80`
  - Replace with simple `bg-primary`
  - Remove `shadow-lg shadow-primary/20`

- [ ] **TASK 1.3:** Tone down color usage in globals.css
  - File: `globals.css`
  - Keep primary for actions only
  - Use neutral grays for most UI
  - Accent (green) only for completed states

- [ ] **TASK 1.4:** Remove decorative gradients from landing
  - File: `page.tsx`
  - Remove gradient text on hero title
  - Remove gradient separators in example plans
  - Remove gradient backgrounds from sections

### PHASE 2: HIERARCHY & CLARITY

- [ ] **TASK 2.1:** Simplify dashboard stats
  - File: `dashboard/page.tsx`
  - Remove icon decorations
  - Show only: Active Plans count, Tasks remaining today
  - Remove "overall progress %" (noise)

- [ ] **TASK 2.2:** Clear "next action" on every screen
  - Dashboard: "Continue [Hobby Name]" or "Start a Plan"
  - Plan page: "Next task: [Task Title]"
  - Make CTA dominant, reduce competing actions

- [ ] **TASK 2.3:** Improve calendar TODAY highlight
  - File: `calendar-view.tsx`
  - Make today AGGRESSIVE: larger, bolder, obvious
  - Dim past days more
  - Show "Today's tasks" expanded by default

- [ ] **TASK 2.4:** Reduce plan-card visual complexity
  - File: `plan-card.tsx`
  - Remove emoji badges ("Active", "Done")
  - Remove 3-column stats grid
  - Show: Hobby name, progress bar, "X/Y tasks"

### PHASE 3: REMOVE GAMIFICATION NOISE

- [ ] **TASK 3.1:** Remove or hide StreakBadge
  - File: `components/streak-badge.tsx`
  - Either delete or make it subtle text: "7 day streak"
  - No animated flames

- [ ] **TASK 3.2:** Remove CompletionCelebration
  - File: `components/completion-celebration.tsx`
  - Replace with subtle checkmark animation
  - No confetti, no "Great job!" messages

- [ ] **TASK 3.3:** Simplify onboarding modal
  - File: `onboarding-modal.tsx`
  - Remove gradient header icon
  - Simple text explanation
  - One clear CTA

- [ ] **TASK 3.4:** Remove hover scale effects
  - Files: `page.tsx`, `plan-card.tsx`
  - Remove `hover:scale-105` and similar
  - Keep subtle `hover:border-primary/50`

### PHASE 4: COPY IMPROVEMENTS

- [ ] **TASK 4.1:** Rewrite dashboard copy
  - "Welcome back" -> Just show user's current plan status
  - Remove motivational fluff
  - Show specific: "3 tasks today. 22 remaining."

- [ ] **TASK 4.2:** Rewrite landing page copy
  - Remove generic "Master any hobby"
  - Be specific: "Learn guitar in 4 weeks. 8 tasks per week. 15 min per day."
  - No exclamation marks

- [ ] **TASK 4.3:** Calendar labels
  - "Week 1 (Apr 12 - Apr 18)" is fine
  - Add: "3 of 8 tasks done" per week (factual, not celebratory)

### PHASE 5: FINAL POLISH

- [ ] **TASK 5.1:** Review all animations
  - File: `globals.css`
  - Remove `slideInUp`, `fadeInScale` if too flashy
  - Keep only subtle transitions (opacity, border-color)

- [ ] **TASK 5.2:** Typography consistency
  - Reduce heading sizes (5xl -> 3xl max)
  - Consistent font weights
  - Better line-height for readability

- [ ] **TASK 5.3:** Mobile review
  - Test all screens on small viewport
  - Ensure hierarchy works on mobile
  - No horizontal scroll

- [ ] **TASK 5.4:** Final color audit
  - Primary: actions only
  - Green: completed only
  - Gray: everything else
  - No decorative color usage

---

## DESIGN PRINCIPLES (NEW)

1. **Color = Meaning** — Never use color for decoration
2. **One Action** — Every screen has one dominant CTA
3. **Instant Clarity** — User knows their status in <1 second
4. **Calm Confidence** — Premium feel, not startup hype
5. **Data, Not Motivation** — Show facts, not cheerleading

---

## BEFORE/AFTER EXAMPLES

**Button:**
- Before: `bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20`
- After: `bg-primary hover:bg-primary/90`

**Card:**
- Before: `border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5`
- After: `border border-border bg-card`

**Copy:**
- Before: "You're doing great! Keep it up!"
- After: "4 of 12 tasks completed."

**Stats:**
- Before: 4-card grid with icons, percentages, gradients
- After: Single line: "2 active plans. 5 tasks today."

---

## FILES TO MODIFY

Priority order:
1. `app/globals.css` — Color simplification
2. `components/plan-card.tsx` — Card cleanup
3. `app/dashboard/page.tsx` — Dashboard simplification
4. `app/page.tsx` — Landing cleanup
5. `components/calendar-view.tsx` — Calendar improvements
6. `components/onboarding-modal.tsx` — Modal simplification
7. Remove: `streak-badge.tsx`, `completion-celebration.tsx`, `week-completion-card.tsx`

---

## SUCCESS CRITERIA

- [ ] No gradients used for decoration
- [ ] Color used only for meaning (action, success, error)
- [ ] Every screen has clear "next action"
- [ ] Copy is factual, not motivational
- [ ] Feels like Linear/Notion, not Dribbble

---

# PREVIOUS CONTEXT (for reference)

## Context: Why These Changes?

After UX audit, we identified that:
1. Users don't understand "4 weeks" is a real structure, not marketing
2. New users don't see examples of what they'll get
3. The planner page doesn't visually show the 4-week timeline
4. After plan completion, there's no clear "what's next"

**Completed quick wins (1-3):**
- [x] Redirect after registration: `/register` → `/planner` (not dashboard)
- [x] Added specificity bar on landing: "8-12 tasks | 15-30 min per day"
- [x] Positive progress messaging: "You're 75% done! Keep it up!"

---

## WIN 4: Visual Timeline on Planner [DONE]

**Priority**: High
**Complexity**: Medium (2-3 credits)
**Files modified**: `/app/planner/page.tsx`, `/lib/i18n-context.tsx`
**Status**: Completed

### Problem
On the planner page, users see task cards per week but don't have a visual understanding that this is exactly 4 weeks. The "Week 1, Week 2..." text exists but doesn't feel like a journey.

### Solution
Add a horizontal timeline component ABOVE the task cards showing:
```
[Week 1] ——— [Week 2] ——— [Week 3] ——— [Week 4]
   ●            ○            ○            ○
 Current      Upcoming     Upcoming     Finish!
```

### Implementation Details

1. **Create timeline component** in `/app/planner/page.tsx` (inline, not separate file):
```tsx
function WeekTimeline({ currentWeek }: { currentWeek: number }) {
  return (
    <div className="flex items-center justify-between mb-8 px-4">
      {[1, 2, 3, 4].map((week) => (
        <div key={week} className="flex flex-col items-center">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold",
            week <= currentWeek 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {week}
          </div>
          <span className="text-xs mt-1 text-muted-foreground">
            {t('planner.weekLabel')} {week}
          </span>
        </div>
      ))}
      {/* Connecting lines between circles */}
    </div>
  )
}
```

2. **Add connecting lines** between week circles using `after:` pseudo-elements or separate divs

3. **Show on Step 3 (Task Planning)** — render `<WeekTimeline currentWeek={1} />` above task cards

4. **Mobile responsive**: On small screens, make circles smaller (w-8 h-8) and hide "Week X" text

### Translations needed
Already have `planner.weekLabel` ("Week" / "Неделя")

---

## WIN 5: Example Plans Section on Landing

**Priority**: Medium
**Complexity**: Medium-High (3-4 credits)
**Files to modify**: `/app/page.tsx`, `/lib/i18n-context.tsx`
**Status**: ✅ Completed

### Problem
New visitors see "Master any hobby in 4 weeks" but have no idea what a plan actually looks like. They need to see concrete examples before signing up.

### Solution
Add a section "See how it works" with 2-3 expandable example plans showing real tasks.

### Implementation Details

1. **Add new section** between "How It Works" and "Popular Hobbies" sections on landing

2. **Create mock data** for 2-3 hobbies:
```tsx
const EXAMPLE_PLANS = [
  {
    hobby: 'guitar',
    hobbyName: 'Guitar',
    hobbyNameRu: 'Гитара',
    goal: 'Play 3 songs from start to finish',
    goalRu: 'Сыграть 3 песни от начала до конца',
    tasks: [
      { week: 1, title: 'Learn basic chords (C, G, D, Am)', titleRu: 'Выучить базовые аккорды (C, G, D, Am)' },
      { week: 1, title: 'Practice chord transitions', titleRu: 'Практиковать смену аккордов' },
      { week: 2, title: 'Learn your first song melody', titleRu: 'Выучить мелодию первой песни' },
      { week: 2, title: 'Practice strumming patterns', titleRu: 'Практиковать ритм-паттерны' },
      { week: 3, title: 'Learn second song', titleRu: 'Выучить вторую песню' },
      { week: 4, title: 'Polish and perform all 3 songs', titleRu: 'Отшлифовать и сыграть все 3 песни' },
    ]
  },
  {
    hobby: 'photography',
    hobbyName: 'Photography',
    hobbyNameRu: 'Фотография',
    goal: 'Create a portfolio with 10 great photos',
    goalRu: 'Создать портфолио из 10 отличных фото',
    tasks: [
      { week: 1, title: 'Learn camera basics (aperture, shutter, ISO)', titleRu: 'Изучить основы камеры (диафрагма, выдержка, ISO)' },
      { week: 1, title: 'Practice composition rules', titleRu: 'Практиковать правила композиции' },
      { week: 2, title: 'Golden hour photoshoot', titleRu: 'Фотосессия в золотой час' },
      { week: 3, title: 'Edit photos in Lightroom', titleRu: 'Обработать фото в Lightroom' },
      { week: 4, title: 'Curate final portfolio', titleRu: 'Собрать финальное портфолио' },
    ]
  }
]
```

3. **UI Component**:
```tsx
function ExamplePlansSection() {
  const [expanded, setExpanded] = useState<string | null>(null)
  
  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4">
          {t('landing.examplesTitle')} {/* "See what you'll get" */}
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          {t('landing.examplesSubtitle')} {/* "Real examples of AI-generated plans" */}
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
          {EXAMPLE_PLANS.map((plan) => (
            <Card 
              key={plan.hobby}
              className={cn(
                "cursor-pointer transition-all",
                expanded === plan.hobby && "ring-2 ring-primary"
              )}
              onClick={() => setExpanded(expanded === plan.hobby ? null : plan.hobby)}
            >
              <CardHeader>
                <CardTitle>{plan.hobbyName}</CardTitle>
                <CardDescription>{plan.goal}</CardDescription>
              </CardHeader>
              {expanded === plan.hobby && (
                <CardContent>
                  <div className="space-y-2">
                    {plan.tasks.map((task, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-primary font-medium">W{task.week}</span>
                        <span>{task.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

4. **Translations needed**:
```
'landing.examplesTitle': 'See what you'll get' / 'Посмотри, что ты получишь'
'landing.examplesSubtitle': 'Real examples of AI-generated plans' / 'Реальные примеры планов от AI'
```

---

## WIN 6: Onboarding Modal for New Users

**Priority**: Medium
**Complexity**: Medium (2-3 credits)
**Files modified**: `/app/dashboard/page.tsx`, `/components/onboarding-modal.tsx`, `/lib/i18n-context.tsx`
**Status**: ✅ Completed

### Problem
First-time users land on dashboard and don't understand the flow.

### Solution
Show a welcome modal on first visit explaining 3 steps:
1. Choose a hobby
2. Set your goal
3. Complete tasks over 4 weeks

### Implementation Details

1. **Track "hasSeenOnboarding"** in localStorage
2. **Show modal once** with 3-step explanation
3. **CTA button**: "Create Your First Plan" → `/planner`
4. **Skip option**: "I'll explore first"

```tsx
function OnboardingModal() {
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    if (!localStorage.getItem('hasSeenOnboarding')) {
      setOpen(true)
    }
  }, [])
  
  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setOpen(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('onboarding.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Step number={1} title="Choose a hobby" />
          <Step number={2} title="Set your goal" />
          <Step number={3} title="Complete tasks over 4 weeks" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>Skip</Button>
          <Button onClick={() => { handleClose(); router.push('/planner') }}>
            Create Your First Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---

## WIN 7: Calendar View for Plan

**Priority**: Low
**Complexity**: High (4-5 credits)
**Files modified**: `/app/plan/[id]/page.tsx`, `/components/calendar-view.tsx`, `/lib/i18n-context.tsx`
**Status**: ✅ Completed

### Problem
Users see tasks as a list but don't visualize when each task should be done.

### Solution
Add optional "Calendar View" toggle on plan page showing 28 days with tasks placed on specific days.

### Implementation Details

1. **View toggle**: List View | Calendar View
2. **Calendar grid**: 4 rows (weeks) x 7 columns (days)
3. **Tasks placed on days** - distributed across the week
4. **Click on day** → expand to see task details and complete tasks
5. **Today highlighted** with accent color
6. **Mobile responsive** with proper spacing

The calendar provides a visual representation of the 28-day plan, helping users understand task distribution and timing better. Tasks can be completed directly from expanded day cells.

---

## Implementation Order

1. **WIN 4** (Timeline) — Quick visual improvement, high impact
2. **WIN 5** (Examples) — Helps conversion on landing
3. **WIN 6** (Onboarding) — Helps retention for new users
4. **WIN 7** (Calendar) — Nice-to-have, can be skipped initially

---

## Notes for Next v0 Session

- All strings must be added to both EN and RU in `/lib/i18n-context.tsx`
- Use existing Tailwind classes and shadcn/ui components
- Test on mobile (use responsive classes: `sm:`, `md:`, `lg:`)
- Keep bundle size in mind — don't add heavy libraries
- Current primary color is orange/red (`primary` token)

---

## DESIGN SYSTEM v2 — PRESIDENT-LEVEL REDESIGN

**Status**: ✅ COMPLETED

### Overview
Complete visual transformation from "B2B dashboard" → "Achievement-driven lifestyle app". Inspired by Stripe, Linear, and Apple design quality.

### Color System Transformation

**Primary Brand:**
- Old: Cool blue (`oklch(0.55 0.18 250)`)
- **New**: Vibrant orange-red (`oklch(0.58 0.22 31)`) ✨
- Why: Orange-red = energy, achievement, forward momentum

**Success/Achievement:**
- Old: Generic secondary gray
- **New**: Bright green (`oklch(0.62 0.2 140)`) ✨
- Why: Green signals success globally

### New Components Created

1. **StreakBadge** — Animated flame showing consecutive days (motivation)
2. **WeekCompletionCard** — Visual progress per week with gradient bars
3. **CompletionCelebration** — Celebratory animation on task completion

### Components Redesigned

1. **CalendarView** — Better visual density, color-coded days, progress bars
2. **PlanCard** — Gradient backgrounds, emoji badges, stats grid
3. **Dashboard** — Achievement stats grid + prominent CTA
4. **Landing Page** — Gradient highlights, enhanced visual hierarchy
5. **Onboarding Modal** — Improved flow with gradient header

### Animation System

New animations in `globals.css`:
- `slideInUp` — Achievement cards slide in from bottom
- `fadeInScale` — Check marks scale in with cubic-bezier bounce
- `progressFill` — Progress bars animate smoothly

### Key Changes by Screen

**Landing Page:**
- Hero title with gradient text highlight
- CTA buttons with gradient + shadow
- Features section: numbered cards with hover gradients
- Example plans: gradient separator, smooth expand/collapse
- Hobbies: larger icons, hover scale
- Final CTA: large gradient card with flame icon

**Dashboard:**
- Achievement stats grid (4 cards: active, completed, tasks done, progress %)
- Each stat has icon + bold number + label
- Prominent gradient CTA for new users
- Achievement-first layout

**Plan Detail:**
- Calendar grid with color-coded days
- Week progress bars (primary→accent gradient)
- Task count badges per day
- Today highlighted with primary ring
- Smooth expand/collapse animations

**Onboarding:**
- Gradient header with flame icon
- Larger text, better spacing
- Green checkmarks for each step
- Primary gradient CTA button

### Typography Improvements
- Larger headings: 4xl→5xl/6xl
- Increased line-height for readability
- Bold weights for progress metrics
- Smaller supporting text with proper hierarchy

### Spacing & Layout
- More generous padding/margins
- Larger gaps between sections
- Bigger icons (20px→24px)
- Thicker progress bars (2px→2.5px)

### Files Modified (10 files)
1. `app/globals.css` — New color system + animations
2. `app/page.tsx` — Landing redesign
3. `app/dashboard/page.tsx` — Dashboard redesign + stats
4. `app/plan/[id]/page.tsx` — View toggle added
5. `components/calendar-view.tsx` — Visual improvements
6. `components/plan-card.tsx` — Premium styling
7. `components/onboarding-modal.tsx` — Enhanced flow
8. `components/streak-badge.tsx` — NEW
9. `components/week-completion-card.tsx` — NEW
10. `components/completion-celebration.tsx` — NEW

### Documentation
- See `DESIGN_SYSTEM_v2.md` for complete specification

### Results
✅ Transformed from "B2B dashboard" → "Lifestyle achievement app"
✅ Vibrant, energetic, motivating visual system
✅ Clear achievement progression throughout
✅ Celebratory moments on completions
✅ Premium, polished appearance (Stripe/Linear level)
✅ Bilingual support (EN/RU) maintained throughout
