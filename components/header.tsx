'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Flame, User, LogOut, LayoutDashboard, Plus } from 'lucide-react'

export function Header() {
  const { user, logout, isLoading } = useAuth()
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">FourWeekForge</span>
        </Link>

        <nav className="flex items-center gap-2">
          <LanguageSwitcher />
          
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t('header.dashboard')}
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/planner">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('header.newPlan')}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('header.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('header.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t('header.login')}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">{t('header.getStarted')}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
