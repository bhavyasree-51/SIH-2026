import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'smartkrishi_crop_data'

type CropRecord = {
  id: string
  name: string
  season: string
  soil: string
  water: string
  yield: string
  notes: string
}

const defaultCrops: CropRecord[] = [
  { id: 'tomato', name: 'Tomato', season: 'Kharif / Rabi', soil: 'Loamy', water: '450-550 mm', yield: '18-22 t/acre', notes: 'Needs steady moisture and proper airflow.' },
  { id: 'rice', name: 'Rice', season: 'Kharif', soil: 'Clay', water: '850-1200 mm', yield: '22-30 q/acre', notes: 'High water retention and careful drainage are required.' },
  { id: 'chilli', name: 'Chilli', season: 'Kharif', soil: 'Sandy loam', water: '500-700 mm', yield: '14-18 q/acre', notes: 'Good for warm conditions with moderate irrigation.' },
]

export function CropInfoPage() {
  const [records, setRecords] = useState<CropRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as CropRecord[] : defaultCrops
  })
  const [name, setName] = useState('')
  const [season, setSeason] = useState('Kharif')
  const [soil, setSoil] = useState('Loamy')
  const [water, setWater] = useState('500 mm')
  const [yieldValue, setYieldValue] = useState('20 t/acre')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records])

  const items = useMemo(() => records, [records])

  const addCrop = () => {
    if (!name.trim()) return
    setRecords((current) => [{ id: `crop-${Date.now()}`, name: name.trim(), season, soil, water, yield: yieldValue, notes }, ...current])
    setName('')
    setSeason('Kharif')
    setSoil('Loamy')
    setWater('500 mm')
    setYieldValue('20 t/acre')
    setNotes('')
  }

  const removeCrop = (id: string) => {
    setRecords((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <span className="section-kicker">CROP KNOWLEDGE BASE</span>
          <h1>Crop Information</h1>
          <p>Understand crop suitability, season, and water needs.</p>
        </div>
      </div>

      <section className="card panel">
        <h2>Add crop data</h2>
        <div className="form-grid">
          <label className="field"><span>Crop name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="field"><span>Season</span><input value={season} onChange={(event) => setSeason(event.target.value)} /></label>
          <label className="field"><span>Soil</span><input value={soil} onChange={(event) => setSoil(event.target.value)} /></label>
          <label className="field"><span>Water need</span><input value={water} onChange={(event) => setWater(event.target.value)} /></label>
          <label className="field"><span>Yield</span><input value={yieldValue} onChange={(event) => setYieldValue(event.target.value)} /></label>
          <label className="field full-width"><span>Notes</span><input value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
        </div>
        <div className="form-actions">
          <button type="button" className="primary-btn" onClick={addCrop}>Save crop data</button>
        </div>
      </section>

      <section className="card panel" style={{ marginTop: 20 }}>
        <h2>Crops</h2>
        <div className="card-grid">
          {items.map((crop) => (
            <div key={crop.id} className="list-item">
              <div className="recommendation-header">
                <h3>{crop.name}</h3>
                <button type="button" className="ghost-btn" onClick={() => removeCrop(crop.id)}>Delete</button>
              </div>
              <p><strong>Season:</strong> {crop.season}</p>
              <p><strong>Soil:</strong> {crop.soil}</p>
              <p><strong>Water need:</strong> {crop.water}</p>
              <p><strong>Typical yield:</strong> {crop.yield}</p>
              <p>{crop.notes}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
