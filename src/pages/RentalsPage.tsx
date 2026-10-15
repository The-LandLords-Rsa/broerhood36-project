import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Product, RentalBookingRequest } from '../types';
import { supabase, CONFIG } from '../lib/supabase';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Flame,
  Truck,
  MapPin,
  CalendarDays,
  User,
  Sparkles,
  MessageCircle
} from 'lucide-react';

export const RentalsPage: React.FC = () => {
  const { addRentalBooking, navigateTo } = useShop();

  const hubblyOptions = PRODUCTS.filter((p) => p.category === 'hubblies');

  // Form State
  const [selectedHubbly, setSelectedHubbly] = useState<Product>(hubblyOptions[0]);
  const [durationDays, setDurationDays] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(18); // default day in October 2026
  const [eventType, setEventType] = useState<string>('Rooftop Gathering / Braai');
  const [eventLocation, setEventLocation] = useState<string>('Sandton, Johannesburg');
  const [customerName, setCustomerName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [submittedBooking, setSubmittedBooking] = useState<RentalBookingRequest | null>(null);

  // Calendar dates matrix for October 2026
  // Days 1 to 31
  // Mock statuses: 5, 12, 24 are Reserved; 10, 25 are Unavailable; rest are Available
  const reservedDays = [5, 12, 13, 24];
  const unavailableDays = [1, 2, 9, 25];

  const getDayStatus = (d: number) => {
    if (unavailableDays.includes(d)) return 'unavailable';
    if (reservedDays.includes(d)) return 'reserved';
    return 'available';
  };

  const dailyRate = selectedHubbly.rentalDetails?.dailyRate || 400;
  const deposit = selectedHubbly.rentalDetails?.deposit || 1200;
  const rentalFee = dailyRate * durationDays * quantity;
  const totalAmount = rentalFee + deposit;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !email) {
      alert('Please fill in your name, phone number, and email.');
      return;
    }

    const bookingId = `RENT-${Date.now().toString().slice(-6)}`;
    const booking: RentalBookingRequest = {
      id: bookingId,
      product: selectedHubbly,
      customerName,
      email,
      phone,
      rentalDate: `${selectedDay} October 2026`,
      durationDays,
      quantity,
      eventType,
      eventLocation,
      deliveryNotes,
      dailyRate,
      deposit,
      totalAmount,
      status: 'Confirmed'
    };

    addRentalBooking(booking);

    // Save rental to Supabase orders table
    try {
      await supabase.from('orders').insert({
        customer_name: customerName,
        customer_whatsapp: phone,
        customer_email: email,
        customer_address: eventLocation,
        total: totalAmount,
        status: 'confirmed_rental',
        order_details: [
          {
            rentalId: bookingId,
            product: selectedHubbly.name,
            durationDays,
            quantity,
            rentalDate: `${selectedDay} October 2026`,
            deposit,
            dailyRate
          }
        ],
        is_rental: true,
        rental_start: `2026-10-${selectedDay.toString().padStart(2, '0')}`,
        rental_end: `2026-10-${Math.min(31, selectedDay + durationDays).toString().padStart(2, '0')}`
      });
    } catch (err) {
      console.warn('Supabase rental sync note:', err);
    }

    setSubmittedBooking(booking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Category Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-blue-950 border border-slate-800 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-rose-500/40 text-rose-400 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 fill-current" />
            <span>PREMIUM EVENT &amp; VIP GATHERING HIRE</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            RENT A GERMAN HUBBLY
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Elevate your celebration, house party, rooftop braai, or corporate gathering. Complete setup delivered directly to your doorstep with 1000W coal stove, organic coconut coals, and premium flavours.
          </p>
        </div>
      </div>

      {submittedBooking ? (
        /* Confirmation View */
        <div className="max-w-2xl mx-auto bg-slate-900 border border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-center text-slate-100 shadow-2xl animate-fadeIn space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              Booking Request Received
            </span>
            <h2 className="font-heading font-black text-3xl text-white">
              RESERVATION #{submittedBooking.id}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Our Johannesburg event team will contact you via WhatsApp on{' '}
              <strong className="text-white">{submittedBooking.phone}</strong> to confirm delivery logistics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Hubbly:</span>
              <strong className="text-white">{submittedBooking.product.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Event Date:</span>
              <strong className="text-white">{submittedBooking.rentalDate}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <strong className="text-white">{submittedBooking.durationDays} Day(s) ({submittedBooking.quantity} unit)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Event Location:</span>
              <strong className="text-white">{submittedBooking.eventLocation}</strong>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-400">Total Rental + Refundable Deposit:</span>
              <strong className="text-emerald-400 font-mono-num font-bold text-sm">
                R {submittedBooking.totalAmount.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Instant Dispatch to Both WhatsApp Lines and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(
                `*NEW GERMAN HUBBLY RENTAL - BROERHOOD36*\n` +
                `Reservation: #${submittedBooking.id}\n` +
                `Pipe: ${submittedBooking.product.name}\n` +
                `Date: ${submittedBooking.rentalDate}\n` +
                `Duration: ${submittedBooking.durationDays} Day(s) (${submittedBooking.quantity} unit)\n` +
                `Customer: ${submittedBooking.customerName} (${submittedBooking.phone})\n` +
                `Location: ${submittedBooking.eventLocation}\n` +
                `Estimated Total: R ${submittedBooking.totalAmount}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Line 1 (+27 64 901 3150)</span>
            </a>

            <a
              href={`https://wa.me/${CONFIG.WHATSAPP_2}?text=${encodeURIComponent(
                `*NEW GERMAN HUBBLY RENTAL - BROERHOOD36*\n` +
                `Reservation: #${submittedBooking.id}\n` +
                `Pipe: ${submittedBooking.product.name}\n` +
                `Date: ${submittedBooking.rentalDate}\n` +
                `Duration: ${submittedBooking.durationDays} Day(s) (${submittedBooking.quantity} unit)\n` +
                `Customer: ${submittedBooking.customerName} (${submittedBooking.phone})\n` +
                `Location: ${submittedBooking.eventLocation}\n` +
                `Estimated Total: R ${submittedBooking.totalAmount}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Line 2 (+27 69 978 1083)</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setSubmittedBooking(null)}
              className="flex-1 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Book Another Hubbly
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Back to Store
            </button>
          </div>
        </div>
      ) : (
        /* Booking Interface */
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Selection & Calendar */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Select German Hubbly */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-heading font-black text-xl text-white">
                  Select German Hubbly Pipe
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {hubblyOptions.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHubbly(h)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedHubbly.id === h.id
                        ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <img
                        src={h.image}
                        alt={h.name}
                        className="w-full h-32 object-cover rounded-xl mb-3 bg-slate-900"
                      />
                      <span className="text-[10px] font-bold text-blue-400 uppercase">
                        {h.brand}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-white line-clamp-1">
                        {h.name}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Daily:</span>
                      <strong className="text-rose-400 font-mono-num font-bold">
                        R {h.rentalDetails?.dailyRate} / 24h
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Duration & Quantity */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-heading font-black text-xl text-white">
                  Rental Duration &amp; Quantity
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Duration:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { days: 1, label: '1 Day (24h)' },
                      { days: 2, label: '2 Days (48h)' },
                      { days: 3, label: 'Weekend (3D)' }
                    ].map((d) => (
                      <button
                        type="button"
                        key={d.days}
                        onClick={() => setDurationDays(d.days)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                          durationDays === d.days
                            ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Number of Hubblies:
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((q) => (
                      <button
                        type="button"
                        key={q}
                        onClick={() => setQuantity(q)}
                        className={`w-12 h-10 rounded-xl text-xs font-bold border transition-all ${
                          quantity === q
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Calendar Date Picker */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-heading font-black text-xl text-white">
                    Select Event Date (October 2026)
                  </h3>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-4 text-xs pt-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  Available
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-amber-600" />
                  Reserved
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-slate-800" />
                  Unavailable
                </span>
              </div>

              {/* Calendar Grid */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 font-bold mb-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {[...Array(31)].map((_, idx) => {
                    const day = idx + 1;
                    const status = getDayStatus(day);
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        type="button"
                        key={day}
                        disabled={status === 'unavailable'}
                        onClick={() => setSelectedDay(day)}
                        className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-lg'
                            : status === 'available'
                            ? 'bg-slate-900 text-slate-200 hover:bg-blue-600/30 hover:border-blue-500 border border-slate-800'
                            : status === 'reserved'
                            ? 'bg-amber-950/40 text-amber-300/80 border border-amber-900/40 cursor-not-allowed opacity-75'
                            : 'bg-slate-950/50 text-slate-600 border border-slate-900 cursor-not-allowed opacity-40'
                        }`}
                      >
                        <span className="font-mono-num">{day}</span>
                        <span className="text-[9px] uppercase font-semibold">
                          {status === 'available' ? 'Avail' : status === 'reserved' ? 'Booked' : 'N/A'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Selected Booking Date:{' '}
                <strong className="text-white font-mono-num font-bold">
                  {selectedDay} October 2026 ({durationDays} Day Duration)
                </strong>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Order Summary */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-heading font-black text-xl text-white">
                Event &amp; Delivery Details
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sipho Ndlovu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sipho@example.co.za"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 82 459 1032"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Rooftop Gathering / Braai">Rooftop Gathering / Braai</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="House Party">House Party</option>
                    <option value="Music Video / Shoot">Music Video / Shoot</option>
                    <option value="Corporate / VIP Event">Corporate / VIP Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Event Venue / Area Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Camps Bay, Cape Town or Sandton, JHB"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Special Delivery Notes / Gate Access
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Deliver before 16:00, security gate code 4091"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Hubbly Rental ({quantity}x for {durationDays} days):</span>
                  <span className="font-mono-num text-white">R {rentalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-mono-num text-white">R {deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Included Accessories:</span>
                  <span className="text-emerald-400 font-semibold">1000W Stove + Coals + Bowls (FREE)</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800">
                  <span className="text-white">Estimated Total:</span>
                  <span className="text-rose-400 font-mono-num text-lg font-black">
                    R {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-heading font-black text-sm bg-gradient-to-r from-rose-600 to-blue-600 hover:from-rose-500 hover:to-blue-500 text-white shadow-xl shadow-rose-950 transition-all"
              >
                SUBMIT RENTAL BOOKING REQUEST
              </button>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero upfront charge today. Pay deposit after WhatsApp confirmation.</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
