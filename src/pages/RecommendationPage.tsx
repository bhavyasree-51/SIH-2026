import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'smartkrishi_recommendations'

type RecommendationInput = {
  soilType: string
  ph: number
  season: string
  temperature: number
  rainfall: number
  irrigation: string
  landArea: number
}

type Recommendation = {
  crop: string
  score: number
  reason: string
  waterRequirement: string
  duration: string
  yield: string
  revenue: string
  risk: 'Low' | 'Medium' | 'High'
}

const defaultInput: RecommendationInput = {
  soilType: 'Loamy',
  ph: 6.5,
  season: 'Kharif',
  temperature: 28,
  rainfall: 650,
  irrigation: 'Drip',
  landArea: 2,
}

function getRecommendation(input: RecommendationInput): Recommendation[] {
  const soil = input.soilType.toLowerCase()
  const season = input.season.toLowerCase()
  const rainfall = input.rainfall
  const temp = input.temperature
  const ph = input.ph

  const candidates: Recommendation[] = []

  if ((soil.includes('loam') || soil.includes('black')) && ph >= 6 && ph <= 7.2 && (season === 'kharif' || season === 'rabi')) {
    candidates.push({
      crop: 'Tomato',
      score: 92,
      reason: 'Loamy soil, balanced pH, and irrigation reliability suit strong tomato root development.',
      waterRequirement: '450-550 mm',
      duration: '90-110 days',
      yield: '18-22 tonnes/acre',
      revenue: '₹3.6L-₹4.8L',
      risk: 'Low',
    })
  }

  if (soil.includes('clay') || soil.includes('black')) {
    candidates.push({
      crop: 'Rice',
      score: 89,
      reason: 'Clay soil retains water well and suits rice during the monsoon season.',
      waterRequirement: '850-1200 mm',
      duration: '120-140 days',
      yield: '22-30 quintals/acre',
      revenue: '₹2.4L-₹3.6L',
      risk: 'Medium',
    })
  }

  if ((soil.includes('sandy') || soil.includes('loam')) && temp >= 25 && temp <= 32 && rainfall <= 900) {
    candidates.push({
      crop: 'Chilli',
      score: 88,
      reason: 'Warm weather and moderate rainfall maintain vegetative growth without heavy water stress.',
      waterRequirement: '500-700 mm',
      duration: '100-120 days',
      yield: '14-18 quintals/acre',
      revenue: '₹2.7L-₹4.1L',
      risk: 'Medium',
    })
  }

  if (ph >= 6.2 && ph <= 7.5 && (season === 'rabi' || season === 'summer')) {
    candidates.push({
      crop: 'Wheat',
      score: 84,
      reason: 'Cooler seasonal conditions and moderate rainfall support stable wheat yields.',
      waterRequirement: '400-500 mm',
      duration: '110-120 days',
      yield: '17-22 quintals/acre',
      revenue: '₹2.2L-₹3.2L',
      risk: 'Low',
    })
  }

  if (candidates.length === 0) {
    return [{
      crop: 'Maize',
      score: 80,
      reason: 'This field profile is flexible and maize can adapt to mixed seasonal conditions with careful irrigation.',
      waterRequirement: '450-650 mm',
      duration: '100-120 days',
      yield: '18-25 quintals/acre',
      revenue: '₹1.8L-₹3.1L',
      risk: 'Medium',
    }]
  }

  return candidates.slice(0, 3)
}

export function RecommendationPage() {
  const [form, setForm] = useState<RecommendationInput>(defaultInput)
  const [result, setResult] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as Recommendation[] : getRecommendation(defaultInput)
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
  }, [result])

  const cards = useMemo(() => result, [result])

  const runRecommendation = () => {
    const next = getRecommendation(form)
    setResult(next)
  }

  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <span className="section-kicker">CROP PLANNING ENGINE</span>
          <h1>Crop Recommendation</h1>
          <p>Match your field conditions to the most suitable crop plan.</p>
        </div>
      </div>

      <div className="two-column-layout">
        <section className="card panel">
          <h2>Field inputs</h2>
          <div className="form-grid">
            <label className="field">
              <span>Soil type</span>
              <select value={form.soilType} onChange={(event) => setForm((current) => ({ ...current, soilType: event.target.value }))}>
                <option>Loamy</option>
                <option>Clay</option>
                <option>Sandy</option>
                <option>Black</option>
                <option>Red</option>
              </select>
            </label>

            <label className="field">
              <span>pH</span>
              <input type="number" min="4" max="9" step="0.1" value={form.ph} onChange={(event) => setForm((current) => ({ ...current, ph: Number(event.target.value) || 0 }))} />
            </label>

            <label className="field">
              <span>Season</span>
              <select value={form.season} onChange={(event) => setForm((current) => ({ ...current, season: event.target.value }))}>
                <option>Kharif</option>
                <option>Rabi</option>
                <option>Summer</option>
                <option>Year-round</option>
              </select>
            </label>

            <label className="field">
              <span>Temperature (°C)</span>
              <input type="number" value={form.temperature} onChange={(event) => setForm((current) => ({ ...current, temperature: Number(event.target.value) || 0 }))} />
            </label>

            <label className="field">
              <span>Rainfall (mm)</span>
              <input type="number" value={form.rainfall} onChange={(event) => setForm((current) => ({ ...current, rainfall: Number(event.target.value) || 0 }))} />
            </label>

            <label className="field">
              <span>Irrigation</span>
              <select value={form.irrigation} onChange={(event) => setForm((current) => ({ ...current, irrigation: event.target.value }))}>
                <option>Drip</option>
                <option>Sprinkler</option>
                <option>Flood</option>
                <option>Rain-fed</option>
              </select>
            </label>

            <label className="field">
              <span>Land area (acres)</span>
              <input type="number" min="0.5" step="0.5" value={form.landArea} onChange={(event) => setForm((current) => ({ ...current, landArea: Number(event.target.value) || 0 }))} />
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="primary-btn" onClick={runRecommendation}>Get recommendation</button>
            <button type="button" className="secondary-btn" onClick={() => setForm(defaultInput)}>Reset</button>
          </div>
        </section>

        <section className="card panel">
          <h2>Recommendation summary</h2>
          <div className="list-stack">
            <div className="list-item">
              <strong>Best-fit crop</strong>
              <p>{cards[0]?.crop ?? 'None yet'}</p>
            </div>
            <div className="list-item">
              <strong>Expected score</strong>
              <p>{cards[0]?.score ?? 0}% match</p>
            </div>
            <div className="list-item">
              <strong>Water planning</strong>
              <p>{cards[0]?.waterRequirement ?? 'Not calculated'}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="card panel" style={{ marginTop: 20 }}>
        <h2>Recommended crops</h2>
        <div className="recommendation-grid">
          {cards.map((item) => (
            <div key={item.crop} className="recommendation-card">
              <div className="recommendation-header">
                <h3>{item.crop}</h3>
                <span className={`risk-badge ${item.risk.toLowerCase()}`}>{item.risk}</span>
              </div>
              <div className="score-line">
                <span>Recommendation score</span>
                <strong>{item.score}%</strong>
              </div>
              <p>{item.reason}</p>
              <ul>
                <li><strong>Water:</strong> {item.waterRequirement}</li>
                <li><strong>Duration:</strong> {item.duration}</li>
                <li><strong>Yield:</strong> {item.yield}</li>
                <li><strong>Revenue:</strong> {item.revenue}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
