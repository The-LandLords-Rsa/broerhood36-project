import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Headphones, BatteryCharging, Shield, Watch, Speaker, Cable, Smartphone, ArrowRight } from 'lucide-react';

export const AccessoriesPage: React.FC = () => {
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');

  const subcategories = [
    { id: 'all', label: 'All Tech Gear' },
    { id: 'Chargers', label: 'Chargers' },
    { id: 'Power banks', label: 'Power Banks' },
    { id: 'Covers', label: 'Phone Cases' }
  ];

  const accessoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== 'accessories') return false;
      if (selectedSubcat !== 'all' && p.subcategory !== selectedSubcat) return false;
      return true;
    });
  }, [selectedSubcat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Category Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-blue-500/40 text-blue-400 text-xs font-bold">
            <BatteryCharging className="w-3.5 h-3.5 fill-current" />
            <span>ESSENTIAL TECH GEAR &amp; POWER</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            PHONE ACCESSORIES
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Never get caught with zero battery during loadshedding. 65W GaN ultra-fast chargers, MagSafe armor cases, ANC studio headphones, and heavy-duty 20,000mAh power banks.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-2 overflow-x-auto">
        {subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubcat(sub.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedSubcat === sub.id
                ? 'bg-gradient-to-r from-blue-600 to-rose-600 text-white shadow-md'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {accessoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
