import React, { useState, useEffect } from 'react';
import { supabase, CONFIG } from '../lib/supabase';
import { useShop } from '../context/ShopContext';
import { CATEGORY_HERO_IMAGES, PRODUCTS } from '../data/products';
import { Product } from '../types';
import { getProductImage, getProductImageCategory } from '../lib/autoImages';
import { isOwnerEmail } from '../lib/ownerAccess';
import ownerSecuritySql from '../../supabase/owner-security.sql?raw';
import {
  Package,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Trash2,
  ExternalLink,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Code2,
  Copy,
  Check,
  Calendar,
  Layers,
  Database,
  Download
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { authUser, orders, rentalBookings, navigateTo, setIsDownloadModalOpen } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'rentals' | 'products' | 'supabase'>('orders');
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncingPaymentCatalog, setSyncingPaymentCatalog] = useState(false);
  const [deliveryDrafts, setDeliveryDrafts] = useState<Record<string, {
    courierName: string;
    trackingNumber: string;
    estimatedDelivery: string;
  }>>({});

  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('sneakers');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('10');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductIsRental, setNewProductIsRental] = useState(false);
  const [newProductRentalPrice, setNewProductRentalPrice] = useState('');
  const [newProductSizes, setNewProductSizes] = useState('UK 7, UK 8, UK 9, UK 10, UK 11');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDbOrders(data || []);
      setLoadError('');
    } catch (error) {
      console.error('Unable to load orders from Supabase:', error);
      setDbOrders([]);
      setLoadError('Orders could not be loaded. Check the database connection and owner access policies, then refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [orders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('No order was updated. Check that this account has owner access.');
      showNotification(`Order #${orderId} marked as ${newStatus}`);
      setDbOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (error) {
      console.error('Unable to update order status:', error);
      showNotification('Order status was not saved. Check your connection and owner permissions.');
    }
  };

  const handleDeliveryUpdate = async (orderId: string, order: Record<string, any>) => {
    const draft = deliveryDrafts[orderId] || {
      courierName: order.courier_name || '',
      trackingNumber: order.tracking_number || '',
      estimatedDelivery: order.estimated_delivery || ''
    };
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          courier_name: draft.courierName.trim() || null,
          tracking_number: draft.trackingNumber.trim() || null,
          estimated_delivery: draft.estimatedDelivery.trim() || null
        })
        .eq('id', orderId)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('No order was updated. Check that this account has owner access.');
      setDbOrders((previous) => previous.map((item) => item.id === orderId
        ? {
            ...item,
            courier_name: draft.courierName.trim(),
            tracking_number: draft.trackingNumber.trim(),
            estimated_delivery: draft.estimatedDelivery.trim()
          }
        : item));
      setDeliveryDrafts((previous) => {
        const next = { ...previous };
        delete next[orderId];
        return next;
      });
      showNotification(`Delivery details saved for order #${orderId}`);
    } catch (error) {
      console.error('Unable to update delivery details:', error);
      showNotification('Delivery details were not saved. Check your connection and owner permissions.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('No order was deleted. Check that this account has owner access.');
      showNotification('Order removed from Supabase');
      setDbOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Unable to delete order:', error);
      showNotification('Order was not deleted. Check your connection and owner permissions.');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = Number(newProductPrice);
    const parsedStock = Number(newProductStock);
    const parsedRentalPrice = Number(newProductRentalPrice);
    if (!newProductName.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      showNotification('Enter a product name and a valid price greater than zero.');
      return;
    }
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      showNotification('Stock quantity must be a whole number of zero or more.');
      return;
    }
    if (newProductIsRental && (!Number.isFinite(parsedRentalPrice) || parsedRentalPrice <= 0)) {
      showNotification('Enter a valid daily rental price greater than zero.');
      return;
    }

    setSubmittingProduct(true);
    const sizesArray = newProductSizes.split(',').map((s) => s.trim()).filter(Boolean);
    const productCategory = newProductCategory as Product['category'];
    const fallbackImage = getProductImageCategory(productCategory)
      ? undefined
      : CATEGORY_HERO_IMAGES[newProductCategory as keyof typeof CATEGORY_HERO_IMAGES];

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      brand: 'BROERHOOD36',
      category: productCategory,
      price: parsedPrice,
      rating: 5.0,
      reviewCount: 1,
      ...(fallbackImage ? { image: fallbackImage, additionalImages: [fallbackImage] } : {}),
      description: newProductDesc || 'Exclusive premium addition to the BROERHOOD36 vault.',
      inStock: true,
      sizes: sizesArray,
      isRental: newProductIsRental,
      specifications: {
        Authenticity: '100% Guaranteed Genuine',
        Condition: 'Brand New In Box'
      },
      rentalDetails: newProductIsRental
        ? {
            dailyRate: parsedRentalPrice || parsedPrice,
            deposit: parsedPrice * 2,
            durationOptions: ['24 Hours', '48 Hours', 'Weekend Hire'],
            whatsIncluded: ['German Hubbly Pipe', '1000W Stove', 'Coconut Coals', 'Silicone Hose']
          }
        : undefined
    };

    // Try saving to Supabase
    try {
      const { error } = await supabase.from('products').insert({
        name: newProductName.trim(),
        category: newProductCategory,
        price: parsedPrice,
        stock: parsedStock,
        description: newProductDesc,
        images: fallbackImage ? [fallbackImage] : [],
        is_rental: newProductIsRental,
        rental_price_per_day: newProductIsRental ? parsedRentalPrice : null,
        sizes: sizesArray
      });
      if (error) throw error;
      setCatalogProducts((prev) => [newProd, ...prev]);
      showNotification(`"${newProductName.trim()}" saved to the Supabase products table.`);
    } catch (error) {
      console.error('Unable to save product to Supabase:', error);
      showNotification('Product was not saved. Check the database connection and owner permissions.');
      setSubmittingProduct(false);
      return;
    }

    // Reset Form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductDesc('');
    setNewProductIsRental(false);
    setNewProductRentalPrice('');
    setSubmittingProduct(false);
  };

  const sqlScript = ownerSecuritySql;

  const copySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const syncPaymentCatalog = async () => {
    setSyncingPaymentCatalog(true);
    try {
      const { data, error } = await supabase.functions.invoke<{ synced: number }>(
        'sync-storefront-catalog',
        {
          body: {
            products: PRODUCTS.map((product) => ({
              sku: product.id,
              name: product.name,
              category: product.category,
              price: product.price,
              is_available: product.inStock
            }))
          }
        }
      );
      if (error) throw error;
      if (!data || typeof data.synced !== 'number') {
        throw new Error('The catalog sync returned an invalid response.');
      }
      showNotification(`Payment catalog synced: ${data.synced} products.`);
    } catch (error) {
      console.error('Unable to sync the trusted payment catalog:', error);
      showNotification(error instanceof Error
        ? `Payment catalog sync failed: ${error.message}`
        : 'Payment catalog sync failed. Check the database and Edge Function deployment.');
    } finally {
      setSyncingPaymentCatalog(false);
    }
  };

  const totalRevenue = dbOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  if (!isOwnerEmail(authUser?.email)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-black text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 text-sm">Sign in with an approved owner account to manage the store.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 animate-fadeIn">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
            MANAGEMENT CONSOLE
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            BROERHOOD<span className="text-rose-500">36</span> ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time orders, German Hubbly rentals, product catalog, Supabase &amp; WhatsApp routing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 cursor-pointer"
            title="Download complete project ZIP file to edit and run in VSCode"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP (VSCode · 4.8 MB)</span>
          </button>

          <button
            onClick={loadOrders}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => {
              window.location.hash = '';
              navigateTo('home');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-900/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue (ZAR)</span>
          <div className="font-heading font-black text-2xl text-white font-mono-num">
            R {totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            {dbOrders.length} processed sales
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Orders Queue</span>
          <div className="font-heading font-black text-2xl text-blue-400 font-mono-num">
            {dbOrders.length}
          </div>
          <span className="text-[10px] text-slate-400 block">
            Supabase + COD orders
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Hubbly Rentals</span>
          <div className="font-heading font-black text-2xl text-rose-400 font-mono-num">
            {rentalBookings.length}
          </div>
          <span className="text-[10px] text-slate-400 block">
            Active event bookings
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Support Channels</span>
          <div className="space-y-0.5 mt-1">
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Line 1: +{CONFIG.WHATSAPP_1}</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Line 2: +{CONFIG.WHATSAPP_2}</span>
            </div>
            <div className="text-[10px] text-blue-400 font-mono truncate">
              {CONFIG.STORE_EMAIL}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Customer Orders ({dbOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rentals')}
          className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rentals'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Hubbly Rentals ({rentalBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Product Catalog &amp; Add New</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'supabase'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase &amp; PayFast Setup</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Live Customer Orders ({dbOrders.length})
              </h3>
              <p className="text-xs text-slate-400">
                Click customer's WhatsApp link to initiate immediate dispatch chat.
              </p>
            </div>
            <span className="text-[11px] text-blue-400 bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full font-semibold">
              PayFast sandbox · setup required
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[1120px]">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">WhatsApp Direct</th>
                  <th className="p-4">Items Summary</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Delivery &amp; Tracking</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {dbOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-500">
                      {loading ? 'Loading orders...' : loadError || 'No orders recorded yet.'}
                    </td>
                  </tr>
                ) : (
                  dbOrders.map((ord) => {
                    const shortId = (ord.id || '').toString().slice(0, 12);
                    const custName = ord.customer_name || ord.customer?.fullName || 'Customer';
                    const custPhone = ord.customer_whatsapp || ord.customer?.phone || '';
                    const cleanPhone = custPhone.replace(/\+/g, '').replace(/\s/g, '');

                    let itemsDesc = '';
                    if (Array.isArray(ord.order_details)) {
                      itemsDesc = ord.order_details
                        .map((i: any) => `${i.quantity || 1}x ${i.name || i.product?.name}`)
                        .join(', ');
                    } else if (Array.isArray(ord.items)) {
                      itemsDesc = ord.items
                        .map((i: any) => `${i.quantity}x ${i.product.name}`)
                        .join(', ');
                    } else {
                      itemsDesc = 'BROERHOOD36 Gear';
                    }
                    const delivery = deliveryDrafts[ord.id] || {
                      courierName: ord.courier_name || '',
                      trackingNumber: ord.tracking_number || '',
                      estimatedDelivery: ord.estimated_delivery || ''
                    };

                    return (
                      <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono font-bold text-white">#{shortId}</td>
                        <td className="p-4 text-slate-400">{ord.date || 'Today'}</td>
                        <td className="p-4 font-semibold text-white">{custName}</td>
                        <td className="p-4">
                          {cleanPhone ? (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                                custName
                              )}%2C%20this%20is%20BROERHOOD36%20regarding%20your%20order%20%23${shortId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>+{cleanPhone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-300" title={itemsDesc}>
                          {itemsDesc}
                        </td>
                        <td className="p-4 font-mono-num font-bold text-white">
                          R {Number(ord.total || 0).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <select
                            value={ord.status || 'pending'}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-white font-bold focus:outline-none focus:border-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="payment_confirmed">Payment Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="whatsapp_order">WhatsApp Order</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1.5">
                            <input
                              aria-label={`Courier for order ${shortId}`}
                              value={delivery.courierName}
                              onChange={(event) => setDeliveryDrafts((previous) => ({
                                ...previous,
                                [ord.id]: { ...delivery, courierName: event.target.value }
                              }))}
                              placeholder="Courier"
                              className="w-36 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                            />
                            <input
                              aria-label={`Tracking number for order ${shortId}`}
                              value={delivery.trackingNumber}
                              onChange={(event) => setDeliveryDrafts((previous) => ({
                                ...previous,
                                [ord.id]: { ...delivery, trackingNumber: event.target.value }
                              }))}
                              placeholder="Tracking number"
                              className="w-36 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                            />
                            <input
                              aria-label={`Estimated delivery for order ${shortId}`}
                              value={delivery.estimatedDelivery}
                              onChange={(event) => setDeliveryDrafts((previous) => ({
                                ...previous,
                                [ord.id]: { ...delivery, estimatedDelivery: event.target.value }
                              }))}
                              placeholder="ETA"
                              className="w-36 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                            />
                            <button
                              onClick={() => handleDeliveryUpdate(ord.id, ord)}
                              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300"
                            >
                              Save delivery
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GERMAN HUBBLY RENTALS */}
      {activeTab === 'rentals' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                German Hubbly Hire Reservations ({rentalBookings.length})
              </h3>
              <p className="text-xs text-slate-400">
                Complete shisha set rentals with 1000W electric stove, coconut coals, and premium flavours.
              </p>
            </div>
            <button
              onClick={() => navigateTo('rentals')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Hire Booking</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Booking Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">WhatsApp Direct</th>
                  <th className="p-4">Selected Pipe</th>
                  <th className="p-4">Event Date</th>
                  <th className="p-4">Duration &amp; Qty</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Deposit + Fee</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {rentalBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-500">
                      No Hubbly rental bookings submitted yet.
                    </td>
                  </tr>
                ) : (
                  rentalBookings.map((r) => {
                    const cleanPhone = r.phone.replace(/\+/g, '').replace(/\s/g, '');
                    return (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono font-bold text-rose-400">#{r.id}</td>
                        <td className="p-4 font-semibold text-white">{r.customerName}</td>
                        <td className="p-4">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                              r.customerName
                            )}%2C%20confirming%20your%20BROERHOOD36%20German%20Hubbly%20Rental%20%23${r.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>+{cleanPhone}</span>
                          </a>
                        </td>
                        <td className="p-4 font-medium text-white">{r.product.name}</td>
                        <td className="p-4 text-slate-300">{r.rentalDate}</td>
                        <td className="p-4 text-slate-300">
                          {r.durationDays} Day(s) ({r.quantity}x unit)
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-400" title={r.eventLocation}>
                          {r.eventLocation}
                        </td>
                        <td className="p-4 font-mono-num font-bold text-white">
                          R {r.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            {r.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS CATALOG & ADD NEW */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          {/* Add Product Form */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-heading font-black text-xl text-white">
                  Add New Product to Store &amp; Supabase
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saves a product record to Supabase. The current storefront catalog is still managed in the source data.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-400 text-xs font-bold">
                Direct Sync
              </span>
            </div>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Air Jordan 4 Retro 'Military Blue'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Category *</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="sneakers">Sneakers &amp; Shoes</option>
                  <option value="phones">Smartphones (iPhone/Samsung/Honor)</option>
                  <option value="accessories">Phone Accessories</option>
                  <option value="football">Football Match Shirts</option>
                  <option value="hubblies">German Hubblies (Shisha)</option>
                  <option value="shisha-accessories">Shisha Accessories &amp; Coals</option>
                  <option value="vapes">Vapes (18+)</option>
                  <option value="rentals">Hubbly Rentals</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Price (ZAR / R) *</label>
                <input
                  type="number"
                  required
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="e.g. 3499"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  placeholder="10"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Available Sizes (Comma-separated)</label>
                <input
                  type="text"
                  value={newProductSizes}
                  onChange={(e) => setNewProductSizes(e.target.value)}
                  placeholder="UK 7, UK 8, UK 9, UK 10, UK 11"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-slate-300 font-bold mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Write a high-end description of the item, materials, authenticity guarantee..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={newProductIsRental}
                    onChange={(e) => setNewProductIsRental(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
                  />
                  <span>Available for Daily Rental Hire?</span>
                </label>

                {newProductIsRental && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Daily Rental Fee (R):</span>
                    <input
                      type="number"
                      value={newProductRentalPrice}
                      onChange={(e) => setNewProductRentalPrice(e.target.value)}
                      placeholder="e.g. 450"
                      className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 transition flex items-center gap-2 ml-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>{submittingProduct ? 'Saving...' : 'Add Product to Vault'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Catalog Summary */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-heading font-black text-xl text-white">
              Storefront Source Catalog ({catalogProducts.length} Items)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {catalogProducts.slice(0, 8).map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <img src={getProductImage(p, 'front')} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-slate-900 shrink-0" />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-white truncate">{p.name}</h5>
                    <span className="text-[10px] text-blue-400 uppercase font-semibold block">{p.category}</span>
                    <span className="text-xs font-mono font-bold text-rose-400">R {p.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUPABASE & PAYFAST SETUP GUIDE */}
      {activeTab === 'supabase' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-heading font-black text-xl text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Supabase &amp; PayFast Configuration</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                PayFast credentials stay in Supabase Edge Function Secrets; storefront prices are synced to a server-only catalog.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={syncPaymentCatalog}
                disabled={syncingPaymentCatalog}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition"
              >
                <RefreshCw className={`w-4 h-4 ${syncingPaymentCatalog ? 'animate-spin' : ''}`} />
                <span>{syncingPaymentCatalog ? 'Syncing prices...' : 'Sync payment catalog'}</span>
              </button>
              <button
                onClick={copySql}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition"
              >
                {copiedSql ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'SQL Script Copied!' : 'Copy Supabase SQL'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">Supabase Project URL:</span>
              <p className="font-mono text-emerald-400 break-all">{CONFIG.SUPABASE_URL}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">Payment mode:</span>
              <p className="font-mono text-amber-300">PayFast sandbox (server-side secrets)</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">Store WhatsApp Line:</span>
              <p className="font-mono text-emerald-400">+{CONFIG.OWNER_WHATSAPP}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">Store Brand &amp; Currency:</span>
              <p className="font-mono text-white font-bold">{CONFIG.STORE_NAME} ({CONFIG.CURRENCY})</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">
                Supabase SQL Setup Code (Run Once in supabase.com &gt; SQL Editor):
              </span>
              <span className="text-[10px] text-slate-500 font-mono">products, orders, profiles tables + storage</span>
            </div>
            <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-72 leading-relaxed">
              {sqlScript}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
