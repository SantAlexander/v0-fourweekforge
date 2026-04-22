'use client'

import { createContext, useContext, useCallback, useMemo, ReactNode } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>
  logout: () => Promise<void>
  refresh: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 401) return null
    throw new Error('Failed to fetch')
  }
  const data = await res.json()
  return data.user
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: user, isLoading, mutate } = useSWR<User | null>('/api/auth/me', fetcher, {
    revalidateOnFocus: false,
  })

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Ensure cookies are sent/received
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }
      // Wait for SWR to refetch and update user state before returning
      await mutate(data.user, { revalidate: false })
      return { success: true }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }, [mutate])

  const register = useCallback(async (email: string, name: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
        credentials: 'include', // Ensure cookies are sent/received
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || 'REGISTRATION_FAILED', message: data.message }
      }
      // Wait for SWR to update user state before returning
      await mutate(data.user, { revalidate: false })
      return { success: true }
    } catch {
      return { success: false, error: 'DATABASE_ERROR', message: 'Network error' }
    }
  }, [mutate])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    await mutate(null)
    router.push('/')
  }, [mutate, router])

  const refresh = useCallback(() => {
    mutate()
  }, [mutate])

  const value = useMemo(() => ({
    user: user ?? null,
    isLoading,
    login,
    register,
    logout,
    refresh,
  }), [user, isLoading, login, register, logout, refresh])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
