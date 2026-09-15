import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLogin() {
  const { signIn, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await signIn(email, password)
    setSubmitting(false)
    if (err) {
      setError('E-posta veya şifre hatalı.')
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="container">
      <div className="auth-card">
        <h1>Admin Girişi</h1>
        <p>Araç ilanlarını yönetmek için giriş yapın.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <p className="form-note">
          Hesabınız yok mu? Admin hesabı Supabase panelinden (Authentication
          &gt; Users) oluşturulur, sitede kayıt formu bulunmaz.
        </p>
      </div>
    </div>
  )
}
