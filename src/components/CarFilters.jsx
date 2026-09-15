import { STATUS_OPTIONS, FUEL_TYPES, BODY_TYPES } from '../lib/constants'

export default function CarFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="filters">
      <div className="container filters-grid">
        <div className="field">
          <label htmlFor="f-q">Ara</label>
          <input
            id="f-q"
            type="text"
            placeholder="Marka veya model..."
            value={filters.q}
            onChange={(e) => set('q', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="f-status">Durum</label>
          <select
            id="f-status"
            value={filters.status}
            onChange={(e) => set('status', e.target.value)}
          >
            <option value="">Tümü</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-fuel">Yakıt</label>
          <select
            id="f-fuel"
            value={filters.fuel_type}
            onChange={(e) => set('fuel_type', e.target.value)}
          >
            <option value="">Tümü</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-body">Kasa Tipi</label>
          <select
            id="f-body"
            value={filters.body_type}
            onChange={(e) => set('body_type', e.target.value)}
          >
            <option value="">Tümü</option>
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-min">Min. Fiyat</label>
          <input
            id="f-min"
            type="number"
            min="0"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="f-max">Maks. Fiyat</label>
          <input
            id="f-max"
            type="number"
            min="0"
            placeholder="Sınırsız"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
