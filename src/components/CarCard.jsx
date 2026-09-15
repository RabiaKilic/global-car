import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatPrice, formatKm } from '../lib/constants'

export default function CarCard({ car }) {
  const cover = car.images?.[0]

  return (
    <Link to={`/arac/${car.id}`} className="car-card">
      <div className="car-card-media">
        {cover ? (
          <img src={cover} alt={`${car.brand} ${car.model}`} loading="lazy" />
        ) : (
          <div className="no-image">Fotoğraf yok</div>
        )}
        <StatusBadge status={car.status} />
      </div>
      <div className="car-card-body">
        <div className="car-card-title">
          {car.brand} {car.model}
        </div>
        <div className="car-card-sub">
          <span>{car.year}</span>
          <span>{formatKm(car.km)}</span>
          {car.fuel_type && <span>{car.fuel_type}</span>}
          {car.transmission && <span>{car.transmission}</span>}
        </div>
        <div className="car-card-price">{formatPrice(car.price)}</div>
      </div>
    </Link>
  )
}
