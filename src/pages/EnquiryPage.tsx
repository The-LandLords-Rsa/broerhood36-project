import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CONFIG, supabase } from '../lib/supabase';
import {
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const EnquiryPage: React.FC = () => {
  const { navigateTo } = useShop();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Sneakers & Limited Edition Kicks');
  const [urgency, setUrgency] = useState('Standard (Within 24 Hours)');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submittedData, setSubmittedData] = useState<{
    refId: string;
    fullName: string;
    email: string;
    phone: string;
    category: string;
    urgency: string;
    subject: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `ENQ-${Date.now().toString().slice(-6)}`;
    const data = {
      refId,
      fullName,
      email,
      phone,
      category,
      urgency,
      subject: subject || `${category} Enquiry`,
      message
    };

    // Save to Supabase (orders or inquiries table)
    try {
      await supabase.from('orders').insert({
        customer_name: fullName,
        customer_whatsapp: phone,
        customer_email: email,
        customer_address: `Enquiry: ${category} (${urgency})`,
        total: 0,
        status: 'enquiry_received',
        order_details: [
          {
            type: 'enquiry',
            refId,
            category,
            urgency,
            subject: data.subject,
            message
          }
        ]
      });
    } catch (err) {
      console.warn('Enquiry logged locally:', err);
    }

    setSubmittedData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWhatsAppMessage = (refId: string) => {
    return (
      `*BROERHOOD36 CUSTOMER ENQUIRY [Ref: #${refId}]*\n\n` +
      `*Name:* ${submittedData?.fullName || fullName}\n` +
      `*Phone:* ${submittedData?.phone || phone}\n` +
      `*Email:* ${submittedData?.email || email}\n` +
      `*Category:* ${submittedData?.category || category}\n` +
      `*Urgency:* ${submittedData?.urgency || urgency}\n` +
      `*Subject:* ${submittedData?.subject || subject}\n\n` +
      `*Message:* \n${submittedData?.message || message}\n\n` +
      `_Sent via BROERHOOD36 Online Portal_`
    );
  };

  const getMailtoLink = () => {
    const s = encodeURIComponent(`[ENQUIRY #${submittedData?.refId || 'BH36'}] - ${submittedData?.subject || subject}`);
    const b = encodeURIComponent(
      `BROERHOOD36 ENQUIRY DETAILS\n` +
      `----------------------------------------\n` +
      `Reference ID: #${submittedData?.refId}\n` +
      `Full Name: ${submittedData?.fullName}\n` +
      `Phone / WhatsApp: ${submittedData?.phone}\n` +
      `Email Address: ${submittedData?.email}\n` +
      `Category: ${submittedData?.category}\n` +
      `Urgency Level: ${submittedData?.urgency}\n\n` +
      `Detailed Message:\n` +
      `${submittedData?.message}\n` +
      `----------------------------------------\n` +
      `Recipient: ${CONFIG.STORE_EMAIL}`
    );
    return `mailto:${CONFIG.STORE_EMAIL}?subject=${s}&body=${b}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 animate-fadeIn">
      {/* Page Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">
          OFFICIAL INQUIRY DESK
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
          HAVE AN ENQUIRY?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Send your enquiry directly to both of our official WhatsApp lines and our central support team at{' '}
          <strong className="text-blue-400 font-mono">{CONFIG.STORE_EMAIL}</strong>.
        </p>
      </div>

      {/* 3 Direct Dispatch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Line 1 */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              WHATSAPP LINE 1 (SALES &amp; ORDERS)
            </span>
            <h3 className="font-heading font-bold text-lg text-white mt-1">
              +{CONFIG.WHATSAPP_1}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct line for kick sizing, smartphone availability, and order status.
            </p>
          </div>
          <a
            href={`https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(
              'Hello BROERHOOD36 (Line 1), I have an enquiry regarding products and orders.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Line 1 (+27 64 901 3150)</span>
          </a>
        </div>

        {/* WhatsApp Line 2 */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              WHATSAPP LINE 2 (RENTALS &amp; DISPATCH)
            </span>
            <h3 className="font-heading font-bold text-lg text-white mt-1">
              +{CONFIG.WHATSAPP_2}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct line for German Hubbly event bookings, delivery logistics, and urgent requests.
            </p>
          </div>
          <a
            href={`https://wa.me/${CONFIG.WHATSAPP_2}?text=${encodeURIComponent(
              'Hello BROERHOOD36 (Line 2), I have an enquiry regarding German Hubbly rentals and dispatch.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Line 2 (+27 69 978 1083)</span>
          </a>
        </div>

        {/* Email broer.hood.36@gmail.com */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              OFFICIAL CENTRAL INBOX
            </span>
            <h3 className="font-heading font-bold text-base text-white mt-1 break-all">
              {CONFIG.STORE_EMAIL}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Official email inbox for formal quotations, invoice requests, and partnerships.
            </p>
          </div>
          <a
            href={`mailto:${CONFIG.STORE_EMAIL}`}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950 transition"
          >
            <Mail className="w-4 h-4" />
            <span>Email Official Desk</span>
          </a>
        </div>
      </div>

      {/* Submission State or Form */}
      {submittedData ? (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-slate-100 shadow-2xl animate-fadeIn space-y-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              Enquiry Successfully Prepared
            </span>
            <h2 className="font-heading font-black text-3xl text-white">
              REFERENCE #{submittedData.refId}
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Thank you, <strong className="text-white">{submittedData.fullName}</strong>. Your enquiry has been registered. Dispatch it now to both WhatsApp numbers and the Broerhood email below:
            </p>
          </div>

          {/* Action Buttons: Line 1, Line 2, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(
                getWhatsAppMessage(submittedData.refId)
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 shadow-lg shadow-emerald-950 transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send to WhatsApp Line 1</span>
              <span className="text-[10px] text-emerald-200 opacity-90">+27 64 901 3150</span>
            </a>

            <a
              href={`https://wa.me/${CONFIG.WHATSAPP_2}?text=${encodeURIComponent(
                getWhatsAppMessage(submittedData.refId)
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 shadow-lg shadow-emerald-950 transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send to WhatsApp Line 2</span>
              <span className="text-[10px] text-emerald-200 opacity-90">+27 69 978 1083</span>
            </a>

            <a
              href={getMailtoLink()}
              className="py-4 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex flex-col items-center justify-center text-center gap-1.5 shadow-lg shadow-blue-950 transition"
            >
              <Mail className="w-5 h-5" />
              <span>Send via Email</span>
              <span className="text-[10px] text-blue-200 opacity-90">{CONFIG.STORE_EMAIL}</span>
            </a>
          </div>

          {/* Review of Details */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              Summary of Your Enquiry
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block">Category:</span>
                <strong>{submittedData.category}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Priority / Urgency:</span>
                <strong className="text-rose-400">{submittedData.urgency}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Customer Name:</span>
                <strong>{submittedData.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Phone / WhatsApp:</span>
                <strong>{submittedData.phone}</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Email Address:</span>
                <strong>{submittedData.email}</strong>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 block mb-1">Message:</span>
                <p className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed font-mono text-[11px]">
                  {submittedData.message}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setSubmittedData(null)}
              className="flex-1 py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Submit Another Enquiry
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white font-bold text-xs"
            >
              Back to Store
            </button>
          </div>
        </div>
      ) : (
        /* Form Section */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-black text-2xl text-white">
                SUBMIT YOUR ENQUIRY
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                All submissions automatically generate instant dispatch links to WhatsApp Line 1, WhatsApp Line 2, and <span className="text-blue-400">{CONFIG.STORE_EMAIL}</span>.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full self-start">
              <Clock className="w-3.5 h-3.5" />
              <span>Fast Response Guarantee</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sipho Ndlovu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +27 82 459 1032"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@example.co.za"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Enquiry Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Sneakers & Limited Edition Kicks">Sneakers &amp; Limited Edition Kicks</option>
                  <option value="Smartphones & Mobile Tech">Smartphones &amp; Mobile Tech</option>
                  <option value="Phone Accessories & Chargers">Phone Accessories &amp; Chargers</option>
                  <option value="Football Shirts & Team Kits">Football Shirts &amp; Team Kits</option>
                  <option value="German Hubbly Purchase">German Hubbly Purchase</option>
                  <option value="German Hubbly Event Rental Hire">German Hubbly Event Rental Hire</option>
                  <option value="Shisha Materials & Coconut Coals">Shisha Materials &amp; Coconut Coals</option>
                  <option value="Vapes & Pods (18+)">Vapes &amp; Pods (18+)</option>
                  <option value="Bulk Order / Wholesale Inquiry">Bulk Order / Wholesale Inquiry</option>
                  <option value="Partnership / Sponsorship">Partnership / Sponsorship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Urgency / Priority
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Standard (Within 24 Hours)">Standard (Within 24 Hours)</option>
                  <option value="Urgent - Event / Order Needed This Weekend">Urgent - Event / Order Needed This Weekend</option>
                  <option value="Immediate - Same Day Gauteng Dispatch Required">Immediate - Same Day Gauteng Dispatch Required</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Sizing check for Air Jordan 4 UK 9"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Detailed Message / Questions *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe what you are looking for, required quantities, delivery location in South Africa, or specific dates..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 leading-relaxed"
              />
            </div>

            {/* Notification Badge */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3 text-slate-300">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white block">Multi-Channel Routing</span>
                <span>
                  Your enquiry will be ready for one-tap delivery to WhatsApp Line 1 (+27 64 901 3150), WhatsApp Line 2 (+27 69 978 1083), and directly to {CONFIG.STORE_EMAIL}.
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-blue-600 hover:from-rose-500 hover:to-blue-500 text-white font-heading font-black text-sm tracking-wide shadow-xl shadow-rose-950 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>CONTINUE TO DISPATCH ENQUIRY</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
