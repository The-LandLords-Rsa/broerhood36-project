import React from 'react';
import { useShop } from '../context/ShopContext';
import { CONFIG } from '../lib/supabase';
import { ShieldCheck, Truck, Headphones, MessageCircle, ArrowUpRight, Heart, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Brand values banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Nationwide SA Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Reliable 24-48h dispatch to all 9 South African provinces via The Courier Guy.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-900/30 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Authentic Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">Verified streetwear kicks, original German hubblies, and ICASA-approved mobile phones.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Direct WhatsApp Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Chat instantly with our Johannesburg team for sizing advice or rental reservations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-rose-600 flex items-center justify-center font-black text-white text-sm">
                B36
              </div>
              <span className="font-heading font-black text-2xl tracking-tighter text-white">
                BROERHOOD<span className="text-rose-500">36</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your style. Your tech. Your hood. Broerhood36 brings the best of global streetwear sneakers, flagship mobile technology, authentic football match kits, and German precision shisha lifestyle to the South African youth culture.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_1}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Line 1: +{CONFIG.WHATSAPP_1}</span>
              </a>
              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_2}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Line 2: +{CONFIG.WHATSAPP_2}</span>
              </a>
            </div>
          </div>

          {/* Shop Col */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm tracking-wide uppercase mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('sneakers')} className="hover:text-white transition-colors">
                  Sneakers &amp; Kicks
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('phones')} className="hover:text-white transition-colors">
                  Smartphones
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('accessories')} className="hover:text-white transition-colors">
                  Phone Accessories
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('football')} className="hover:text-white transition-colors">
                  Football Match Kits
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('hubblies')} className="hover:text-white transition-colors">
                  German Hubblies
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shisha-accessories')} className="hover:text-white transition-colors">
                  Shisha Materials &amp; Coals
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('vapes')} className="hover:text-white transition-colors">
                  Vapes (18+ Verified)
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Rentals Col */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm tracking-wide uppercase mb-4">
              Services &amp; Experience
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('rentals')} className="hover:text-white transition-colors">
                  Hubbly Rental Bookings
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shisha-accessories')} className="hover:text-white transition-colors">
                  Build Your Setup (Bundle)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('phones')} className="hover:text-white transition-colors">
                  Phone Comparison Tool
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('tracking')} className="hover:text-white transition-colors">
                  Order Tracking System
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Our Story &amp; Values
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Contact Us (Both Lines)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('enquiry')} className="text-rose-400 hover:text-white transition-colors font-semibold">
                  Submit an Enquiry (All Channels)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="text-blue-400 hover:text-white transition-colors font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm tracking-wide uppercase mb-4">
              Online Store &amp; Support
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div>
                <strong className="text-slate-200 block">Nationwide Delivery:</strong>
                <span>Courier to Door across all 9 Provinces</span>
              </div>
              <div>
                <strong className="text-slate-200 block">Fulfillment:</strong>
                <span>Online Only · Express 24–48h Dispatch</span>
              </div>
              <div>
                <strong className="text-slate-200 block">WhatsApp Lines:</strong>
                <div className="space-y-0.5 mt-0.5">
                  <a href={`https://wa.me/${CONFIG.WHATSAPP_1}`} className="text-emerald-400 hover:underline block font-semibold">
                    Line 1: +{CONFIG.WHATSAPP_1}
                  </a>
                  <a href={`https://wa.me/${CONFIG.WHATSAPP_2}`} className="text-emerald-400 hover:underline block font-semibold">
                    Line 2: +{CONFIG.WHATSAPP_2}
                  </a>
                </div>
              </div>
              <div>
                <strong className="text-slate-200 block">Official Email:</strong>
                <a href={`mailto:${CONFIG.STORE_EMAIL}`} className="text-blue-400 hover:underline font-mono break-all">
                  {CONFIG.STORE_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Accepted Payment badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400">Secure SA Payments:</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-slate-300">
              PayFast
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-emerald-400">
              Ozow Instant EFT
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-blue-400">
              Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-amber-400">
              SnapScan
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-rose-400">
              Cash on Delivery (Gauteng/CT)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span>© 2026 BROERHOOD36 (Pty) Ltd.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
