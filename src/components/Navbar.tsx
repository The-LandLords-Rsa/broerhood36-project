import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CONFIG } from '../lib/supabase';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ArrowRight,
  Code2,
  Copy,
  Check,
  MessageCircle,
  FolderArchive,
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenWishlist?: () => void }> = ({ onOpenWishlist }) => {
  const {
    activePage,
    navigateTo,
    cartCount,
    cartTotal,
    wishlist,
    setIsSearchOpen,
    authUser,
    setIsAuthModalOpen,
    setIsDownloadModalOpen
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'sneakers', label: 'Sneakers' },
    { id: 'phones', label: 'Phones' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'football', label: 'Football' },
    { id: 'hubblies', label: 'Hubblies' },
    { id: 'vapes', label: 'Vapes' },
    { id: 'rentals', label: 'Rentals' },
    { id: 'enquiry', label: 'Enquiries' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId: string) => {
    navigateTo(pageId);
    setMobileMenuOpen(false);
  };

  const sqlScript = `-- RUN THIS IN SUPABASE SQL EDITOR
create extension if not exists "uuid-ossp";
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  price decimal not null,
  stock int default 10,
  description text,
  images jsonb not null,
  is_rental boolean default false,
  rental_price_per_day decimal,
  sizes text[] default array['S','M','L','XL'],
  created_at timestamp default now()
);
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  customer_name text not null,
  customer_whatsapp text not null,
  customer_email text,
  customer_address text,
  total decimal not null,
  status text default 'pending',
  order_details jsonb not null,
  is_rental boolean default false,
  rental_start date,
  rental_end date,
  created_at timestamp default now()
);
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  whatsapp text,
  address text,
  created_at timestamp default now()
);
alter table products enable row level security;
alter table orders enable row level security;
alter table profiles enable row level security;
drop policy if exists "public all" on products; create policy "public all" on products for all using (true) with check (true);
drop policy if exists "public all" on orders; create policy "public all" on orders for all using (true) with check (true);
drop policy if exists "public all" on profiles; create policy "public all" on profiles for all using (true) with check (true);
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
drop policy if exists "public read images" on storage.objects; create policy "public read images" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "allow upload images" on storage.objects; create policy "allow upload images" on storage.objects for insert with check (bucket_id = 'product-images');
drop policy if exists "allow update images" on storage.objects; create policy "allow update images" on storage.objects for update using (bucket_id = 'product-images');
drop policy if exists "allow delete images" on storage.objects; create policy "allow delete images" on storage.objects for delete using (bucket_id = 'product-images');`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* Top slim announcement bar - MOBILE STACKED */}
      <div className="w-full bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 text-slate-200 border-b border-slate-800/80 font-medium overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-1.5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 sm:gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-rose-400 font-bold tracking-wide">FREE DELIVERY OVER R1,500</span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-300">Code: <strong className="text-white bg-blue-600/30 px-1 py-0.5 rounded border border-blue-500/40">BROERHOOD10</strong></span>
          </div>
         {authUser?.email === 'broer.hood.36@gmail.com' && (
      <div className="hidden md:flex items-center gap-3">
        <button onClick={() => handleNavClick('admin')} className="text-blue-400 font-bold">Admin Portal</button>
        <button onClick={() => setShowSqlGuide(!showSqlGuide)} className="text-blue-400"><Code2 /> SQL Guide</button>
      </div>
      )} 
        </div>
      </div>

      {showSqlGuide && (
        <div className="w-full bg-slate-900 border-b border-blue-500/30 p-3 text-xs">
          <div className="w-full max-w-7xl mx-auto space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-[11px]"><Code2 className="w-4 h-4" /><span>Supabase SQL (Run Once)</span></div>
              <div className="flex items-center gap-2">
                <button onClick={copySql} className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-1 text-[11px]">{copiedSql? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copiedSql? 'Copied!' : 'Copy'}</button>
                <button onClick={() => setShowSqlGuide(false)} className="p-1 text-slate-400 hover:text-white">✕</button>
              </div>
            </div>
            <pre className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-emerald-400 font-mono overflow-x-auto max-h-48 whitespace-pre-wrap break-all">{sqlScript}</pre>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full max-w-[100vw] bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[64px] sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <button onClick={() => handleNavClick('home')} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-rose-600 flex items-center justify-center font-black text-white text-sm sm:text-lg">B36</div>
            <div className="flex flex-col text-left">
              <span className="font-black text-[16px] sm:text-xl tracking-tighter text-white leading-none">BROERHOOD<span className="text-rose-500">36</span></span>
              <span className="text-[8px] sm:text-[10px] tracking-widest text-blue-400 uppercase font-bold font-mono">EST. SOUTH AFRICA</span>
            </div>
          </button>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button key={link.id} onClick={() => handleNavClick(link.id)} className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${isActive? 'text-white bg-blue-600/20 border border-blue-500/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`}>
                  {link.label}{link.id === 'vapes' && <span className="ml-1 text-[8px] text-rose-400 border border-rose-500/30 rounded px-1">18+</span>}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 sm:p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"><Search className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <button onClick={() => { if (onOpenWishlist) onOpenWishlist(); else handleNavClick('account'); }} className="relative p-2 sm:p-2.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
            </button>
            <button onClick={() => setIsAuthModalOpen(true)} className={`p-2 sm:p-2.5 rounded-lg ${authUser? 'text-blue-400 bg-blue-900/30 border border-blue-500/40' : 'text-slate-300 hover:bg-slate-800'}`}><User className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            <button onClick={() => handleNavClick('cart')} className="relative flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] sm:text-xs shadow-md">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Bag</span><span className="bg-white text-blue-950 font-black px-1.5 rounded-full text-[10px]">{cartCount}</span>
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 ml-1">{mobileMenuOpen? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}</button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden w-full max-w-[100vw] bg-slate-950 border-t border-slate-800 px-3 py-4 max-h-[85vh] overflow-y-auto overflow-x-hidden">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return <button key={link.id} onClick={() => handleNavClick(link.id)} className={`flex items-center justify-between px-3 py-3 rounded-lg text-xs sm:text-sm font-semibold ${isActive? 'bg-gradient-to-r from-blue-600 to-rose-600 text-white' : 'bg-slate-900 text-slate-200'}`}><span>{link.label}</span><ArrowRight className="w-3 h-3 opacity-50" /></button>;
              })}
            </div>
           <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
  {authUser?.email === 'broer.hood.36@gmail.com' && (
    <>
      <button onClick={() => handleNavClick('admin')} className="w-full py-2.5 text-center text-xs font-bold text-blue-400 bg-slate-900 rounded-lg">Admin Orders Console</button>
      <button
        onClick={() => setShowSqlGuide(!showSqlGuide)}
        className="w-full py-2.5 text-center text-xs font-bold text-blue-400 bg-slate-900 rounded-lg flex items-center justify-center gap-2"
      >
        <Code2 className="w-3.5 h-3.5" /> Supabase SQL Guide
      </button>
    </>
  )}
  <button onClick={() => handleNavClick('tracking')} className="w-full py-2.5 text-center text-xs font-semibold text-slate-300 bg-slate-900 rounded-lg">Track Live Order</button>
              <div className="grid grid-cols-2 gap-2">
                <a href={`https://wa.me/${CONFIG.WHATSAPP_1}`} target="_blank" rel="noreferrer" className="py-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold text-center flex items-center justify-center gap-1"><MessageCircle className="w-3.5 h-3.5" />WA 1</a>
                <a href={`https://wa.me/${CONFIG.WHATSAPP_2}`} target="_blank" rel="noreferrer" className="py-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold text-center flex items-center justify-center gap-1"><MessageCircle className="w-3.5 h-3.5" />WA 2</a>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};