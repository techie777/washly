'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Clock, 
  MapPin, 
  RefreshCw,
  ExternalLink,
  LogOut,
  UserCheck,
  Palette
} from 'lucide-react';
import Link from 'next/link';
import { Booking, JrAdmin, SupportEnquiry } from '@/types';
import AdminSidebar, { AdminTab } from './AdminSidebar';
import AdminDashboardTab from './AdminDashboardTab';
import AdminOrdersTab from './AdminOrdersTab';
import AdminCustomersTab from './AdminCustomersTab';
import AdminSupportTab from './AdminSupportTab';
import AdminPackagesTab from './AdminPackagesTab';
import AdminJrAdminsTab from './AdminJrAdminsTab';
import AdminSettingsTab from './AdminSettingsTab';
import JrAdminFieldModal from './JrAdminFieldModal';
import AdminLoginView, { AdminAuthSession } from './AdminLoginView';
import JrAdminWorkspace from './JrAdminWorkspace';
import ToastContainer from '@/components/ui/ToastContainer';
import NotificationBellDrawer from './NotificationBellDrawer';
import { useAdminThemeStore } from '@/lib/store/adminThemeStore';
import AdminThemeModal from './AdminThemeModal';

interface SuperAdminDashboardProps {
  initialBookings: Booking[];
  initialJrAdmins: JrAdmin[];
}

