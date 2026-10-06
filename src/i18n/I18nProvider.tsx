import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Language, type TranslationKey } from './translations'
type I18nContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string }
const I18nContext = createContext<I18nContextValue | null>(null)
export function I18nProvider({ children }: { children: ReactNode }) { const [language, setLanguage] = useState<Language>('en'); const t = (key: TranslationKey) => (translations[language] as Record<TranslationKey, string>)[key] ?? translations.en[key]; return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider> }
export function useI18n() { const context = useContext(I18nContext); if (!context) throw new Error('useI18n must be used within I18nProvider'); return context }