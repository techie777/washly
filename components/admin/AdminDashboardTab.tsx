'use client';

import React from 'react';
import { 
  DollarSign, 
  Truck, 
  CheckCircle2, 
  Droplets, 
  Star, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  UserCheck, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Booking, JrAdmin } from '@/types';
import { AdminTab } from './AdminSidebar';

interface AdminDashboardTabProps {
  bookings: Booking[];
  jrAdmins: JrAdmin[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenFieldSimulator: (booking: Booking) => void;
}

export default function AdminDashboardTab({
  bookings,
  jrAdmins,
  onNavigateTab,
  onOpenFieldSimulator,
}: AdminDashboardTabProps) {
  // Aggregate stats
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const inProgressCount = bookings.filter(
    (b) => b.status === 'en_route' || b.status === 'arrived' || b.status === 'in_progress'
  ).length;

  const activeVans = jrAdmins.filter((j) => j.status === 'active' || j.status === 'busy').length;
  const waterConserved = (completedCount || 4) * 200; // 200L saved per doorstep wash vs traditional bay

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const activeBookings = bookings.filter((b) =>
    ['confirmed', 'en_route', 'arrived', 'in_progress'].includes(b.status)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Alert if pending intake */}
      {pendingCount > 0 && (
        <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {pendingCount} New Booking{pendingCount > 1 ? 's' : ''} Awaiting Admin Review &amp; Confirmation!
              </h3>
              <p className="text-xs text-slate-600">
                Incoming orders need your confirmation and Jr Admin assignment to initiate doorstep dispatch.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <span>Review Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Gross Intake</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-cyan-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Fleet / Vans</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 flex items-baseline space-x-2">
            <span>{activeVans}</span>
            <span className="text-xs text-slate-500 font-normal">Active Vans</span>
          </div>
          <div className="text-[11px] text-cyan-700 font-semibold mt-1">
            {jrAdmins.filter(j => j.status === 'busy').length} currently on job
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 flex items-baseline space-x-2">
            <span>{completedCount}</span>
            <span className="text-xs text-slate-400 font-normal">/ {bookings.length}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            99.4% on-time arrival rate
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Water Saved</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 flex items-baseline space-x-1">
            <span>{waterConserved}</span>
            <span className="text-xs text-blue-600 font-bold">L</span>
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            Eco friendly doorstep wash
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Fleet CSAT</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            4.98 <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            100% verified customer ratings
          </div>
        </div>
      </div>

      {/* Middle Operations Section: Active Jobs & Jr Admins on Duty */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Missions (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Live Active Dispatches</h3>
              <p className="text-xs text-slate-500">Real-time status of doorstep washing vans in Indore</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View All ({bookings.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {activeBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No active dispatches right now. Check pending orders to assign wash technicians.
            </div>
          ) : (
            <div className="space-y-3">
              {activeBookings.slice(0, 4).map((b) => {
                const statusBadge =
                  b.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : b.status === 'en_route'
                    ? 'bg-cyan-100 text-cyan-800 border-cyan-200 animate-pulse'
                    : b.status === 'arrived'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-purple-100 text-purple-800 border-purple-200';

                const statusLabel =
                  b.status === 'confirmed'
                    ? 'Assigned'
                    : b.status === 'en_route'
                    ? 'En Route (On Way)'
                    : b.status === 'arrived'
                    ? 'Arrived (OTP Pending)'
                    : 'Washing';

                return (
                  <div
                    key={b.bookingId}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          #{b.bookingId}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${statusBadge}`}>
                          {statusLabel}
                        </span>
                        {b.startOtp && (
                          <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                            🔑 OTP: {b.startOtp}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-slate-900">
                        {b.customer.name}{' '}
                        <span className="text-slate-500 font-normal">
                          • {b.vehicle.make} {b.vehicle.model} ({b.service.name})
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center space-x-2">
                        <span>📍 {b.address.street}, {b.address.city}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">
                          Technician: {b.assignedTechnician?.name || 'Unassigned'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenFieldSimulator(b)}
                      className="shrink-0 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Launch Field App</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fleet Roster Quick View (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Jr Admins on Duty</h3>
                <p className="text-xs text-slate-500">Wash Experts &amp; Mobile Units</p>
              </div>
              <button
                onClick={() => onNavigateTab('jradmins')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                + Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {jrAdmins.slice(0, 4).map((jr) => (
                <div
                  key={jr.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      {jr.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{jr.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{jr.vehicleNo}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        jr.status === 'busy'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {jr.status === 'busy' ? 'On Mission' : 'Standby'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{jr.totalJobs || 0} jobs done</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('jradmins')}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Register New Jr Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
