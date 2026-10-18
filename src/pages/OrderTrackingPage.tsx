import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderStatus } from '../types';
import { CONFIG, supabase } from '../lib/supabase';
import {
  Search,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  Sparkles
} from 'lucide-react';

interface TrackedOrder {
  id: string;
  status: OrderStatus;
  trackingNumber: string | null;
  courierName: string | null;
  estimatedDelivery: string | null;
  customerName: string;
  deliveryAddress: string;
  total: number | null;
  items: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const trackingStatuses: OrderStatus[] = [
  'placed',
  'payment_confirmed',
  'processing',
  'dispatched',
  'out_for_delivery',
  'delivered'
];

const toTrackedOrder = (row: Record<string, unknown>): TrackedOrder | null => {
  const rawStatus = typeof row.status === 'string' ? row.status : '';
  const status = rawStatus === 'pending'
    ? 'placed'
    : trackingStatuses.find((value) => value === rawStatus);
  if (!status || typeof row.id !== 'string') return null;

  const details = Array.isArray(row.order_details) ? row.order_details : [];
  const items = details.flatMap((detail) => {
    if (!isRecord(detail)) return [];
    const productRecord = isRecord(detail.product) ? detail.product : null;
    const product = typeof detail.product === 'string'
      ? detail.product
      : typeof productRecord?.name === 'string'
        ? productRecord.name
        : typeof detail.name === 'string'
          ? detail.name
          : '';
    if (!product) return [];
    const quantity = typeof detail.quantity === 'number' && detail.quantity > 1
      ? `${detail.quantity} × `
      : '';
    return [`${quantity}${product}`];
  });

  const rawTotal = typeof row.total === 'number'
    ? row.total
    : typeof row.total === 'string'
      ? Number(row.total)
      : Number.NaN;

  return {
    id: row.id,
    status,
    trackingNumber: typeof row.tracking_number === 'string' ? row.tracking_number : null,
    courierName: typeof row.courier_name === 'string' ? row.courier_name : null,
    estimatedDelivery: typeof row.estimated_delivery === 'string' ? row.estimated_delivery : null,
    customerName: typeof row.customer_name === 'string' ? row.customer_name : 'Customer',
    deliveryAddress: typeof row.customer_address === 'string' ? row.customer_address : '',
    total: Number.isFinite(rawTotal) ? rawTotal : null,
    items
  };
};

export const OrderTrackingPage: React.FC = () => {
  const { authUser, setIsAuthModalOpen } = useShop();

  const [inputOrderNumber, setInputOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<TrackedOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedWaybill, setCopiedWaybill] = useState(false);
  const paymentReturned = new URLSearchParams(window.location.search).get('payfast') === 'returned';

  const searchOrder = async (reference: string) => {
    const clean = reference.trim().replace(/^#/, '');
    setInputOrderNumber(reference);
    setErrorMsg('');
    setSearchedOrder(null);
    setHasSearched(true);
    if (!clean) {
      setErrorMsg('Enter an order ID or courier tracking number.');
      return;
    }
    if (!authUser) {
      setErrorMsg('Sign in with the email address used for the order to securely view its details.');
      return;
    }

    setLoading(true);
    try {
      const ordersQuery = supabase
        .from('orders')
        .select('id, customer_name, customer_address, total, status, order_details, courier_name, tracking_number, estimated_delivery')
        .in('status', ['pending', 'placed', 'payment_confirmed', 'processing', 'dispatched', 'out_for_delivery', 'delivered']);
      const isOrderId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clean);
      const { data, error } = isOrderId
        ? await ordersQuery.eq('id', clean).maybeSingle()
        : await ordersQuery.eq('tracking_number', clean).maybeSingle();
      if (error) throw error;
      if (data) setSearchedOrder(toTrackedOrder(data as Record<string, unknown>));
    } catch (error) {
      console.error('Unable to look up order tracking details:', error);
      setErrorMsg('We could not look up this order right now. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get('order_id');
    if (paymentReturned && authUser && orderId) void searchOrder(orderId);
  }, [authUser]);

  const trackingSteps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'placed', label: 'Order Placed', desc: 'Received in Broerhood36 system' },
    { status: 'payment_confirmed', label: 'Payment Confirmed', desc: 'Payment independently verified' },
    { status: 'processing', label: 'Processing', desc: 'Packed & inspected at JHB Depot' },
    { status: 'dispatched', label: 'Dispatched', desc: 'Handed over to The Courier Guy' },
    { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'With local driver on vehicle' },
    { status: 'delivered', label: 'Delivered', desc: 'Signed for at doorstep' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    return trackingSteps.findIndex((s) => s.status === status);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchOrder(inputOrderNumber);
  };

  const currentStepIndex = searchedOrder ? Math.max(getStepIndex(searchedOrder.status), 0) : 0;

  const copyWaybill = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedWaybill(true);
    setTimeout(() => setCopiedWaybill(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
          Real-Time Courier Tracking
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
          ORDER TRACKING
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Sign in with the email used for your order, then enter its order ID or courier tracking number.
        </p>
        {paymentReturned && (
          <p role="status" className="text-xs text-amber-200 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3">
            PayFast has returned you to the store. Payment is shown as confirmed only after its server notification is verified.
          </p>
        )}

        {/* Search Input */}
        <form onSubmit={handleSearch} className="pt-2 flex items-center gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={inputOrderNumber}
              onChange={(e) => setInputOrderNumber(e.target.value)}
              placeholder="Order ID or tracking number"
              aria-label="Order ID or courier tracking number"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-xs sm:text-sm text-white uppercase focus:outline-none focus:border-blue-500 font-mono-num font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-blue-900/30"
          >
            {loading ? 'Searching...' : 'Track Parcel'}
          </button>
        </form>
        {errorMsg && (
          <p role="alert" className="text-xs text-rose-300 mt-3">
            {errorMsg}
            {!authUser && (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="ml-2 font-bold text-blue-300 underline"
              >
                Sign in
              </button>
            )}
          </p>
        )}
      </div>

      {/* Tracking Result View */}
      {hasSearched && searchedOrder ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10">
          {searchedOrder.status === 'pending' && (
            <p role="status" className="text-xs text-amber-200 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3">
              Awaiting PayFast payment verification. This order is not marked paid until PayFast's server notification is verified.
            </p>
          )}
          {/* Header metadata row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Order Reference:</span>
              <strong className="text-white font-mono-num text-lg font-black">
                #{searchedOrder.id}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block">Courier Partner:</span>
              <strong className="text-white block">{searchedOrder.courierName || 'Not assigned yet'}</strong>
              {searchedOrder.trackingNumber && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono-num text-blue-400">{searchedOrder.trackingNumber}</span>
                  <button
                    onClick={() => copyWaybill(searchedOrder.trackingNumber!)}
                    className="text-slate-400 hover:text-white"
                    title="Copy waybill"
                    aria-label="Copy waybill"
                  >
                    {copiedWaybill ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div>
              <span className="text-slate-400 block">Estimated Arrival:</span>
              <strong className="text-emerald-400 font-mono-num font-bold">
                {searchedOrder.estimatedDelivery || 'To be confirmed'}
              </strong>
            </div>
          </div>

          {/* 6-Step Visual Progress Tracker */}
          <div className="space-y-4">
            <h3 className="font-heading font-black text-lg text-white">
              Shipment Journey
            </h3>

            {/* Desktop / Tablet Horizontal Timeline */}
            <div className="relative hidden md:flex items-center justify-between">
              {/* Background Connecting Bar */}
              <div className="absolute top-5 left-6 right-6 h-1 bg-slate-800 z-0" />
              <div
                className="absolute top-5 left-6 h-1 bg-gradient-to-r from-blue-600 via-rose-600 to-emerald-500 z-0 transition-all duration-700"
                style={{
                  width: `${(currentStepIndex / (trackingSteps.length - 1)) * 92}%`
                }}
              />

              {trackingSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="relative z-10 flex flex-col items-center text-center w-28">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-rose-600 text-white ring-4 ring-rose-900/60 shadow-lg scale-110'
                          : isPassed
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {isPassed ? <Check className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                    </div>

                    <span
                      className={`mt-3 text-xs font-bold ${
                        isCurrent ? 'text-white' : isPassed ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>

                    <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="md:hidden space-y-4 relative border-l-2 border-slate-800 ml-4 pl-6 pt-2">
              {trackingSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="relative pb-4 last:pb-0">
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-rose-600 text-white ring-4 ring-rose-950'
                          : isPassed
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-950 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <h4
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-rose-400' : isPassed ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-400">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick WhatsApp Support & Payment Confirmation on both lines */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Order &amp; Payment Support</span>
              </span>
              <span className="text-[10px] text-slate-400">Available on both lines</span>
            </div>
            <p className="text-xs text-slate-300">
              Need updates on this order or want to confirm proof of payment? Chat with our team directly:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(
                  `*ORDER INQUIRY / PAYMENT PROOF - BROERHOOD36*\nOrder: #${searchedOrder.id}\nWaybill: ${searchedOrder.trackingNumber || 'Not assigned'}\nCustomer: ${searchedOrder.customerName}\nTotal: R ${searchedOrder.total === null ? 'Unavailable' : searchedOrder.total.toLocaleString()}\nStatus: ${searchedOrder.status}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Line 1 (+27 64 901 3150)</span>
              </a>

              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_2}?text=${encodeURIComponent(
                  `*ORDER INQUIRY / PAYMENT PROOF - BROERHOOD36*\nOrder: #${searchedOrder.id}\nWaybill: ${searchedOrder.trackingNumber || 'Not assigned'}\nCustomer: ${searchedOrder.customerName}\nTotal: R ${searchedOrder.total === null ? 'Unavailable' : searchedOrder.total.toLocaleString()}\nStatus: ${searchedOrder.status}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Line 2 (+27 69 978 1083)</span>
              </a>
            </div>
          </div>

          {/* Delivery Address & Customer summary */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Delivering To:</span>
              <strong className="text-white block mt-0.5">{searchedOrder.customerName}</strong>
              <p className="text-slate-400">{searchedOrder.deliveryAddress || 'Address not available'}</p>
            </div>
            <div>
              <span className="text-slate-400 block">Package Inclusions:</span>
              <ul className="text-slate-300 space-y-1 mt-0.5">
                {searchedOrder.items.length > 0
                  ? searchedOrder.items.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)
                  : <li>Order items are not available.</li>}
              </ul>
            </div>
          </div>
        </div>
      ) : hasSearched && !loading && !errorMsg ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-heading font-bold text-xl text-white">Order not found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't find a shippable order with that reference. Check the order ID or tracking number and make sure you are signed in with the email used for the order.
          </p>
        </div>
      ) : null}
    </div>
  );
};
