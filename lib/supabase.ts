import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Build sırasında hata vermesin diye sadece uyarı basıyoruz;
  // gerçek kullanımda .env.local dolu olmalı.
  console.warn(
    "Supabase env değişkenleri eksik. .env.local dosyasını kontrol edin."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);
