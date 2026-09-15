import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages'te proje "https://kullaniciadi.github.io/repo-adi/" altında
// yayınlanacağı için base yolu göreceli olarak ayarlandı.
// Kendi sunucunuzda (Vercel/Netlify) yayınlarsanız base: '/' yapabilirsiniz.
export default defineConfig({
  plugins: [react()],
  base: './',
})
