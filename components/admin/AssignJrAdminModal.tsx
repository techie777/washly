'use client';

import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Truck, 
  Phone, 
  Star, 
  Check, 
  AlertCircle,
  Sparkles,
  Shield
} from 'lucide-react';
import { Booking, JrAdmin } from '@/types';

interface AssignJrAdminModalProps {
  booking: Booking;
  jrAdmins: JrAdmin[];
  onClose: () => void;
  onAssigned: (updatedBooking: Booking) => void;
}

export default function AssignJrAdminModal({
  booking,
  jrAdmins,
  onClose,
  onAssigned,
}: AssignJrAdminModalProps) {
  const [selectedJrId, setSelectedJrId] = useState<string>(
    booking.assignedTechnician?.id || (jrAdmins.length > 0 ? jrAdmins[0].id : '')
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!selectedJrId) {
      setError('Please choose a Wash Expert / Jr Admin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/orders/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign',
          bookingId: booking.bookingId,
          jrAdminId: selectedJrId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to assign Jr Admin');
        return;
      }

      onAssigned(data.booking);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const selectedExpert = jrAdmins.find((j) => j.id === selectedJrId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Assign Wash Expert (Jr Admin)</h3>
              <p className="text-xs text-blue-100">Order #{booking.bookingId} • {booking.customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-800 space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-blue-900">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Automatic Dispatch Notification</span>
            </div>
            <p>
              Once you confirm assignment, the customer will instantly receive a notification with the Jr Admin&apos;s name ({selectedExpert?.name || 'Expert'}), phone, mobile van details, and their secure Start OTP.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Available Jr Admin from Fleet ({jrAdmins.length} registered):
            </label>

            {jrAdmins.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
                No Jr Admins found. Please create one in the &quot;Jr Admins&quot; tab first.
              </div>
            ) : (
              <div className="space-y-2">
                {jrAdmins.map((jr) => {
                  const isSelected = selectedJrId === jr.id;
                  const isBusy = jr.status === 'busy';
                  return (
                    <div
                      key={jr.id}
                      onClick={() => setSelectedJrId(jr.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {jr.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{jr.name}</span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                isBusy
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isBusy ? 'On Task' : 'Available'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{jr.phone}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1 font-mono text-slate-600">
                              <Truck className="w-3 h-3 text-slate-400" />
                              <span>{jr.vehicleNo}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="text-right">
                          <div className="flex items-center text-amber-500 text-xs font-bold">
                            <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                            <span>{jr.rating}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{jr.totalJobs || 0} jobs</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={loading || !selectedJrId}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-98"
          >
            <UserCheck className="w-4 h-4" />
            <span>{loading ? 'Assigning...' : 'Confirm & Notify Customer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
