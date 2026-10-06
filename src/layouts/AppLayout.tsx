import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  CircleHelp,
  CloudSun,
  Home,
  Leaf,
  LogOut,
  Menu,
  MessageCircle,
  ScanLine,
  Sprout,
  WalletCards,
  X,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useAuth } from '../hooks/useAuth'
import type { Language } from '../i18n/translations'
import { FarmerHelpModal } from '../components/FarmerHelpModal'

const navigation = [
  { to: '/farmer/dashboard', key: 'home' as const, icon: Home },
  { to: '/farmer/weather', key: 'weather' as const, icon: CloudSun },
  { to: '/farmer/recommendation', key: 'cropRecommendation' as const, icon: Sprout },
  { to: '/farmer/disease', key: 'diseaseDetection' as const, icon: ScanLine },
  { to: '/farmer/crops', key: 'cropInfo' as const, icon: Leaf },
  { to: '/farmer/profit', key: 'profit' as const, icon: WalletCards },
  { to: '/farmer/farm', key: 'myFarm' as const, icon: Sprout },
  { to: '/farmer/community', key: 'community' as const, icon: Leaf },
  { to: '/farmer/notifications', key: 'notifications' as const, icon: Bell },
  { to: '/farmer/voice', key: 'voiceAssistant' as const, icon: MessageCircle },
  { to: '/farmer/profile', key: 'profile' as const, icon: CircleHelp },
]

export function AppLayout() {
  const { language, setLanguage, t } = useI18n()
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={menuOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <div className="brand">
          <img src="/logo.png" alt="Kisan Mitra Logo" className="brand-logo-img" />
          <div>
            <strong>Kisan<span>Mitra</span></strong>
            <small>{t('tagline') || 'Smart Farming Assistant'}</small>
          </div>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navigation.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/farmer/dashboard'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Icon size={19} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="help-box"
            onClick={() => setHelpOpen(true)}
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(29, 122, 79, 0.15)' }}
            aria-label="Open Farm Help Center"
          >
            <CircleHelp size={19} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <strong>{language === 'te' ? 'సహాయం కావాలా?' : language === 'hi' ? 'मदद चाहिए?' : 'Need help?'}</strong>
              <span>{language === 'te' ? 'కిసాన్ కాల్ సెంటర్ & AI' : language === 'hi' ? 'किसान कॉल सेंटर व एआई' : 'Talk to our farm team'}</span>
            </div>
          </button>
          <div className="profile">
            <div className="avatar">{(user?.name ?? 'KP').slice(0, 2).toUpperCase()}</div>
            <div>
              <strong>{user?.name ?? 'Kisan Farmer'}</strong>
              <span>{t('location')}</span>
            </div>
            <span className="online-dot" />
          </div>
          <button className="farmer-logout" onClick={() => void logout().then(() => navigate('/login'))}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <FarmerHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      {menuOpen && <button className="scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="mobile-brand">
            <img src="/logo.png" alt="Kisan Mitra" className="mobile-logo-img" />
            Kisan<span>Mitra</span>
          </div>
          <div className="topbar-actions">
            <label className="language-select">
              <span>Language</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Select language">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="te">తెలుగు</option>
              </select>
            </label>
            <NavLink to="/farmer/notifications" className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              <i />
            </NavLink>
          </div>
        </header>

        <div className="page-wrap">
          <Outlet />
        </div>
      </main>
    </div>
  )
}