import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminCarForm from './pages/AdminCarForm'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/arac/:id" element={<CarDetail />} />
              <Route path="/admin/giris" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/yeni"
                element={
                  <ProtectedRoute>
                    <AdminCarForm mode="create" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/duzenle/:id"
                element={
                  <ProtectedRoute>
                    <AdminCarForm mode="edit" />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  )
}
