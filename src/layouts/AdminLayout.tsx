import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  FileWarning,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Wheat,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../i18n/I18nProvider'

const links = [
  { to: '/admin/dashboard', label: 'Volunteer Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/farmers', label: 'Farmer Directory', icon: Users },
  { to: '/admin/farms', label: 'Farm Land Records', icon: Wheat },
  { to: '/admin/disease-reports', label: 'Disease Field Reports', icon: FileWarning },
  { to: '/admin/alerts', label: 'Weather & Pest Alerts', icon: Bell },
  { to: '/admin/analytics', label: 'Field Analytics', icon: BarChart3 },
  { to: '/admin/content', label: 'Agronomy Knowledge', icon: BookOpen },
  { to: '/admin/community', label: 'Community Oversight', icon: ClipboardList },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const { language } = useI18n()
  const navigate = useNavigate()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt="Kisan Mitra Logo" className="brand-logo-img" />
          <div>
            <strong>Kisan<span>Mitra</span></strong>
            <small>
              {language === 'te'
                ? 'గ్రామ వాలంటీర్ కేంద్రం'
                : language === 'hi'
                  ? 'किसान स्वयंसेवक केंद्र'
                  : 'FIELD VOLUNTEER DESK'}
            </small>
          </div>
        </div>

        <div className="volunteer-badge">
          <HeartHandshake size={15} />
          <span>
            {language === 'te'
              ? 'గ్రామ సేవా విభాగం'
              : language === 'hi'
                ? 'कृषि सहायता केंद्र'
                : 'Gram Sahayak Network'}
          </span>
        </div>

        <nav>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'admin-nav active' : 'admin-nav')}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="admin-logout"
          onClick={() => void logout().then(() => navigate('/login/admin'))}
        >
          <LogOut size={17} />
          <span>
            {language === 'te'
              ? 'లాగౌట్'
              : language === 'hi'
                ? 'लॉग आउट'
                : 'Sign out'}
          </span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Menu size={20} />
            <span style={{ fontWeight: 600 }}>
              {language === 'te'
                ? 'వాలంటీర్ కార్యస్థలం'
                : language === 'hi'
                  ? 'स्वयंसेवक कार्यक्षेत्र'
                  : 'Volunteer Field Workspace'}
            </span>
          </div>
          <div className="admin-user">
            <div>
              <strong>{user?.name || 'Kisan Volunteer'}</strong>
              <small style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
                Field Sahayak / Volunteer
              </small>
            </div>
            <b>VL</b>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}