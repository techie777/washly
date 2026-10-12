'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Car, 
  MessageCircle, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Booking } from '@/types';

interface CustomerRecord {
  phone: string;
  name: string;
  email: string;
  city: string;
  address: string;
  totalBookings: number;
  lifetimeSpend: number;
  lastBookingDate: string;
  lastService: string;
  vehicles: string[];
}

interface AdminCustomersTabProps {
  bookings: Booking[];
}

export default function AdminCustomersTab({ bookings }: AdminCustomersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate unique customers
  const customers = useMemo(() => {
    const map = new Map<string, CustomerRecord>();

    bookings.forEach((b) => {
      const cleanPhone = (b.customer?.phone || '').replace(/\D/g, '').slice(-10);
      if (!cleanPhone) return;
      const existing = map.get(cleanPhone);

      const vehicleLabel = `${b.vehicle.make} ${b.vehicle.model}`;

      if (existing) {
        existing.totalBookings += 1;
        existing.lifetimeSpend += b.totalAmount;
        if (new Date(b.createdAt) > new Date(existing.lastBookingDate)) {
          existing.lastBookingDate = b.scheduledDate || b.createdAt;
          existing.lastService = b.service.name;
        }
        if (!existing.vehicles.includes(vehicleLabel)) {
          existing.vehicles.push(vehicleLabel);
        }
        if (!existing.email && b.customer.email) {
          existing.email = b.customer.email;
        }
      } else {
        map.set(cleanPhone, {
          phone: cleanPhone,
          name: b.customer.name,
          email: b.customer.email || '',
          city: b.address.city,
          address: `${b.address.street}, ${b.address.city}`,
          totalBookings: 1,
          lifetimeSpend: b.totalAmount,
          lastBookingDate: b.scheduledDate || b.createdAt,
          lastService: b.service.name,
          vehicles: [vehicleLabel],
        });
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      c.vehicles.some((v) => v.toLowerCase().includes(q))
    );
  });

  const totalSpend = customers.reduce((sum, c) => sum + c.lifetimeSpend, 0);
  const repeatCustomers = customers.filter((c) => c.totalBookings > 1).length;
  const avgLtv = customers.length > 0 ? Math.round(totalSpend / customers.length) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Total Customers
          </div>
          <div className="text-2xl font-black text-slate-900">{customers.length}</div>
          <div className="text-xs text-slate-500 mt-1">Direct doorstep car wash clients</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Repeat Customers
          </div>
          <div className="text-2xl font-black text-blue-600">{repeatCustomers}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>High retention rate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Avg Lifetime Value (LTV)
          </div>
          <div className="text-2xl font-black text-slate-900">₹{avgLtv.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-500 mt-1">Per unique customer account</div>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Customer Directory</h3>
          <p className="text-xs text-slate-500">
            Verified contact details, registered vehicles, and spend history
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, address, car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Customers Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Vehicles</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Last Service</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No customers found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.phone} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{c.city}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-mono font-bold flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                      {c.email && (
                        <div className="text-slate-400 text-[11px] truncate max-w-[160px]">
                          {c.email}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {c.vehicles.map((v, i) => (
                          <span
                            key={i}
                            className="inline-block bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px] mr-1"
                          >
                            🚗 {v}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {c.totalBookings} Booking{c.totalBookings > 1 ? 's' : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                      ₹{c.lifetimeSpend.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-semibold truncate max-w-[140px]">
                        {c.lastService}
                      </div>
                      <div className="text-slate-400 text-[10px]">{c.lastBookingDate}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
