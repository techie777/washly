'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, CheckCircle2, ArrowRight, Search, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

const INDORE_AREAS = [
  { name: 'Vijay Nagar', nameHi: 'विजय नगर', pin: '452010', vanActive: true, time: '15-20 मिनट' },
  { name: 'Palasia', nameHi: 'पलासिया', pin: '452001', vanActive: true, time: '20-25 मिनट' },
  { name: 'Scheme 54', nameHi: 'स्कीम 54', pin: '452011', vanActive: true, time: '15-20 मिनट' },
  { name: 'Super Corridor', nameHi: 'सुपर कॉरिडोर', pin: '452016', vanActive: true, time: '25-30 मिनट' },
  { name: 'Bhawarkua', nameHi: 'भंवरकुआं', pin: '452012', vanActive: true, time: '20-25 मिनट' },
  { name: 'Rajwada', nameHi: 'राजवाड़ा', pin: '452002', vanActive: true, time: '25-30 मिनट' },
  { name: 'Annapurna', nameHi: 'अन्नपूर्णा रोड', pin: '452009', vanActive: true, time: '20-25 मिनट' },
  { name: 'Rau', nameHi: 'राऊ', pin: '453331', vanActive: true, time: '30-35 मिनट' },
];

export default function AreaAvailabilityChecker() {
  const { isHindi } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<typeof INDORE_AREAS[0] | null>(INDORE_AREAS[0]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = query.trim().toLowerCase();
    const match = INDORE_AREAS.find(
      (a) => a.pin.includes(q) || a.name.toLowerCase().includes(q) || a.nameHi.includes(q)
    );
    if (match) {
      setSelectedArea(match);
    } else {
      setSelectedArea({
        name: query || 'Indore Region',
        nameHi: query || 'इंदौर क्षेत्र',
        pin: '452001',
        vanActive: true,
        time: '30 मिनट',
      });
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-amber-100/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-50/70 via-stone-50 to-amber-50/40 rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-sm">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left Header */}
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{isHindi ? 'एरिया उपलब्धता चेक' : 'Service Area Checker'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {isHindi ? 'क्या आपके एरिया में Washly वैन उपलब्ध है?' : 'Is Washly van available in your area?'}
              </h2>
              <p className="text-xs text-slate-600">
                {isHindi 
                  ? 'अपना पिनकोड या इलाका चुनें—हम इंदौर के लगभग सभी प्रमुख क्षेत्रों में उपलब्ध हैं।'
                  : 'Select your area or enter pincode—we cover almost all key Indore localities.'}
              </p>
            </div>

            {/* Quick Pincode Search Box */}
            <form onSubmit={handleSearch} className="w-full md:w-auto flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <label htmlFor="area-checker-input" className="sr-only">
                  {isHindi ? 'पिनकोड या एरिया खोजें' : 'Search Indore pincode or area'}
                </label>
                <input
                  id="area-checker-input"
                  name="areaQuery"
                  aria-label={isHindi ? 'पिनकोड या एरिया खोजें' : 'Search Indore pincode or area'}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isHindi ? 'पिनकोड या एरिया (उदा: 452010)' : 'Pincode (e.g. 452010)'}
                  className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
                />
              </div>
              <button
                type="submit"
                aria-label={isHindi ? 'एरिया उपलब्धता जाँचें' : 'Check area availability'}
                className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-black text-amber-400 font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
              >
                {isHindi ? 'जाँचें' : 'Check'}
              </button>
            </form>

          </div>

          {/* Quick Area 1-Tap Pills */}
          <div className="mt-5 pt-4 border-t border-amber-200/60">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              {isHindi ? 'इंदौर के लोकप्रिय इलाके (1-टैप से चुनें):' : 'Popular Indore Localities:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {INDORE_AREAS.map((a) => {
                const isSelected = selectedArea?.pin === a.pin;
                return (
                  <button
                    key={a.pin}
                    type="button"
                    onClick={() => {
                      setSelectedArea(a);
                      setSearched(true);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-xs scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                    }`}
                  >
                    {isHindi ? a.nameHi : a.name} ({a.pin})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Card */}
          {selectedArea && (
            <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <span>{isHindi ? 'हाँ! सर्विस 100% उपलब्ध है' : 'Yes! Service Available'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {isHindi ? selectedArea.nameHi : selectedArea.name} ({selectedArea.pin})
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {isHindi 
                        ? `वैन का अनुमानित समय: ${selectedArea.time} • पानी व जनरेटर साथ में` 
                        : `Estimated Arrival: ${selectedArea.time} • Clean water on-board`}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/book"
                className="py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-black text-amber-400 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-amber-400/40 shadow-md transition-all text-center shrink-0 active:scale-98"
              >
                <span>{isHindi ? 'इस एरिया में बुक करें' : 'Book in this Area'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
