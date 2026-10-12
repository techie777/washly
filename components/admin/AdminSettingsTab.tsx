'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  QrCode, 
  Building, 
  Phone, 
  Clock, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  MapPin,
  Lock,
  AlertCircle,
  Palette,
  Sliders,
  RotateCcw,
  Eye
} from 'lucide-react';
import { CompanySettings } from '@/types';
import { useAdminThemeStore, PRESET_THEMES } from '@/lib/store/adminThemeStore';

export default function AdminSettingsTab() {
  const [settings, setSettings] = useState<CompanySettings>({
    companyName: 'डोरस्टेप कार वॉश (Doorstep Car Wash Indore)',
    operatingCity: 'Indore',
    supportPhone: '+91 96852 32340',
    supportWhatsapp: '9685232340',
    upiId: 'doorstepwash@upi',
    upiName: 'Doorstep Car Wash Indore Pvt Ltd',
    businessHours: '07:00 AM - 08:00 PM (Everyday)',
    noticeText: '100% शुद्ध आरओ पानी व मोबाइल जनरेटर सुविधा हर वॉश में शामिल।',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Admin change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Admin Theme Design System state
  const { currentTheme, customHex, setThemeById, setCustomColor } = useAdminThemeStore();

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.warn('Could not load settings', err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings(data.settings);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current admin password.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPasswordError(data.message || 'Failed to change password.');
        return;
      }

      setPasswordMessage('Super Admin password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(null), 3500);
    } catch (err: any) {
      setPasswordError(err.message || 'Network error changing password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Common Company &amp; Hub Settings</h3>
          <p className="text-xs text-slate-500">
            Configure company identity, support helplines, Indore hub parameters, and Company UPI QR Code
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-all active:scale-98"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 font-bold text-slate-800 text-sm">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Business Profile &amp; Contact Details</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Company Name (Brand Display):
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Central Operations Hub (City):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.operatingCity}
                  onChange={(e) => setSettings({ ...settings, operatingCity: e.target.value })}
                  className="w-full px-3.5 py-2.5 pl-8 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-semibold"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Helpline / Calling:
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Support WhatsApp Number:
              </label>
              <input
                type="text"
                value={settings.supportWhatsapp}
                onChange={(e) => setSettings({ ...settings, supportWhatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Business Working Hours:
              </label>
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2 pb-3 font-bold text-slate-800 text-sm">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Company Given QR Code &amp; UPI Collection Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Company VPA / UPI ID:
                </label>
                <input
                  type="text"
                  value={settings.upiId}
                  onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                  placeholder="e.g. doorstepwash@upi"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  All customer payments collected by Jr Admins go to this VPA.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Payee Name:
                </label>
                <input
                  type="text"
                  value={settings.upiName}
                  onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-semibold"
                />
              </div>
            </div>
          </div>

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}
        </div>

        {/* Right 1 Col: Live QR Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Company QR Preview
            </div>
            <p className="text-xs text-slate-400">
              Live QR code given to Jr Admins on duty to collect payment from doorstep customers
            </p>
          </div>

          {/* QR Container */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white w-full max-w-[240px] flex flex-col items-center shadow-lg space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Doorstep Car Wash Indore
            </div>
            <div className="p-3 bg-white rounded-xl shadow-inner flex flex-col items-center justify-center">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-300 truncate max-w-full">
              {settings.upiId}
            </div>
            <div className="text-[9px] text-slate-400">
              BHIM • PhonePe • GooglePay • Paytm
            </div>
          </div>

          <div className="w-full pt-3 border-t border-slate-100 text-slate-500 text-xs">
            <p className="font-semibold text-slate-700">{settings.upiName}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Indore Commercial Fleet Account</p>
          </div>
        </div>
      </form>

      {/* Super Admin Security & Password Change Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Super Admin Security &amp; Password Management
            </h3>
            <p className="text-xs text-slate-500">
              Update your central operations command access password
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password:
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password:
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password:
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm"
              />
            </div>
          </div>

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Default password: <code className="font-mono font-bold text-slate-600">admin123</code>
            </span>
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{passwordLoading ? 'Updating...' : 'Change Admin Password'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* SECTION: Portal Design System & Theme Customizer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-colors"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>Portal Design System &amp; Theme Customizer</span>
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                    style={{
                      backgroundColor: currentTheme.primaryLight,
                      borderColor: currentTheme.primaryBorder,
                      color: currentTheme.primary
                    }}
                  >
                    {currentTheme.name}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Not happy with the default blue and white? Choose from curated palettes or pick your own custom brand color.
                </p>
              </div>
            </div>
          </div>

          {/* Live Interactive Preview */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Real-Time Theme Preview</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Primary: <strong style={{ color: currentTheme.primary }}>{currentTheme.primary}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Action Button</span>
              </button>

              <span 
                className="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all"
                style={{
                  backgroundColor: currentTheme.primaryLight,
                  borderColor: currentTheme.primaryBorder,
                  color: currentTheme.primary
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active Status Badge</span>
              </span>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.primary }} />
                <span>Sidebar Active Item</span>
              </div>
            </div>
          </div>

          {/* Curated Theme Palettes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Choose Curated Palette:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PRESET_THEMES.map((theme) => {
                const isSelected = currentTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeById(theme.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'border-slate-900 bg-white ring-2 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    style={isSelected ? { borderColor: theme.primary, boxShadow: `0 0 0 2px ${theme.primary}40` } : {}}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-1.5">
                        <span 
                          className="w-6 h-6 rounded-xl shadow-2xs inline-block"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span 
                          className="w-4 h-4 rounded-lg inline-block opacity-75"
                          style={{ backgroundColor: theme.accent }}
                        />
                      </div>
                      {isSelected && (
                        <span 
                          className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px]"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {theme.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {theme.primary}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Color Engine */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>Custom Brand Color Picker (Choose Any Color):</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Use the native color swatch or enter any hexadecimal color code to dynamically theme the entire portal.
            </p>

            <div className="flex items-center space-x-3 max-w-md">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-12 rounded-2xl border-2 border-slate-300 cursor-pointer p-0.5 bg-white shadow-xs"
              />
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-xs">
                  #
                </span>
                <input
                  type="text"
                  value={customHex.replace('#', '')}
                  onChange={(e) => setCustomColor(`#${e.target.value}`)}
                  placeholder="2563eb"
                  maxLength={7}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:bg-white transition-all uppercase"
                />
              </div>
              <button
                type="button"
                onClick={() => setThemeById('blue')}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
