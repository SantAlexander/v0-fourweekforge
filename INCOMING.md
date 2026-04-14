# INCOMING: Planned Changes

This file contains detailed specifications for upcoming UI/UX improvements.
Another v0 session can use this as a guide to implement these changes.

---

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
**Files to modify**: `/app/dashboard/page.tsx` or create `/components/onboarding-modal.tsx`

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
**Files to modify**: `/app/plan/[id]/page.tsx`, possibly new component

### Problem
Users see tasks as a list but don't visualize when each task should be done.

### Solution
Add optional "Calendar View" toggle on plan page showing 28 days with tasks placed on specific days.

### Implementation Details

1. **Add view toggle**: List View | Calendar View
2. **Calendar grid**: 4 rows (weeks) x 7 columns (days)
3. **Tasks placed on days** based on `due_date` or calculated from `start_date + week_index`
4. **Click on day** → expand to see task details
5. **Today highlighted** with accent color

This is a larger change and may require:
- Storing `due_date` for each task (already in schema)
- Calculating dates from plan `start_date`
- Building responsive calendar grid

**Recommendation**: Implement this last, after wins 4-6 are complete.

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
