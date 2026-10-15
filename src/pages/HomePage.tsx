import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES_LIST, CATEGORY_HERO_IMAGES } from '../data/products';
import { CUSTOMER_REVIEWS, TRUST_FEATURES } from '../data/reviews';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  Quote,
  ShieldCheck,
  Tag,
  Smartphone,
  Truck,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo } = useShop();

  const trendingProducts = PRODUCTS.filter((p) => p.isTrending || p.isFeatured).slice(0, 8);

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-blue-400" />;
      case 'Tag':
        return <Tag className="w-7 h-7 text-rose-400" />;
      case 'Smartphone':
        return <Smartphone className="w-7 h-7 text-blue-400" />;
      case 'Truck':
      default:
        return <Truck className="w-7 h-7 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 pt-8 sm:pt-14 pb-16 lg:pb-24 border-b border-slate-800/80">
        {/* Ambient lighting glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy & call to action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-slate-300">MZANSI'S #1 YOUTH LIFESTYLE MARKETPLACE</span>
              </div>

              <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-white leading-none">
                YOUR STYLE.<br />
                <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-rose-500 bg-clip-text text-transparent">
                  YOUR TECH.
                </span><br />
                YOUR HOOD.
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Sneakers, smartphones, football jerseys, accessories and lifestyle products — all in one place. Engineered for the streets of South Africa.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigateTo('shop')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white shadow-xl shadow-blue-900/40 hover:scale-102 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>SHOP NOW</span>
                </button>

                <a
                  href="#categories"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-heading font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-all flex items-center justify-center gap-2"
                >
                  <span>EXPLORE COLLECTIONS</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Hero highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="font-mono-num font-black text-xl text-white">100%</div>
                  <div className="text-xs text-slate-400">Authentic Kicks</div>
                </div>
                <div>
                  <div className="font-mono-num font-black text-xl text-white">24-48h</div>
                  <div className="text-xs text-slate-400">SA Delivery</div>
                </div>
                <div>
                  <div className="font-mono-num font-black text-xl text-white">R 1,500+</div>
                  <div className="text-xs text-slate-400">Free Shipping</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative z-10">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-3 bg-gradient-to-br from-blue-600/20 via-slate-800/40 to-rose-600/20 border border-slate-700/80 shadow-2xl backdrop-blur-xl group">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={CATEGORY_HERO_IMAGES.hero}
                    alt="Broerhood36 lifestyle collection - Sneakers, Smartphones, Hubbly and Jerseys"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-bold tracking-wide bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700">
                      Curated 2026 Drop
                    </span>
                    <span className="text-rose-400 font-bold bg-rose-950/70 backdrop-blur-md px-3 py-1 rounded-lg border border-rose-500/40">
                      Nationwide Online Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Explore The Catalog</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              SHOP BY CATEGORY
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 7 Big Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES_LIST.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => navigateTo(cat.route)}
              className={`group relative rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/40 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                idx === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="relative aspect-16/10 w-full bg-slate-950 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-slate-300 border border-slate-800">
                  {cat.count}
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h3 className="font-heading font-black text-xl text-white group-hover:text-blue-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-rose-400 group-hover:text-white transition-colors">
                  <span>Explore Collection</span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING NOW (FEATURED PRODUCTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 tracking-wider uppercase mb-1">
              <Flame className="w-4 h-4 fill-current" />
              <span>Mzansi Street Heat</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              TRENDING NOW
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 group"
          >
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-slate-900 to-rose-950 border border-slate-700/80 p-8 sm:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-black tracking-widest text-rose-400 uppercase bg-rose-950/60 border border-rose-500/30 px-3 py-1 rounded-full inline-block">
              LIMITED TIME OFFER
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              LEVEL UP YOUR SETUP
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Get your tech, kicks and lifestyle essentials in one place. Use voucher code <strong className="text-white underline decoration-rose-500 decoration-2">BROERHOOD10</strong> at checkout for 10% instant off your first order.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-lg flex items-center gap-2"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE BROERHOOD36 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Built For The Culture
          </span>
          <h2 className="font-heading font-black text-3xl text-white mt-1">
            WHY CHOOSE BROERHOOD36
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            South African youth market excellence with unmatched standards and local customer support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
                  {getFeatureIcon(feature.iconName)}
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">
              Real Experiences
            </span>
            <h2 className="font-heading font-black text-3xl text-white mt-1">
              CUSTOMER REVIEWS
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-white font-bold font-mono-num">4.9 / 5.0</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span>(240+ Verified Buyers)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono-num">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white block">{rev.author}</strong>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block">{rev.location}</span>
                <span className="text-[10px] text-blue-400 font-medium line-clamp-1 mt-0.5">
                  {rev.productReviewed}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
