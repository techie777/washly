'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, CheckCircle2, ArrowRight, Search, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

const INDORE_AREAS = [
  { name: 'Vijay Nagar', nameHi: 'विजय नगर', pin: '452010', vanActive: true, time: '15-20 मिनट' },
  { name: 'Palasia', nameHi: 'पलासिया', pin: '452001', vanActive: true, time: '20-25 मिनट' },
  { name: 'Scheme No 54', nameHi: 'स्कीम 54', pin: '452011', vanActive: true, time: '15-20 मिनट' },
  { name: 'Scheme No 78', nameHi: 'स्कीम 78', pin: '452010', vanActive: true, time: '15-20 मिनट' },
  { name: 'Mahalaxmi Nagar', nameHi: 'महालक्ष्मी नगर', pin: '452010', vanActive: true, time: '15-20 मिनट' },
  { name: 'MR-9 Road', nameHi: 'एमआर-9 रोड', pin: '452010', vanActive: true, time: '15-20 मिनट' },
  { name: 'Nipania', nameHi: 'निपानिया', pin: '452016', vanActive: true, time: '20-25 मिनट' },
  { name: 'Bapat Square', nameHi: 'बापट चौराहा', pin: '452010', vanActive: true, time: '15-20 मिनट' },
  { name: 'Sukhlia', nameHi: 'सुखलिया', pin: '452010', vanActive: true, time: '15-20 मिनट' },
  { name: 'LIG Square', nameHi: 'एलआईजी चौराहा', pin: '452011', vanActive: true, time: '15-20 मिनट' },
  { name: 'Malviya Nagar', nameHi: 'मालवीय नगर', pin: '452010', vanActive: true, time: '15-20 मिनट' },
  { name: 'Saket', nameHi: 'साकेत', pin: '452018', vanActive: true, time: '20-25 मिनट' },
  { name: 'Tilak Nagar', nameHi: 'तिलक नगर', pin: '452018', vanActive: true, time: '20-25 मिनट' },
  { name: 'Bengali Square', nameHi: 'बंगाली चौराहा', pin: '452016', vanActive: true, time: '20-25 मिनट' },
  { name: 'Khajrana', nameHi: 'खजराना', pin: '452016', vanActive: true, time: '20-25 मिनट' },
];

export default function AreaAvailabilityChecker() {
  const { isHindi } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<typeof INDORE_AREAS[0] | null>(null);
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
    <section className="py-10 sm:py-12 bg-white border-b border-amber-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-50/70 via-slate-50 to-amber-50/40 rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-sm">
          
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
                <Search aria-hidden="true" className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
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
                  className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
                />
              </div>
              <button
                type="submit"
                aria-label={isHindi ? 'एरिया उपलब्धता जाँचें' : 'Check area availability'}
                className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-xs shrink-0 cursor-pointer transition-all shadow-xs"
              >
                {isHindi ? 'जाँचें' : 'Check'}
              </button>
            </form>

          </div>

          {/* Quick Area 1-Tap Pills */}
          <div className="mt-5 pt-4 border-t border-amber-200/60">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>{isHindi ? 'इंदौर के प्रमुख इलाके (1-टैप से चुनें):' : 'Popular Indore Localities (Tap to select):'}</span>
              <span className="text-[10px] text-amber-700 font-semibold">{INDORE_AREAS.length} {isHindi ? 'एरिया सक्रिय' : 'Areas Active'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INDORE_AREAS.map((a) => {
                const isSelected = selectedArea?.name === a.name;
                return (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => {
                      setSelectedArea(a);
                      setSearched(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-black border border-amber-500 shadow-sm shadow-amber-500/20 scale-[1.03]'
                        : 'bg-white text-slate-700 font-medium border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 hover:text-slate-950'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />}
                    <span>{isHindi ? a.nameHi : a.name}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                      ({a.pin})
                    </span>
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
                        ? `वैन का अनुमानित समय: ${selectedArea.time} • प्रो डिटेलिंग किट साथ में` 
                        : `Estimated Arrival: ${selectedArea.time} • Pro detailing gear on-board`}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/book"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-amber-400 shadow-sm transition-all text-center shrink-0 active:scale-98"
              >
                <span>{isHindi ? 'इस एरिया में बुक करें' : 'Book in this Area'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
