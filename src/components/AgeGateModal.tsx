import React from 'react';
import { useShop } from '../context/ShopContext';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export const AgeGateModal: React.FC = () => {
  const {
    isAgeModalOpen,
    setIsAgeModalOpen,
    setIsAgeVerified,
    navigateTo
  } = useShop();

  if (!isAgeModalOpen) return null;

  const handleConfirmAge = () => {
    setIsAgeVerified(true);
    setIsAgeModalOpen(false);
    navigateTo('vapes');
  };

  const handleRejectAge = () => {
    setIsAgeModalOpen(false);
    navigateTo('home');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center text-slate-100 shadow-2xl relative">
        <button
          onClick={handleRejectAge}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest block mb-1">
          Age-Restricted Category
        </span>
        <h2 className="font-heading font-black text-2xl text-white">
          ARE YOU 18 YEARS OR OLDER?
        </h2>

        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          The vape and e-liquid products displayed on BROERHOOD36 contain nicotine and are strictly intended for legal adult consumers of 18 years of age and older in the Republic of South Africa.
        </p>

        <p className="text-[11px] text-slate-500 mt-2 italic">
          Broerhood36 does not make medical or health claims regarding vaping products.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleConfirmAge}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>I Am 18+ — Enter Vapes Store</span>
          </button>

          <button
            onClick={handleRejectAge}
            className="w-full py-3 px-6 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            Under 18 — Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};
