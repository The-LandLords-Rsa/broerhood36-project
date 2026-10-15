export const CONFIG = {
  SUPABASE_URL: 'https://dgbmqrzapoyuafgskohy.supabase.co', // USER MUST REPLACE - from supabase.com > project settings > API > Project URL
  SUPABASE_ANON_KEY: 'sb_publishable_NMR365B7MMNo1y4Fh6jUBg_cyAONRFc', // USER MUST REPLACE - anon public key
  
  // Both Official Broerhood36 WhatsApp Lines
  WHATSAPP_1: '27649013150', // Line 1: +27 64 901 3150 (Primary Sales & Customer Care)
  WHATSAPP_2: '27699781083', // Line 2: +27 69 978 1083 (Dispatch & Hubbly Rentals)
  OWNER_WHATSAPP: '27649013150', // Default Line
  
  // Official Store Email
  STORE_EMAIL: 'broer.hood.36@gmail.com',

  // PayFast Payment Gateway Config
  PAYFAST_MERCHANT_ID: '10000100', // PayFast test ID, user will replace with live
  PAYFAST_MERCHANT_KEY: '46f0cd694581a', // PayFast test key
  STORE_NAME: 'BROERHOOD36',
  CURRENCY: 'R'
};

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}
