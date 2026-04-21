// Common types used across the app
export type Locale = 'en' | 'ru'

export interface I18nContext {
  locale: Locale
  setLocale: (locale: Locale) => void
}
