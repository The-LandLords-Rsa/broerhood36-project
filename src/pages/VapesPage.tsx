import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const VapesPage: React.FC = () => {
  const { isAgeVerified, setIsAgeModalOpen } = useShop();

  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');

  const subcategories = [
    { id: 'all', label: 'All Vape Hardware' },
    { id: 'Vape Devices', label: 'Pod Kits & Mods' },
    { id: 'Disposable Vapes', label: 'Disposables (10k Puffs)' },
    { id: 'Pods', label: 'Replacement Pods' },
    { id: 'Flavours', label: 'Salt Nic E-Liquids' }
  ];

  const vapeProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== 'vapes') return false;
      if (selectedSubcat !== 'all' && p.subcategory !== selectedSubcat) return false;
      return true;
    });
  }, [selectedSubcat]);

  // If somehow not verified, show lock gate
  if (!isAgeVerified) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="font-heading font-black text-2xl text-white">AGE VERIFICATION REQUIRED</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            You must verify you are 18 years or older under South African law to view this catalog.
          </p>
          <button
            onClick={() => setIsAgeModalOpen(true)}
            className="mt-6 px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950"
          >
            Verify My Age (18+)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Category Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 fill-current" />
            <span>AGE VERIFIED · 18+ ADULT CONSUMER</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            VAPES &amp; POD SYSTEMS
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore authentic refillable pod systems, ultra long-lasting disposable vapes, replacement mesh coils, and award-winning salt nic flavours from Vaporesso, ElfBar and Nasty Juice.
          </p>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-400">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          Compliance Notice: Products contain nicotine. For legal adult smokers only. Broerhood36 does not make therapeutic, cessation, or health claims regarding electronic vape devices.
        </span>
      </div>

      {/* Subcategory Filter Tabs */}
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vapeProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
