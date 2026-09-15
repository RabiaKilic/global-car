import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import CarCard from '../components/CarCard'
import CarFilters from '../components/CarFilters'

const initialFilters = {
  q: '',
  status: '',
  fuel_type: '',
  body_type: '',
  minPrice: '',
  maxPrice: '',
}

export default function Home() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    let active = true
    setLoading(true)
    supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (!active) return
        if (err) {
          setError('İlanlar yüklenirken bir hata oluştu.')
        } else {
          setCars(data || [])
        }
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        const hay = `${c.brand} ${c.model}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.status && c.status !== filters.status) return false
      if (filters.fuel_type && c.fuel_type !== filters.fuel_type) return false
      if (filters.body_type && c.body_type !== filters.body_type) return false
      if (filters.minPrice && Number(c.price) < Number(filters.minPrice))
        return false
      if (filters.maxPrice && Number(c.price) > Number(filters.maxPrice))
        return false
      return true
    })
  }, [cars, filters])

  const availableCount = cars.filter((c) => c.status === 'satista').length

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">GÜVENİLİR İKİNCİ EL ARAÇ İLANLARI</div>
          <h1>Aradığın aracı Global Car Deals'ta bul.</h1>
          <p className="lead">
            Titizlikle kontrol edilmiş araçlar, şeffaf fiyatlandırma ve güncel
            stok durumu — satışta, opsiyonlandı ya da satıldı, her ilanın
            durumunu anında gör.
          </p>
          <div className="hero-actions">
            <a href="#listings" className="btn btn-primary">
              İlanlara Göz At
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">{cars.length}</div>
              <div className="lbl">Toplam İlan</div>
            </div>
            <div className="hero-stat">
              <div className="num">{availableCount}</div>
              <div className="lbl">Satışta Olan Araç</div>
            </div>
          </div>
        </div>
      </section>

      <CarFilters filters={filters} onChange={setFilters} />

      <section className="listings" id="listings">
        <div className="container">
          <div className="listings-head">
            <h2>İlanlar</h2>
            <span className="listings-count">
              {filtered.length} araç listeleniyor
            </span>
          </div>

          {loading && (
            <div className="loading-block">
              <span className="spinner" />
            </div>
          )}

          {!loading && error && (
            <div className="empty-state">
              <h3>Bir sorun oluştu</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <h3>Uygun ilan bulunamadı</h3>
              <p>Filtreleri temizleyip tekrar deneyin.</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="car-grid">
              {filtered.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
