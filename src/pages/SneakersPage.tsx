import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Flame, Sparkles, SlidersHorizontal, Check } from 'lucide-react';

export const SneakersPage: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'featured' | 'asc' | 'desc'>('featured');

  const brands = ['all', 'Jordan', 'Nike', 'New Balance', 'Adidas'];
  const sizes = ['all', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
  const styles = ['all', 'Lifestyle Sneakers', 'Sports Shoes'];

  const sneakerProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== 'sneakers') return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (selectedSize !== 'all' && !p.sizes?.includes(selectedSize)) return false;
      if (selectedStyle !== 'all' && p.subcategory !== selectedStyle) return false;
      return true;
    }).sort((a, b) => {
      if (priceSort === 'asc') return a.price - b.price;
      if (priceSort === 'desc') return b.price - a.price;
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    });
  }, [selectedBrand, selectedSize, selectedStyle, priceSort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Category Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>AUTHENTIC STREETWEAR FOOTWEAR</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            STEP INTO SOMETHING DIFFERENT
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From iconic Air Jordan grails to chunky Y2K New Balance runners and classic Nike Dunks. 100% verified authentic kicks, delivered nationwide across South Africa with door tracking.
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        {/* Brand Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Brand:
          </span>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedBrand === b
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selector Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            UK Sizing:
          </span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSize === s
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All Sizes' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Style & Sort Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Silhouette Style:</span>
            {styles.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStyle(st)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  selectedStyle === st
                    ? 'text-white bg-slate-800 border border-blue-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Styles' : st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Sort:</span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
            >
              <option value="featured">Featured Drops</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sneaker Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sneakerProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
