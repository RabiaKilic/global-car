import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase bilgileri eksik. ".env" dosyasını ".env.example" dosyasına göre oluşturduğunuzdan emin olun.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const CAR_IMAGES_BUCKET = 'car-images'
