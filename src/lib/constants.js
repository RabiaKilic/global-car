export const STATUS_OPTIONS = [
  { value: 'satista', label: 'Satışta', color: '#3FB65F' },
  { value: 'opsiyonlandi', label: 'Opsiyonlandı', color: '#E8A23D' },
  { value: 'satildi', label: 'Satıldı', color: '#8A8A8E' },
]

export const getStatusMeta = (value) =>
  STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0]

export const FUEL_TYPES = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik']

export const TRANSMISSIONS = ['Manuel', 'Otomatik', 'Yarı Otomatik']

export const BODY_TYPES = [
  'Sedan',
  'Hatchback',
  'SUV',
  'Station Wagon',
  'Coupe',
  'Cabrio',
  'Pickup',
  'Minivan',
]

export const DAMAGE_STATUSES = [
  'Hasarsız',
  'Boyalı',
  'Değişen Parça Var',
  'Ağır Hasar Kayıtlı',
]

export const formatPrice = (price) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(price || 0)

export const formatKm = (km) =>
  `${new Intl.NumberFormat('tr-TR').format(km || 0)} km`
