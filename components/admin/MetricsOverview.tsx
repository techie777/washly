import React from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  Droplet, 
  Truck, 
  Star, 
  TrendingUp 
} from 'lucide-react';
import { Booking } from '@/types';
import { useAdminThemeStore } from '@/lib/store/adminThemeStore';

interface MetricsOverviewProps {
  bookings: Booking[];
}

export default function MetricsOverview({ bookings }: MetricsOverviewProps) {
  const { currentTheme } = useAdminThemeStore();
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in_progress').length;
  const enRouteCount = bookings.filter((b) => b.status === 'en_route').length;
  
  // 100 Liters saved per wash compared to 250L traditional hose wash
  const waterSavedLiters = (bookings.length * 100).toLocaleString();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      
      {/* Gross Revenue */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Gross Intake
          </span>
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: currentTheme.primaryLight, color: currentTheme.primary }}
          >
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 font-mono">
          ₹{totalRevenue.toLocaleString()}
        </div>
        <div className="text-[11px] text-emerald-600 mt-1 flex items-center space-x-1 font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>+18.4% vs last week</span>
        </div>
      </div>

      {/* Active Dispatches */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Vans On Mission
          </span>
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: currentTheme.primaryLight, color: currentTheme.primary }}
          >
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 font-mono">
          {inProgressCount + enRouteCount} <span className="text-xs text-slate-400 font-normal">Active</span>
        </div>
        <div 
          className="text-[11px] mt-1 font-medium"
          style={{ color: currentTheme.primary }}
        >
          {enRouteCount} En Route • {inProgressCount} Washing
        </div>
      </div>

      {/* Completed Washes */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Completed Washes
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 font-mono">
          {completedCount} <span className="text-xs text-slate-400 font-normal">/ {bookings.length}</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          99.4% on-time arrival rate
        </div>
      </div>

      {/* Water Conserved */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Water Conserved
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Droplet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 font-mono">
          {waterSavedLiters} L
        </div>
        <div className="text-[11px] text-emerald-600 mt-1 font-medium">
          Eco friendly doorstep wash
        </div>
      </div>

      {/* Quality Score */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
            Fleet CSAT
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-500" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 font-mono">
          4.98 / 5.0
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          100% verified customer ratings
        </div>
      </div>

    </div>
  );
}
