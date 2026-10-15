import React from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORY_HERO_IMAGES } from '../data/products';
import {
  Sparkles,
  ShieldCheck,
  Target,
  Zap,
  Users,
  Award,
  ArrowRight,
  Heart
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 border border-slate-800 p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-950/60 border border-rose-500/30 px-3 py-1 rounded-full inline-block">
          THE BROERHOOD36 STORY
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
          WHERE TECH, STREETWEAR &amp; MZANSI CULTURE CONVERGE
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Born out of Johannesburg and shaped by the rhythm of South African youth ambition, Broerhood36 was created to break down borders between tech, sneaker hype, football passion and luxury lifestyle.
        </p>
      </div>

      {/* Story & Vision Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Chapter 01
            </span>
            <h2 className="font-heading font-black text-3xl text-white">
              OUR STORY
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            South African youth have always driven culture—from the fashion subcultures in Soweto and Braamfontein to the creative energy across Cape Town and Durban. Yet for too long, buying genuine hype sneakers meant taking risks on shady peer-to-peer sellers, flagship phones came with exorbitant mall markups, and luxury German hookahs were near impossible to source locally.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We founded <strong className="text-white">BROERHOOD36</strong> to build an authentic, uncompromising marketplace where real enthusiasts could find verified grails, cutting-edge mobile tech, official football shirts, and German precision shisha rentals in one seamless digital home.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="font-heading font-black text-2xl text-blue-400 font-mono-num">
                100%
              </span>
              <span className="text-xs text-slate-400 block mt-1 font-semibold">
                Authentic Guarantee
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="font-heading font-black text-2xl text-rose-400 font-mono-num">
                9 SA
              </span>
              <span className="text-xs text-slate-400 block mt-1 font-semibold">
                Provinces Delivered
              </span>
            </div>
          </div>
        </div>

        {/* Visual card */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-3 shadow-2xl">
          <img
            src={CATEGORY_HERO_IMAGES.hero}
            alt="Broerhood36 lifestyle story"
            className="w-full aspect-4/3 object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Vision & Values */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Core Foundations
          </span>
          <h2 className="font-heading font-black text-3xl text-white mt-1">
            OUR VISION &amp; VALUES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Our Vision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              To be Africa's definitive youth lifestyle ecosystem, setting the benchmark for product curation, customer trust, and lightning-fast logistics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-950 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Zero Compromise on Quality</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every sneaker is physically inspected, every phone is genuine ICASA-compliant stock, and every German shisha uses V2A surgical-grade steel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Community &amp; Culture First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Broerhood36 is built with, by, and for the Mzansi community. We sponsor local five-a-side football tournaments and support emerging local creatives.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-rose-900 border border-slate-700 text-center space-y-4">
        <h3 className="font-heading font-black text-2xl sm:text-4xl text-white">
          READY TO ELEVATE YOUR SETUP?
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto">
          Join thousands of satisfied South African buyers enjoying genuine gear, fast dispatch, and direct WhatsApp support.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-white text-slate-950 hover:bg-slate-200 shadow-xl transition-all inline-flex items-center gap-2"
        >
          <span>EXPLORE MARKETPLACE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
