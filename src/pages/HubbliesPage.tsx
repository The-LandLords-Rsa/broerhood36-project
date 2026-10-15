import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { getProductImage } from '../lib/autoImages';
import { Flame, ShieldCheck, Calendar, Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export const HubbliesPage: React.FC = () => {
  const { navigateTo, openProductModal, addToCart } = useShop();
  const [mode, setMode] = useState<'buy' | 'rent'>('buy');

  const hubblyProducts = PRODUCTS.filter((p) => p.category === 'hubblies');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Category Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-blue-500/40 text-blue-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 fill-current" />
            <span>PRECISION GERMAN V2A SURGICAL STAINLESS STEEL</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            GERMAN HUBBLIES
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The undisputed gold standard of shisha engineering. Handcrafted in Germany with 360° click-lock systems, multi-channel purge valves, and surgical stainless steel that never rusts or stains.
          </p>
        </div>
      </div>

      {/* Prominent Mode Switcher: BUY vs RENT */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
        <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center shadow-xl">
          <button
            onClick={() => setMode('buy')}
            className={`px-8 py-3.5 rounded-xl font-heading font-bold text-sm transition-all flex items-center gap-2 ${
              mode === 'buy'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-102'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>BUY OUTRIGHT</span>
          </button>
          <button
            onClick={() => setMode('rent')}
            className={`px-8 py-3.5 rounded-xl font-heading font-bold text-sm transition-all flex items-center gap-2 ${
              mode === 'rent'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 scale-102'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>RENT FOR EVENTS</span>
          </button>
        </div>
      </div>

      {/* Mode Sub-banner Info */}
      {mode === 'buy' ? (
        <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Purchase Outright with Lifetime Quality</h3>
            <p className="text-slate-400 mt-0.5">Every German Hubbly includes full bowl, surgical steel stem, Bohemian crystal vase, silicone hose, and 2-year warranty.</p>
          </div>
          <button
            onClick={() => navigateTo('shisha-accessories')}
            className="px-4 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600 border border-blue-500/40 text-white font-bold whitespace-nowrap transition-colors"
          >
            Add Coals &amp; Accessories
          </button>
        </div>
      ) : (
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Event &amp; Gathering Rental Packages</h3>
            <p className="text-slate-400 mt-0.5">All rentals come sanitized and packed with 1000W coal stove burner, 1kg organic coals, HMD, and fresh flavour bowls. Delivery to your venue in Johannesburg or Cape Town.</p>
          </div>
          <button
            onClick={() => navigateTo('rentals')}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold whitespace-nowrap hover:bg-rose-500 transition-colors shadow-md"
          >
            View Rental Calendar &amp; Booking
          </button>
        </div>
      )}

      {/* Products Grid based on Mode */}
      {mode === 'buy' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubblyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* RENTAL CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubblyProducts.map((product) => {
            const rental = product.rentalDetails;
            if (!rental) return null;

            return (
              <div
                key={`rent-${product.id}`}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between transition-all hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-950/30"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-blue-400 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                      Available For Hire
                    </span>
                  </div>

                  <div className="relative aspect-4/3 w-full bg-slate-950 rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center">
                    <img
                      src={getProductImage(product, 'front')}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <h3 className="font-heading font-black text-lg text-white mb-2">
                    {product.name}
                  </h3>

                  {/* Pricing Details */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Daily Rate:</span>
                      <strong className="text-rose-400 font-mono-num text-sm">
                        R {rental.dailyRate} / 24h
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Refundable Deposit:</span>
                      <strong className="text-slate-200 font-mono-num">
                        R {rental.deposit}
                      </strong>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="text-xs">
                    <strong className="text-slate-300 block mb-2 font-semibold">
                      What's Included:
                    </strong>
                    <ul className="space-y-1.5 text-slate-400 text-[11px]">
                      {rental.whatsIncluded.slice(0, 4).map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => navigateTo('rentals', { productId: product.id })}
                    className="w-full py-3 px-4 rounded-xl font-heading font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-900/40 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>BOOK NOW</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
