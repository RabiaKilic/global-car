import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { isAdmin, signOut } = useAuth()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <img src="./logo.png" alt="Global Car Deals" />
        </Link>
        <nav className="nav-links">
          <Link to="/">İlanlar</Link>
          {isAdmin ? (
            <>
              <Link to="/admin">Yönetim Paneli</Link>
              <button className="btn btn-ghost" onClick={signOut}>
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link to="/admin/giris">Admin Girişi</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
