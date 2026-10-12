'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  UserCheck, 
  Truck, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  X,
  MessageCircle,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Eye,
  FileText,
  CheckCircle,
  Sparkle
} from 'lucide-react';
import { Booking, BookingStatus, JrAdmin } from '@/types';
import AssignJrAdminModal from './AssignJrAdminModal';
import JrAdminFieldModal from './JrAdminFieldModal';
import { useNotificationStore } from '@/lib/store/notificationStore';

interface AdminOrdersTabProps {
  bookings: Booking[];
  jrAdmins: JrAdmin[];
  onOrderUpdated: (updatedBooking: Booking) => void;
}

export default function AdminOrdersTab({
  bookings,
  jrAdmins,
  onOrderUpdated,
}: AdminOrdersTabProps) {
  const { addToast } = useNotificationStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assignModalBooking, setAssignModalBooking] = useState<Booking | null>(null);
  const [fieldSimulatorBooking, setFieldSimulatorBooking] = useState<Booking | null>(null);
  const [selectedDetailsBooking, setSelectedDetailsBooking] = useState<Booking | null>(null);

  // WhatsApp Forwarding modal state
  const [forwardModalBooking, setForwardModalBooking] = useState<Booking | null>(null);
  const [forwardPhone, setForwardPhone] = useState<string>('9685232340');
  const [copied, setCopied] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Full date & time formatter
  const formatFullDateTime = (isoString?: string) => {
    if (!isoString) return 'Not available';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Accept and Confirm booking
  const handleAcceptOrder = async (booking: Booking) => {
    setActionLoadingId(booking.bookingId);
    try {
      const res = await fetch('/api/admin/orders/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept',
          bookingId: booking.bookingId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.booking) {
        onOrderUpdated(data.booking);
        addToast({
          title: 'Order Confirmed & Accepted',
          message: `Booking #${booking.bookingId} (${booking.customer.name}) is accepted! Please assign a wash expert.`,
          type: 'success',
        });
        // Prompt to assign Jr Admin immediately
        setAssignModalBooking(data.booking);
      } else {
        alert(data.message || 'Failed to accept order.');
      }
    } catch (err: any) {
      alert(err.message || 'Network error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Status filtering
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.bookingId.toLowerCase().includes(q) ||
      b.customer.name.toLowerCase().includes(q) ||
      b.customer.phone.includes(q) ||
      b.vehicle.make.toLowerCase().includes(q) ||
      b.vehicle.model.toLowerCase().includes(q) ||
      (b.assignedTechnician?.name && b.assignedTechnician.name.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pending') return b.status === 'pending';
    if (selectedFilter === 'confirmed') return b.status === 'confirmed';
    if (selectedFilter === 'en_route') return b.status === 'en_route';
    if (selectedFilter === 'arrived') return b.status === 'arrived';
    if (selectedFilter === 'in_progress') return b.status === 'in_progress';
    if (selectedFilter === 'completed') return b.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Intake',
          class: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
        };
      case 'confirmed':
        return {
          label: 'Confirmed & Assigned',
          class: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
        };
      case 'en_route':
        return {
          label: 'On My Way (En Route)',
          class: 'bg-cyan-100 text-cyan-800 border-cyan-300 font-bold animate-pulse',
        };
      case 'arrived':
        return {
          label: 'Arrived (Awaiting OTP)',
          class: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
        };
      case 'in_progress':
        return {
          label: 'Washing In Progress',
          class: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
        };
      case 'completed':
        return {
          label: 'Completed & Paid',
          class: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          class: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
        };
      default:
        return {
          label: status,
          class: 'bg-slate-100 text-slate-800 border-slate-300',
        };
    }
  };

  const constructForwardText = (b: Booking): string => {
    return `*🚗 नई कार वॉश बुकिंग विवरण - इंदौर हब*
*बुकिंग आईडी:* ${b.bookingId}
*ग्राहक:* ${b.customer.name}
*फ़ोन:* ${b.customer.phone}
*वाहन:* ${b.vehicle.make} ${b.vehicle.model} (${b.vehicle.segment.toUpperCase()})
*सेवा:* ${b.service.name}
*दिनांक व समय:* ${b.scheduledDate} (${b.timeSlot})
*पता:* ${b.address.street}, ${b.address.city} - ${b.address.pincode}
*कुल राशि:* ₹${b.totalAmount} (${b.paymentMethod.toUpperCase()})
*वॉश स्टार्ट OTP:* ${b.startOtp || '1234'}
*असाइन वाश एक्सपर्ट:* ${b.assignedTechnician?.name || 'लंबित'} (${b.assignedTechnician?.vehicleNo || 'वैन'})
--------------------------------
डोरस्टेप कार वॉश ऑपरेशन्स टीम`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders', count: bookings.length },
            {
              id: 'pending',
              label: 'Pending Review',
              count: bookings.filter((b) => b.status === 'pending').length,
              color: 'text-amber-600',
            },
            {
              id: 'confirmed',
              label: 'Confirmed',
              count: bookings.filter((b) => b.status === 'confirmed').length,
            },
            {
              id: 'en_route',
              label: 'On Way',
              count: bookings.filter((b) => b.status === 'en_route').length,
            },
            {
              id: 'arrived',
              label: 'Arrived',
              count: bookings.filter((b) => b.status === 'arrived').length,
            },
            {
              id: 'in_progress',
              label: 'Washing',
              count: bookings.filter((b) => b.status === 'in_progress').length,
            },
            {
              id: 'completed',
              label: 'Completed',
              count: bookings.filter((b) => b.status === 'completed').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedFilter === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, customer, phone, car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No orders match current criteria</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try choosing &quot;All Orders&quot; or clearing your search keywords.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const badge = getStatusBadge(b.status);
            const isPending = b.status === 'pending';
            const isConfirmed = b.status === 'confirmed';
            const isAssigned = !!b.assignedTechnician;

            return (
              <div
                key={b.bookingId}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:shadow-sm ${
                  isPending ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                }`}
              >
                {/* Row 1: Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      #{b.bookingId}
                    </span>
                    <span className={`text-[11px] uppercase px-2.5 py-1 rounded-full border ${badge.class}`}>
                      {badge.label}
                    </span>

                    {/* Customer OTP badge */}
                    {b.startOtp && (
                      <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        <span>Customer Start OTP: <strong className="text-amber-900">{b.startOtp}</strong></span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-slate-500">Placed:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatFullDateTime(b.createdAt)}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedDetailsBooking(b)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center space-x-1 transition-all"
                      title="View Complete Order Details &amp; Lifecycle"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <span className="text-base font-black text-slate-900 ml-1">
                      ₹{b.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Row 2: Customer, Vehicle & Service Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3.5 text-xs">
                  {/* Customer */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Customer &amp; Contact
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{b.customer.name}</div>
                    <div className="text-slate-600 flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.customer.phone}</span>
                    </div>
                    <div className="text-slate-500 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{b.address.street}, {b.address.city} - {b.address.pincode}</span>
                    </div>
                  </div>

                  {/* Vehicle & Schedule */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Vehicle &amp; Schedule
                    </div>
                    <div className="font-bold text-slate-800">
                      🚗 {b.vehicle.make} {b.vehicle.model}{' '}
                      <span className="text-[10px] uppercase font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {b.vehicle.segment}
                      </span>
                    </div>
                    <div className="text-slate-600 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.scheduledDate}</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400 ml-2" />
                      <span>{b.timeSlot}</span>
                    </div>
                    <div className="text-blue-700 font-semibold truncate">
                      {b.service.name}
                    </div>
                  </div>

                  {/* Wash Expert / Dispatch Status */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Assigned Wash Expert</span>
                      {b.assignedTechnician && (
                        <span className="text-emerald-700 font-bold">Verified</span>
                      )}
                    </div>

                    {b.assignedTechnician ? (
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center space-x-1">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          <span>{b.assignedTechnician.name}</span>
                        </div>
                        <div className="text-slate-600 text-[11px] mt-0.5">
                          📞 {b.assignedTechnician.phone}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center space-x-1">
                          <Truck className="w-3 h-3 text-slate-400" />
                          <span>{b.assignedTechnician.vehicleNo}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs py-1">
                        ⚠️ No expert assigned yet. Review &amp; select Jr Admin from fleet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {/* WhatsApp Forward */}
                    <button
                      onClick={() => setForwardModalBooking(b)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Forward WhatsApp</span>
                    </button>

                    {/* Simulator Button */}
                    <button
                      onClick={() => setFieldSimulatorBooking(b)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Field Task Simulator</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* If pending: Review and Confirm Button */}
                    {isPending && (
                      <button
                        onClick={() => handleAcceptOrder(b)}
                        disabled={actionLoadingId === b.bookingId}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-98"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {actionLoadingId === b.bookingId ? 'Confirming...' : 'Review & Confirm Order'}
                        </span>
                      </button>
                    )}

                    {/* If confirmed or needs reassign: Assign Jr Admin */}
                    <button
                      onClick={() => setAssignModalBooking(b)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm active:scale-98 ${
                        !b.assignedTechnician
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                          : 'border border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{b.assignedTechnician ? 'Reassign Expert' : 'Assign Wash Expert'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Jr Admin Modal */}
      {assignModalBooking && (
        <AssignJrAdminModal
          booking={assignModalBooking}
          jrAdmins={jrAdmins}
          onClose={() => setAssignModalBooking(null)}
          onAssigned={(updated) => {
            onOrderUpdated(updated);
            setAssignModalBooking(null);
          }}
        />
      )}

      {/* Field Simulator Modal */}
      {fieldSimulatorBooking && (
        <JrAdminFieldModal
          booking={fieldSimulatorBooking}
          onClose={() => setFieldSimulatorBooking(null)}
          onStatusUpdated={(updated) => {
            onOrderUpdated(updated);
          }}
        />
      )}

      {/* Forward Booking via WhatsApp Modal */}
      {forwardModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Forward Order via WhatsApp</h3>
                  <p className="text-xs text-slate-500">Order #{forwardModalBooking.bookingId}</p>
                </div>
              </div>
              <button
                onClick={() => setForwardModalBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient WhatsApp Number:
                </label>
                <input
                  type="text"
                  value={forwardPhone}
                  onChange={(e) => setForwardPhone(e.target.value)}
                  placeholder="e.g. 9685232340"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message Preview:
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto text-slate-800">
                  {constructForwardText(forwardModalBooking)}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(constructForwardText(forwardModalBooking));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <a
                  href={`https://wa.me/${forwardPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    constructForwardText(forwardModalBooking)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open WhatsApp Web</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Order Details Modal */}
      {selectedDetailsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-slate-900">
                      Order #{selectedDetailsBooking.bookingId}
                    </h3>
                    <span
                      className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                        getStatusBadge(selectedDetailsBooking.status).class
                      }`}
                    >
                      {getStatusBadge(selectedDetailsBooking.status).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete booking telemetry, schedule &amp; field assignment details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailsBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-5 text-xs">
              {/* Prominent Timestamp & Lifecycle Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-800">
                      📅 Exact Order Placed Date &amp; Time:
                    </span>
                    <div className="font-mono text-sm font-black text-blue-950">
                      {formatFullDateTime(selectedDetailsBooking.createdAt)}
                    </div>
                    <span className="text-[10px] text-blue-700 font-medium">
                      ISO: {selectedDetailsBooking.createdAt}
                    </span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xs px-3 py-2 rounded-xl border border-blue-200 text-right">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Scheduled Service Slot
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {selectedDetailsBooking.scheduledDate} ({selectedDetailsBooking.timeSlot})
                    </span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-blue-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">1. ORDER LOGGED</span>
                    <span className="font-mono font-bold text-slate-700">
                      {new Date(selectedDetailsBooking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">2. CONFIRMED</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedDetailsBooking.acceptedAt
                        ? new Date(selectedDetailsBooking.acceptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Confirmed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">3. EXPERT ASSIGNED</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedDetailsBooking.assignedAt
                        ? new Date(selectedDetailsBooking.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : selectedDetailsBooking.assignedTechnician ? 'Assigned' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">4. WASH COMPLETED</span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedDetailsBooking.completedAt
                        ? new Date(selectedDetailsBooking.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : selectedDetailsBooking.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Customer Information
                  </span>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900">
                      {selectedDetailsBooking.customer.name}
                    </div>
                    <div className="text-slate-600 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-bold">{selectedDetailsBooking.customer.phone}</span>
                    </div>
                    <div className="text-slate-600 flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        {selectedDetailsBooking.address.street}, {selectedDetailsBooking.address.city} - {selectedDetailsBooking.address.pincode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Service */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Vehicle &amp; Wash Service
                  </span>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>🚗 {selectedDetailsBooking.vehicle.make} {selectedDetailsBooking.vehicle.model}</span>
                      <span className="text-[10px] uppercase font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                        {selectedDetailsBooking.vehicle.segment}
                      </span>
                    </div>
                    <div className="text-blue-700 font-bold text-xs">
                      {selectedDetailsBooking.service.name}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Bill Amount:</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        ₹{selectedDetailsBooking.totalAmount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Payment Method:</span>
                      <span className="font-bold text-slate-700 uppercase">
                        {selectedDetailsBooking.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Water & Electricity:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <span>⚡💧 Confirmed Yes</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start OTP & Assigned Expert row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* OTP Security */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-amber-800 font-black text-xs">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>Customer Security Start OTP</span>
                  </div>
                  <div className="text-2xl font-black font-mono tracking-widest text-amber-950 py-1">
                    {selectedDetailsBooking.startOtp || '1234'}
                  </div>
                  <p className="text-[10px] text-amber-800">
                    Technician must ask customer for this 4-digit code upon van arrival to start washing.
                  </p>
                </div>

                {/* Wash Expert */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Assigned Doorstep Expert
                    </span>
                    {selectedDetailsBooking.assignedTechnician && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Dispatched
                      </span>
                    )}
                  </div>
                  {selectedDetailsBooking.assignedTechnician ? (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        <span>{selectedDetailsBooking.assignedTechnician.name}</span>
                      </div>
                      <div className="text-slate-600 text-xs">
                        📞 {selectedDetailsBooking.assignedTechnician.phone}
                      </div>
                      <div className="text-slate-600 text-[11px] font-mono">
                        🚐 {selectedDetailsBooking.assignedTechnician.vehicleNo}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-slate-500 italic">
                      No wash expert assigned yet. Please assign from fleet.
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setForwardModalBooking(selectedDetailsBooking);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Forward WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      setFieldSimulatorBooking(selectedDetailsBooking);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center space-x-1.5"
                  >
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Test in Field App</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setAssignModalBooking(selectedDetailsBooking);
                      setSelectedDetailsBooking(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                  >
                    {selectedDetailsBooking.assignedTechnician ? 'Reassign Expert' : 'Assign Expert'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDetailsBooking(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
