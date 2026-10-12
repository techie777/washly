'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Save, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Clock, 
  DollarSign, 
  Layers,
  FileText,
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import { ServicePackage, VehicleSegment } from '@/types';
import { LUXURY_SERVICES } from '@/lib/seedData';

const SEGMENTS: Array<{ id: VehicleSegment; label: string; examples: string }> = [
  { id: 'hatchback', label: 'Hatchback', examples: 'Swift, i20, Tiago, Baleno' },
  { id: 'sedan', label: 'Sedan', examples: 'City, Verna, Ciaz, Slavia' },
  { id: 'compact_suv', label: 'Compact SUV', examples: 'Creta, Seltos, Brezza, Nexon' },
  { id: 'suv', label: 'Full SUV / 7-Str', examples: 'Fortuner, XUV700, Safari, Innova' },
  { id: 'luxury', label: 'Luxury / Super', examples: 'BMW, Mercedes, Audi, Volvo' },
];

export default function AdminPackagesTab() {
  const [services, setServices] = useState<ServicePackage[]>(LUXURY_SERVICES);
  const [selectedId, setSelectedId] = useState<string>(LUXURY_SERVICES[0].id);
  const [editing, setEditing] = useState<ServicePackage>(LUXURY_SERVICES[0]);
  const [newTask, setNewTask] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Web text / promo notice state
  const [webNotice, setWebNotice] = useState('100% शुद्ध आरओ पानी व मोबाइल जनरेटर सुविधा हर वॉश में शामिल।');
  const [businessHours, setBusinessHours] = useState('07:00 AM - 08:00 PM (Everyday)');
  const [savingText, setSavingText] = useState(false);
  const [textSuccess, setTextSuccess] = useState(false);

  useEffect(() => {
    // Load packages
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
          const current = data.services.find((s: ServicePackage) => s.id === selectedId) || data.services[0];
          setSelectedId(current.id);
          setEditing(JSON.parse(JSON.stringify(current)));
        }
      })
      .catch((err) => console.warn('Services fetch error', err));

    // Load settings for web notice
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.noticeText) setWebNotice(data.settings.noticeText);
          if (data.settings.businessHours) setBusinessHours(data.settings.businessHours);
        }
      })
      .catch((err) => console.warn('Settings fetch error', err));
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const found = services.find((s) => s.id === id);
    if (found) {
      setEditing(JSON.parse(JSON.stringify(found)));
      setSaveSuccess(false);
      setError(null);
    }
  };

  const handlePriceChange = (segment: VehicleSegment, val: string) => {
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setEditing((prev) => ({
      ...prev,
      vehiclePricing: {
        ...prev.vehiclePricing,
        [segment]: num,
      },
    }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setEditing((prev) => ({
      ...prev,
      includedTasks: [...prev.includedTasks, newTask.trim()],
    }));
    setNewTask('');
  };

  const handleRemoveTask = (idx: number) => {
    setEditing((prev) => ({
      ...prev,
      includedTasks: prev.includedTasks.filter((_, i) => i !== idx),
    }));
  };

  const handleSavePackage = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update package');
      }

      setServices((prev) =>
        prev.map((s) => (s.id === editing.id ? data.service : s))
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Could not save package.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWebText = async () => {
    setSavingText(true);
    setTextSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noticeText: webNotice,
          businessHours: businessHours,
        }),
      });
      if (res.ok) {
        setTextSuccess(true);
        setTimeout(() => setTextSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update web notice', err);
    } finally {
      setSavingText(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Website Promotional Text & Banner Announcements */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Customer Website Promotional Text &amp; Notice Banner
            </h3>
            <p className="text-xs text-slate-500">
              Update the real-time banner shown to users on the homepage and booking screens
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Live Announcement / Notice Text:
            </label>
            <input
              type="text"
              value={webNotice}
              onChange={(e) => setWebNotice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-500 outline-none text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Customer Operating Hours:
            </label>
            <input
              type="text"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-500 outline-none text-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {textSuccess && (
            <div className="text-xs font-bold text-emerald-600 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Promotional text updated and published live!</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSaveWebText}
              disabled={savingText}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{savingText ? 'Saving Text...' : 'Update Website Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Package Management Editor */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Customer Wash Packages &amp; Segment Pricing
              </h3>
              <p className="text-xs text-slate-500">
                Configure rates for Hatchbacks, Sedans, Compact SUVs, and Luxury cars
              </p>
            </div>
          </div>

          <button
            onClick={handleSavePackage}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Package Changes'}</span>
          </button>
        </div>

        {/* Package Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedId === s.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Left Column: Metadata */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Package Name:
              </label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:border-blue-500 outline-none text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tagline / Short Summary:
              </label>
              <input
                type="text"
                value={editing.tagline}
                onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-500 outline-none text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Estimated Duration:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={editing.durationMinutes}
                    onChange={(e) =>
                      setEditing({ ...editing, durationMinutes: parseInt(e.target.value, 10) || 45 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-500 outline-none text-slate-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    mins
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Popular Tag:
                </label>
                <select
                  value={editing.popular ? 'yes' : 'no'}
                  onChange={(e) =>
                    setEditing({ ...editing, popular: e.target.value === 'yes' })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-500 outline-none text-slate-900"
                >
                  <option value="no">Standard Tier</option>
                  <option value="yes">Most Popular (Highlighted)</option>
                </select>
              </div>
            </div>

            {/* Checklist of Tasks */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                Included Wash Tasks ({editing.includedTasks.length}):
              </label>

              <div className="flex items-center space-x-2 mb-2.5">
                <input
                  type="text"
                  placeholder="e.g. Dashboard UV polish"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 text-xs"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {editing.includedTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                  >
                    <span className="truncate pr-2">✓ {task}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Vehicle Pricing Matrix */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <label className="block font-bold text-slate-900 text-sm mb-1">
                Segment-Wise Pricing Matrix (₹ INR)
              </label>
              <p className="text-slate-500 text-xs mb-3">
                Prices shown on customer website when user selects their car segment.
              </p>

              <div className="space-y-3">
                {SEGMENTS.map((seg) => {
                  const currentPrice = editing.vehiclePricing[seg.id] ?? 0;
                  return (
                    <div
                      key={seg.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{seg.label}</div>
                        <div className="text-[10px] text-slate-400">{seg.examples}</div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-slate-600 text-sm">₹</span>
                        <input
                          type="text"
                          value={currentPrice}
                          onChange={(e) => handlePriceChange(seg.id, e.target.value)}
                          className="w-24 px-2 py-1.5 text-right font-mono font-black text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-500 text-slate-900"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Package prices updated and live on website!</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
