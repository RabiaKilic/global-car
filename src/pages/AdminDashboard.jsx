import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import StatusBadge from '../components/StatusBadge'
import { STATUS_OPTIONS, formatPrice, formatKm } from '../lib/constants'

export default function AdminDashboard() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const loadCars = () => {
    setLoading(true)
    supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError('İlanlar yüklenemedi.')
        else setCars(data || [])
        setLoading(false)
      })
  }

  useEffect(loadCars, [])

  const handleStatusChange = async (id, status) => {
    setBusyId(id)
    const { error: err } = await supabase
      .from('cars')
      .update({ status })
      .eq('id', id)
    if (!err) {
      setCars((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    }
    setBusyId(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) return
    setBusyId(id)
    const { error: err } = await supabase.from('cars').delete().eq('id', id)
    if (!err) {
      setCars((prev) => prev.filter((c) => c.id !== id))
    }
    setBusyId(null)
  }

  return (
    <div className="admin-wrap">
      <div className="container">
        <div className="admin-head">
          <div>
            <h1>Yönetim Paneli</h1>
            <p>Araç ilanlarını ekleyin, düzenleyin ve durumlarını güncelleyin.</p>
          </div>
          <Link to="/admin/yeni" className="btn btn-primary">
            + Yeni Araç Ekle
          </Link>
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

        {!loading && !error && cars.length === 0 && (
          <div className="empty-state">
            <h3>Henüz ilan yok</h3>
            <p>İlk aracınızı ekleyerek başlayın.</p>
          </div>
        )}

        {!loading && !error && cars.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Araç</th>
                  <th>Fiyat</th>
                  <th>KM</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td>
                      {car.images?.[0] ? (
                        <img
                          className="admin-table-thumb"
                          src={car.images[0]}
                          alt=""
                        />
                      ) : (
                        <div className="admin-table-thumb" />
                      )}
                    </td>
                    <td>
                      <strong>
                        {car.brand} {car.model}
                      </strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {car.year}
                      </div>
                    </td>
                    <td>{formatPrice(car.price)}</td>
                    <td>{formatKm(car.km)}</td>
                    <td>
                      <select
                        className="status-select"
                        value={car.status}
                        disabled={busyId === car.id}
                        onChange={(e) => handleStatusChange(car.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          to={`/admin/duzenle/${car.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          Düzenle
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={busyId === car.id}
                          onClick={() => handleDelete(car.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
