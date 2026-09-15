import { getStatusMeta } from '../lib/constants'

export default function StatusBadge({ status }) {
  const meta = getStatusMeta(status)
  return (
    <span className="status-badge" style={{ background: meta.color }}>
      {meta.label}
    </span>
  )
}
