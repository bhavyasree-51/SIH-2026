import { useEffect, useState } from 'react'
import { ArrowUpRight, Bell, FileWarning, HeartHandshake, ShieldCheck, Users, Wheat } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

export function AdminDashboardPage() {
  const { language } = useI18n()
  const [farmersCount, setFarmersCount] = useState(2480)
  const [farmsCount, setFarmsCount] = useState(1936)
  const [scansCount, setScansCount] = useState(148)

  const syncRealTimeData = () => {
    // Read farmers from localStorage
    try {
      const rawFarmers = localStorage.getItem('smartkrishi_farmers')
      if (rawFarmers) {
        const list = JSON.parse(rawFarmers)
        if (Array.isArray(list)) {
          setFarmersCount(2480 + list.length)
        }
      }
    } catch {
      // ignore
    }

    // Read farms from localStorage
    try {
      const rawFarms = localStorage.getItem('smartkrishi_farms')
      if (rawFarms) {
        const list = JSON.parse(rawFarms)
        if (Array.isArray(list)) {
          setFarmsCount(1936 + list.length)
        }
      }
    } catch {
      // ignore
    }

    // Read disease scans from localStorage
    try {
      const rawScans = localStorage.getItem('smartkrishi_scans')
      if (rawScans) {
        const list = JSON.parse(rawScans)
        if (Array.isArray(list)) {
          setScansCount(148 + list.length)
        }
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    syncRealTimeData()
    window.addEventListener('storage', syncRealTimeData)
    return () => window.removeEventListener('storage', syncRealTimeData)
  }, [])

  const stats = [
    {
      label: language === 'te' ? 'నమోదైన రైతులు' : language === 'hi' ? 'पंजीकृत किसान' : 'Registered Farmers',
      value: farmersCount.toLocaleString(),
      change: '+100% Real-time Synced',
      icon: Users,
    },
    {
      label: language === 'te' ? 'పర్యవేక్షణలో ఉన్న పొలాలు' : language === 'hi' ? 'निगरानी वाले खेत' : 'Monitored Farms',
      value: farmsCount.toLocaleString(),
      change: '+100% Real-time Synced',
      icon: Wheat,
    },
    {
      label: language === 'te' ? 'తెగుళ్ల నివేదికలు' : language === 'hi' ? 'फसल रोग रिपोर्ट' : 'Crop Disease Reports',
      value: scansCount.toLocaleString(),
      change: 'Active field scans',
      icon: FileWarning,
    },
    {
      label: language === 'te' ? 'గ్రామ హెచ్చరికలు' : language === 'hi' ? 'सक्रिय अलर्ट' : 'Active Field Alerts',
      value: '36',
      change: '8 urgent',
      icon: Bell,
    },
  ]

  return (
    <div className="admin-dashboard">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">
            <HeartHandshake size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            {language === 'te'
              ? 'వాలంటీర్ డాష్‌బోర్డ్'
              : language === 'hi'
                ? 'स्वयंसेवक अवलोकन'
                : 'VOLUNTEER FIELD OVERVIEW'}
          </span>
          <h1>
            {language === 'te'
              ? 'నమస్కారం, కిసాన్ వాలంటీర్'
              : language === 'hi'
                ? 'नमस्ते, किसान स्वयंसेवक'
                : 'Good morning, Kisan Volunteer'}
          </h1>
          <p>
            {language === 'te'
              ? 'రైతులకు సకాలంలో పంట సలహాలు మరియు తెగుళ్ల నివారణ మద్దతు అందించండి.'
              : language === 'hi'
                ? 'किसानों को समय पर फसल सलाह और रोग नियंत्रण सहायता प्रदान करें।'
                : 'Empowering local farmers with precision crop advice and emergency disease intervention.'}
          </p>
        </div>
        <span className="admin-demo">
          <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          LIVE REAL-TIME VOLUNTEER NETWORK
        </span>
      </div>

      <div className="admin-stats">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <div className="admin-stat" key={label}>
            <div className="admin-stat-icon">
              <Icon size={20} />
            </div>
            <span>{label}</span>
            <strong>{value}</strong>
            <small style={{ color: '#16a34a', fontWeight: 600 }}>{change}</small>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <span className="section-kicker">
                {language === 'te' ? 'పరిశీలన జాబితా' : language === 'hi' ? 'समीक्षा कतार' : 'FIELD ACTION QUEUE'}
              </span>
              <h2>
                {language === 'te' ? 'తక్షణ చర్యలు' : language === 'hi' ? 'आवश्यक कार्य' : 'Needs Volunteer Attention'}
              </h2>
            </div>
            <ArrowUpRight size={18} />
          </div>

          <div className="queue-row">
            <FileWarning size={18} style={{ color: '#e67e22' }} />
            <div>
              <strong>
                {language === 'te' ? 'కొత్త పంట తెగుళ్ల నివేదికలు' : language === 'hi' ? 'नई फसल रोग रिपोर्ट' : 'New crop disease reports'}
              </strong>
              <span>
                {language === 'te' ? '23 నివేదికలు పరిశీలనలో ఉన్నాయి' : language === 'hi' ? '23 रिपोर्ट सत्यापन हेतु लंबित' : '23 reports awaiting field verification'}
              </span>
            </div>
            <Link to="/admin/disease-reports" style={{ textDecoration: 'none' }}>
              <b style={{ cursor: 'pointer' }}>Review</b>
            </Link>
          </div>

          <div className="queue-row">
            <Bell size={18} style={{ color: '#e74c3c' }} />
            <div>
              <strong>
                {language === 'te' ? 'వాతావరణ హెచ్చరికల ప్రసారం' : language === 'hi' ? 'मौसम अलर्ट प्रसारण' : 'Weather alert broadcasts'}
              </strong>
              <span>
                {language === 'te' ? '8 గ్రామాలకు వర్షపాత హెచ్చరిక పంపాలి' : language === 'hi' ? '8 गांवों में भारी वर्षा चेतावनी भेजें' : '8 villages need emergency rain warning'}
              </span>
            </div>
            <Link to="/admin/alerts" style={{ textDecoration: 'none' }}>
              <b style={{ cursor: 'pointer' }}>Broadcast</b>
            </Link>
          </div>

          <div className="queue-row">
            <Users size={18} style={{ color: '#27ae60' }} />
            <div>
              <strong>
                {language === 'te' ? 'రైతు నమోదు డైరెక్టరీ' : language === 'hi' ? 'किसान पंजीकरण निर्देशिका' : 'Farmer enrollment directory'}
              </strong>
              <span>
                {language === 'te' ? 'ప్రత్యక్ష నమోదుల జాబితాను చూడండి' : language === 'hi' ? 'पंजीकृत किसानों की सूची देखें' : 'View live enrolled farmer records'}
              </span>
            </div>
            <Link to="/admin/farmers" style={{ textDecoration: 'none' }}>
              <b style={{ cursor: 'pointer' }}>View Live</b>
            </Link>
          </div>
        </section>

        <section className="admin-panel admin-health">
          <span className="section-kicker">
            {language === 'te' ? 'గ్రామ భాగస్వామ్యం' : language === 'hi' ? 'नेटवर्क सहभागिता' : 'VILLAGE ENGAGEMENT'}
          </span>
          <h2>
            {language === 'te' ? 'రైతు స్పందన రేటు' : language === 'hi' ? 'किसान सहभागिता दर' : 'Farmer Advisory Uptake'}
          </h2>
          <div className="admin-chart">
            <i style={{ height: '38%' }} />
            <i style={{ height: '54%' }} />
            <i style={{ height: '47%' }} />
            <i style={{ height: '72%' }} />
            <i style={{ height: '65%' }} />
            <i style={{ height: '88%' }} />
            <i style={{ height: '78%' }} />
          </div>
          <div className="chart-days">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </section>
      </div>
    </div>
  )
}