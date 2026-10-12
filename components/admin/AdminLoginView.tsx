'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  Phone, 
  Lock, 
  Truck, 
  ArrowRight, 
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { JrAdmin } from '@/types';

export interface AdminAuthSession {
  role: 'admin' | 'jr_admin';
  user: {
    id?: string;
    name: string;
    phone?: string;
    vehicleNo?: string;
    rating?: number;
    totalJobs?: number;
    username?: string;
  };
}

interface AdminLoginViewProps {
  jrAdmins: JrAdmin[];
  onLoginSuccess: (session: AdminAuthSession) => void;
}

export default function AdminLoginView({
  jrAdmins,
  onLoginSuccess,
}: AdminLoginViewProps) {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'jr_admin'>('admin');
  
  // Super Admin form
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Jr Admin form
  const [jrIdentifier, setJrIdentifier] = useState('');
  const [jrPassword, setJrPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedRole === 'admin') {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'admin',
            username: adminUsername,
            password: adminPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || 'Login failed. Please check credentials.');
          return;
        }

        const session: AdminAuthSession = {
          role: 'admin',
          user: data.user,
        };
        localStorage.setItem('doorstep_admin_session', JSON.stringify(session));
        onLoginSuccess(session);
      } else {
        // Jr Admin
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'jr_admin',
            username: jrIdentifier,
            phone: jrIdentifier,
            password: jrPassword,
            pin: jrPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || 'Login failed. Please check username & password.');
          return;
        }

        const session: AdminAuthSession = {
          role: 'jr_admin',
          user: data.user,
        };
        localStorage.setItem('doorstep_admin_session', JSON.stringify(session));
        onLoginSuccess(session);
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-amber-400 selection:text-slate-950 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-slate-900 border border-amber-400/40 text-amber-400 shadow-xl shadow-amber-500/10 mb-3">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            डोरस्टेप कार वॉश <span className="text-amber-400">पोर्टल</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Indore Operations Central Command &amp; Field Dispatch
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Select Your Portal Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setError(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
                  selectedRole === 'admin'
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('jr_admin');
                  setError(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
                  selectedRole === 'jr_admin'
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Jr Admin (Expert)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {selectedRole === 'admin' ? (
              /* Super Admin Form */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Super Admin Username / ID:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">
                      Admin Password:
                    </label>
                    <span className="text-[10px] text-slate-500">Default: admin123</span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Jr Admin (Wash Expert) Form - Only Username & Password/PIN */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Jr Admin Username:
                  </label>
                  <input
                    type="text"
                    required
                    value={jrIdentifier}
                    onChange={(e) => setJrIdentifier(e.target.value)}
                    placeholder="Enter Jr Admin username"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 font-mono text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">
                      Password or PIN:
                    </label>
                  </div>
                  <input
                    type="password"
                    required
                    value={jrPassword}
                    onChange={(e) => setJrPassword(e.target.value)}
                    placeholder="Enter password or 4-digit PIN"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-400/20 transition-all active:scale-98"
            >
              <span>
                {loading
                  ? 'Verifying...'
                  : selectedRole === 'admin'
                  ? 'Sign In to Super Admin Panel'
                  : 'Sign In as Wash Expert'}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>

          {/* Quick preset credentials helper */}
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
              Demo Quick Logins:
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setAdminUsername('admin');
                  setAdminPassword('admin123');
                  setError(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
              >
                Super Admin (admin123)
              </button>
            </div>
          </div>
        </div>

        {/* Back to website link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Go to Customer Doorstep Car Wash Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
