import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  ChevronRight,
  CloudSun,
  Droplets,
  Leaf,
  MapPin,
  MessageCircle,
  Sprout,
  Sun,
  Wind,
} from 'lucide-react'
import { HealthRing } from '../components/HealthRing'
import { StatusPill } from '../components/StatusPill'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../i18n/I18nProvider'

export function HomePage() {
  const { t, language } = useI18n()
  const { user } = useAuth()
  const [farmerCrop, setFarmerCrop] = useState('Tomato')
  const [farmerAcres, setFarmerAcres] = useState('2.5')

  // Load custom farm details for current user if available
  useEffect(() => {
    try {
      const farmsRaw = localStorage.getItem('smartkrishi_farms')
      if (farmsRaw) {
        const farms = JSON.parse(farmsRaw)
        if (Array.isArray(farms) && farms.length > 0) {
          const userFarm = farms.find((f: any) => f.userId === user?.id) || farms[0]
          if (userFarm) {
            if (userFarm.crops && userFarm.crops[0]) setFarmerCrop(userFarm.crops[0].name || 'Tomato')
            if (userFarm.sizeAcres) setFarmerAcres(String(userFarm.sizeAcres))
          }
        }
      }
    } catch {
      // ignore
    }
  }, [user])

  const displayName =
    user?.name?.split(' ')[0] ||
    user?.name ||
    (language === 'te' ? 'రైతు' : language === 'hi' ? 'किसान' : 'Farmer')

  const userLocation = user?.location || t('location') || 'Nalgonda, Telangana'

  return (
    <div className="dashboard">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">
            {t('welcomeBack')} <span className="wave">✦</span>
          </p>
          <h1>
            {t('goodMorning')}, {displayName}
          </h1>
          <p className="subhead">{t('farmSnapshot')}</p>
        </div>
        <div className="location">
          <MapPin size={16} />
          <span>{userLocation}</span>
          <span className="live-dot" />
        </div>
      </div>

      <section className="top-grid">
        <div className="weather-card card">
          <div className="card-heading">
            <div>
              <span className="section-kicker">{t('weather')}</span>
              <h2>{t('clearSky')}</h2>
            </div>
            <CloudSun className="weather-icon" size={42} />
          </div>
          <div className="temperature">{t('degrees')}</div>
          <div className="weather-meta">
            <span>
              <Droplets size={15} />
              {t('humidity')}
            </span>
            <span>
              <Wind size={15} />
              12 km/h
            </span>
          </div>
          <a className="text-button" href="/farmer/weather">
            {t('seeForecast')} <ChevronRight size={16} />
          </a>
        </div>

        <div className="crop-card card">
          <div className="crop-image" />
          <div className="crop-content">
            <span className="section-kicker">{t('currentCrop')}</span>
            <h2>{farmerCrop}</h2>
            <p>
              {farmerAcres} {language === 'te' ? 'ఎకరాలు' : language === 'hi' ? 'एकड़' : 'acres'} <span>·</span> Kharif 2026
            </p>
            <StatusPill>{t('healthy')}</StatusPill>
          </div>
        </div>

        <div className="health-card card">
          <div className="health-header">
            <div>
              <span className="section-kicker">{t('farmHealth')}</span>
              <h2>Looking good</h2>
            </div>
            <HealthRing score={78} />
          </div>
          <div className="health-bars">
            <MiniHealth label={t('soil')} value="82" tone="green" />
            <MiniHealth label={t('water')} value="64" tone="blue" />
            <MiniHealth label={t('diseaseRisk')} value="18" tone="amber" />
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-title">
          <div>
            <span className="section-kicker">{t('todayOnFarm')}</span>
            <h2>{t('topActions')}</h2>
          </div>
          <a className="outline-button" href="/farmer/reminders">
            {t('viewAll')} <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="action-grid">
          <ActionCard
            number="01"
            icon={<Droplets />}
            title={t('checkMoisture')}
            desc={t('checkMoistureDesc')}
            cta={t('waterNow')}
            tone="water"
            href="/farmer/irrigation"
          />
          <ActionCard
            number="02"
            icon={<Leaf />}
            title={t('scoutLeaves')}
            desc={t('scoutDesc')}
            cta={t('markDone')}
            tone="scout"
            href="/farmer/disease"
          />
          <ActionCard
            number="03"
            icon={<MessageCircle />}
            title={t('askCopilot')}
            desc={t('askDesc')}
            cta={t('openCopilot')}
            tone="copilot"
            href="/farmer/copilot"
          />
        </div>
      </section>

      <section className="section-block quick-section">
        <div className="section-title">
          <div>
            <span className="section-kicker">{t('quickTools')}</span>
            <h2>Farm intelligence, one tap away</h2>
          </div>
        </div>
        <div className="quick-tools">
          <QuickTool icon={<Sun />} label={t('weatherTool')} href="/farmer/weather" />
          <QuickTool icon={<Leaf />} label={t('soilTool')} href="/farmer/farm" />
          <QuickTool icon={<Droplets />} label={t('irrigationTool')} href="/farmer/irrigation" />
          <QuickTool icon={<Sprout />} label={t('recommendTool')} href="/farmer/recommendation" />
        </div>
      </section>
    </div>
  )
}

function MiniHealth({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="mini-health">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="bar">
        <i className={`bar-${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ActionCard({
  number,
  icon,
  title,
  desc,
  cta,
  tone,
  href,
}: {
  number: string
  icon: React.ReactNode
  title: string
  desc: string
  cta: string
  tone: string
  href?: string
}) {
  const content = (
    <>
      <div className="action-top">
        <span className="action-number">{number}</span>
        <span className={`action-icon icon-${tone}`}>{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="action-cta">
        {cta} <ChevronRight size={15} />
      </span>
    </>
  )
  return href ? (
    <a className={`action-card action-${tone}`} href={href}>
      {content}
    </a>
  ) : (
    <button className={`action-card action-${tone}`}>{content}</button>
  )
}

function QuickTool({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a href={href} className="quick-tool">
      {icon}
      <span>{label}</span>
      <ChevronRight size={16} />
    </a>
  )
}