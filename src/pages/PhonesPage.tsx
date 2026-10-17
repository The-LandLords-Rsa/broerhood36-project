import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { getProductImage } from '../lib/autoImages';
import { Smartphone, SlidersHorizontal, Check, Zap, ArrowRight } from 'lucide-react';

export const PhonesPage: React.FC = () => {
  const {
    comparePhones,
    setIsCompareModalOpen,
    openProductModal,
    addToCart,
    toggleComparePhone,
    isCompared
  } = useShop();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');

  const brands = ['all', 'iPhone', 'Samsung', 'Honor'];
  const storageList = ['all', '128GB', '256GB', '512GB', '1TB'];

  const phoneProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== 'phones') return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (selectedStorage !== 'all' && !p.storageOptions?.includes(selectedStorage)) return false;
      return true;
    });
  }, [selectedBrand, selectedStorage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Category Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-blue-500/40 text-blue-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>OFFICIAL ICASA APPROVED DEVICES</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            UPGRADE YOUR TECH
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Experience next-generation mobile performance. Flagship titanium Apple iPhone 16 Pro, Samsung Galaxy S24 Ultra with Galaxy AI, and Honor Magic 6 Pro. Factory unlocked with full local warranty.
          </p>

          {/* Quick Comparison Tool Callout */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/30"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Open Side-by-Side Comparison ({comparePhones.length} selected)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Brand & Storage Filters */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand Segment */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Brand:
          </span>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBrand === b
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {b === 'all' ? 'All Smartphones' : b}
            </button>
          ))}
        </div>

        {/* Storage Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Storage:
          </span>
          {storageList.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStorage(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStorage === st
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Smartphones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phoneProducts.map((phone) => {
          const isComp = isCompared(phone.id);
          return (
            <div
              key={phone.id}
              onClick={() => openProductModal(phone)}
              className="group bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-blue-500/50 p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-950/30"
            >
              <div>
                {/* Top bar with compare button */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    {phone.brand}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComparePhone(phone.id);
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                      isComp
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{isComp ? 'Comparing' : 'Compare'}</span>
                  </button>
                </div>

                {/* Phone Image */}
                <div className="relative aspect-4/3 w-full bg-slate-950 rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center">
                  <img
                    src={getProductImage(phone, 'front')}
                    alt={phone.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {phone.discountPercent && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                      SAVE {phone.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Model & Specs */}
                <h3 className="font-heading font-black text-lg text-white group-hover:text-blue-400 transition-colors">
                  {phone.name}
                </h3>

                {/* Key Spec highlights */}
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  <div>Display: <span className="text-slate-200 font-medium">{phone.specifications['Display'] || phone.specifications['Main Screen']}</span></div>
                  <div>Camera: <span className="text-slate-200 font-medium">{phone.specifications['Camera']}</span></div>
                </div>

                {/* Storage & Colour Pill display */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {phone.storageOptions?.map((storage) => (
                    <span key={storage} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                      {storage}
                    </span>
                  ))}
                  <span className="text-[10px] text-emerald-400 font-semibold ml-auto flex items-center gap-1">
                    <Check className="w-3 h-3" /> In Stock
                  </span>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-heading font-black text-xl text-white font-mono-num block">
                    R {phone.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Free insured SA delivery
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(phone, {
                      storage: phone.storageOptions?.[0],
                      color: phone.colors?.[0]
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating compare banner if user selected items */}
      {comparePhones.length > 0 && (
        <div className="sticky bottom-6 z-30 max-w-xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span className="text-white font-bold">{comparePhones.length} phones in comparison queue</span>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
