import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { getProductImage, getProductImageFallback } from '../lib/autoImages';
import { Heart, ShoppingBag, Star, Check, SlidersHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    openProductModal,
    toggleComparePhone,
    isCompared
  } = useShop();

  const [isAdded, setIsAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const compared = isCompared(product.id);

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    view: 'front' | 'top' | 'side' | 'back'
  ) => {
    const failedSource = event.currentTarget.currentSrc || event.currentTarget.src;
    if (event.currentTarget.dataset.failedSource === failedSource) {
      event.currentTarget.style.display = 'none';
      return;
    }

    const fallback = getProductImageFallback(product.name, product.category, view);
    if (fallback && failedSource !== fallback) {
      event.currentTarget.dataset.failedSource = failedSource;
      event.currentTarget.src = fallback;
      return;
    }
    event.currentTarget.style.display = 'none';
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, {
      quantity: 1,
      size: product.sizes?.[0],
      color: product.colors?.[0],
      storage: product.storageOptions?.[0]
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComparePhone(product.id);
  };

  return (
    <div
      onClick={() => openProductModal(product)}
      className="glass-card group relative flex flex-col bg-[#121212] rounded-md border border-[#27272A] overflow-hidden hover:border-[#22C55E]/50 transition-all duration-200 cursor-pointer"
    >
      {/* Top badges & Wishlist - GREEN NOT BLUE */}
      <div className="absolute top-2 inset-x-2 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1 pointer-events-auto">
          {product.discountPercent && (
            <span className="bg-[#22C55E] text-black font-black text-[10px] px-2 py-0.5 rounded-sm">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-white text-black font-bold text-[10px] px-2 py-0.5 rounded-sm">
              NEW
            </span>
          )}
          {product.rentalDetails && (
            <span className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 font-bold text-[9px] px-2 py-0.5 rounded-sm">
              RENTAL
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistClick}
          aria-label="Save to wishlist"
          className={`p-1.5 rounded-sm pointer-events-auto transition-all border ${
            wishlisted
             ? 'bg-[#22C55E] text-black border-[#22C55E]'
              : 'bg-black/80 text-zinc-400 hover:text-white border-[#27272A] hover:border-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product image */}
      <div className="relative aspect-square w-full bg-white overflow-hidden flex items-center justify-center p-3">
        <img
          src={getProductImage(product, 'front')}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="object-contain w-full h-full"
          onError={(e) => handleImageError(e, 'front')}
        />

        {product.category === 'phones' && (
          <button
            onClick={handleCompareClick}
            className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-1 rounded-sm border transition-all flex items-center gap-1 ${
              compared
               ? 'bg-[#22C55E] text-black border-[#22C55E]'
                : 'bg-black text-white border-[#27272A] hover:border-white'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{compared? 'Comparing' : 'Compare'}</span>
          </button>
        )}
      </div>

      {/* Content - BLACK + GREEN */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2 bg-[#121212]">
        <div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
            <span className="font-bold uppercase tracking-widest text-zinc-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-zinc-400">
              <Star className="w-3 h-3 fill-[#22C55E] text-[#22C55E]" />
              <span className="text-white font-bold">{product.rating.toFixed(1)}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-white text-[13px] leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-[#22C55E] transition-colors">
            {product.name}
          </h3>

          {product.category === 'football' && product.jerseyType && (
            <div className="mt-1 text-[11px] text-zinc-500">
              <span>{product.season}</span> · <span>{product.jerseyType}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-[#27272A] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-[15px] text-[#22C55E]">
                R {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-zinc-600 line-through">
                  R {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className={`px-3 py-1.5 rounded-sm text-[11px] font-black uppercase tracking-wide transition-all flex items-center gap-1 border ${
              isAdded
               ? 'bg-[#22C55E] text-black border-[#22C55E]'
                : 'bg-[#22C55E] hover:bg-[#16A34A] text-black border-[#22C55E]'
            }`}
          >
            {isAdded? (
              <>
                <Check className="w-3 h-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};