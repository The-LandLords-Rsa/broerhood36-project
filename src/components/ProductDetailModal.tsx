import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import {
  getProductImage,
  getProductImageCategory,
  getProductImageFallback,
  type ProductImageView
} from '../lib/autoImages';
import {
  X,
  Star,
  Check,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductModal,
    addToCart,
    navigateTo,
    toggleWishlist,
    isWishlisted,
    toggleComparePhone,
    isCompared
  } = useShop();

  const [activePhoto, setActivePhoto] = useState<string>('');
  const [activeView, setActiveView] = useState<ProductImageView>('side');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'rental'>('desc');

  useEffect(() => {
    if (selectedProduct) {
      setActivePhoto(getProductImage(selectedProduct, 'front'));
      setActiveView('front');
      setSelectedSize(selectedProduct.sizes?.[0] || '');
      setSelectedColor(selectedProduct.colors?.[0] || '');
      setSelectedStorage(selectedProduct.storageOptions?.[0] || '');
      setQuantity(1);
      setIsAdded(false);
      setActiveTab('desc');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const wishlisted = isWishlisted(selectedProduct.id);
  const compared = isCompared(selectedProduct.id);

  const imageViews: ProductImageView[] = getProductImageCategory(selectedProduct.category)
    ? ['top', 'side', 'back']
    : ['front', 'side', 'top', 'back'];
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, view: ProductImageView) => {
    const failedSource = event.currentTarget.currentSrc || event.currentTarget.src;
    if (event.currentTarget.dataset.failedSource === failedSource) {
      event.currentTarget.style.display = 'none';
      return;
    }

    const fallback = getProductImageFallback(selectedProduct.name, selectedProduct.category, view);
    if (fallback && failedSource !== fallback) {
      event.currentTarget.dataset.failedSource = failedSource;
      event.currentTarget.src = fallback;
      return;
    }
    event.currentTarget.style.display = 'none';
  };

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(selectedProduct, {
      quantity,
      size: selectedSize,
      color: selectedColor,
      storage: selectedStorage
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, {
      quantity,
      size: selectedSize,
      color: selectedColor,
      storage: selectedStorage
    });
    closeProductModal();
    navigateTo('checkout');
  };

  const handleRentalBook = () => {
    closeProductModal();
    navigateTo('rentals', { productId: selectedProduct.id });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] text-slate-100 my-auto">
        {/* Close Button */}
        <button
          onClick={closeProductModal}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left Column: Gallery & Visual Showcase with 4 Views */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              <img
                src={activePhoto}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl transition duration-300"
                onError={(e) => handleImageError(e, activeView)}
              />
              {selectedProduct.discountPercent && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  SAVE {selectedProduct.discountPercent}%
                </div>
              )}
            </div>

            <div className={`grid ${imageViews.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-2`}>
              {imageViews.map((viewKey) => {
                const imgUrl = getProductImage(selectedProduct, viewKey);
                const isSelected = activePhoto === imgUrl;
                return (
                  <button
                    key={viewKey}
                    type="button"
                    onClick={() => {
                      setActivePhoto(imgUrl);
                      setActiveView(viewKey);
                    }}
                    className={`flex flex-col items-center bg-slate-950 p-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-500 shadow-md shadow-blue-950 ring-1 ring-blue-500'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={viewKey}
                      referrerPolicy="no-referrer"
                      className="w-full h-12 object-cover rounded-lg"
                      onError={(e) => handleImageError(e, viewKey)}
                    />
                    <span
                      className={`text-[9px] font-bold uppercase mt-1 tracking-wider ${
                        isSelected ? 'text-blue-400' : 'text-slate-400'
                      }`}
                    >
                      {viewKey}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick trust strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400 py-3 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>24-48h Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category, Rating & Wishlist */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-blue-400 uppercase tracking-wider">
                    {selectedProduct.brand}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 capitalize">{selectedProduct.category.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProduct.category === 'phones' && (
                    <button
                      onClick={() => toggleComparePhone(selectedProduct.id)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        compared
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{compared ? 'In Comparison' : 'Compare'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      wishlisted
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mt-2 leading-tight">
                {selectedProduct.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-mono-num font-semibold">
                  {selectedProduct.rating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500">
                  ({selectedProduct.reviewCount} customer reviews)
                </span>
              </div>

              {/* Price Block */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading font-black text-3xl text-white font-mono-num">
                      R {selectedProduct.price.toLocaleString()}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-slate-500 line-through font-mono-num">
                        R {selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">
                    In Stock 
                  </span>
                </div>

                {selectedProduct.rentalDetails && (
                  <button
                    onClick={handleRentalBook}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Rent from R{selectedProduct.rentalDetails.dailyRate}/day
                  </button>
                )}
              </div>

              {/* Selectors: Storage (for Phones) */}
              {selectedProduct.storageOptions && (
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Storage Capacity: <span className="text-blue-400">{selectedStorage}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          selectedStorage === storage
                            ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selectors: Sizes (for Sneakers & Football) */}
              {selectedProduct.sizes && (
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Size: <span className="text-blue-400">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selectors: Colors */}
              {selectedProduct.colors && (
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Colorway: <span className="text-blue-400">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          selectedColor === color
                            ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Actions */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center border border-slate-800 bg-slate-950 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono-num font-bold text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 hover:scale-101'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-900/30 hover:scale-101"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Description & Technical Specifications Tabs */}
            <div className="border-t border-slate-800/80 pt-6">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-3 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-1 transition-colors ${
                    activeTab === 'desc'
                      ? 'text-white border-b-2 border-blue-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Product Overview
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1 transition-colors ${
                    activeTab === 'specs'
                      ? 'text-white border-b-2 border-blue-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Technical Specifications
                </button>
                {selectedProduct.rentalDetails && (
                  <button
                    onClick={() => setActiveTab('rental')}
                    className={`pb-1 transition-colors ${
                      activeTab === 'rental'
                        ? 'text-emerald-400 border-b-2 border-emerald-500 font-bold'
                        : 'text-slate-400 hover:text-emerald-300'
                    }`}
                  >
                    Rental Package Details
                  </button>
                )}
              </div>

              <div className="mt-4 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto pr-2">
                {activeTab === 'desc' && <p>{selectedProduct.description}</p>}

                {activeTab === 'specs' && (
                  <div className="divide-y divide-slate-800">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="py-2 flex justify-between gap-4">
                        <span className="text-slate-400 font-medium">{key}</span>
                        <span className="text-slate-100 font-semibold text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'rental' && selectedProduct.rentalDetails && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/40">
                      <span>Daily Rental Rate:</span>
                      <strong className="text-emerald-400 font-mono-num text-sm">
                        R {selectedProduct.rentalDetails.dailyRate} / day
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Security Refundable Deposit:</span>
                      <strong className="text-white font-mono-num">
                        R {selectedProduct.rentalDetails.deposit}
                      </strong>
                    </div>
                    <div>
                      <strong className="block text-slate-200 mb-1">What's Included in Rental:</strong>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400">
                        {selectedProduct.rentalDetails.whatsIncluded.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={handleRentalBook}
                      className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Open Rental Booking Calendar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="border-t border-slate-800/80 pt-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                  You Might Also Like
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => {
                        useShop().openProductModal(rel);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-left transition-all group flex flex-col justify-between"
                    >
                      <img
                        src={getProductImage(rel, 'front')}
                        alt={rel.name}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-square object-cover rounded-lg mb-1"
                      />
                      <span className="text-[11px] font-bold text-slate-200 line-clamp-1 group-hover:text-blue-400">
                        {rel.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-num font-semibold">
                        R {rel.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
