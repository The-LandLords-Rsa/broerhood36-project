import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { getProductImage } from '../lib/autoImages';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    openProductModal,
    navigateTo
  } = useShop();

  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInputVal('');
    }
  }, [isSearchOpen]);

  const quickPicks = ['iPhone', 'Nike', 'Hubbly', 'Samsung', 'Arsenal', 'Vape', 'Charger'];

  const results = useMemo(() => {
    const query = inputVal.trim().toLowerCase();
    if (!query) return [];

    return PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchBrand = p.brand.toLowerCase().includes(query);
      const matchCategory = p.category.toLowerCase().includes(query);
      const matchSub = p.subcategory?.toLowerCase().includes(query) || false;
      const matchDesc = p.description.toLowerCase().includes(query);

      // Special search logic mentioned in prompt:
      // "iPhone" -> phones and phone accessories
      if (query === 'iphone') {
        return (
          p.brand.toLowerCase().includes('iphone') ||
          p.category === 'accessories' ||
          p.name.toLowerCase().includes('iphone')
        );
      }
      // "Nike" -> sneakers and products
      if (query === 'nike') {
        return (
          p.brand.toLowerCase().includes('nike') ||
          p.category === 'sneakers' ||
          p.name.toLowerCase().includes('nike')
        );
      }
      // "Hubbly" -> hubblies and shisha accessories
      if (query === 'hubbly' || query === 'shisha') {
        return p.category === 'hubblies' || p.category === 'shisha-accessories';
      }

      return matchName || matchBrand || matchCategory || matchSub || matchDesc;
    });
  }, [inputVal]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-6 h-6 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search kicks, iPhones, Samsung, hubblies, jerseys, vapes..."
            className="w-full bg-transparent text-white text-base sm:text-lg focus:outline-none placeholder-slate-500 font-medium"
          />
          {inputVal && (
            <button
              onClick={() => setInputVal('')}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-semibold shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            Trending:
          </span>
          {quickPicks.map((pick) => (
            <button
              key={pick}
              onClick={() => setInputVal(pick)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-blue-600/30 text-slate-300 hover:text-white border border-slate-800 hover:border-blue-500/40 shrink-0 transition-colors"
            >
              {pick}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {inputVal && results.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">No results found for "{inputVal}".</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching "iPhone", "Nike", "Hubbly", "Charger" or "Jersey".
              </p>
            </div>
          )}

          {!inputVal && (
            <div className="py-8 text-center text-slate-500 text-xs">
              Type to instantly search across the entire South African catalog.
            </div>
          )}

          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                setIsSearchOpen(false);
                openProductModal(product);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-850 hover:border-blue-500/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getProductImage(product, 'front')}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg bg-slate-950 p-1 border border-slate-800"
                />
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold uppercase">
                    <span>{product.brand}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{product.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h4>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono-num font-black text-sm text-white block">
                  R {product.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-rose-400 flex items-center justify-end gap-1">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
