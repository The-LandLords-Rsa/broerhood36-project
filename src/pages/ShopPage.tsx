import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { navigateTo } = useShop();

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique brands, sizes, colors for filter dropdowns
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, []);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, []);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => p.colors?.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      // Brand
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      // Size
      if (selectedSize !== 'all' && !p.sizes?.includes(selectedSize)) return false;
      // Color
      if (selectedColor !== 'all' && !p.colors?.includes(selectedColor)) return false;
      // Price
      if (p.price > maxPrice) return false;
      // Availability
      if (inStockOnly && !p.inStock) return false;
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchCat = p.category.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchCat && !matchDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    });
  }, [
    selectedCategory,
    selectedBrand,
    selectedSize,
    selectedColor,
    maxPrice,
    inStockOnly,
    search,
    sortBy
  ]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setInStockOnly(false);
    setMaxPrice(35000);
    setSortBy('featured');
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'sneakers', label: 'Sneakers' },
    { id: 'phones', label: 'Phones' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'football', label: 'Football' },
    { id: 'hubblies', label: 'Hubblies' },
    { id: 'shisha-accessories', label: 'Shisha Coals & Materials' },
    { id: 'vapes', label: 'Vapes (18+)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
            Complete South African Marketplace
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            SHOP ALL PRODUCTS
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Showing <strong className="text-white font-mono-num">{filteredProducts.length}</strong> items across all departments
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Filters ({selectedCategory !== 'all' || selectedBrand !== 'all' ? 'Active' : 'All'})</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className={`space-y-6 lg:block ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                Filter Products
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Search Catalog</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter name, model..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Department</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider Filter */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-slate-300">Max Price:</span>
                <span className="font-mono-num font-bold text-white">R {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="200"
                max="35000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono-num">
                <span>R 200</span>
                <span>R 35,000</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Brands ({availableBrands.length})</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            {availableSizes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Size</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                      selectedSize === 'all'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Any
                  </button>
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                        selectedSize === s
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Filter */}
            {availableColors.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Colourway</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Colours</option>
                  {availableColors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Availability Toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">In Stock Only</span>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                  inStockOnly ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    inStockOnly ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid & Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400">
              Showing <strong className="text-white font-mono-num">{filteredProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="featured">Trending &amp; Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
              <h3 className="font-heading font-bold text-xl text-white">No products found</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                No items match your active filters. Try clearing some filters or searching for another term.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
