import { useEffect, useState } from 'react'

const STORAGE_KEY = 'smartkrishi_farms'

type Farm = {
  id: string
  name: string
  location: string
  acreage: number
  soil: string
  crops: Array<{
    id: string
    name: string
    sowingDate: string
    expectedHarvestDate: string
  }>
}

export function FarmPage() {
  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as Farm[] : []
  })
  const [form, setForm] = useState({ name: '', location: '', acreage: '2.5', soil: 'Loamy' })
  const [cropForm, setCropForm] = useState({ farmId: '', name: 'Tomato', sowingDate: '', expectedHarvestDate: '' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farms))
  }, [farms])

  const addFarm = () => {
    if (!form.name.trim()) return
    setFarms((current) => [{
      id: `farm-${Date.now()}`,
      name: form.name.trim(),
      location: form.location.trim() || 'District',
      acreage: Number(form.acreage) || 0,
      soil: form.soil,
      crops: [],
    }, ...current])
    setForm({ name: '', location: '', acreage: '2.5', soil: 'Loamy' })
  }

  const deleteFarm = (id: string) => {
    setFarms((current) => current.filter((farm) => farm.id !== id))
  }

  const addCrop = () => {
    if (!cropForm.farmId || !cropForm.name || !cropForm.sowingDate || !cropForm.expectedHarvestDate) return
    setFarms((current) => current.map((farm) => farm.id === cropForm.farmId ? {
      ...farm,
      crops: [...farm.crops, {
        id: `crop-${Date.now()}`,
        name: cropForm.name,
        sowingDate: cropForm.sowingDate,
        expectedHarvestDate: cropForm.expectedHarvestDate,
      }],
    } : farm))
    setCropForm({ farmId: '', name: 'Tomato', sowingDate: '', expectedHarvestDate: '' })
  }

  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <span className="section-kicker">FARM MANAGEMENT</span>
          <h1>My Farm</h1>
          <p>Add farms, track crop stages, and maintain sowing and harvesting plans.</p>
        </div>
      </div>

      <div className="two-column-layout">
        <section className="card panel">
          <h2>Add a farm</h2>
          <div className="form-grid">
            <label className="field"><span>Farm name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label className="field"><span>Location</span><input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
            <label className="field"><span>Acreage</span><input type="number" value={form.acreage} onChange={(event) => setForm({ ...form, acreage: event.target.value })} /></label>
            <label className="field"><span>Soil type</span><select value={form.soil} onChange={(event) => setForm({ ...form, soil: event.target.value })}><option>Loamy</option><option>Clay</option><option>Sandy</option><option>Black</option></select></label>
          </div>
          <div className="form-actions">
            <button type="button" className="primary-btn" onClick={addFarm}>Add farm</button>
          </div>
        </section>

        <section className="card panel">
          <h2>Add crop schedule</h2>
          <div className="form-grid">
            <label className="field"><span>Farm</span><select value={cropForm.farmId} onChange={(event) => setCropForm({ ...cropForm, farmId: event.target.value })}><option value="">Select farm</option>{farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</select></label>
            <label className="field"><span>Crop</span><input value={cropForm.name} onChange={(event) => setCropForm({ ...cropForm, name: event.target.value })} /></label>
            <label className="field"><span>Sowing date</span><input type="date" value={cropForm.sowingDate} onChange={(event) => setCropForm({ ...cropForm, sowingDate: event.target.value })} /></label>
            <label className="field"><span>Expected harvest date</span><input type="date" value={cropForm.expectedHarvestDate} onChange={(event) => setCropForm({ ...cropForm, expectedHarvestDate: event.target.value })} /></label>
          </div>
          <div className="form-actions">
            <button type="button" className="primary-btn" onClick={addCrop}>Add crop</button>
          </div>
        </section>
      </div>

      <section className="card panel" style={{ marginTop: 20 }}>
        <h2>Farm records</h2>
        <div className="list-stack">
          {farms.length === 0 ? (
            <div className="empty-state">No farms added yet.</div>
          ) : (
            farms.map((farm) => (
              <div key={farm.id} className="list-item">
                <div className="recommendation-header">
                  <strong>{farm.name}</strong>
                  <button type="button" className="ghost-btn" onClick={() => deleteFarm(farm.id)}>Delete</button>
                </div>
                <p>{farm.location} · {farm.acreage} acres · {farm.soil}</p>
                <div className="mini-grid">
                  {farm.crops.length === 0 ? <span>No crops added</span> : farm.crops.map((crop) => (
                    <div key={crop.id} className="mini-card">
                      <strong>{crop.name}</strong>
                      <span>Sown: {crop.sowingDate || 'Not set'}</span>
                      <span>Expected harvest: {crop.expectedHarvestDate || 'Not set'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
