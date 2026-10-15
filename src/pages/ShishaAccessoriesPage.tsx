import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Flame, Sparkles, Check, ShoppingBag, Plus, ArrowRight, Layers } from 'lucide-react';

export const ShishaAccessoriesPage: React.FC = () => {
  const { addToCart } = useShop();

  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');

  // Interactive "Build Your Setup" state
  const [bundlePipe, setBundlePipe] = useState<Product | null>(
    PRODUCTS.find((p) => p.id === 'hub-03') || null // Aladin MVP 480
  );
  const [bundleCoal, setBundleCoal] = useState<Product | null>(
    PRODUCTS.find((p) => p.id === 'sh-01') || null // CocoUrth
  );
  const [bundleStove, setBundleStove] = useState<Product | null>(
    PRODUCTS.find((p) => p.id === 'sh-02') || null // 1000W Stove
  );
  const [bundleHmd, setBundleHmd] = useState<Product | null>(
    PRODUCTS.find((p) => p.id === 'sh-03') || null // HMD
  );
  const [bundleFlavour, setBundleFlavour] = useState<Product | null>(
    PRODUCTS.find((p) => p.id === 'sh-05') || null // Al Fakher Double Apple
  );
  const [isBundleAdded, setIsBundleAdded] = useState(false);

  const subcategories = [
    { id: 'all', label: 'All Shisha Materials' },
    { id: 'Coal', label: 'Coconut Coal' },
    { id: 'Stoves', label: 'Electric Stoves' },
    { id: 'HMDs', label: 'HMDs' },
    { id: 'Flavours', label: 'Flavours' },
    { id: 'Pipes/Hoses', label: 'Silicone Hoses' },
    { id: 'Foil', label: 'Shisha Foil' },
    { id: 'Bundles', label: 'Complete Bundles' }
  ];

  const accessoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== 'shisha-accessories') return false;
      if (selectedSubcat !== 'all' && p.subcategory !== selectedSubcat) return false;
      return true;
    });
  }, [selectedSubcat]);

  // Bundle calculations
  const rawBundleSum =
    (bundlePipe?.price || 0) +
    (bundleCoal?.price || 0) +
    (bundleStove?.price || 0) +
    (bundleHmd?.price || 0) +
    (bundleFlavour?.price || 0);

  const bundleDiscount = Math.round(rawBundleSum * 0.1); // 10% bundle discount
  const finalBundlePrice = rawBundleSum - bundleDiscount;

  const handleAddBundleToCart = () => {
    if (bundlePipe) addToCart(bundlePipe);
    if (bundleCoal) addToCart(bundleCoal);
    if (bundleStove) addToCart(bundleStove);
    if (bundleHmd) addToCart(bundleHmd);
    if (bundleFlavour) addToCart(bundleFlavour);

    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Category Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-blue-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-rose-500/40 text-rose-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>PREMIUM SHISHA ACCESSORIES &amp; MATERIALS</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            SHISHA ACCESSORIES
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Everything you need for clean, thick clouds. 100% natural compressed coconut coals, 1000W electric stoves, medical-grade silicone hoses, heat management devices (HMDs), and premium flavours.
          </p>
        </div>
      </div>

      {/* ================= BUILD YOUR SETUP BUNDLE BUILDER ================= */}
      <section className="rounded-3xl bg-slate-900/90 border border-blue-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>INTERACTIVE BUNDLE BUILDER</span>
              </div>
              <h2 className="font-heading font-black text-3xl text-white">
                BUILD YOUR SETUP
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize your complete German shisha kit. Bundle all 5 essentials and receive an automatic 10% bundle discount!
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-right shrink-0">
              <span className="text-[11px] text-slate-400 block">Bundle Total (10% OFF applied):</span>
              <div className="flex items-baseline justify-end gap-2">
                <span className="font-heading font-black text-2xl text-emerald-400 font-mono-num">
                  R {finalBundlePrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 line-through font-mono-num">
                  R {rawBundleSum.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-rose-400 font-bold block mt-0.5">
                You save R {bundleDiscount.toLocaleString()}!
              </span>
            </div>
          </div>

          {/* 5 Setup Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Slot 1: Hubbly Pipe */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  1. German Pipe
                </span>
                <h4 className="font-bold text-xs text-white line-clamp-1">
                  {bundlePipe ? bundlePipe.name : 'Select Hubbly'}
                </h4>
                <div className="font-mono-num text-xs text-slate-300 mt-1">
                  R {bundlePipe?.price.toLocaleString()}
                </div>
              </div>
              <div className="mt-3">
                <select
                  value={bundlePipe?.id}
                  onChange={(e) => {
                    const found = PRODUCTS.find((p) => p.id === e.target.value);
                    if (found) setBundlePipe(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg p-2"
                >
                  {PRODUCTS.filter((p) => p.category === 'hubblies').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (R{p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slot 2: Coal */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  2. Shisha Charcoal
                </span>
                <h4 className="font-bold text-xs text-white line-clamp-1">
                  {bundleCoal ? bundleCoal.name : 'Select Coal'}
                </h4>
                <div className="font-mono-num text-xs text-slate-300 mt-1">
                  R {bundleCoal?.price.toLocaleString()}
                </div>
              </div>
              <div className="mt-3">
                <select
                  value={bundleCoal?.id}
                  onChange={(e) => {
                    const found = PRODUCTS.find((p) => p.id === e.target.value);
                    if (found) setBundleCoal(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg p-2"
                >
                  {PRODUCTS.filter((p) => p.subcategory === 'Coal').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (R{p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slot 3: Electric Stove */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  3. Coal Burner Stove
                </span>
                <h4 className="font-bold text-xs text-white line-clamp-1">
                  {bundleStove ? bundleStove.name : 'Select Stove'}
                </h4>
                <div className="font-mono-num text-xs text-slate-300 mt-1">
                  R {bundleStove?.price.toLocaleString()}
                </div>
              </div>
              <div className="mt-3">
                <select
                  value={bundleStove?.id}
                  onChange={(e) => {
                    const found = PRODUCTS.find((p) => p.id === e.target.value);
                    if (found) setBundleStove(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg p-2"
                >
                  {PRODUCTS.filter((p) => p.subcategory === 'Stoves').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (R{p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slot 4: HMD */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  4. Heat Management (HMD)
                </span>
                <h4 className="font-bold text-xs text-white line-clamp-1">
                  {bundleHmd ? bundleHmd.name : 'Select HMD'}
                </h4>
                <div className="font-mono-num text-xs text-slate-300 mt-1">
                  R {bundleHmd?.price.toLocaleString()}
                </div>
              </div>
              <div className="mt-3">
                <select
                  value={bundleHmd?.id}
                  onChange={(e) => {
                    const found = PRODUCTS.find((p) => p.id === e.target.value);
                    if (found) setBundleHmd(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg p-2"
                >
                  {PRODUCTS.filter((p) => p.subcategory === 'HMDs' || p.subcategory === 'Foil').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (R{p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slot 5: Flavour */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  5. Premium Flavour
                </span>
                <h4 className="font-bold text-xs text-white line-clamp-1">
                  {bundleFlavour ? bundleFlavour.name : 'Select Flavour'}
                </h4>
                <div className="font-mono-num text-xs text-slate-300 mt-1">
                  R {bundleFlavour?.price.toLocaleString()}
                </div>
              </div>
              <div className="mt-3">
                <select
                  value={bundleFlavour?.id}
                  onChange={(e) => {
                    const found = PRODUCTS.find((p) => p.id === e.target.value);
                    if (found) setBundleFlavour(found);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg p-2"
                >
                  {PRODUCTS.filter((p) => p.subcategory === 'Flavours').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (R{p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Add Bundle Action */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleAddBundleToCart}
              className={`px-8 py-3.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 transition-all shadow-xl ${
                isBundleAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white shadow-blue-900/40'
              }`}
            >
              {isBundleAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Custom Bundle Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD COMPLETE 5-PIECE BUNDLE TO BAG (R {finalBundlePrice.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Subcategory Filter Tabs */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-2 overflow-x-auto">
        {subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubcat(sub.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedSubcat === sub.id
                ? 'bg-gradient-to-r from-rose-600 to-blue-600 text-white shadow-md'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {accessoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
