import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { I18nProvider } from './i18n/I18nProvider'
import './styles.css'
import { AuthProvider } from './hooks/useAuth'
createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><AuthProvider><I18nProvider><App /></I18nProvider></AuthProvider></BrowserRouter></StrictMode>)