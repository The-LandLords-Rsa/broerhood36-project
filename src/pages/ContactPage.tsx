import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CONFIG } from '../lib/supabase';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
  FileQuestion,
  ArrowRight
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigateTo } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product / Sizing Inquiry');
  const [message, setMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'wa1' | 'wa2' | 'email'>('wa1');
  const [isSent, setIsSent] = useState(false);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does nationwide delivery take in South Africa?',
      a: 'Deliveries to major metro hubs (Johannesburg, Pretoria, Cape Town, Durban) take 24–48 hours via The Courier Guy. Regional and outlying areas usually take 48–72 hours. You receive an instant SMS tracking link as soon as your parcel is dispatched.'
    },
    {
      q: 'Are your sneakers 100% authentic and original?',
      a: 'Yes, without exception. Every single pair of Nike, Jordan, Adidas, and New Balance kicks passes rigorous multi-point physical verification before entering our inventory. We guarantee 100% authenticity or a 200% refund.'
    },
    {
      q: 'How does German Hubbly rental work?',
      a: 'Select your preferred German Hubbly on our Rentals page, choose your event date and duration, and enter your delivery venue. We deliver the sanitized hookah along with a 1000W coal stove burner, organic coals, and flavours. A refundable security deposit is collected and released immediately upon return inspection.'
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept all South African bank cards via PayFast, Ozow Instant EFT (Capitec, FNB, Standard Bank, ABSA, Nedbank), and Cash on Delivery in selected Gauteng and Cape Town areas.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);

    const formattedMessage =
      `*BROERHOOD36 CONTACT INQUIRY*\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Subject:* ${subject}\n\n` +
      `*Message:* \n${message}`;

    if (selectedChannel === 'wa1') {
      window.open(
        `https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(formattedMessage)}`,
        '_blank'
      );
    } else if (selectedChannel === 'wa2') {
      window.open(
        `https://wa.me/${CONFIG.WHATSAPP_2}?text=${encodeURIComponent(formattedMessage)}`,
        '_blank'
      );
    } else {
      window.location.href = `mailto:${CONFIG.STORE_EMAIL}?subject=${encodeURIComponent(
        `[CONTACT] ${subject} - ${name}`
      )}&body=${encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
      )}`;
    }

    setTimeout(() => {
      setIsSent(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 animate-fadeIn">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block">
          Get In Touch
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
          WE’RE HERE FOR THE HOOD
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Questions regarding sneaker sizing, smartphone stock, football jerseys, or German hubbly rentals? Connect directly with our team on our two official WhatsApp numbers or via email.
        </p>
      </div>

      {/* Contact Channels Row: 2 WhatsApp Lines + 1 Email + 1 Enquiry Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Line 1 */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              WHATSAPP LINE 1
            </span>
            <h3 className="font-heading font-bold text-lg text-white mt-0.5">
              +{CONFIG.WHATSAPP_1}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Primary sales, kicks authentication, smartphone upgrades &amp; order inquiries.
            </p>
          </div>
          <a
            href={`https://wa.me/${CONFIG.WHATSAPP_1}?text=${encodeURIComponent(
              'Hello BROERHOOD36 (Line 1), I would like to get in touch with customer support.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Line 1 (+27 64 901 3150)</span>
          </a>
        </div>

        {/* WhatsApp Line 2 */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              WHATSAPP LINE 2
            </span>
            <h3 className="font-heading font-bold text-lg text-white mt-0.5">
              +{CONFIG.WHATSAPP_2}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              German Hubbly event hire, delivery dispatch logistics &amp; urgent customer care.
            </p>
          </div>
          <a
            href={`https://wa.me/${CONFIG.WHATSAPP_2}?text=${encodeURIComponent(
              'Hello BROERHOOD36 (Line 2), I have an inquiry regarding dispatch/rentals.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Line 2 (+27 69 978 1083)</span>
          </a>
        </div>

        {/* Official Email Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-500/30 space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              CENTRAL EMAIL
            </span>
            <h3 className="font-heading font-bold text-base text-white mt-0.5 break-all">
              {CONFIG.STORE_EMAIL}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct inbox for quotes, wholesale partnerships, and formal invoicing.
            </p>
          </div>
          <a
            href={`mailto:${CONFIG.STORE_EMAIL}`}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-950 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Email broer.hood.36@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Detailed Enquiry Promo Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-white">
              NEED TO SUBMIT A FORMAL ENQUIRY?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Use our dedicated Enquiry Portal to specify order urgency, delivery dates, or wholesale quantities. Dispatches automatically to both WhatsApp numbers and our email.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('enquiry')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-blue-600 hover:from-rose-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg"
        >
          <span>Open Enquiry Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Form + Hub Locations & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-heading font-black text-2xl text-white">SEND A DIRECT MESSAGE</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your preferred dispatch method below (WhatsApp Line 1, Line 2, or Email).
            </p>
          </div>

          {isSent ? (
            <div className="p-8 text-center bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-white">Message Dispatched!</h3>
              <p className="text-xs text-slate-300">
                Thank you, {name || 'valued customer'}. We are routing your message right now.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sipho Ndlovu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.co.za"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 459 1032"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Inquiry Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Product / Sizing Inquiry">Product / Sizing Inquiry</option>
                    <option value="Smartphone Stock Check">Smartphone Stock Check</option>
                    <option value="Football Jersey Sizing">Football Jersey Sizing</option>
                    <option value="German Hubbly Rental Booking">German Hubbly Rental Booking</option>
                    <option value="Order Tracking & Logistics">Order Tracking &amp; Logistics</option>
                    <option value="Wholesale / Bulk Orders">Wholesale / Bulk Orders</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Dispatch Destination</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedChannel('wa1')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 transition ${
                      selectedChannel === 'wa1'
                        ? 'border-emerald-500 bg-emerald-950/40 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <strong className="block text-[11px] text-white">WhatsApp 1</strong>
                      <span className="text-[10px] text-slate-400">+27 64 901 3150</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedChannel('wa2')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 transition ${
                      selectedChannel === 'wa2'
                        ? 'border-emerald-500 bg-emerald-950/40 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <strong className="block text-[11px] text-white">WhatsApp 2</strong>
                      <span className="text-[10px] text-slate-400">+27 69 978 1083</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedChannel('email')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 transition ${
                      selectedChannel === 'email'
                        ? 'border-blue-500 bg-blue-950/40 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="truncate">
                      <strong className="block text-[11px] text-white">Email Inbox</strong>
                      <span className="text-[10px] text-slate-400 truncate block">broer.hood.36</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can BROERHOOD36 assist you today?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-heading font-black text-sm bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white shadow-xl shadow-blue-950 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {selectedChannel === 'wa1'
                    ? 'SEND TO WHATSAPP LINE 1 (+27 64 901 3150)'
                    : selectedChannel === 'wa2'
                    ? 'SEND TO WHATSAPP LINE 2 (+27 69 978 1083)'
                    : 'SEND VIA EMAIL (broer.hood.36@gmail.com)'}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Online Store & Nationwide Delivery Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block mb-1">
                E-Commerce Excellence
              </span>
              <h3 className="font-heading font-black text-xl text-white">
                100% ONLINE STORE &amp; NATIONWIDE DISPATCH
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                We operate purely online with zero physical showrooms to keep overheads low and give you the best prices on verified grails.
              </p>
            </div>

            <div className="space-y-5 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Nationwide Doorstep Delivery</h4>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    We ship daily to all 9 South African provinces (Gauteng, Western Cape, KZN, Eastern Cape, Free State, Mpumalanga, Limpopo, North West, Northern Cape).
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                    Via The Courier Guy &amp; Paxi with real-time SMS waybill tracking
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Customer Support Desk Hours</h4>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    Monday – Friday: 08:30 – 18:00
                    <br />
                    Saturday – Sunday: 09:00 – 16:00
                  </p>
                  <span className="text-[10px] text-blue-400 font-semibold block mt-1">
                    WhatsApp response usually under 5 minutes during operational hours
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white block">Official Contact Channels</span>
              <div className="space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-slate-300">
                  <span className="text-slate-400">Sales &amp; Kicks:</span>
                  <a href={`https://wa.me/${CONFIG.WHATSAPP_1}`} className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Line 1: +{CONFIG.WHATSAPP_1}</span>
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-slate-300">
                  <span className="text-slate-400">Rentals &amp; Logistics:</span>
                  <a href={`https://wa.me/${CONFIG.WHATSAPP_2}`} className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Line 2: +{CONFIG.WHATSAPP_2}</span>
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-slate-300">
                  <span className="text-slate-400">Central Support:</span>
                  <a href={`mailto:${CONFIG.STORE_EMAIL}`} className="text-blue-400 font-mono hover:underline break-all">
                    {CONFIG.STORE_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
            Common Inquiries
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-rose-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-rose-500' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
