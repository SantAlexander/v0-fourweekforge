// Shared Hooks - useAsync
// Generic hook for async operations with loading, error, and data states

import { useState, useCallback } from 'react'

interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error'
  data: T | null
  error: Error | null
  isLoading: boolean
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): UseAsyncState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
    isLoading: false,
  })

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null, isLoading: true })
    try {
      const data = await asyncFunction()
      setState({ status: 'success', data, error: null, isLoading: false })
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
        isLoading: false,
      })
    }
  }, [asyncFunction])

  return {
    ...state,
    execute,
  }
}
