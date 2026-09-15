export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Global Car Deals. Tüm hakları saklıdır.</span>
        <a href="#/admin/giris">Admin Girişi</a>
      </div>
    </footer>
  )
}