export default function SuperAdminDashboard({
  initialBookings,
  initialJrAdmins,
}: SuperAdminDashboardProps) {
  // Session State
  const [session, setSession] = useState<AdminAuthSession | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [jrAdmins, setJrAdmins] = useState<JrAdmin[]>(initialJrAdmins);
  const [openSupportCount, setOpenSupportCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Theme Design System state
  const { currentTheme, openThemePicker } = useAdminThemeStore();

  // Field simulator modal
  const [simulatorBooking, setSimulatorBooking] = useState<Booking | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('doorstep_admin_session');
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setSessionLoaded(true);
    }
  }, []);

  // Live clock
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch support count and bookings periodically or on refresh
  const refreshData = async () => {
    setRefreshing(true);
    try {
      const [bRes, jRes, sRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/admin/jr-admins'),
        fetch('/api/admin/support'),
      ]);

      const [bData, jData, sData] = await Promise.all([
        bRes.json(),
        jRes.json(),
        sRes.json(),
      ]);

      if (bData.success && Array.isArray(bData.bookings)) {
        setBookings(bData.bookings);
      }
      if (jData.success && Array.isArray(jData.jrAdmins)) {
        setJrAdmins(jData.jrAdmins);
      }
      if (sData.success && Array.isArray(sData.enquiries)) {
        const count = sData.enquiries.filter((e: SupportEnquiry) => e.status === 'open').length;
        setOpenSupportCount(count);
      }
    } catch (err) {
      console.warn('Refresh error', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('doorstep_admin_session');
    setSession(null);
  };

  // Booking updated callback
  const handleBookingUpdated = (updatedBooking: Booking) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === updatedBooking.bookingId ? updatedBooking : b))
    );
    // Also re-sync JrAdmins
    fetch('/api/admin/jr-admins')
      .then((res) => res.json())
      .then((d) => d.success && setJrAdmins(d.jrAdmins))
      .catch(() => {});
  };

  const handleJrAdminDeleted = (id: string) => {
    setJrAdmins((prev) => prev.filter((j) => j.id !== id));
  };

  // 1. Loading screen while checking auth
  if (!sessionLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-blue-500 mr-2" />
        <span>Initializing Fleet Command...</span>
      </div>
    );
  }

  // 2. Unauthenticated: Show Portal Login View with Super Admin / Jr Admin selector
  if (!session) {
    return (
      <AdminLoginView
        jrAdmins={jrAdmins}
        onLoginSuccess={(newSession) => setSession(newSession)}
      />
    );
  }

  // 3. Jr Admin (Wash Expert) Workspace View
  if (session.role === 'jr_admin') {
    return (
      <JrAdminWorkspace
        session={session}
        bookings={bookings}
        jrAdmins={jrAdmins}
        onOrderUpdated={handleBookingUpdated}
        onLogout={handleLogout}
      />
    );
  }

  // 4. Super Admin Operations Command Dashboard
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const activeJrCount = jrAdmins.filter((j) => j.status === 'active' || j.status === 'busy').length;

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans relative"
      style={{
        '--admin-primary': currentTheme.primary,
        '--admin-primary-hover': currentTheme.primaryHover,
        '--admin-primary-light': currentTheme.primaryLight,
        '--admin-primary-border': currentTheme.primaryBorder,
      } as React.CSSProperties}
    >
      <AdminThemeModal />
      <ToastContainer />
      {/* Mobile Top bar */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <div className="text-sm font-black flex items-center space-x-1.5">
              <span>डोरस्टेप कार वॉश</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">
                Super Admin
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Indore Central Hub</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Palette Button (Mobile) */}
          <button
            onClick={openThemePicker}
            className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 transition-colors"
            title="Change Theme Colors"
          >
            <Palette className="w-4 h-4" style={{ color: currentTheme.primary }} />
          </button>

          <NotificationBellDrawer onSelectBooking={() => setActiveTab('orders')} />
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Left Navigation Sidebar (Desktop fixed/static, Mobile slide-over) */}
      <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          pendingCount={pendingCount}
          openSupportCount={openSupportCount}
          activeJrAdminCount={activeJrCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Control Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div 
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors"
              style={{
                backgroundColor: currentTheme.primaryLight,
                borderColor: currentTheme.primaryBorder,
                color: currentTheme.primary
              }}
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              <span>Indore Hub (Active Operations)</span>
            </div>

            {currentTime && (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentTime}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Theme Customizer Trigger Button */}
            <button
              type="button"
              onClick={openThemePicker}
              className="p-2 sm:px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-2 transition-all shadow-2xs"
              title="Change Portal Theme Colors / पोर्टल रंग बदलें"
            >
              <span 
                className="w-3.5 h-3.5 rounded-full shadow-2xs shrink-0" 
                style={{ backgroundColor: currentTheme.primary }} 
              />
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline font-semibold">{currentTheme.name.split(' ')[0]}</span>
            </button>

            {/* Notification Bell Drawer */}
            <NotificationBellDrawer onSelectBooking={() => setActiveTab('orders')} />

            {/* Refresh */}
            <button
              onClick={refreshData}
              disabled={refreshing}
              title="Refresh Live Data"
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: currentTheme.primary }} />
              <span className="hidden sm:inline">{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Quick Test Simulator Button */}
            {bookings.length > 0 && (
              <button
                onClick={() => {
                  const target =
                    bookings.find((b) =>
                      ['confirmed', 'en_route', 'arrived', 'in_progress'].includes(b.status)
                    ) || bookings[0];
                  setSimulatorBooking(target);
                }}
                className="hidden xl:flex px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold items-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Wash Expert App Simulator</span>
              </button>
            )}

            {/* Manual Booking Button with Theme Color */}
            <Link
              href="/book"
              target="_blank"
              className="px-4 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all hover:scale-102"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Plus className="w-4 h-4" />
              <span>+ Manual Booking</span>
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold flex items-center space-x-1.5 transition-all"
              title="Sign Out of Super Admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              bookings={bookings}
              jrAdmins={jrAdmins}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenFieldSimulator={(booking) => setSimulatorBooking(booking)}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersTab
              bookings={bookings}
              jrAdmins={jrAdmins}
              onOrderUpdated={handleBookingUpdated}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomersTab bookings={bookings} />
          )}

          {activeTab === 'support' && (
            <AdminSupportTab />
          )}

          {activeTab === 'packages' && (
            <AdminPackagesTab />
          )}

          {activeTab === 'jradmins' && (
            <AdminJrAdminsTab
              jrAdmins={jrAdmins}
              bookings={bookings}
              onJrAdminCreated={(newJr) => setJrAdmins((prev) => [newJr, ...prev])}
              onJrAdminUpdated={(updated) =>
                setJrAdmins((prev) => prev.map((j) => (j.id === updated.id ? updated : j)))
              }
              onJrAdminDeleted={handleJrAdminDeleted}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab />
          )}
        </main>
      </div>

      {/* Global Field Simulator Modal */}
      {simulatorBooking && (
        <JrAdminFieldModal
          booking={simulatorBooking}
          onClose={() => setSimulatorBooking(null)}
          onStatusUpdated={(updated) => {
            handleBookingUpdated(updated);
          }}
        />
      )}
    </div>
  );
}
