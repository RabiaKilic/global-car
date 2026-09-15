import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase, CAR_IMAGES_BUCKET } from '../lib/supabaseClient'
import {
  STATUS_OPTIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
  BODY_TYPES,
  DAMAGE_STATUSES,
} from '../lib/constants'

const emptyForm = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: '',
  km: '',
  fuel_type: '',
  transmission: '',
  color: '',
  body_type: '',
  damage_status: '',
  description: '',
  status: 'satista',
}

export default function AdminCarForm({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(emptyForm)
  const [images, setImages] = useState([]) // existing URLs (edit mode)
  const [newFiles, setNewFiles] = useState([]) // File objects to upload
  const [newPreviews, setNewPreviews] = useState([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode !== 'edit') return
    let active = true
    supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (!active) return
        if (err || !data) {
          setError('İlan bulunamadı.')
        } else {
          setForm({
            brand: data.brand || '',
            model: data.model || '',
            year: data.year || new Date().getFullYear(),
            price: data.price || '',
            km: data.km || '',
            fuel_type: data.fuel_type || '',
            transmission: data.transmission || '',
            color: data.color || '',
            body_type: data.body_type || '',
            damage_status: data.damage_status || '',
            description: data.description || '',
            status: data.status || 'satista',
          })
          setImages(data.images || [])
        }
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [mode, id])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setNewFiles((prev) => [...prev, ...files])
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ])
    e.target.value = ''
  }

  const removeExistingImage = (url) => {
    setImages((prev) => prev.filter((i) => i !== url))
  }

  const removeNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
    setNewPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadNewFiles = async () => {
    const urls = []
    for (const file of newFiles) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from(CAR_IMAGES_BUCKET)
        .upload(path, file)
      if (uploadErr) {
        throw new Error('Fotoğraf yüklenirken hata oluştu: ' + uploadErr.message)
      }
      const { data } = supabase.storage
        .from(CAR_IMAGES_BUCKET)
        .getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const uploadedUrls = await uploadNewFiles()
      const allImages = [...images, ...uploadedUrls]

      const payload = {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        km: Number(form.km) || 0,
        images: allImages,
      }

      if (mode === 'create') {
        const { error: insertErr } = await supabase.from('cars').insert(payload)
        if (insertErr) throw insertErr
      } else {
        const { error: updateErr } = await supabase
          .from('cars')
          .update(payload)
          .eq('id', id)
        if (updateErr) throw updateErr
      }

      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Kaydedilirken bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-block">
        <span className="spinner" />
      </div>
    )
  }

  return (
    <div className="admin-wrap">
      <div className="container">
        <div className="admin-head">
          <div>
            <h1>{mode === 'create' ? 'Yeni Araç Ekle' : 'Aracı Düzenle'}</h1>
            <p>Tüm alanları eksiksiz doldurun ve en az bir fotoğraf ekleyin.</p>
          </div>
          <Link to="/admin" className="btn btn-outline">
            ← Panele Dön
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Durum</h3>
            <div className="status-radio-group">
              {STATUS_OPTIONS.map((s) => (
                <label
                  key={s.value}
                  className={`status-radio ${form.status === s.value ? 'checked' : ''}`}
                  style={{ color: form.status === s.value ? s.color : undefined }}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s.value}
                    checked={form.status === s.value}
                    onChange={(e) => set('status', e.target.value)}
                  />
                  <span className="dot" style={{ background: s.color }} />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Temel Bilgiler</h3>
            <div className="form-grid">
              <div className="field">
                <label>Marka *</label>
                <input
                  required
                  value={form.brand}
                  onChange={(e) => set('brand', e.target.value)}
                  placeholder="Renault"
                />
              </div>
              <div className="field">
                <label>Model *</label>
                <input
                  required
                  value={form.model}
                  onChange={(e) => set('model', e.target.value)}
                  placeholder="Clio"
                />
              </div>
              <div className="field">
                <label>Model Yılı *</label>
                <input
                  required
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) => set('year', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Fiyat (TL) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="850000"
                />
              </div>
              <div className="field">
                <label>Kilometre *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.km}
                  onChange={(e) => set('km', e.target.value)}
                  placeholder="45000"
                />
              </div>
              <div className="field">
                <label>Renk</label>
                <input
                  value={form.color}
                  onChange={(e) => set('color', e.target.value)}
                  placeholder="Beyaz"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Teknik Özellikler</h3>
            <div className="form-grid">
              <div className="field">
                <label>Yakıt Tipi</label>
                <select
                  value={form.fuel_type}
                  onChange={(e) => set('fuel_type', e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Vites</label>
                <select
                  value={form.transmission}
                  onChange={(e) => set('transmission', e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Kasa Tipi</label>
                <select
                  value={form.body_type}
                  onChange={(e) => set('body_type', e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {BODY_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Hasar Durumu</label>
                <select
                  value={form.damage_status}
                  onChange={(e) => set('damage_status', e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {DAMAGE_STATUSES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Açıklama</h3>
            <div className="field">
              <label>İlan Açıklaması</label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Araç hakkında detaylı bilgi verin..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Fotoğraflar</h3>
            <div
              className="image-drop"
              onClick={() => fileInputRef.current?.click()}
            >
              Fotoğraf eklemek için tıklayın (birden fazla seçebilirsiniz)
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFileSelect}
              />
            </div>

            {(images.length > 0 || newPreviews.length > 0) && (
              <div className="image-preview-grid">
                {images.map((url) => (
                  <div className="image-preview" key={url}>
                    <img src={url} alt="" />
                    <button type="button" onClick={() => removeExistingImage(url)}>
                      ✕
                    </button>
                  </div>
                ))}
                {newPreviews.map((url, i) => (
                  <div className="image-preview" key={url}>
                    <img src={url} alt="" />
                    <button type="button" onClick={() => removeNewFile(i)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Link to="/admin" className="btn btn-outline">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
