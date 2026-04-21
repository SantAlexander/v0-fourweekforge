// API service functions
// This file re-exports API utilities for cleaner imports

export async function fetcher(url: string) {
  const response = await fetch(url)
  return response.json()
}
