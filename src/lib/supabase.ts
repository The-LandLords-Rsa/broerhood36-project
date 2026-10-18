export const CONFIG = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://dgbmqrzapoyuafgskohy.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || 'sb_publishable_NMR365B7MMNo1y4Fh6jUBg_cyAONRFc',
  
  // Both Official Broerhood36 WhatsApp Lines
  WHATSAPP_1: '27649013150', // Line 1: +27 64 901 3150 (Primary Sales & Customer Care)
  WHATSAPP_2: '27699781083', // Line 2: +27 69 978 1083 (Dispatch & Hubbly Rentals)
  OWNER_WHATSAPP: '27649013150', // Default Line
  
  // Official Store Email
  STORE_EMAIL: 'broer.hood.36@gmail.com',

  // PayFast merchant settings must be configured in server-side Supabase secrets.
  PAYFAST_MERCHANT_ID: '10000100',
  STORE_NAME: 'BROERHOOD36',
  CURRENCY: 'R'
};

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}
