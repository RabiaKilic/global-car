import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StatusBadge from '../components/StatusBadge'
import { formatPrice, formatKm } from '../lib/constants'

export default function CarDetail() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (!active) return
        if (err) {
          setError('İlan bulunamadı.')
        } else {
          setCar(data)
        }
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="loading-block">
        <span className="spinner" />
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="empty-state container">
        <h3>İlan bulunamadı</h3>
        <p>Bu ilan kaldırılmış veya hiç var olmamış olabilir.</p>
        <div style={{ marginTop: 20 }}>
          <Link to="/" className="btn btn-outline">
            İlanlara Dön
          </Link>
        </div>
      </div>
    )
  }

  const images = car.images?.length ? car.images : []

  const specs = [
    ['Model Yılı', car.year],
    ['Kilometre', formatKm(car.km)],
    ['Yakıt Tipi', car.fuel_type],
    ['Vites', car.transmission],
    ['Renk', car.color],
    ['Kasa Tipi', car.body_type],
    ['Hasar Durumu', car.damage_status],
  ].filter(([, v]) => v)

  return (
    <div className="detail-wrap">
      <div className="container">
        <Link to="/" className="back-link">
          ← İlanlara Dön
        </Link>

        <div className="detail-grid">
          <div>
            <div className="detail-main-image">
              {images.length > 0 ? (
                <img src={images[activeImage]} alt={`${car.brand} ${car.model}`} />
              ) : (
                <div className="no-image" style={{ height: '100%' }}>
                  Fotoğraf yok
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="detail-thumbs">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    className={i === activeImage ? 'active' : ''}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="detail-title-row">
              <h1>
                {car.brand} {car.model}
              </h1>
              <StatusBadge status={car.status} />
            </div>
            <div className="detail-price">{formatPrice(car.price)}</div>

            <div className="spec-list">
              {specs.map(([k, v]) => (
                <div className="spec-item" key={k}>
                  <div className="k">{k}</div>
                  <div className="v">{v}</div>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="detail-desc">
                <h3>Açıklama</h3>
                <p>{car.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
