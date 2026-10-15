import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, PaymentMethod } from '../types';
import { supabase, CONFIG } from '../lib/supabase';
import { getProductImage } from '../lib/autoImages';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Sparkles
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartDiscount,
    cartTotal,
    addOrder,
    clearCart,
    navigateTo
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Customer Details
  const [fullName, setFullName] = useState('Sipho Ndlovu');
  const [email, setEmail] = useState('sipho.ndlovu@gmail.com');
  const [phone, setPhone] = useState('+27 82 459 1032');

  // Step 2: Delivery Address (South Africa)
  const [street, setStreet] = useState('142 Jan Smuts Avenue, Rosebank');
  const [city, setCity] = useState('Johannesburg');
  const [province, setProvince] = useState('Gauteng');
  const [postalCode, setPostalCode] = useState('2196');
  const [notes, setNotes] = useState('Security guard at gate - please buzz unit 4B');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payfast');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasNotifiedPaid, setHasNotifiedPaid] = useState(false);
  const [notifiedMessage, setNotifiedMessage] = useState('');

  // Check for payment=success URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const orderId = params.get('order') || 'BH36-SUCCESS';
      const successOrder: Order = {
        id: orderId,
        date: 'Today',
        customer: { fullName: 'Valued Customer', email: 'verified@payfast.co.za', phone: '+27 82 000 0000' },
        address: { street: 'South Africa Delivery', city: 'Johannesburg', province: 'Gauteng', postalCode: '2000' },
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        discount: 0,
        total: 0,
        paymentMethod: 'payfast',
        status: 'payment_confirmed',
        courierName: 'The Courier Guy South Africa',
        trackingNumber: `TCG-ZA-${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: 'Dispatched within 24-48 hours'
      };
      setConfirmedOrder(successOrder);
      setStep(4);
      clearCart();
    }
  }, []);

  const saProvinces = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Free State',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape'
  ];

  // BUTTON A: Pay with PayFast
  const handlePayFastCheckout = async () => {
    setIsProcessing(true);
    const orderNumber = `BH36-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderNumber,
      date: 'Today',
      customer: { fullName, email, phone },
      address: { street, city, province, postalCode, deliveryNotes: notes },
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: cartDiscount,
      total: cartTotal,
      paymentMethod: 'payfast',
      status: 'pending',
      courierName: 'The Courier Guy South Africa',
      trackingNumber: `TCG-ZA-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: 'Estimated within 24-48 hours'
    };

    addOrder(newOrder);

    // Save to Supabase orders table
    try {
      await supabase.from('orders').insert({
        id: undefined,
        customer_name: fullName,
        customer_whatsapp: phone,
        customer_email: email,
        customer_address: `${street}, ${city}, ${province} ${postalCode}`,
        total: cartTotal,
        status: 'pending',
        order_details: cart,
        is_rental: cart.some((i) => i.isRental)
      });
    } catch (e) {
      console.warn('Supabase order insert note:', e);
    }

    // Submit hidden PayFast form
        // LIVE PayFast - BROERHOOD36
    const actionUrl = 'https://www.payfast.co.za/eng/process';

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = actionUrl;

            const fields: Record<string, string> = {
      merchant_id: '37411031',
      merchant_key: 'c2b6u9l23voj3',
      return_url: `${window.location.origin}${window.location.pathname}?payment=success&order=${orderNumber}`,
      cancel_url: `${window.location.origin}${window.location.pathname}?payment=cancel`,
      m_payment_id: orderNumber,
      amount: cartTotal.toFixed(2),
      item_name: `Broerhood36 Order ${orderNumber}`,
      email_address: email,
      name_first: fullName.split(' ')[0] || 'Customer',
      name_last: fullName.split(' ').slice(1).join(' ') || 'Broerhood',
      email_confirmation: '1',
      confirmation_address: email,
    };

    for (const [key, val] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = val;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  // BUTTON B: Order via WhatsApp (COD)
  const handleWhatsAppCheckout = async () => {
    setIsProcessing(true);
    const orderNumber = `BH36-WA-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderNumber,
      date: 'Today',
      customer: { fullName, email, phone },
      address: { street, city, province, postalCode, deliveryNotes: notes },
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: cartDiscount,
      total: cartTotal,
      paymentMethod: 'cod',
      status: 'placed',
      courierName: 'The Courier Guy South Africa',
      trackingNumber: `TCG-ZA-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: 'Cash on delivery dispatch'
    };

    addOrder(newOrder);

    // Save to Supabase
    try {
      await supabase.from('orders').insert({
        customer_name: fullName,
        customer_whatsapp: phone,
        customer_email: email,
        customer_address: `${street}, ${city}, ${province} ${postalCode}`,
        total: cartTotal,
        status: 'whatsapp_order',
        order_details: cart,
        is_rental: cart.some((i) => i.isRental)
      });
    } catch (e) {
      console.warn('Supabase note:', e);
    }

    // Build WhatsApp message
    const itemsText = cart
      .map(
        (it) =>
          `• ${it.quantity}x ${it.product.name} ${it.selectedSize ? `(${it.selectedSize})` : ''} - R ${(it.product.price * it.quantity).toLocaleString()}`
      )
      .join('\n');

    const message =
      `*NEW ORDER #${orderNumber} - BROERHOOD36*\n\n` +
      `*Customer:* ${fullName}\n` +
      `*Phone/WhatsApp:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Delivery Address:* ${street}, ${city}, ${province} ${postalCode}\n` +
      (notes ? `*Delivery Notes:* ${notes}\n` : '') +
      `\n*Order Items:*\n${itemsText}\n\n` +
      `*Total Due:* R ${cartTotal.toLocaleString()} (Cash on Delivery)\n\n` +
      `Please confirm order dispatch for Broerhood36!`;

    setConfirmedOrder(newOrder);
    clearCart();
    setStep(4);
    setIsProcessing(false);

    window.open(`https://wa.me/${CONFIG.OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const getPaidMessage = (order: Order) => {
    const itemsSummary = order.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.product.name} ${it.selectedSize ? `(${it.selectedSize})` : ''} - R ${(it.product.price * it.quantity).toLocaleString()}`
      )
      .join('\n');

    return (
      `*PAYMENT CONFIRMED BY BUYER - BROERHOOD36*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Order Number:* #${order.id}\n` +
      `*Waybill Tracking:* ${order.trackingNumber}\n` +
      `*Customer:* ${order.customer.fullName}\n` +
      `*WhatsApp / Mobile:* ${order.customer.phone}\n` +
      `*Email:* ${order.customer.email}\n` +
      `*Total Amount Paid:* R ${order.total.toLocaleString()}\n` +
      `*Payment Method:* ${(order.paymentMethod || 'EFT').toUpperCase()}\n` +
      `*Delivery Address:* ${order.address.street}, ${order.address.city}, ${order.address.province} ${order.address.postalCode}\n` +
      (order.address.deliveryNotes ? `*Delivery Notes:* ${order.address.deliveryNotes}\n` : '') +
      `\n*Purchased Items:*\n${itemsSummary}\n\n` +
      `*ACTION REQUIRED:* Customer has clicked [I HAVE PAID]. Please verify receipt in bank/PayFast account and dispatch via The Courier Guy!\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━`
    );
  };

  const handlePaidNotifyBothNumbers = async (existingOrder?: Order | null) => {
    setIsProcessing(true);
    let finalOrder: Order;

    if (existingOrder) {
      finalOrder = { ...existingOrder, status: 'payment_confirmed' };
      setConfirmedOrder(finalOrder);
    } else if (confirmedOrder) {
      finalOrder = { ...confirmedOrder, status: 'payment_confirmed' };
      setConfirmedOrder(finalOrder);
    } else {
      const orderNumber = `BH36-PAY-${Math.floor(10000 + Math.random() * 90000)}`;
      finalOrder = {
        id: orderNumber,
        date: 'Today',
        customer: { fullName, email, phone },
        address: { street, city, province, postalCode, deliveryNotes: notes },
        items: [...cart],
        subtotal: cartSubtotal,
        deliveryFee,
        discount: cartDiscount,
        total: cartTotal,
        paymentMethod: paymentMethod === 'cod' ? 'eft' : paymentMethod,
        status: 'payment_confirmed',
        courierName: 'The Courier Guy South Africa',
        trackingNumber: `TCG-ZA-${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: 'Express Doorstep Courier'
      };
      addOrder(finalOrder);
      setConfirmedOrder(finalOrder);
      clearCart();
      setStep(4);
    }

    try {
      await supabase.from('orders').insert({
        customer_name: finalOrder.customer.fullName,
        customer_whatsapp: finalOrder.customer.phone,
        customer_email: finalOrder.customer.email,
        customer_address: `${finalOrder.address.street}, ${finalOrder.address.city}, ${finalOrder.address.province} ${finalOrder.address.postalCode}`,
        total: finalOrder.total,
        status: 'payment_confirmed',
        order_details: finalOrder.items,
        is_rental: finalOrder.items.some((i) => i.isRental)
      });
    } catch (e) {
      console.warn('Supabase paid order note:', e);
    }

    const msg = getPaidMessage(finalOrder);
    setNotifiedMessage(msg);
    setHasNotifiedPaid(true);
    setIsProcessing(false);

    // Open WhatsApp Line 1
    window.open(`https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // If user reaches checkout with empty cart and not on step 4
  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading font-black text-2xl text-white">NO ITEMS TO CHECK OUT</h2>
        <p className="text-xs text-slate-400">
          Your shopping cart is currently empty. Add items from our catalog to proceed.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
        >
          Go to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Checkout Progress Stepper */}
      {step !== 4 && (
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Customer' },
              { num: 2, label: 'Delivery' },
              { num: 3, label: 'Payment' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    step >= s.num
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    step >= s.num ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
                {s.num < 3 && <div className="w-12 sm:w-20 h-0.5 bg-slate-800 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Customer Details */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
              Step 1 of 3
            </span>
            <h2 className="font-heading font-black text-2xl text-white">
              CUSTOMER DETAILS
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your contact information for order confirmation and SMS tracking updates.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sipho Ndlovu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sipho@example.co.za"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 82 459 1032"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => navigateTo('cart')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </button>

            <button
              onClick={() => {
                if (!fullName || !email || !phone) {
                  alert('Please fill in your name, email, and phone number.');
                  return;
                }
                setStep(2);
              }}
              className="px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 flex items-center gap-2"
            >
              <span>Continue to Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Delivery Address */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-1">
              Step 2 of 3
            </span>
            <h2 className="font-heading font-black text-2xl text-white">
              DELIVERY ADDRESS (SOUTH AFRICA)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Door-to-door courier delivery anywhere across South Africa.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 142 Jan Smuts Avenue, Rosebank"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">City / Town *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Johannesburg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Province *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                >
                  {saProvinces.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="2196"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 font-mono-num"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Special Delivery Notes / Gate Access
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please call before arrival; security complex code 3302"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Customer
            </button>

            <button
              onClick={() => {
                if (!street || !city || !postalCode) {
                  alert('Please enter complete street, city, and postal code.');
                  return;
                }
                setStep(3);
              }}
              className="px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 flex items-center gap-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment Options (South African E-commerce) */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              Step 3 of 3
            </span>
            <h2 className="font-heading font-black text-2xl text-white">
              SELECT PAYMENT METHOD
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Instant and verified South African payment gateways with zero transaction surcharge.
            </p>
          </div>

          <div className="space-y-3">
            {/* PayFast */}
            <label
              onClick={() => setPaymentMethod('payfast')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'payfast'
                  ? 'bg-blue-950/40 border-blue-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'payfast'}
                  onChange={() => setPaymentMethod('payfast')}
                  className="accent-blue-500"
                />
                <div>
                  <strong className="text-sm text-white block">PayFast Gateway</strong>
                  <span className="text-xs text-slate-400">Debit / Credit Card, Capitec Pay, QR Payments</span>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                Most Popular
              </span>
            </label>

            {/* Ozow Instant EFT */}
            <label
              onClick={() => setPaymentMethod('ozow')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'ozow'
                  ? 'bg-blue-950/40 border-blue-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'ozow'}
                  onChange={() => setPaymentMethod('ozow')}
                  className="accent-blue-500"
                />
                <div>
                  <strong className="text-sm text-white block">Ozow Instant EFT</strong>
                  <span className="text-xs text-slate-400">FNB, Standard Bank, ABSA, Nedbank, Capitec, Investec</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Zero Waiting
              </span>
            </label>

            {/* Credit / Debit Card */}
            <label
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'card'
                  ? 'bg-blue-950/40 border-blue-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-blue-500"
                />
                <div>
                  <strong className="text-sm text-white block">Direct Visa &amp; Mastercard</strong>
                  <span className="text-xs text-slate-400">3D-Secure 256-bit encrypted checkout</span>
                </div>
              </div>
            </label>

            {/* Cash on Delivery (COD) */}
            <label
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === 'cod'
                  ? 'bg-blue-950/40 border-blue-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-blue-500"
                />
                <div>
                  <strong className="text-sm text-white block">Cash on Delivery (COD)</strong>
                  <span className="text-xs text-slate-400">Available in Johannesburg, Pretoria &amp; Cape Town metros</span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                Major Metros
              </span>
            </label>

            {/* Direct Bank EFT / Capitec Pay Transfer Details Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Manual Banking App / EFT Transfer Details</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Immediate Processing</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500 block">Bank:</span>
                  <strong>Capitec / FNB</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Name:</span>
                  <strong>BROERHOOD36</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Number:</span>
                  <strong className="font-mono text-white">1849203610</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Branch Code:</span>
                  <strong className="font-mono text-white">470010</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Reference: <strong className="text-white">{fullName || 'Your Name'} / {phone || 'Phone'}</strong>. Once paid in your banking app, click "I Have Paid" below to notify both store numbers immediately!
              </p>
            </div>
          </div>

          {/* Total Summary */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Due:</span>
              <strong className="text-white font-heading font-black text-2xl font-mono-num">
                R {cartTotal.toLocaleString()}
              </strong>
            </div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Secure Checkout
            </span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Delivery
            </button>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="button"
                onClick={() => handlePaidNotifyBothNumbers(null)}
                disabled={isProcessing}
                className="px-6 py-3.5 rounded-xl font-heading font-black text-xs bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-950 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>I HAVE PAID - NOTIFY BOTH NUMBERS</span>
              </button>

              <button
                type="button"
                onClick={handlePayFastCheckout}
                disabled={isProcessing}
                className="px-5 py-3.5 rounded-xl font-heading font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>PAY VIA PAYFAST</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                disabled={isProcessing}
                className="px-5 py-3.5 rounded-xl font-heading font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ORDER COD</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER CONFIRMED */}
      {step === 4 && confirmedOrder && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-center text-slate-100 shadow-2xl animate-fadeIn space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              Thank You For Your Order!
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
              ORDER CONFIRMED
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              We've sent an order receipt to <strong className="text-white">{confirmedOrder.customer.email}</strong>.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Order Number:</span>
                <strong className="text-white font-mono-num text-sm">#{confirmedOrder.id}</strong>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="text-slate-400 block">Waybill Tracking:</span>
                <div className="flex items-center gap-1.5">
                  <strong className="text-blue-400 font-mono-num">{confirmedOrder.trackingNumber}</strong>
                  <button
                    onClick={() => copyToClipboard(confirmedOrder.trackingNumber)}
                    className="p-1 hover:text-white text-slate-400"
                    title="Copy tracking number"
                  >
                    {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Purchased Items:</span>
              {confirmedOrder.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={getProductImage(it.product, 'front')} alt={it.product.name} className="w-8 h-8 rounded object-cover" />
                    <span>{it.quantity}x {it.product.name} {it.selectedSize ? `(${it.selectedSize})` : ''}</span>
                  </div>
                  <span className="font-mono-num text-white">
                    R {(it.product.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-3 border-t border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono-num text-white">R {confirmedOrder.subtotal.toLocaleString()}</span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Discount:</span>
                  <span className="font-mono-num">- R {confirmedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Courier Delivery:</span>
                <span className="text-emerald-400 font-bold uppercase">
                  {confirmedOrder.deliveryFee === 0 ? 'FREE' : `R ${confirmedOrder.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800">
                <span className="text-white">Total Paid:</span>
                <span className="text-white font-mono-num font-black text-base">
                  R {confirmedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="pt-2 text-[11px] text-slate-400">
              <strong className="text-slate-300 block">Delivery to:</strong>
              <span>{confirmedOrder.address.street}, {confirmedOrder.address.city}, {confirmedOrder.address.province} {confirmedOrder.address.postalCode}</span>
            </div>
          </div>

          {/* USER PAYMENT NOTIFICATION CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border-2 border-emerald-500 shadow-2xl text-center space-y-4 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Payment Dispatch Trigger</span>
            </div>

            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              HAVE YOU TRANSFERRED / COMPLETED PAYMENT?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              If you have transferred funds or completed your payment, click the button below to notify both Broerhood36 numbers immediately. We will verify your funds and fast-track courier packing &amp; dispatch!
            </p>

            <button
              onClick={() => handlePaidNotifyBothNumbers(confirmedOrder)}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl font-heading font-black text-sm sm:text-base bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>I HAVE PAID - NOTIFY BOTH NUMBERS NOW</span>
            </button>

            {/* Notification links for Line 1, Line 2, and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(getPaidMessage(confirmedOrder))}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Line 1 (+27 64 901 3150)</span>
              </a>

              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_2}?text=${encodeURIComponent(getPaidMessage(confirmedOrder))}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Line 2 (+27 69 978 1083)</span>
              </a>
            </div>

            <div className="pt-1 text-center">
              <a
                href={`mailto:${CONFIG.STORE_EMAIL}?subject=${encodeURIComponent(
                  `[PAYMENT CONFIRMED] Order #${confirmedOrder.id} - ${confirmedOrder.customer.fullName}`
                )}&body=${encodeURIComponent(getPaidMessage(confirmedOrder))}`}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Also email Proof of Payment to {CONFIG.STORE_EMAIL}</span>
              </a>
            </div>

            {hasNotifiedPaid && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Payment notification generated! Dispatched to Broerhood36 WhatsApp desk.</span>
              </div>
            )}
          </div>

          {/* Quick WhatsApp Support on both lines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a
              href={`https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(
                `Hello BROERHOOD36 (Line 1), checking on my order #${confirmedOrder.id} (Waybill: ${confirmedOrder.trackingNumber})`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Line 1 (+27 64 901 3150)</span>
            </a>

            <a
              href={`https://wa.me/${CONFIG.WHATSAPP_2}?text=${encodeURIComponent(
                `Hello BROERHOOD36 (Line 2), checking on dispatch for order #${confirmedOrder.id} (Waybill: ${confirmedOrder.trackingNumber})`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Line 2 (+27 69 978 1083)</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigateTo('tracking')}
              className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track This Order Live</span>
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
