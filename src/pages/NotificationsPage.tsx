import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const STORAGE_KEY = 'smartkrishi_reminders'
const ANNOUNCEMENTS_KEY = 'smartkrishi_announcements'

type Reminder = {
  id: string
  type: string
  date: string
  message: string
  complete: boolean
}

type Announcement = {
  id: string
  title: string
  message: string
  createdAt: string
}

export function NotificationsPage() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as Reminder[] : []
  })
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(ANNOUNCEMENTS_KEY)
    return saved ? JSON.parse(saved) as Announcement[] : [{
      id: 'announce-1',
      title: 'Rain advisory',
      message: 'Light rain expected in the next three days. Keep drainage clear and monitor field moisture.',
      createdAt: new Date().toISOString(),
    }]
  })
  const [form, setForm] = useState({ type: 'Weather', date: '', message: '' })
  const [announceForm, setAnnounceForm] = useState({ title: '', message: '' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  }, [reminders])

  useEffect(() => {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements))
  }, [announcements])

  const addReminder = () => {
    if (!form.date || !form.message.trim()) return
    setReminders((current) => [{
      id: `reminder-${Date.now()}`,
      type: form.type,
      date: form.date,
      message: form.message.trim(),
      complete: false,
    }, ...current])
    setForm({ type: 'Weather', date: '', message: '' })
  }

  const toggleReminder = (id: string) => {
    setReminders((current) => current.map((item) => item.id === id ? { ...item, complete: !item.complete } : item))
  }

  const removeReminder = (id: string) => {
    setReminders((current) => current.filter((item) => item.id !== id))
  }

  const addAnnouncement = () => {
    if (!announceForm.title.trim() || !announceForm.message.trim()) return
    setAnnouncements((current) => [{
      id: `announcement-${Date.now()}`,
      title: announceForm.title.trim(),
      message: announceForm.message.trim(),
      createdAt: new Date().toISOString(),
    }, ...current])
    setAnnounceForm({ title: '', message: '' })
  }

  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <span className="section-kicker">FIELD ALERTS</span>
          <h1>Notifications & Reminders</h1>
          <p>Keep track of irrigation, crop alerts, and administrative guidance.</p>
        </div>
      </div>

      <div className="two-column-layout">
        <section className="card panel">
          <h2>Create reminder</h2>
          <div className="form-grid">
            <label className="field"><span>Type</span><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Weather</option><option>Irrigation</option><option>Disease</option><option>Fertilizer</option><option>Harvest</option></select></label>
            <label className="field"><span>Date</span><input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
            <label className="field full-width"><span>Reminder</span><textarea rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
          </div>
          <div className="form-actions">
            <button type="button" className="primary-btn" onClick={addReminder}>Save reminder</button>
          </div>
        </section>

        {user?.role === 'ADMIN' && (
          <section className="card panel">
            <h2>Send announcement</h2>
            <div className="form-grid">
              <label className="field full-width"><span>Title</span><input value={announceForm.title} onChange={(event) => setAnnounceForm({ ...announceForm, title: event.target.value })} /></label>
              <label className="field full-width"><span>Message</span><textarea rows={4} value={announceForm.message} onChange={(event) => setAnnounceForm({ ...announceForm, message: event.target.value })} /></label>
            </div>
            <div className="form-actions">
              <button type="button" className="primary-btn" onClick={addAnnouncement}>Publish</button>
            </div>
          </section>
        )}
      </div>

      <div className="two-column-layout" style={{ marginTop: 20 }}>
        <section className="card panel">
          <h2>Reminders</h2>
          <div className="list-stack">
            {reminders.length === 0 ? <div className="empty-state">No reminders created.</div> : reminders.map((item) => (
              <div key={item.id} className="list-item">
                <div className="recommendation-header">
                  <strong>{item.type}</strong>
                  <button type="button" className="ghost-btn" onClick={() => removeReminder(item.id)}>Delete</button>
                </div>
                <p>{item.message}</p>
                <small>{item.date}</small>
                <div className="form-actions">
                  <button type="button" className="secondary-btn" onClick={() => toggleReminder(item.id)}>{item.complete ? 'Mark active' : 'Mark complete'}</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card panel">
          <h2>Announcements</h2>
          <div className="list-stack">
            {announcements.map((item) => (
              <div key={item.id} className="list-item">
                <strong>{item.title}</strong>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
