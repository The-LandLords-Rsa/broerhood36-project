import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../data/products';
import { getProductImage } from '../lib/autoImages';
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Trash2,
  Edit2,
  Check,
  Lock,
  LogOut,
  LogIn
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    orders,
    wishlist,
    toggleWishlist,
    addToCart,
    navigateTo,
    setCurrentOrder,
    authUser,
    setAuthUser,
    setIsAuthModalOpen
  } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('orders');

  // Profile Form state
  const [profileName, setProfileName] = useState(authUser?.user_metadata?.full_name || 'Broerhood36 Member');
  const [profileEmail, setProfileEmail] = useState(authUser?.email || '');
  const [profilePhone, setProfilePhone] = useState(authUser?.user_metadata?.phone || '');
  const [isSavedProfile, setIsSavedProfile] = useState(false);

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedProfile(true);
    setTimeout(() => setIsSavedProfile(false), 2000);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      window.alert(`Unable to sign out: ${error.message}`);
      return;
    }
    setAuthUser(null);
  };

  const handleTrackSpecificOrder = (order: any) => {
    setCurrentOrder(order);
    navigateTo('tracking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-rose-600 flex items-center justify-center font-heading font-black text-2xl text-white shadow-xl shadow-blue-900/30">
            SN
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              {profileName}
            </h1>
            <span className="text-xs text-slate-400 block">{profileEmail} · South Africa</span>
            <span className="inline-block mt-1 text-[10px] font-bold text-rose-400 bg-rose-950/70 border border-rose-500/30 px-2 py-0.5 rounded">
              BROERHOOD36 VIP MEMBER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {authUser ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('tracking')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Orders &amp; History</span>
              </div>
              <span className="text-[10px] font-mono-num bg-slate-950 px-1.5 py-0.5 rounded">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'wishlist'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Saved Wishlist</span>
              </div>
              <span className="text-[10px] font-mono-num bg-slate-950 px-1.5 py-0.5 rounded">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'addresses'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>

            <button
              onClick={() => navigateTo('admin')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 text-blue-400 hover:text-white hover:bg-slate-800 border-t border-slate-800/80 mt-2 pt-3"
            >
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Admin Management</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-heading font-black text-2xl text-white">Previous Orders</h2>
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 text-xs gap-2">
                      <div>
                        <span className="text-slate-400">Order ID:</span>{' '}
                        <strong className="text-white font-mono-num font-bold">#{ord.id}</strong>
                        <span className="mx-2 text-slate-600">·</span>
                        <span className="text-slate-400">{ord.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-500/30">
                          {ord.status.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleTrackSpecificOrder(ord)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold"
                        >
                          Track Waybill
                        </button>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="space-y-2">
                      {ord.items.map((it) => (
                        <div key={it.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={getProductImage(it.product, 'front')}
                              alt={it.product.name}
                              className="w-12 h-12 object-cover rounded-lg bg-slate-950 p-1"
                            />
                            <div>
                              <strong className="text-white block">{it.product.name}</strong>
                              <span className="text-slate-400">
                                Qty: {it.quantity} {it.selectedSize ? `· Size: ${it.selectedSize}` : ''}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono-num font-bold text-white">
                            R {(it.product.price * it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Delivering to {ord.address.city}, {ord.address.province}</span>
                      <div>
                        <span className="text-slate-400 mr-2">Total Paid:</span>
                        <strong className="text-white font-mono-num text-sm font-black">
                          R {ord.total.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="font-heading font-black text-2xl text-white">
                Saved Wishlist ({wishlistedProducts.length})
              </h2>

              {wishlistedProducts.length === 0 ? (
                <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                  <p className="text-slate-400 text-sm">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => navigateTo('shop')}
                    className="mt-3 px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-4/3 w-full bg-slate-950 rounded-xl overflow-hidden mb-3 p-2">
                          <img src={getProductImage(p, 'front')} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase">{p.brand}</span>
                        <h4 className="font-heading font-bold text-sm text-white">{p.name}</h4>
                        <div className="font-mono-num font-black text-sm text-white mt-1">
                          R {p.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => addToCart(p)}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-950"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PERSONAL DETAILS TAB */}
          {activeTab === 'profile' && (
            <div className="max-w-xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="font-heading font-black text-2xl text-white">Personal Details</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {isSavedProfile ? <Check className="w-4 h-4" /> : <Edit2 className="w-3.5 h-3.5" />}
                  <span>{isSavedProfile ? 'Saved Successfully' : 'Update Profile'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <h2 className="font-heading font-black text-2xl text-white">Saved Addresses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-white font-bold">Primary Residential</strong>
                    <span className="text-[10px] text-blue-400 font-bold bg-blue-950 px-2 py-0.5 rounded">
                      Default
                    </span>
                  </div>
                  <p className="text-slate-300">142 Jan Smuts Avenue, Rosebank</p>
                  <p className="text-slate-400">Johannesburg, Gauteng, 2196</p>
                  <p className="text-slate-500">Gate security code: 4091</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 border-dashed flex flex-col items-center justify-center text-center p-6 text-xs text-slate-400 hover:border-slate-700 cursor-pointer">
                  <MapPin className="w-6 h-6 text-slate-500 mb-2" />
                  <span className="font-bold text-slate-200">+ Add New Delivery Address</span>
                  <span className="text-[11px] text-slate-500 mt-1">Cape Town, Durban or Pretoria location</span>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs">
              <h2 className="font-heading font-black text-2xl text-white">Account Settings</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span>WhatsApp SMS Order Updates</span>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span>Currency Display</span>
                  <span className="font-mono-num font-bold text-white">ZAR (Rands)</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span>Age Verification (18+)</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
