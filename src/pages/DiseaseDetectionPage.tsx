import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Droplets,
  FlaskConical,
  Leaf,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  Volume2,
} from 'lucide-react'
import {
  detectDisease,
  getSamplePlantCases,
  validateImage,
  type DiseaseResult,
} from '../services/diseaseDetectionService'
import { browserVoiceService } from '../services/voiceService'
import { useI18n } from '../i18n/I18nProvider'
import { getDiseaseCopy, type DiseaseCopyKey } from '../i18n/diseaseTranslations'

const STORAGE_KEY = 'smartkrishi_disease_reports'

type DiseaseReport = {
  id: string
  crop: string
  possibleDisease: string
  confidence: number
  severity: string
  symptoms: string[]
  cause: string
  treatment: string
  chemical_treatment?: string
  organic_treatment?: string
  recovery_days?: string
  stage_risk?: string
  prevention: string
  is_healthy: boolean
  low_confidence: boolean
  note: string
  top_predictions?: { label: string; confidence: number }[]
  createdAt: string
  model?: string
}

export function DiseaseDetectionPage() {
  const { language } = useI18n()
  const copy = (key: DiseaseCopyKey) => getDiseaseCopy(language, key)
  const sampleCases = getSamplePlantCases(language)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [crop, setCrop] = useState('Tomato')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [report, setReport] = useState<DiseaseReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [history, setHistory] = useState<DiseaseReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as DiseaseReport[]) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImage(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setImagePreview(URL.createObjectURL(file))
    setImageFile(file)
    setError(null)
    setReport(null)
  }

  const loadSampleCase = (sample: ReturnType<typeof getSamplePlantCases>[0]) => {
    setImagePreview(sample.preview)
    setImageFile(null)
    setError(null)
    setCrop(sample.crop)

    const next: DiseaseReport = {
      id: `sample-${Date.now()}`,
      createdAt: new Date().toISOString(),
      crop: sample.data.crop,
      possibleDisease: sample.data.disease,
      confidence: sample.data.confidence,
      severity: sample.data.severity,
      symptoms: sample.data.symptoms,
      cause: sample.data.cause,
      treatment: sample.data.treatment,
      chemical_treatment: sample.data.chemical_treatment,
      organic_treatment: sample.data.organic_treatment,
      recovery_days: sample.data.recovery_days,
      stage_risk: sample.data.stage_risk,
      prevention: sample.data.prevention,
      is_healthy: sample.data.is_healthy,
      low_confidence: false,
      top_predictions: sample.data.top_predictions,
      model: 'PlantDiseaseDetection YOLO (PlantVillage 38-Class Dataset)',
      note: sample.data.is_healthy
        ? copy('healthyTitle')
        : copy('pathogenDetected'),
    }

    setReport(next)
    setHistory((current) => [next, ...current].slice(0, 10))
  }

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setImageFile(null)
    setError(null)
    setReport(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const detect = async () => {
    if (!imageFile && !imagePreview) {
      setError(copy('photoLabel'))
      return
    }

    if (!imageFile && imagePreview) {
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setReport(null)

    const result = await detectDisease(imageFile!, crop, language, true)

    if (!result.success) {
      setError((result as { error: string }).error)
      setLoading(false)
      return
    }

    const data = result as DiseaseResult
    const next: DiseaseReport = {
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString(),
      crop: data.crop || crop,
      possibleDisease: data.disease,
      confidence: data.confidence,
      severity: data.severity,
      symptoms: data.symptoms,
      cause: data.cause,
      treatment: data.treatment,
      chemical_treatment: data.chemical_treatment,
      organic_treatment: data.organic_treatment,
      recovery_days: data.recovery_days || (language === 'te' ? '5 నుండి 7 రోజులు' : language === 'hi' ? '5 से 7 दिन' : '5 to 7 Days'),
      stage_risk: data.stage_risk || (language === 'te' ? 'ప్రభావిత పంట దశ' : language === 'hi' ? 'सक्रिय फसल अवस्था' : 'Active Crop Phase'),
      prevention: data.prevention,
      is_healthy: data.is_healthy,
      low_confidence: data.low_confidence,
      model: data.model || 'Google Gemini Multimodal Vision (PlantVillage 38-Class Taxonomy)',
      note: data.is_healthy ? copy('healthyTitle') : copy('pathogenDetected'),
    }

    setReport(next)
    setHistory((current) => [next, ...current].slice(0, 10))
    setLoading(false)
  }

  const speakResult = async () => {
    if (!report) return
    browserVoiceService.unlockAudio()
    setSpeaking(true)
    try {
      let text = ''
      if (language === 'hi') {
        text = report.is_healthy
          ? `पौधा पूरी तरह स्वस्थ है। विश्वसनीयता ${Math.round(report.confidence)} प्रतिशत।`
          : `पहचानी गई स्थिति ${report.possibleDisease} है। विश्वसनीयता ${Math.round(report.confidence)} प्रतिशत। रासायनिक उपचार: ${report.chemical_treatment || report.treatment}। जैविक उपचार: ${report.organic_treatment || 'नीम तेल का छिड़काव करें।'}`
      } else if (language === 'te') {
        text = report.is_healthy
          ? `మొక్క పూర్తిగా ఆరోగ్యంగా ఉంది. విశ్వసనీయత ${Math.round(report.confidence)} శాతం.`
          : `గుర్తించిన పరిస్థితి ${report.possibleDisease}. విశ్వసనీయత ${Math.round(report.confidence)} శాతం. రసాయన మందు: ${report.chemical_treatment || report.treatment}. సేంద్రీయ నివారణ: ${report.organic_treatment || 'వేప నూనె పిచికారీ చేయండి.'}`
      } else {
        text = report.is_healthy
          ? `The plant appears completely healthy with a confidence of ${Math.round(report.confidence)} percent.`
          : `The detected condition is ${report.possibleDisease} with ${Math.round(report.confidence)} percent confidence. Recommended treatment: ${report.chemical_treatment || report.treatment}`
      }
      await browserVoiceService.speak(text, language)
    } catch {
      // TTS fallback
    }
    setSpeaking(false)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="module-page">
      {/* Header Banner */}
      <div className="module-header">
        <div>
          <span className="section-kicker">{copy('pageKicker')}</span>
          <h1>{copy('pageTitle')}</h1>
          <p>{copy('pageSubtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="data-badge">
            <Sparkles size={14} /> PlantDiseaseDetection YOLO
          </span>
        </div>
      </div>

      {/* Sample Quick-Test Bar */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
              {copy('quickTestTitle')}
            </strong>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sampleCases.map((sample) => (
              <button
                key={sample.id}
                type="button"
                className="chip-btn"
                onClick={() => loadSampleCase(sample)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.84rem',
                  borderRadius: 20,
                  border: '1.5px solid var(--border)',
                  background: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="two-column-layout">
        {/* Left Column: Upload & Controls */}
        <section className="card panel">
          <h2>{copy('uploadHeader')}</h2>
          <div className="form-grid">
            <label className="field">
              <span>{copy('targetCrop')}</span>
              <select value={crop} onChange={(event) => setCrop(event.target.value)}>
                <option value="Tomato">{language === 'te' ? 'టమాటా (Tomato)' : language === 'hi' ? 'टमाटर (Tomato)' : 'Tomato'}</option>
                <option value="Chilli">{language === 'te' ? 'మిరప (Chilli)' : language === 'hi' ? 'मिर्च (Chilli)' : 'Chilli'}</option>
                <option value="Potato">{language === 'te' ? 'బంగాళాదుంప (Potato)' : language === 'hi' ? 'आलू (Potato)' : 'Potato'}</option>
                <option value="Rice">{language === 'te' ? 'వరి (Rice)' : language === 'hi' ? 'धान/चावल (Rice)' : 'Rice'}</option>
                <option value="Maize">{language === 'te' ? 'మొక్కజొన్న (Maize)' : language === 'hi' ? 'मक्का (Maize)' : 'Maize'}</option>
                <option value="Cotton">{language === 'te' ? 'పత్తి (Cotton)' : language === 'hi' ? 'कपास (Cotton)' : 'Cotton'}</option>
                <option value="Apple">{language === 'te' ? 'యాపిల్ (Apple)' : language === 'hi' ? 'सेब (Apple)' : 'Apple'}</option>
              </select>
            </label>

            <div className="field full-width">
              <span>{copy('photoLabel')}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleImage}
              />

              {!imagePreview ? (
                <button
                  type="button"
                  className="dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '100%', minHeight: 220 }}
                >
                  <UploadCloud size={38} style={{ color: 'var(--primary)', marginBottom: 8 }} />
                  <strong>{copy('dropzoneText')}</strong>
                  <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                    {copy('dropzoneSub')}
                  </span>
                </button>
              ) : (
                <div className="upload-preview">
                  <img
                    src={imagePreview}
                    alt="Crop preview"
                  />
                  <div className="preview-actions">
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                      <RotateCcw size={14} /> {copy('replaceBtn')}
                    </button>
                    <button type="button" onClick={removeImage}>
                      <Trash2 size={14} /> {copy('removeBtn')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="error-box" style={{ marginTop: 16 }}>
              <AlertCircle size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              {error}
            </div>
          )}

          <div className="form-actions" style={{ marginTop: 20 }}>
            <button
              type="button"
              className="primary-btn"
              onClick={() => void detect()}
              disabled={loading || (!imageFile && !imagePreview)}
            >
              {loading ? (
                <>{copy('analyzingText')}</>
              ) : (
                <>
                  <Camera size={18} /> {copy('runDiagnosisBtn')}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column: Detailed Diagnosis Results */}
        <section className="card panel">
          <h2>{copy('advisoryHeader')}</h2>
          {loading ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '50px 20px' }}>
              <div className="voice-orb orb-processing" style={{ width: 60, height: 60, margin: '0 auto 16px' }} />
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                {copy('analyzingText')}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 4 }}>
                {copy('analyzingSub')}
              </p>
            </div>
          ) : report ? (
            <div className="report-box">
              {/* Healthy banner */}
              {report.is_healthy ? (
                <div className="success-box" style={{ marginBottom: 16 }}>
                  <CheckCircle2 size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                  <strong>{copy('healthyTitle')}</strong>
                </div>
              ) : (
                <div
                  className="error-box"
                  style={{
                    marginBottom: 16,
                    background: report.severity === 'High' ? '#ffebee' : '#fff8e1',
                    borderLeftColor: report.severity === 'High' ? '#c62828' : '#f57c00',
                    color: report.severity === 'High' ? '#b71c1c' : '#7d4a00',
                  }}
                >
                  <AlertTriangle size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                  <strong>{copy('pathogenDetected')}</strong>
                </div>
              )}

              {/* Disease Name & Confidence Bar */}
              <div className="list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>
                      {copy('primaryDiagnosis')} ({report.crop})
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0', color: report.is_healthy ? 'var(--primary)' : '#c62828' }}>
                      {report.possibleDisease}
                    </h3>
                  </div>
                  <span
                    className="pill"
                    style={{
                      background: report.severity === 'High' ? '#ffebee' : report.severity === 'Medium' ? '#fff8e1' : '#e8f5e9',
                      color: report.severity === 'High' ? '#c62828' : report.severity === 'Medium' ? '#f57c00' : '#2e7d32',
                      fontWeight: 700,
                    }}
                  >
                    {report.severity === 'High'
                      ? (language === 'te' ? 'అధిక తీవ్రత' : language === 'hi' ? 'उच्च जोखिम' : 'High Severity')
                      : report.severity === 'Medium'
                        ? (language === 'te' ? 'మధ్యమ తీవ్రత' : language === 'hi' ? 'मध्यम जोखिम' : 'Medium Severity')
                        : (language === 'te' ? 'ఆరోగ్యకరం' : language === 'hi' ? 'स्वस्थ' : 'Healthy')}
                  </span>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', fontWeight: 700, marginBottom: 4 }}>
                    <span>{copy('confidenceLabel')} ({report.model || 'YOLO PlantDiseaseDetection'})</span>
                    <span>{report.confidence}%</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 999, background: '#eef2ee', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(report.confidence, 100)}%`,
                        height: '100%',
                        borderRadius: 999,
                        background: report.confidence >= 80 ? 'var(--primary)' : report.confidence >= 60 ? '#f57c00' : '#c62828',
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Top Prediction Breakdown */}
              {report.top_predictions && report.top_predictions.length > 1 && (
                <div className="list-item" style={{ background: '#fbfdfb', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                    {copy('probabilitiesTitle')}
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {report.top_predictions.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                        <span>{p.label}</span>
                        <strong style={{ color: i === 0 ? 'var(--primary)' : 'var(--muted)' }}>
                          {p.confidence}%
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Symptoms & Cause */}
              <div className="list-item">
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Leaf size={16} style={{ color: 'var(--primary)' }} /> {copy('symptomsTitle')}
                </strong>
                <ul style={{ margin: '8px 0 0 18px', padding: 0, fontSize: '0.9rem', color: 'var(--text)' }}>
                  {report.symptoms.map((s, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{s}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 8, fontSize: '0.88rem', color: 'var(--muted)' }}>
                  <strong>{copy('causeTitle')}:</strong> {report.cause}
                </div>
              </div>

              {/* Dual Action Treatment Cards */}
              {!report.is_healthy && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, margin: '14px 0' }}>
                  {/* Scientific Chemical Treatment */}
                  <div style={{ background: '#f4f8fd', border: '1px solid #c8ddf7', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0e6ae4', fontWeight: 700, fontSize: '0.88rem', marginBottom: 6 }}>
                      <FlaskConical size={16} /> {copy('chemicalTitle')}
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#1a3b63', margin: 0, lineHeight: 1.4 }}>
                      {report.chemical_treatment || report.treatment}
                    </p>
                  </div>

                  {/* Organic Bio Remedy */}
                  <div style={{ background: '#f4fbf5', border: '1px solid #bce9cb', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary-dark)', fontWeight: 700, fontSize: '0.88rem', marginBottom: 6 }}>
                      <Droplets size={16} /> {copy('organicTitle')}
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#13472c', margin: 0, lineHeight: 1.4 }}>
                      {report.organic_treatment || (language === 'te' ? '10,000 ppm వేప నూనె (3-5 ml/లీ) పిచికారీ చేయండి.' : language === 'hi' ? 'नीम का तेल (10,000 ppm) 3-5 ml/L का छिड़काव करें।' : 'Spray Neem Oil 10000 ppm (5ml/L) + Trichoderma viride.')}
                    </p>
                  </div>
                </div>
              )}

              {/* Recovery Time & Stage Risk */}
              {report.recovery_days && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '8px 0 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', color: 'var(--muted)' }}>
                    <Clock size={15} style={{ color: 'var(--primary)' }} />
                    <span>{copy('recoveryTitle')}: <strong>{report.recovery_days}</strong></span>
                  </div>
                  {report.stage_risk && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', color: 'var(--muted)' }}>
                      <ShieldCheck size={15} style={{ color: '#0e6ae4' }} />
                      <span>{copy('stageTitle')}: <strong>{report.stage_risk}</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Prevention Advice */}
              <div className="list-item" style={{ background: '#fffcf5', border: '1px solid #fae7b9', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                <strong style={{ color: '#8a5300', fontSize: '0.88rem' }}>{copy('preventionTitle')}</strong>
                <p style={{ fontSize: '0.86rem', color: '#683e00', margin: '4px 0 0' }}>
                  {report.prevention}
                </p>
              </div>

              {/* Voice Speak Action */}
              <div className="form-actions" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => void speakResult()}
                  disabled={speaking}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Volume2 size={17} /> {speaking ? copy('speakingBtn') : copy('readAloudBtn')}
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <UploadCloud size={40} style={{ margin: '0 auto 12px', color: 'var(--muted)' }} />
              <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text)' }}>
                {copy('emptyHeader')}
              </strong>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 4 }}>
                {copy('emptyDesc')}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* History */}
      <section className="card panel" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2>{copy('historyTitle')}</h2>
          {history.length > 0 && (
            <button type="button" className="ghost-btn" onClick={clearHistory} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
              {copy('clearHistoryBtn')}
            </button>
          )}
        </div>

        <div className="list-stack">
          {history.length === 0 ? (
            <div className="empty-state">{copy('noHistoryText')}</div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>{item.crop}</strong>
                  {typeof item.confidence === 'number' && (
                    <span className="pill" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                      {item.confidence}% {copy('confidenceLabel')}
                    </span>
                  )}
                </div>
                <p style={{ color: item.is_healthy ? 'var(--primary)' : '#c62828', fontWeight: 700, marginTop: 4 }}>
                  {item.possibleDisease}
                </p>
                <small style={{ color: 'var(--muted)' }}>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
