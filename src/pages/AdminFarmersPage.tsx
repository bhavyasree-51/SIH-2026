import { useEffect, useState } from 'react'
import { HeartHandshake, Phone, Search, UserCheck, Users } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

const FARMERS_KEY = 'smartkrishi_farmers'

type FarmerRecord = {
  id: string
  name: string
  email: string
  phone: string
  district: string
  state: string
  language: 'en' | 'hi' | 'te'
  createdAt?: string
}

export function FarmersPage() {
  const { language } = useI18n()
  const [search, setSearch] = useState('')
  const [farmers, setFarmers] = useState<FarmerRecord[]>(() => {
    const saved = localStorage.getItem(FARMERS_KEY)
    if (!saved) {
      const initial: FarmerRecord[] = [
        { id: 'farmer-1', name: 'Ramesh Patel', email: '9876543210@kisanmitra.in', phone: '9876543210', district: 'Nalgonda', state: 'Telangana', language: 'te', createdAt: new Date().toISOString() },
        { id: 'farmer-2', name: 'Sunitha Reddy', email: '9123456780@kisanmitra.in', phone: '9123456780', district: 'Warangal', state: 'Telangana', language: 'te', createdAt: new Date().toISOString() },
        { id: 'farmer-3', name: 'Rajesh Kumar', email: '9988776655@kisanmitra.in', phone: '9988776655', district: 'Nashik', state: 'Maharashtra', language: 'hi', createdAt: new Date().toISOString() },
      ]
      localStorage.setItem(FARMERS_KEY, JSON.stringify(initial))
      return initial
    }

    try {
      return JSON.parse(saved) as FarmerRecord[]
    } catch {
      return []
    }
  })

  // Listen to storage events from other tabs or real-time registration
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem(FARMERS_KEY)
      if (saved) {
        try {
          setFarmers(JSON.parse(saved))
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const filtered = farmers.filter((f) => {
    const q = search.toLowerCase()
    return (
      f.name.toLowerCase().includes(q) ||
      f.phone.includes(q) ||
      f.district.toLowerCase().includes(q) ||
      f.state.toLowerCase().includes(q)
    )
  })

  return (
    <div className="module-page">
      <div className="admin-heading" style={{ marginBottom: '24px' }}>
        <div>
          <span className="section-kicker">
            <HeartHandshake size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            {language === 'te' ? 'రైతు డైరెక్టరీ' : language === 'hi' ? 'किसान निर्देशिका' : 'FIELD VOLUNTEER DIRECTORY'}
          </span>
          <h1>
            {language === 'te' ? 'నమోదైన రైతుల జాబితా' : language === 'hi' ? 'पंजीकृत किसान सूची' : 'Registered Farmers Directory'}
          </h1>
          <p>
            {language === 'te'
              ? 'గ్రామస్థాయిలో నమోదైన రైతుల సమాచారం మరియు సంప్రదింపు వివరాలు.'
              : language === 'hi'
                ? 'ग्राम स्तर पर नामांकित किसानों की जानकारी और संपर्क विवरण।'
                : 'Real-time directory of enrolled village farmers, districts, and language preferences.'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="admin-demo" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserCheck size={14} />
            {farmers.length} {language === 'te' ? 'రైతులు ప్రత్యక్షంగా' : language === 'hi' ? 'किसान लाइव' : 'Farmers Active'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
          <Search size={17} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'te' ? 'రైతు పేరు, ఫోన్ లేదా జిల్లా ద్వారా వెతకండి...' : language === 'hi' ? 'किसान का नाम, फोन या जिला खोजें...' : 'Search farmer name, mobile, district...'}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
            }}
          />
        </div>
      </div>

      <section className="card panel" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        <div className="table-wrap">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: '#475569' }}>Name</th>
                <th style={{ padding: '12px 14px', color: '#475569' }}>Phone / Contact</th>
                <th style={{ padding: '12px 14px', color: '#475569' }}>District</th>
                <th style={{ padding: '12px 14px', color: '#475569' }}>State</th>
                <th style={{ padding: '12px 14px', color: '#475569' }}>Preferred Lang</th>
                <th style={{ padding: '12px 14px', color: '#475569' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((farmer) => (
                <tr key={farmer.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                        {farmer.name.slice(0, 2).toUpperCase()}
                      </span>
                      {farmer.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>
                    <a href={`tel:${farmer.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', textDecoration: 'none', fontWeight: 500 }}>
                      <Phone size={14} />
                      {farmer.phone}
                    </a>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{farmer.district}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{farmer.state}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', fontSize: '0.76rem', fontWeight: 600 }}>
                      {farmer.language ? farmer.language.toUpperCase() : 'TE'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700 }}>
                      ● Active
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    No farmers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
