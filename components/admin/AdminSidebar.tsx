'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  HelpCircle, 
  Sparkles, 
  UserCheck, 
  Settings, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  QrCode,
  Palette
} from 'lucide-react';
import Link from 'next/link';
import { useAdminThemeStore } from '@/lib/store/adminThemeStore';

export type AdminTab = 
  | 'dashboard' 
  | 'orders' 
  | 'customers' 
  | 'support' 
  | 'packages' 
  | 'jradmins' 
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingCount?: number;
  openSupportCount?: number;
  activeJrAdminCount?: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  openSupportCount = 0,
  activeJrAdminCount = 0,
}: AdminSidebarProps) {
  const { currentTheme, openThemePicker } = useAdminThemeStore();

  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Telemetry & Gross Metrics',
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders & Dispatch',
      icon: ShoppingBag,
      badge: pendingCount > 0 ? `${pendingCount} New` : null,
      badgeColor: 'bg-amber-500 text-white',
      desc: 'Intake, Assign & Tracking',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Customers Data',
      icon: Users,
      badge: null,
      desc: 'User Directory & Spend',
    },
    {
      id: 'support' as AdminTab,
      label: 'Support Enquiry',
      icon: HelpCircle,
      badge: openSupportCount > 0 ? `${openSupportCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
      desc: 'Inbound Customer Queries',
    },
    {
      id: 'packages' as AdminTab,
      label: 'Web Packages & Text',
      icon: Sparkles,
      badge: null,
      desc: 'Pricing & Promotional Copy',
    },
    {
      id: 'jradmins' as AdminTab,
      label: 'Jr Admins (Experts)',
      icon: UserCheck,
      badge: activeJrAdminCount > 0 ? `${activeJrAdminCount} Active` : null,
      badgeColor: 'bg-emerald-500 text-white',
      desc: 'Wash Technicians & Vans',
    },
    {
      id: 'settings' as AdminTab,
      label: 'Common Settings',
      icon: Settings,
      badge: null,
      desc: 'UPI QR, Hub & Profile',
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 lg:min-h-screen">
      {/* Brand & Super Admin Badge */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-lg transition-all"
            style={{ 
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
              boxShadow: `0 10px 20px -5px ${currentTheme.primary}40`
            }}
          >
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-base tracking-tight">डोरस्टेप कार वॉश</span>
              <span 
                className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded border"
                style={{ 
                  backgroundColor: currentTheme.primaryLight, 
                  color: currentTheme.primary, 
                  borderColor: currentTheme.primaryBorder 
                }}
              >
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">Indore Central Command Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="p-3 flex-1 space-y-1">
        <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Operations & Control
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-150 group ${
                isActive
                  ? 'text-white font-bold shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
              }`}
              style={isActive ? { 
                backgroundColor: currentTheme.primary,
                boxShadow: `0 10px 20px -3px ${currentTheme.primary}45`
              } : {}}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                  style={!isActive ? { color: undefined } : {}}
                />
                <div className="min-w-0">
                  <div className="text-sm truncate">{item.label}</div>
                  <div className={`text-[11px] truncate ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer / Quick Links */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-2">
        <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentTheme.primary }}
            ></span>
            <span>Live Server (Indore)</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">v2.4 Active</span>
        </div>

        {/* Change Theme trigger in sidebar */}
        <button
          type="button"
          onClick={openThemePicker}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700/50"
        >
          <span className="flex items-center space-x-2">
            <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
            <span>Theme: {currentTheme.name.split(' ')[0]}</span>
          </span>
          <span 
            className="w-3 h-3 rounded-full shadow-2xs shrink-0"
            style={{ backgroundColor: currentTheme.primary }}
          />
        </button>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700/50"
        >
          <span className="flex items-center space-x-2">
            <ExternalLink className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
            <span>Open Customer Website</span>
          </span>
          <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">Preview</span>
        </Link>
      </div>
    </aside>
  );
}
