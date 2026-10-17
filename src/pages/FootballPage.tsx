import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { getProductImage } from '../lib/autoImages';
import { Trophy, Shield, Shirt, Sparkles } from 'lucide-react';

export const FootballPage: React.FC = () => {
  const { openProductModal, addToCart } = useShop();

  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedEdition, setSelectedEdition] = useState<string>('all');

  const leagues = [
    { id: 'all', label: 'All Leagues' },
    { id: 'Premier League', label: 'Premier League' },
    { id: 'La Liga', label: 'La Liga' },
    { id: 'International', label: 'International Teams' },
    { id: 'PSL South Africa', label: 'South African PSL' }
  ];

  const editions = ['all', 'Home', 'Away', 'Third'];

  const footballProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== 'football') return false;
      if (selectedLeague !== 'all' && p.league !== selectedLeague && p.subcategory !== selectedLeague) {
        return false;
      }
      if (selectedEdition !== 'all' && p.jerseyType !== selectedEdition) {
        return false;
      }
      return true;
    });
  }, [selectedLeague, selectedEdition]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Category Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-blue-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-rose-500/40 text-rose-400 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 fill-current" />
            <span>AUTHENTIC MATCHDAY &amp; STREETWEAR KITS</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            REP YOUR CLUB
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From North London to the Bernabéu, and Soweto to Bafana Bafana. Official authentic matchday and stadium jerseys engineered with moisture-wicking technology and embroidered club crests.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* League Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Competition:
          </span>
          {leagues.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLeague(l.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLeague === l.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Edition: Home / Away / Third */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Edition:
          </span>
          {editions.map((ed) => (
            <button
              key={ed}
              onClick={() => setSelectedEdition(ed)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedEdition === ed
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {ed === 'all' ? 'All Kits' : `${ed} Kit`}
            </button>
          ))}
        </div>
      </div>

      {/* Football Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {footballProducts.map((jersey) => (
          <div
            key={jersey.id}
            onClick={() => openProductModal(jersey)}
            className="group bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-rose-500/50 p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg hover:shadow-rose-950/20"
          >
            <div>
              {/* Badge & Edition */}
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-rose-400 uppercase tracking-wider">
                  {jersey.brand}
                </span>
                <span className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                  {jersey.jerseyType} Kit · {jersey.season}
                </span>
              </div>

              {/* Jersey Photo */}
              <div className="relative aspect-4/3 w-full bg-white rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center">
                <img
                  src={getProductImage(jersey, 'front')}
                  alt={jersey.name}
                  className="w-full h-full object-contain rounded-lg"
                />
                {jersey.discountPercent && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                    {jersey.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-heading font-black text-base text-white group-hover:text-rose-400 transition-colors">
                {jersey.name}
              </h3>

              {/* Sizes Available */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                  Sizes Available:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {jersey.sizes?.map((sz) => (
                    <span
                      key={sz}
                      className="px-2 py-0.5 text-[10px] font-bold bg-slate-950 border border-slate-800 rounded text-slate-300"
                    >
                      {sz}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Add */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-heading font-black text-lg text-white font-mono-num block">
                  R {jersey.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Official Club Authentic</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(jersey, { size: jersey.sizes?.[0] });
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md"
              >
                Add to Bag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
