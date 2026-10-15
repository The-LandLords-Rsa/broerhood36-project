import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { getProductImage } from '../lib/autoImages';
import { X, Check, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const PhoneCompareModal: React.FC = () => {
  const {
    comparePhones,
    toggleComparePhone,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    addToCart,
    openProductModal
  } = useShop();

  if (!isCompareModalOpen) return null;

  const comparedProducts = PRODUCTS.filter((p) => comparePhones.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsCompareModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block">
              Flagship Technology
            </span>
            <h2 className="font-heading font-black text-2xl text-white">
              SMARTPHONE COMPARISON
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Comparing {comparedProducts.length} of 3 devices
            </span>
            <button
              onClick={clearCompare}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {comparedProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-base font-medium">No smartphones selected for comparison.</p>
            <p className="text-xs text-slate-500 mt-1">
              Visit the Phones page and tap "Compare" on up to 3 phones.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-4 w-40 text-xs font-bold text-slate-400 uppercase">Feature</th>
                  {comparedProducts.map((phone) => (
                    <th key={phone.id} className="p-4 min-w-[200px] align-top">
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={getProductImage(phone, 'front')}
                          alt={phone.name}
                          className="w-24 h-24 object-cover rounded-xl bg-slate-950 p-2 mb-2 border border-slate-800"
                        />
                        <span className="text-[11px] font-bold text-blue-400 uppercase">
                          {phone.brand}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-white line-clamp-2">
                          {phone.name}
                        </h4>
                        <div className="font-mono-num font-black text-base text-white mt-1">
                          R {phone.price.toLocaleString()}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => {
                              addToCart(phone);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                          <button
                            onClick={() => toggleComparePhone(phone.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Display</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-200">
                      {p.specifications['Display'] || p.specifications['Main Screen'] || 'OLED 120Hz'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Processor</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-200">
                      {p.specifications['Chipset'] || p.specifications['Processor'] || 'Flagship SoC'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Cameras</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-200">
                      {p.specifications['Camera'] || p.specifications['Cameras'] || 'Multi-lens setup'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Battery &amp; Charging</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-200">
                      {p.specifications['Battery'] || 'All-day battery'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Storage Options</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-200">
                      {p.storageOptions?.join(' / ') || '256GB'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Build &amp; Materials</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-200">
                      {p.specifications['Build'] || p.specifications['Hinge'] || 'Titanium / Glass'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Software</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-200">
                      {p.specifications['OS'] || 'Latest Platform'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
