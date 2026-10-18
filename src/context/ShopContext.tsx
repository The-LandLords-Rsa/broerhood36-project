import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { Product, CartItem, Order, RentalBookingRequest } from '../types';
import { PRODUCTS } from '../data/products';

interface ShopContextType {
  activePage: string;
  navigateTo: (page: string, params?: { category?: string; productId?: string }) => void;
  cart: CartItem[];
  savedForLater: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      size?: string;
      color?: string;
      storage?: string;
      quantity?: number;
      isRental?: boolean;
      rentalDays?: number;
      rentalDate?: string;
    }
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  saveItemForLater: (cartItemId: string) => void;
  moveSavedToCart: (savedItemId: string) => void;
  removeSavedItem: (savedItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  promoCode: string;
  promoDiscountPercent: number;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  cartDiscount: number;
  cartTotal: number;
  cartCount: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  comparePhones: string[];
  toggleComparePhone: (productId: string) => void;
  clearCompare: () => void;
  isCompared: (productId: string) => boolean;

  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isAgeVerified: boolean;
  setIsAgeVerified: (verified: boolean) => void;
  isAgeModalOpen: boolean;
  setIsAgeModalOpen: (open: boolean) => void;

  orders: Order[];
  addOrder: (order: Order) => void;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;

  rentalBookings: RentalBookingRequest[];
  addRentalBooking: (booking: RentalBookingRequest) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;

  authUser: User | null;
  setAuthUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  isDownloadModalOpen: boolean;
  setIsDownloadModalOpen: (open: boolean) => void;
  triggerProjectDownload: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

import { supabase } from '../lib/supabase';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>(() => {
    const requestedPage = window.location.hash.slice(1);
    return ['admin', 'tracking', 'checkout'].includes(requestedPage) ? requestedPage : 'home';
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('broerhood_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['snk-01', 'ph-01', 'hub-01']);
  const [comparePhones, setComparePhones] = useState<string[]>(['ph-01', 'ph-02']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(false);

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  const triggerProjectDownload = async () => {
    try {
      const res = await fetch('/broerhood36-project.zip');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const blob = await res.blob();
      if (blob.size < 500000) {
        throw new Error(`Downloaded archive is incomplete (${(blob.size / 1024).toFixed(0)} KB). Please use the direct link.`);
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'broerhood36-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 2000);
    } catch (err: any) {
      console.warn('Direct Blob download failed, attempting window.open fallback:', err);
      // Fallback
      const a = document.createElement('a');
      a.href = '/broerhood36-project.zip';
      a.download = 'broerhood36-project.zip';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [rentalBookings, setRentalBookings] = useState<RentalBookingRequest[]>([]);

  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const persistAuthUser = (user: User | null) => {
      if (!isMounted) return;

      setAuthUser(user);
      try {
        if (user) {
          localStorage.setItem('broerhood36_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('broerhood36_user');
        }
      } catch (error) {
        console.error('Unable to persist the Supabase user profile:', error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      persistAuthUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session) {
        window.history.replaceState(null, '', '/');
      }
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Unable to restore the Supabase session:', error.message);
        return;
      }
      persistAuthUser(session?.user ?? null);
    }).catch((error: unknown) => {
      console.error('Unable to restore the Supabase session:', error);
    });

    // Restore routes used by payment-provider return and cancellation URLs.
    const handleHash = () => {
      const requestedPage = window.location.hash.slice(1);
      if (['admin', 'tracking', 'checkout'].includes(requestedPage)) {
        setActivePage(requestedPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('broerhood_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save note:', e);
    }
  }, [cart]);

  // Scroll to top on page switch
  const navigateTo = (page: string, params?: { category?: string; productId?: string }) => {
    if (page === 'vapes' && !isAgeVerified) {
      setIsAgeModalOpen(true);
      return;
    }

    if (params?.productId) {
      const found = PRODUCTS.find((p) => p.id === params.productId);
      if (found) setSelectedProduct(found);
    }

    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (
    product: Product,
    options?: {
      size?: string;
      color?: string;
      storage?: string;
      quantity?: number;
      isRental?: boolean;
      rentalDays?: number;
      rentalDate?: string;
    }
  ) => {
    const qty = options?.quantity || 1;
    const size = options?.size || product.sizes?.[0];
    const color = options?.color || product.colors?.[0];
    const storage = options?.storage || product.storageOptions?.[0];

    setCart((prev) => {
      // Find existing matching item
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color &&
          item.selectedStorage === storage &&
          item.isRental === options?.isRental
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        product,
        quantity: qty,
        selectedSize: size,
        selectedColor: color,
        selectedStorage: storage,
        isRental: options?.isRental,
        rentalDays: options?.rentalDays,
        rentalDate: options?.rentalDate
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const saveItemForLater = (cartItemId: string) => {
    const itemToSave = cart.find((i) => i.id === cartItemId);
    if (!itemToSave) return;
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    setSavedForLater((prev) => [...prev, itemToSave]);
  };

  const moveSavedToCart = (savedItemId: string) => {
    const itemToMove = savedForLater.find((i) => i.id === savedItemId);
    if (!itemToMove) return;
    setSavedForLater((prev) => prev.filter((i) => i.id !== savedItemId));
    setCart((prev) => [...prev, itemToMove]);
  };

  const removeSavedItem = (savedItemId: string) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== savedItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Pricing calculations (ZAR)
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.isRental && item.product.rentalDetails
      ? item.product.rentalDetails.dailyRate * (item.rentalDays || 1)
      : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  // Free delivery threshold R 1500 in South Africa
  const deliveryFee = cartSubtotal > 1500 || cartSubtotal === 0 ? 0 : 120;
  const cartDiscount = Math.round((cartSubtotal * promoDiscountPercent) / 100);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BROERHOOD10' || clean === 'MZANSI10') {
      setPromoCode(clean);
      setPromoDiscountPercent(10);
      return true;
    }
    if (clean === 'BH36VIP' || clean === 'HOOD15') {
      setPromoCode(clean);
      setPromoDiscountPercent(15);
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscountPercent(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const toggleComparePhone = (productId: string) => {
    setComparePhones((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        // limit to 3 phones
        return [prev[1], prev[2], productId];
      }
      return [...prev, productId];
    });
  };

  const clearCompare = () => setComparePhones([]);
  const isCompared = (productId: string) => comparePhones.includes(productId);

  const openProductModal = (product: Product) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCurrentOrder(order);
  };

  const addRentalBooking = (booking: RentalBookingRequest) => {
    setRentalBookings((prev) => [booking, ...prev]);
  };

  return (
    <ShopContext.Provider
      value={{
        activePage,
        navigateTo,
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveItemForLater,
        moveSavedToCart,
        removeSavedItem,
        clearCart,
        cartSubtotal,
        deliveryFee,
        promoCode,
        promoDiscountPercent,
        applyPromoCode,
        removePromoCode,
        cartDiscount,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        comparePhones,
        toggleComparePhone,
        clearCompare,
        isCompared,
        selectedProduct,
        openProductModal,
        closeProductModal,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        isAgeVerified,
        setIsAgeVerified,
        isAgeModalOpen,
        setIsAgeModalOpen,
        orders,
        addOrder,
        currentOrder,
        setCurrentOrder,
        rentalBookings,
        addRentalBooking,
        isCompareModalOpen,
        setIsCompareModalOpen,
        authUser,
        setAuthUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        triggerProjectDownload
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
