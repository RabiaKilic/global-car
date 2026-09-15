# Global Car Deals

İkinci el araç alım/satım ilanları için, **yönetim (admin) paneli olan**, kullanıcı
kaydı gerektirmeyen bir web sitesi. Ziyaretçiler ilanları görüntüler; sadece admin
giriş yaparak araç ekleyip düzenleyebilir/silebilir ve her aracın durumunu
**Satışta / Opsiyonlandı / Satıldı** olarak işaretleyebilir.

- **Frontend:** React (Vite)
- **Veritabanı + Depolama + Giriş:** [Supabase](https://supabase.com) (ücretsiz plan — PostgreSQL)
- **Yayınlama:** GitHub + GitHub Pages (ya da Vercel/Netlify)

---

## 1) Supabase projesi oluşturma (ücretsiz online SQL veritabanı)

1. [supabase.com](https://supabase.com) adresine gidip ücretsiz bir hesap açın.
2. **New Project** ile yeni bir proje oluşturun (bir veritabanı şifresi belirlemeniz
   istenecek, not alın).
3. Proje hazır olduğunda sol menüden **SQL Editor**'ı açın.
4. Bu depodaki `supabase/schema.sql` dosyasının tamamını kopyalayıp SQL Editor'e
   yapıştırın ve **Run** butonuna basın. Bu işlem:
   - `cars` tablosunu oluşturur (marka, model, yıl, fiyat, km, yakıt, vites,
     renk, kasa tipi, hasar durumu, açıklama, durum, fotoğraflar),
   - Güvenlik kurallarını (RLS) ayarlar: **herkes ilanları görebilir, sadece
     giriş yapan admin ekleyip/düzenleyip/silebilir**,
   - Fotoğraflar için `car-images` adında herkese açık bir Storage bucket'ı
     oluşturur.
5. Sol menüden **Authentication > Users** bölümüne gidin, **Add user** ile
   kendinize bir admin hesabı oluşturun (e-posta + şifre). Sitede kayıt (sign up)
   formu **yoktur** — admin hesabı sadece buradan, elle oluşturulur. Böylece
   sadece siz giriş yapabilirsiniz.
6. Sol menüden **Project Settings > API** bölümüne gidin, şu iki değeri not alın:
   - **Project URL**
   - **anon public** anahtarı

> Supabase ücretsiz planı: 500 MB veritabanı, 1 GB dosya depolama, sınırsız API
> isteği (aylık kotalar dahilinde) içerir — küçük/orta ölçekli bir galeri
> sitesi için fazlasıyla yeterlidir.

---

## 2) Projeyi bilgisayarınızda çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env
```

`.env` dosyasını açıp Supabase'ten aldığınız bilgileri girin:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Ardından geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın. Siteye admin olarak giriş
yapmak için sağ üstteki **Admin Girişi** linkine tıklayıp 1. adımda oluşturduğunuz
e-posta/şifre ile giriş yapın.

---

## 3) GitHub'a yükleme

```bash
git init
git add .
git commit -m "İlk sürüm: Global Car Deals"
git branch -M main
git remote add origin https://github.com/RabiaKilic/global-car.git
git push -u origin main
```

> `.env` dosyanız `.gitignore` içinde olduğu için GitHub'a **yüklenmez** —
> Supabase anahtarlarınız güvende kalır. (Not: Supabase "anon" anahtarı zaten
> tarayıcıda görünecek şekilde tasarlanmıştır ve veritabanı erişimi RLS
> kurallarıyla korunur; yine de kendi anahtarınızı halka açık paylaşmayın.)

---

## 4) Yayınlama (GitHub Pages)

Proje, GitHub Pages'te çalışacak şekilde hazırlandı (`HashRouter` ve göreceli
`base` yolu kullanılıyor, bu yüzden 404 sorunu yaşamazsınız).

1. `package.json` içindeki `deploy` script'i hazır: `gh-pages` paketi zaten
   `devDependencies` içinde.
2. Şu komutu çalıştırın:

   ```bash
   npm run deploy
   ```

   Bu komut projeyi derler ve `gh-pages` dalına otomatik olarak yükler.
3. GitHub deposunda **Settings > Pages** bölümünden **Source** olarak
   `gh-pages` dalını seçin.
4. Birkaç dakika içinde siteniz şu adreste yayında olur:
   `https://rabiakilic.github.io/global-car/`

**Önemli:** GitHub Pages'te ortam değişkenleri (`.env`) çalışma zamanında
okunamaz; `npm run deploy` komutunu **kendi bilgisayarınızda**, `.env`
dosyanız doluyken çalıştırmanız gerekir (Vite, build sırasında bu değerleri
koddaki dosyaya gömer).

### Alternatif: Vercel / Netlify (isteğe bağlı, daha kolay ortam değişkeni yönetimi)

Eğer ortam değişkenlerini panelden yönetmek isterseniz, GitHub deponuzu
[Vercel](https://vercel.com) veya [Netlify](https://netlify.com)'a bağlayıp
`VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` değerlerini oradaki "Environment
Variables" bölümüne girmeniz yeterlidir. Build komutu: `npm run build`,
çıktı klasörü: `dist`.

---

## Proje Yapısı

```
global-car-deals/
├── public/
│   └── logo.png                 # Global Car Deals logosu
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CarCard.jsx          # İlan kartı (grid görünümü)
│   │   ├── CarFilters.jsx       # Arama/filtre çubuğu
│   │   ├── StatusBadge.jsx      # Satışta/Opsiyonlandı/Satıldı rozeti
│   │   └── ProtectedRoute.jsx   # Admin sayfalarını koruyan bileşen
│   ├── contexts/
│   │   └── AuthContext.jsx      # Supabase Auth oturum yönetimi
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   └── constants.js         # Durum/seçenek listeleri, biçimlendirme
│   ├── pages/
│   │   ├── Home.jsx             # Ana sayfa: hero + ilan listesi + filtreler
│   │   ├── CarDetail.jsx        # İlan detay sayfası
│   │   ├── AdminLogin.jsx       # Admin giriş formu
│   │   ├── AdminDashboard.jsx   # Admin: ilan tablosu, durum değiştirme, silme
│   │   └── AdminCarForm.jsx     # Admin: araç ekleme/düzenleme formu + fotoğraf yükleme
│   ├── App.jsx                  # Yönlendirmeler (routes)
│   ├── main.jsx
│   └── index.css                # Tüm tasarım (kırmızı/siyah tema)
├── supabase/
│   └── schema.sql               # Veritabanı kurulum betiği
├── .env.example
├── package.json
└── vite.config.js
```

## Özellikler

- **Herkese açık:** İlan listesi, arama/filtreleme (marka-model, durum, yakıt,
  kasa tipi, fiyat aralığı), ilan detay sayfası.
- **Sadece admin (kullanıcı paneli yok):**
  - Araç ekleme / düzenleme / silme (CRUD)
  - Her araç için **Satışta / Opsiyonlandı / Satıldı** durumu seçme —
    hem ekleme formunda hem de panel tablosunda tek tıkla değiştirilebilir
  - Birden fazla fotoğraf yükleme (Supabase Storage)
  - Detaylı araç bilgileri: marka, model, yıl, fiyat, km, yakıt tipi, vites,
    renk, kasa tipi, hasar durumu, açıklama

## Sorun Giderme

- **"Supabase bilgileri eksik" hatası:** `.env` dosyasını oluşturup doğru
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` değerlerini girdiğinizden emin
  olun, sonra `npm run dev`'i yeniden başlatın.
- **Giriş yapamıyorum:** Supabase panelinde **Authentication > Users**
  altında bir kullanıcı oluşturduğunuzdan emin olun (sitede kayıt formu yok).
- **Fotoğraf yüklenmiyor:** `schema.sql` dosyasını çalıştırdığınızdan ve
  `car-images` bucket'ının Supabase panelinde **Storage** sekmesinde
  göründüğünden emin olun.
