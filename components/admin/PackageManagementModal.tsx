'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Settings, 
  X, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import { ServicePackage, VehicleSegment } from '@/types';
import { LUXURY_SERVICES } from '@/lib/seedData';

export default function PackageManagementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<ServicePackage[]>(LUXURY_SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(LUXURY_SERVICES[0].id);
  const [editingService, setEditingService] = useState<ServicePackage>(LUXURY_SERVICES[0]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');

  // Load packages from server on open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/services')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
            const found = data.services.find((s: ServicePackage) => s.id === selectedServiceId) || data.services[0];
            setSelectedServiceId(found.id);
            setEditingService(JSON.parse(JSON.stringify(found)));
          }
        })
        .catch((err) => console.warn('Could not fetch services:', err));
    }
  }, [isOpen, selectedServiceId]);

  const handleSelectPackage = (id: string) => {
    setSelectedServiceId(id);
    const found = services.find((s) => s.id === id);
    if (found) {
      setEditingService(JSON.parse(JSON.stringify(found)));
      setSaveSuccess(false);
      setError(null);
    }
  };

  const handlePriceChange = (segment: VehicleSegment, val: string) => {
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setEditingService((prev) => ({
      ...prev,
      vehiclePricing: {
        ...prev.vehiclePricing,
        [segment]: num,
      },
    }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setEditingService((prev) => ({
      ...prev,
      includedTasks: [...prev.includedTasks, newTask.trim()],
    }));
    setNewTask('');
  };

  const handleRemoveTask = (index: number) => {
    setEditingService((prev) => ({
      ...prev,
      includedTasks: prev.includedTasks.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update package');
      }

      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? data.service : s))
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-xs"
      >
        <Sliders className="w-3.5 h-3.5 text-blue-600" />
        <span>Manage Wash Packages</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Wash Packages & Pricing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Changes here immediately sync with the customer booking page.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with 2-Column layout */}
            <div className="flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {/* Left Column: Package Tabs */}
              <div className="md:col-span-4 p-4 space-y-2 bg-slate-50/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-1">
                  Select Package to Edit:
                </span>
                {services.map((s) => {
                  const isSelected = s.id === selectedServiceId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectPackage(s.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{s.name}</span>
                        {s.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase font-semibold">
                            {s.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 font-mono">
                        ⏱ {s.durationMinutes} mins • Hatchback: ₹{s.vehiclePricing.hatchback || 150}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Edit Form */}
              <form onSubmit={handleSave} className="md:col-span-8 p-6 space-y-5">
                {saveSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-700 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Wash package updated successfully and published to booking flow!</span>
                  </div>
                )}

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2 text-xs text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Package Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Package Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingService.name}
                      onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Duration (Minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={180}
                      value={editingService.durationMinutes}
                      onChange={(e) => setEditingService({ ...editingService, durationMinutes: parseInt(e.target.value, 10) || 30 })}
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingService.tagline}
                    onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Marketing Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingService.badge || ''}
                      placeholder="e.g. Popular / Budget Friendly / Best Value"
                      onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      disabled
                      value={editingService.category.toUpperCase()}
                      className="w-full px-3.5 py-2 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-500 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                {/* Segment Pricing Grid */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                    <span>Calibrated Pricing Per Vehicle Segment (₹ INR)</span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Hatchback (₹)
                      </label>
                      <input
                        type="number"
                        value={editingService.vehiclePricing.hatchback || ''}
                        onChange={(e) => handlePriceChange('hatchback', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Sedan (₹)
                      </label>
                      <input
                        type="number"
                        value={editingService.vehiclePricing.sedan || ''}
                        onChange={(e) => handlePriceChange('sedan', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Compact SUV (₹)
                      </label>
                      <input
                        type="number"
                        value={editingService.vehiclePricing.compact_suv || ''}
                        onChange={(e) => handlePriceChange('compact_suv', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Full-Size SUV (₹)
                      </label>
                      <input
                        type="number"
                        value={editingService.vehiclePricing.suv || ''}
                        onChange={(e) => handlePriceChange('suv', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Luxury / Sports (₹)
                      </label>
                      <input
                        type="number"
                        value={editingService.vehiclePricing.luxury || ''}
                        onChange={(e) => handlePriceChange('luxury', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Bike / Commuter (₹)
                      </label>
                      <input
                        type="number"
                        value={editingService.vehiclePricing.commuter || ''}
                        onChange={(e) => handlePriceChange('commuter', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Included Tasks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Included Tasks / Service Features
                  </label>

                  <div className="space-y-1.5 mb-3 max-h-36 overflow-y-auto">
                    {editingService.includedTasks.map((task, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
                        <span className="truncate pr-2">{task}</span>
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

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="e.g. Free dashboard conditioning wipe"
                      className="flex-grow px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTask();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTask}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Package Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
