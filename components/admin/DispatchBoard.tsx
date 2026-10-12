'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Car, 
  Bike, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  Search, 
  User, 
  Phone, 
  AlertCircle,
  Sparkles,
  MessageCircle,
  Share2,
  Copy,
  Check,
  ExternalLink,
  X
} from 'lucide-react';
import { Booking, BookingStatus } from '@/types';
import { SERVICEABLE_CITIES } from '@/lib/seedData';

interface DispatchBoardProps {
  initialBookings: Booking[];
}

const COLUMNS: Array<{ id: BookingStatus; label: string; badgeColor: string }> = [
  { id: 'pending', label: 'Pending Intake', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'confirmed', label: 'Confirmed & Assigned', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'en_route', label: 'Van En Route', badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'in_progress', label: 'Washing In Progress', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'completed', label: 'Completed & Verified', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export default function DispatchBoard({ initialBookings }: DispatchBoardProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  // Rest of the cities hidden in admin panel as operations are currently focused in Indore
  const [selectedCity, setSelectedCity] = useState<string>('Indore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // WhatsApp Forwarding Modal State
  const [forwardModalBooking, setForwardModalBooking] = useState<Booking | null>(null);
  const [forwardPhone, setForwardPhone] = useState<string>('9685232340');
  const [copied, setCopied] = useState(false);

  const handleUpdateStatus = async (bookingId: string, nextStatus: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.bookingId === bookingId ? data.booking : b))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStatus = (current: BookingStatus): BookingStatus | null => {
    switch (current) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'en_route';
      case 'en_route': return 'in_progress';
      case 'in_progress': return 'completed';
      default: return null;
    }
  };

  const getNextButtonLabel = (current: BookingStatus): string => {
    switch (current) {
      case 'pending': return 'Confirm & Assign';
      case 'confirmed': return 'Dispatch Van';
      case 'en_route': return 'Start Wash';
      case 'in_progress': return 'Complete Wash';
      default: return 'Done';
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesCity = selectedCity === 'all' || b.address.city.toLowerCase() === selectedCity.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      !query ||
      b.bookingId.toLowerCase().includes(query) ||
      b.customer.name.toLowerCase().includes(query) ||
      b.customer.phone.includes(query) ||
      b.vehicle.make.toLowerCase().includes(query) ||
      b.vehicle.model.toLowerCase().includes(query);

    return matchesCity && matchesQuery;
  });

  return (
    <div>
      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-500 shrink-0">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="font-bold uppercase tracking-wider">City Hub:</span>
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:outline-none cursor-pointer"
          >
            {/* Rest of the cities hidden in admin panel per operating scope */}
            {SERVICEABLE_CITIES.filter(c => c.city.toLowerCase() === 'indore').map((c) => (
              <option key={c.slug} value={c.city}>
                {c.city} Hub (Active Operations)
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ID, client, vehicle..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {COLUMNS.map((col) => {
          const colBookings = filteredBookings.filter((b) => b.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 flex flex-col h-[calc(100vh-280px)] min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${col.badgeColor}`}>
                  {colBookings.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                {colBookings.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 italic">
                    No active slots
                  </div>
                ) : (
                  colBookings.map((b) => {
                    const nextStatus = getNextStatus(b.status);

                    return (
                      <div
                        key={b.bookingId}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 transition-all space-y-2.5 shadow-xs"
                      >
                        {/* ID & Amount */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-blue-600">
                            {b.bookingId}
                          </span>
                          <span className="text-xs font-mono font-black text-slate-900">
                            ₹{b.totalAmount}
                          </span>
                        </div>

                        {/* Customer */}
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {b.customer.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {b.customer.phone}
                          </div>
                        </div>

                        {/* Vehicle */}
                        <div className="flex items-center space-x-1.5 text-xs text-slate-700">
                          {b.vehicle.type === 'car' ? (
                            <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          ) : (
                            <Bike className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                          <span className="truncate font-medium">
                            {b.vehicle.make} {b.vehicle.model}
                          </span>
                        </div>

                        {/* Service & Slot */}
                        <div className="text-[11px] text-slate-600 font-medium line-clamp-1">
                          {b.service.name}
                        </div>

                        <div className="text-[10px] text-blue-700 font-semibold flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{b.scheduledDate} • {b.timeSlot}</span>
                        </div>

                        {/* Address */}
                        <div className="text-[10px] text-slate-600 flex items-start space-x-1 pt-1 border-t border-slate-100">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{b.address.street}, {b.address.city}</span>
                        </div>

                        {/* Technician info if assigned */}
                        {b.assignedTechnician && (
                          <div className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200 p-1.5 rounded-lg">
                            Van: <span className="text-slate-900 font-mono font-bold">{b.assignedTechnician.vehicleNo}</span>
                          </div>
                        )}

                        {/* WhatsApp Forward Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setForwardModalBooking(b);
                            setForwardPhone(b.assignedTechnician?.phone ? b.assignedTechnician.phone.replace(/\D/g, '') : '9685232340');
                            setCopied(false);
                          }}
                          className="w-full py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] flex items-center justify-center space-x-1.5 transition-colors mt-2 shadow-2xs"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>Forward to WhatsApp</span>
                        </button>

                        {/* Action Buttons */}
                        {nextStatus && (
                          <button
                            onClick={() => handleUpdateStatus(b.bookingId, nextStatus)}
                            disabled={updatingId === b.bookingId}
                            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1.5 hover:scale-[1.02] transition-all disabled:opacity-50 mt-2 shadow-2xs"
                          >
                            <span>{getNextButtonLabel(b.status)}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Admin WhatsApp Forwarding Modal */}
      {forwardModalBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-slate-200 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setForwardModalBooking(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Forward Order via WhatsApp Web
                </h3>
                <p className="text-xs text-slate-500">
                  Booking ID: <span className="font-mono font-bold text-blue-600">{forwardModalBooking.bookingId}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Recipient WhatsApp Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={forwardPhone}
                    onChange={(e) => setForwardPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9685232340"
                    className="flex-grow px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const clean = forwardPhone.replace(/\D/g, '');
                      const target = clean.length === 10 ? `91${clean}` : clean;
                      const text = 
                        `🚗 *DOORSTEP CAR WASH DISPATCH SLIP* 🚗\n` +
                        `----------------------------------------\n` +
                        `📋 *Booking ID:* ${forwardModalBooking.bookingId}\n` +
                        `👤 *Customer Name:* ${forwardModalBooking.customer.name}\n` +
                        `📞 *Customer Phone:* ${forwardModalBooking.customer.phone}\n` +
                        `🚘 *Vehicle:* ${forwardModalBooking.vehicle.make} ${forwardModalBooking.vehicle.model} (${forwardModalBooking.vehicle.segment.replace('_', ' ').toUpperCase()}) ${forwardModalBooking.vehicle.plateNumber ? `[${forwardModalBooking.vehicle.plateNumber}]` : ''}\n` +
                        `📦 *Package:* ${forwardModalBooking.service.name}\n` +
                        `📅 *Date:* ${forwardModalBooking.scheduledDate} (${forwardModalBooking.timeSlot})\n` +
                        `📍 *Address:* ${forwardModalBooking.address.street}${forwardModalBooking.address.landmark ? ', ' + forwardModalBooking.address.landmark : ''}, Indore - ${forwardModalBooking.address.pincode}\n` +
                        `💰 *Amount:* ₹${forwardModalBooking.totalAmount} (${forwardModalBooking.paymentMethod === 'cod' ? 'Cash/UPI on Inspection' : 'Paid'})\n` +
                        `${forwardModalBooking.notes ? `📝 *Notes:* ${forwardModalBooking.notes}\n` : ''}` +
                        `----------------------------------------\n` +
                        `📍 *Doorstep Operations Hub Indore*`;
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setForwardPhone('9685232340')}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium hover:bg-blue-100"
                  >
                    Van Driver 1 (9685232340)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForwardPhone('9685232341')}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium hover:bg-blue-100"
                  >
                    Van Driver 2 (9685232341)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForwardPhone(forwardModalBooking.customer.phone.replace(/\D/g, ''))}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium hover:bg-slate-200"
                  >
                    Customer ({forwardModalBooking.customer.phone})
                  </button>
                </div>
              </div>

              {/* Message Preview Box */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Message Slip Preview:
                </label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px] leading-relaxed max-h-44 overflow-y-auto whitespace-pre-wrap">
                  {`🚗 *DOORSTEP CAR WASH DISPATCH SLIP* 🚗\n` +
                    `----------------------------------------\n` +
                    `📋 *Booking ID:* ${forwardModalBooking.bookingId}\n` +
                    `👤 *Customer Name:* ${forwardModalBooking.customer.name}\n` +
                    `📞 *Customer Phone:* ${forwardModalBooking.customer.phone}\n` +
                    `🚘 *Vehicle:* ${forwardModalBooking.vehicle.make} ${forwardModalBooking.vehicle.model} (${forwardModalBooking.vehicle.segment.replace('_', ' ').toUpperCase()})\n` +
                    `📦 *Package:* ${forwardModalBooking.service.name}\n` +
                    `📅 *Date:* ${forwardModalBooking.scheduledDate} (${forwardModalBooking.timeSlot})\n` +
                    `📍 *Address:* ${forwardModalBooking.address.street}, Indore - ${forwardModalBooking.address.pincode}\n` +
                    `💰 *Amount:* ₹${forwardModalBooking.totalAmount}`}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  const clean = forwardPhone.replace(/\D/g, '');
                  const target = clean.length === 10 ? `91${clean}` : clean;
                  const text = 
                    `🚗 *DOORSTEP CAR WASH DISPATCH SLIP* 🚗\n` +
                    `----------------------------------------\n` +
                    `📋 *Booking ID:* ${forwardModalBooking.bookingId}\n` +
                    `👤 *Customer Name:* ${forwardModalBooking.customer.name}\n` +
                    `📞 *Customer Phone:* ${forwardModalBooking.customer.phone}\n` +
                    `🚘 *Vehicle:* ${forwardModalBooking.vehicle.make} ${forwardModalBooking.vehicle.model} (${forwardModalBooking.vehicle.segment.replace('_', ' ').toUpperCase()}) ${forwardModalBooking.vehicle.plateNumber ? `[${forwardModalBooking.vehicle.plateNumber}]` : ''}\n` +
                    `📦 *Package:* ${forwardModalBooking.service.name}\n` +
                    `📅 *Scheduled Date:* ${forwardModalBooking.scheduledDate}\n` +
                    `⏰ *Arrival Window:* ${forwardModalBooking.timeSlot}\n` +
                    `📍 *Address:* ${forwardModalBooking.address.street}${forwardModalBooking.address.landmark ? ', ' + forwardModalBooking.address.landmark : ''}, Indore - ${forwardModalBooking.address.pincode}\n` +
                    `💰 *Amount:* ₹${forwardModalBooking.totalAmount} (${forwardModalBooking.paymentMethod === 'cod' ? 'Cash/UPI on Inspection' : 'Paid'})\n` +
                    `${forwardModalBooking.notes ? `📝 *Notes:* ${forwardModalBooking.notes}\n` : ''}` +
                    `----------------------------------------\n` +
                    `📍 *Doorstep Operations Hub Indore*`;
                  window.open(`https://web.whatsapp.com/send?phone=${target}&text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full sm:w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open WhatsApp Web</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const clean = forwardPhone.replace(/\D/g, '');
                  const target = clean.length === 10 ? `91${clean}` : clean;
                  const text = 
                    `🚗 *DOORSTEP CAR WASH DISPATCH SLIP* 🚗\n` +
                    `----------------------------------------\n` +
                    `📋 *Booking ID:* ${forwardModalBooking.bookingId}\n` +
                    `👤 *Customer Name:* ${forwardModalBooking.customer.name}\n` +
                    `📞 *Customer Phone:* ${forwardModalBooking.customer.phone}\n` +
                    `🚘 *Vehicle:* ${forwardModalBooking.vehicle.make} ${forwardModalBooking.vehicle.model} (${forwardModalBooking.vehicle.segment.replace('_', ' ').toUpperCase()}) ${forwardModalBooking.vehicle.plateNumber ? `[${forwardModalBooking.vehicle.plateNumber}]` : ''}\n` +
                    `📦 *Package:* ${forwardModalBooking.service.name}\n` +
                    `📅 *Scheduled Date:* ${forwardModalBooking.scheduledDate}\n` +
                    `⏰ *Arrival Window:* ${forwardModalBooking.timeSlot}\n` +
                    `📍 *Address:* ${forwardModalBooking.address.street}${forwardModalBooking.address.landmark ? ', ' + forwardModalBooking.address.landmark : ''}, Indore - ${forwardModalBooking.address.pincode}\n` +
                    `💰 *Amount:* ₹${forwardModalBooking.totalAmount} (${forwardModalBooking.paymentMethod === 'cod' ? 'Cash/UPI on Inspection' : 'Paid'})\n` +
                    `${forwardModalBooking.notes ? `📝 *Notes:* ${forwardModalBooking.notes}\n` : ''}` +
                    `----------------------------------------\n` +
                    `📍 *Doorstep Operations Hub Indore*`;
                  window.open(`https://wa.me/${target}?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full sm:w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mobile WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
