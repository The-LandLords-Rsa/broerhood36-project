import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { isValidEmail, isValidName, isValidSouthAfricanPhone } from '../lib/formValidation';
import { supabase } from '../lib/supabase';
import {
  ArrowRight,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    navigateTo,
    authUser,
    setIsAuthModalOpen,
    promoCode
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Customer Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Delivery Address (South Africa)
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [startingPayment, setStartingPayment] = useState(false);

  useEffect(() => {
    if (authUser?.email) setEmail(authUser.email);
  }, [authUser?.email]);

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

  const validateCustomerDetails = () => {
    if (!isValidName(fullName)) {
      window.alert('Enter your name using between 2 and 100 characters.');
      return false;
    }
    if (!isValidEmail(email)) {
      window.alert('Enter a valid email address.');
      return false;
    }
    if (!isValidSouthAfricanPhone(phone)) {
      window.alert('Enter a valid South African phone number.');
      return false;
    }
    return true;
  };

  const validateDeliveryAddress = () => {
    if (street.trim().length < 5 || city.trim().length < 2 || !/^\d{4}$/.test(postalCode.trim())) {
      window.alert('Enter a street address, city, and valid 4-digit South African postal code.');
      return false;
    }
    return true;
  };

  const startPayFastCheckout = async () => {
    setPaymentError('');
    if (!authUser?.email) {
      setPaymentError('Sign in with a confirmed account before paying so your order can be securely linked to you.');
      setIsAuthModalOpen(true);
      return;
    }
    if (email.trim().toLowerCase() !== authUser.email.toLowerCase()) {
      setPaymentError('The order email must match the email address on your signed-in account.');
      return;
    }
    if (!validateCustomerDetails() || !validateDeliveryAddress()) return;

    setStartingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke<{
        action: string;
        parameters: Record<string, string>;
        total: number;
        error?: string;
      }>('payfast-create-payment', {
        body: {
          customer: { fullName, email: authUser.email, phone },
          address: {
            street,
            city,
            province,
            postalCode,
            deliveryNotes: notes
          },
          items: cart.map((item) => ({
            sku: item.product.id,
            quantity: item.quantity,
            selected_size: item.selectedSize,
            selected_color: item.selectedColor,
            selected_storage: item.selectedStorage
          })),
          promoCode
        }
      });

      if (error) {
        if (error.context instanceof Response) {
          const body: unknown = await error.context.clone().json().catch(() => null);
          if (
            typeof body === 'object' &&
            body !== null &&
            'error' in body &&
            typeof body.error === 'string'
          ) {
            throw new Error(body.error);
          }
        }
        throw error;
      }
      if (data?.error) throw new Error(data.error);
      if (
        data?.action !== 'https://sandbox.payfast.co.za/eng/process' ||
        !data.parameters ||
        Object.values(data.parameters).some((value) => typeof value !== 'string') ||
        typeof data.total !== 'number' ||
        !Number.isFinite(data.total) ||
        Math.round(data.total * 100) !== Math.round(cartTotal * 100)
      ) {
        throw new Error('The verified server total does not match your cart. No payment was started; refresh the page and try again.');
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.action;
      form.style.display = 'none';
      Object.entries(data.parameters).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Unable to start PayFast sandbox checkout:', error);
      setPaymentError(error instanceof Error
        ? error.message
        : 'Secure checkout could not be started. Please try again.');
      setStartingPayment(false);
    }
  };

  if (cart.length === 0) {
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

  const paymentCancelled = new URLSearchParams(window.location.search).get('payfast') === 'cancelled';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {paymentCancelled && (
        <div role="status" className="max-w-2xl mx-auto p-4 rounded-xl border border-amber-500/40 bg-amber-950/40 text-sm text-amber-200">
          Payment was cancelled in PayFast. The order remains unpaid; you can retry securely below.
        </div>
      )}
      {/* Checkout Progress Stepper */}
      <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Customer' },
              { num: 2, label: 'Delivery' },
              { num: 3, label: 'Online payment' }
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
                  readOnly={Boolean(authUser?.email)}
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
                if (!validateCustomerDetails()) return;
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
                if (!validateDeliveryAddress()) return;
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
              SECURE ONLINE CHECKOUT
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              PayFast is currently in sandbox mode. Test payments do not move real money. Sign in using the same email address entered above.
            </p>
          </div>

          <div className="space-y-3">
            {/* PayFast */}
            <label className="p-4 rounded-2xl border border-blue-500/40 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked
                  readOnly
                  className="accent-blue-500"
                />
                <div>
                  <strong className="text-sm text-white block">PayFast Sandbox</strong>
                  <span className="text-xs text-slate-400">Test checkout · no real charge</span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                TEST MODE
              </span>
            </label>

            {/* Ozow Instant EFT */}
            <label className="p-4 rounded-2xl border border-slate-800 bg-slate-950 opacity-50 cursor-not-allowed flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  disabled
                  className="accent-blue-500"
                />
                <div>
                  <strong className="text-sm text-white block">Ozow Instant EFT</strong>
                  <span className="text-xs text-slate-400">Unavailable until provider credentials and server verification are configured.</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Zero Waiting
              </span>
            </label>

            {/* Credit / Debit Card */}
            <label className="p-4 rounded-2xl border border-slate-800 bg-slate-950 opacity-50 cursor-not-allowed flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  disabled
                  className="accent-blue-500"
                />
                <div>
                  <strong className="text-sm text-white block">Direct Visa &amp; Mastercard</strong>
                  <span className="text-xs text-slate-400">Unavailable until a secure card processor is configured.</span>
                </div>
              </div>
            </label>

          </div>

          {/* Total Summary */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Due:</span>
              <strong className="text-white font-heading font-black text-2xl font-mono-num">
                R {cartTotal.toLocaleString()}
              </strong>
            </div>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Final amount is recalculated by the server
            </span>
          </div>

          {paymentError && (
            <div role="alert" className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs">
              {paymentError}
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Delivery
            </button>

            <button
              type="button"
              onClick={startPayFastCheckout}
              disabled={startingPayment}
              className="px-5 py-3.5 rounded-xl font-heading font-bold text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white border border-blue-500 disabled:border-slate-700 flex items-center justify-center gap-1.5 order-1 sm:order-2"
            >
              <Lock className="w-4 h-4" />
              <span>{startingPayment ? 'STARTING SECURE CHECKOUT...' : 'PAY SECURELY WITH PAYFAST'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
