import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import { CONFIG } from '../lib/supabase';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders, currentOrder } = useShop();

  const [inputOrderNumber, setInputOrderNumber] = useState(
    currentOrder ? currentOrder.id : 'BH36-84920'
  );
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    currentOrder || orders[0] || null
  );
  const [hasSearched, setHasSearched] = useState(true);
  const [copiedWaybill, setCopiedWaybill] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputOrderNumber.trim().replace('#', '');
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean.toLowerCase() ||
        o.trackingNumber.toLowerCase() === clean.toLowerCase()
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const currentStepIndex = searchedOrder ? getStepIndex(searchedOrder.status) : 4;

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
          Enter your Broerhood36 order number (e.g. <strong className="text-white">BH36-84920</strong>) or waybill tracking number to follow your parcel from our hub to your door.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="pt-2 flex items-center gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={inputOrderNumber}
              onChange={(e) => setInputOrderNumber(e.target.value)}
              placeholder="Enter order ID e.g. BH36-84920"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-xs sm:text-sm text-white uppercase focus:outline-none focus:border-blue-500 font-mono-num font-semibold"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-blue-900/30"
          >
            Track Parcel
          </button>
        </form>
      </div>

      {/* Tracking Result View */}
      {hasSearched && searchedOrder ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10">
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
              <strong className="text-white block">{searchedOrder.courierName}</strong>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono-num text-blue-400">{searchedOrder.trackingNumber}</span>
                <button
                  onClick={() => copyWaybill(searchedOrder.trackingNumber)}
                  className="text-slate-400 hover:text-white"
                  title="Copy waybill"
                >
                  {copiedWaybill ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block">Estimated Arrival:</span>
              <strong className="text-emerald-400 font-mono-num font-bold">
                {searchedOrder.estimatedDelivery}
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

          {/* Live Checkpoint Updates */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Recent Courier Scans:
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between text-slate-300">
                <span className="font-medium">Parcel loaded onto driver route vehicle (Johannesburg North)</span>
                <span className="text-slate-500 font-mono-num">Today, 08:42</span>
              </div>
              <div className="flex items-start justify-between text-slate-400">
                <span>Sorted at The Courier Guy Linbro Park Hub</span>
                <span className="text-slate-500 font-mono-num">Today, 05:15</span>
              </div>
              <div className="flex items-start justify-between text-slate-500">
                <span>Dispatched from Broerhood36 Central Online Fulfillment</span>
                <span className="text-slate-500 font-mono-num">Yesterday, 17:30</span>
              </div>
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
                  `*ORDER INQUIRY / PAYMENT PROOF - BROERHOOD36*\nOrder: #${searchedOrder.id}\nWaybill: ${searchedOrder.trackingNumber}\nCustomer: ${searchedOrder.customer.fullName}\nTotal: R ${searchedOrder.total.toLocaleString()}\nStatus: ${searchedOrder.status}`
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
                  `*ORDER INQUIRY / PAYMENT PROOF - BROERHOOD36*\nOrder: #${searchedOrder.id}\nWaybill: ${searchedOrder.trackingNumber}\nCustomer: ${searchedOrder.customer.fullName}\nTotal: R ${searchedOrder.total.toLocaleString()}\nStatus: ${searchedOrder.status}`
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
              <strong className="text-white block mt-0.5">{searchedOrder.customer.fullName}</strong>
              <p className="text-slate-400">{searchedOrder.address.street}, {searchedOrder.address.city}, {searchedOrder.address.province}</p>
            </div>
            <div>
              <span className="text-slate-400 block">Package Inclusions:</span>
              <ul className="text-slate-300 space-y-1 mt-0.5">
                {searchedOrder.items.map((it) => (
                  <li key={it.id}>
                    • {it.quantity}x {it.product.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-heading font-bold text-xl text-white">Order not found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't locate an order with reference "{inputOrderNumber}". Try checking your confirmation email or enter default order <strong className="text-white font-mono-num">BH36-84920</strong>.
          </p>
        </div>
      ) : null}
    </div>
  );
};
