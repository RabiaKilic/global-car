-- ============================================================
-- GLOBAL CAR DEALS - Supabase Veritabanı Kurulum Betiği
-- Bu dosyanın tamamını Supabase Dashboard > SQL Editor içine
-- yapıştırıp "Run" butonuna basın.
-- ============================================================

-- 1) ARAÇLAR TABLOSU
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  brand text not null,                -- Marka (Örn: Renault)
  model text not null,                -- Model (Örn: Clio)
  year int not null,                  -- Model yılı
  price numeric not null,             -- Fiyat (TL)
  km int not null default 0,          -- Kilometre
  fuel_type text,                     -- Yakıt tipi: Benzin, Dizel, LPG, Hibrit, Elektrik
  transmission text,                  -- Vites: Manuel, Otomatik, Yarı Otomatik
  color text,                         -- Renk
  body_type text,                     -- Kasa tipi: Sedan, Hatchback, SUV, Station Wagon, Coupe, Cabrio, Pickup, Minivan
  damage_status text,                 -- Hasar durumu: Hasarsız, Boyalı, Değişen Parça Var, Ağır Hasar Kayıtlı
  description text,                   -- Açıklama
  status text not null default 'satista'
    check (status in ('satista', 'opsiyonlandi', 'satildi')),
  images text[] not null default '{}', -- Fotoğraf URL'leri
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at otomatik güncellensin
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_cars_updated_at on public.cars;
create trigger set_cars_updated_at
before update on public.cars
for each row execute function public.set_updated_at();

-- 2) SATIR SEVİYESİ GÜVENLİK (RLS)
alter table public.cars enable row level security;

drop policy if exists "Herkes ilanlari gorebilir" on public.cars;
create policy "Herkes ilanlari gorebilir"
  on public.cars for select
  using (true);

drop policy if exists "Admin ekleyebilir" on public.cars;
create policy "Admin ekleyebilir"
  on public.cars for insert
  to authenticated
  with check (true);

drop policy if exists "Admin guncelleyebilir" on public.cars;
create policy "Admin guncelleyebilir"
  on public.cars for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin silebilir" on public.cars;
create policy "Admin silebilir"
  on public.cars for delete
  to authenticated
  using (true);

-- 3) FOTOĞRAF DEPOLAMA (Storage) - "car-images" adında herkese açık bir bucket
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

drop policy if exists "Herkes resimleri gorebilir" on storage.objects;
create policy "Herkes resimleri gorebilir"
  on storage.objects for select
  using (bucket_id = 'car-images');

drop policy if exists "Admin resim yukleyebilir" on storage.objects;
create policy "Admin resim yukleyebilir"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'car-images');

drop policy if exists "Admin resim silebilir" on storage.objects;
create policy "Admin resim silebilir"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'car-images');

-- ============================================================
-- KURULUM TAMAMLANDI.
-- Sıradaki adım: Authentication > Users bölümünden kendinize
-- bir admin kullanıcısı (e-posta + şifre) oluşturun.
-- Sitede sadece bu hesapla giriş yapan kişi araç ekleyip
-- düzenleyebilir/silebilir. Kayıt (sign up) formu sitede YOK,
-- kullanıcı sadece Supabase panelinden elle oluşturulur.
-- ============================================================
