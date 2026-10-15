import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { getProductImage } from '../lib/autoImages';
import {
  ShoppingBag,
  Trash2,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Tag,
  Check
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    savedForLater,
    removeFromCart,
    updateQuantity,
    saveItemForLater,
    moveSavedToCart,
    removeSavedItem,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartDiscount,
    cartTotal,
    promoCode,
    promoDiscountPercent,
    applyPromoCode,
    removePromoCode,
    navigateTo
  } = useShop();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const freeDeliveryThreshold = 1500;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const success = applyPromoCode(inputCode);
    if (success) {
      setPromoMessage({ text: 'Promo code applied! 10% discount deducted.' });
      setInputCode('');
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try "BROERHOOD10"', error: true });
    }
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-heading font-black text-3xl text-white">YOUR SHOPPING BAG IS EMPTY</h2>
        <p className="text-slate-400 text-xs max-w-sm mx-auto">
          Explore our streetwear kicks, flagship smartphones, football jerseys, and German hubblies.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-gradient-to-r from-blue-600 to-rose-600 text-white shadow-xl shadow-blue-900/30 hover:scale-102 transition-all"
        >
          EXPLORE CATALOG
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
          YOUR SHOPPING BAG ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        )}
      </div>

      {/* Free Delivery Tracker Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            {amountToFreeDelivery > 0 ? (
              <span className="text-slate-300">
                Add <strong className="text-white font-mono-num font-bold">R {amountToFreeDelivery.toLocaleString()}</strong> more to unlock <strong className="text-rose-400 font-bold">FREE DELIVERY</strong>
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Congratulations! You unlocked Free Nationwide Courier Delivery!
              </span>
            )}
          </div>
          <span className="text-slate-400 font-mono-num font-bold text-[11px]">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-rose-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-slate-800 border border-slate-800 bg-slate-900/60 rounded-3xl p-4 sm:p-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getProductImage(item.product, 'front')}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                      {item.product.brand}
                    </span>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                      {item.product.name}
                    </h3>

                    {/* Selected Options */}
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      {item.selectedSize && (
                        <span>Size: <strong className="text-slate-200">{item.selectedSize}</strong></span>
                      )}
                      {item.selectedStorage && (
                        <span>Storage: <strong className="text-slate-200">{item.selectedStorage}</strong></span>
                      )}
                      {item.selectedColor && (
                        <span>Color: <strong className="text-slate-200">{item.selectedColor}</strong></span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => saveItemForLater(item.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        <Bookmark className="w-3 h-3" /> Save for later
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                  <span className="font-heading font-black text-base sm:text-lg text-white font-mono-num">
                    R {(item.product.price * item.quantity).toLocaleString()}
                  </span>

                  {/* Qty Stepper */}
                  <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-mono-num font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Saved For Later Section */}
          {savedForLater.length > 0 && (
            <div className="pt-6">
              <h3 className="font-heading font-bold text-lg text-white mb-4">
                Saved For Later ({savedForLater.length})
              </h3>
              <div className="divide-y divide-slate-800 border border-slate-800 bg-slate-900/40 rounded-3xl p-4 sm:p-6">
                {savedForLater.map((sItem) => (
                  <div
                    key={sItem.id}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getProductImage(sItem.product, 'front')}
                        alt={sItem.product.name}
                        className="w-14 h-14 object-cover rounded-lg bg-slate-950 p-1"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{sItem.product.name}</h4>
                        <span className="text-[11px] font-mono-num text-slate-400">
                          R {sItem.product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveSavedToCart(sItem.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        Move to Bag
                      </button>
                      <button
                        onClick={() => removeSavedItem(sItem.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-heading font-black text-xl text-white">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Discount code (e.g. BROERHOOD10)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  Apply
                </button>
              </div>

              {promoMessage && (
                <div
                  className={`text-[11px] ${
                    promoMessage.error ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {promoMessage.text}
                </div>
              )}

              {promoCode && (
                <div className="flex items-center justify-between bg-blue-950/40 p-2 rounded-lg border border-blue-500/30 text-xs text-blue-300">
                  <span>Code Applied: <strong>{promoCode}</strong> (-{promoDiscountPercent}%)</span>
                  <button onClick={removePromoCode} className="text-slate-400 hover:text-white font-bold">
                    ✕
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs divide-y divide-slate-800 pt-2">
              <div className="flex justify-between text-slate-400 pb-2">
                <span>Subtotal</span>
                <span className="font-mono-num font-bold text-white">
                  R {cartSubtotal.toLocaleString()}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-rose-400 pt-2">
                  <span>Discount ({promoDiscountPercent}%)</span>
                  <span className="font-mono-num font-bold">
                    - R {cartDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 pt-2">
                <span>Nationwide Courier Delivery</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-400 font-bold uppercase">FREE</span>
                ) : (
                  <span className="font-mono-num font-bold text-white">R {deliveryFee}</span>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-4 text-sm font-bold">
                <span className="text-white text-base">Estimated Total</span>
                <span className="font-heading font-black text-2xl text-white font-mono-num">
                  R {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-4 px-6 rounded-xl font-heading font-black text-sm bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white shadow-xl shadow-blue-950 transition-all flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Pay &amp; Notify Both WhatsApp Lines</span>
              </button>

              <button
                onClick={() => navigateTo('shop')}
                className="w-full py-3 px-6 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-950 border border-slate-800 transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Encrypted 256-Bit SSL Checkout Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
