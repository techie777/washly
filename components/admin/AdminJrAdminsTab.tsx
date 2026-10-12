'use client';

import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Truck, 
  Phone, 
  Mail, 
  Star, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  X, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Calendar,
  Edit2,
  Trash2,
  Lock,
  Check,
  AtSign
} from 'lucide-react';
import { JrAdmin, Booking } from '@/types';
import JrAdminFieldModal from './JrAdminFieldModal';
import { useNotificationStore } from '@/lib/store/notificationStore';

interface AdminJrAdminsTabProps {
  jrAdmins: JrAdmin[];
  bookings: Booking[];
  onJrAdminCreated: (newJr: JrAdmin) => void;
  onJrAdminUpdated: (updatedJr: JrAdmin) => void;
  onJrAdminDeleted: (id: string) => void;
}

export default function AdminJrAdminsTab({
  jrAdmins,
  bookings,
  onJrAdminCreated,
  onJrAdminUpdated,
  onJrAdminDeleted,
}: AdminJrAdminsTabProps) {
  const { addToast } = useNotificationStore();

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [pin, setPin] = useState('1234');
  const [password, setPassword] = useState('1234');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal state
  const [editingJr, setEditingJr] = useState<JrAdmin | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editVehicleNo, setEditVehicleNo] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'busy' | 'offline'>('active');
  const [editPassword, setEditPassword] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Change PIN / Password state
  const [changingPinJr, setChangingPinJr] = useState<JrAdmin | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  // Field simulator test modal
  const [simulatorBooking, setSimulatorBooking] = useState<Booking | null>(null);

  // Handle Create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !vehicleNo.trim()) {
      setError('Please fill full name, 10-digit phone, and vehicle registration number.');
      return;
    }

    setLoading(true);
    setError(null);

    const generatedUsername =
      username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') ||
      name.trim().toLowerCase().replace(/\s+/g, '_');

    try {
      const res = await fetch('/api/admin/jr-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          username: generatedUsername,
          phone: phone.trim(),
          vehicleNo: vehicleNo.trim(),
          pin: pin.trim() || '1234',
          password: password.trim() || pin.trim() || '1234',
          email: email.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create Jr Admin');
      }

      onJrAdminCreated(data.jrAdmin);
      setShowCreateModal(false);
      setName('');
      setUsername('');
      setPhone('');
      setVehicleNo('');
      setPin('1234');
      setPassword('1234');
      setEmail('');

      addToast({
        title: 'Jr Admin Account Created',
        message: `${data.jrAdmin.name} (@${data.jrAdmin.username}) added with mobile van ${data.jrAdmin.vehicleNo}.`,
        type: 'success',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create technician');
      addToast({
        title: 'Failed to create Jr Admin',
        message: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (jr: JrAdmin) => {
    setEditingJr(jr);
    setEditName(jr.name);
    setEditUsername(jr.username || jr.name.toLowerCase().replace(/\s+/g, '_'));
    setEditPhone(jr.phone);
    setEditVehicleNo(jr.vehicleNo);
    setEditEmail(jr.email || '');
    setEditStatus(jr.status);
    setEditPassword(jr.password || jr.pin || '1234');
    setError(null);
  };

  // Save Edit Changes
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJr) return;

    setEditLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/jr-admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingJr.id,
          updates: {
            name: editName.trim(),
            username: editUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
            phone: editPhone.replace(/\D/g, ''),
            vehicleNo: editVehicleNo.trim(),
            email: editEmail.trim(),
            status: editStatus,
            password: editPassword.trim() || '1234',
            pin: editPassword.trim().slice(0, 4) || '1234',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update Jr Admin');
      }

      onJrAdminUpdated(data.jrAdmin);
      setEditingJr(null);

      addToast({
        title: 'Jr Admin Profile Updated',
        message: `Updated profile details & credentials for ${data.jrAdmin.name}.`,
        type: 'success',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update Jr Admin');
      addToast({
        title: 'Update Failed',
        message: err.message,
        type: 'error',
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Open Change PIN / Password Modal
  const openChangePinModal = (jr: JrAdmin) => {
    setChangingPinJr(jr);
    setNewPassword(jr.password || jr.pin || '1234');
    setConfirmPassword(jr.password || jr.pin || '1234');
    setNewPin(jr.pin || '1234');
    setPinMessage(null);
    setError(null);
  };

  // Handle Save New PIN / Password
  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingPinJr) return;

    if (!newPassword || newPassword.trim().length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setPinLoading(true);
    setError(null);

    try {
      const cleanPass = newPassword.trim();
      const cleanPinCode = newPin.trim() || cleanPass.replace(/\D/g, '').slice(0, 4) || '1234';

      const res = await fetch('/api/admin/jr-admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: changingPinJr.id,
          pin: cleanPinCode,
          password: cleanPass,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to change password / PIN');
      }

      onJrAdminUpdated(data.jrAdmin);
      setPinMessage('Credentials changed successfully!');

      addToast({
        title: 'Credentials Saved',
        message: `Updated password for ${changingPinJr.name} (@${changingPinJr.username || 'jr'}).`,
        type: 'success',
      });

      setTimeout(() => {
        setChangingPinJr(null);
        setPinMessage(null);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to change credentials');
    } finally {
      setPinLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (jr: JrAdmin) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete Jr Admin account for ${jr.name} (${jr.vehicleNo})?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/jr-admins?id=${jr.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to delete Jr Admin account');
        return;
      }

      onJrAdminDeleted(jr.id);
      addToast({
        title: 'Jr Admin Account Removed',
        message: `${jr.name} has been removed from active fleet.`,
        type: 'warning',
      });
    } catch (err: any) {
      alert(err.message || 'Network error deleting account');
    }
  };

  // Duty Toggle
  const handleToggleStatus = async (jr: JrAdmin) => {
    const nextStatus = jr.status === 'offline' ? 'active' : 'offline';
    try {
      const res = await fetch('/api/admin/jr-admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: jr.id,
          updates: { status: nextStatus },
        }),
      });
      const data = await res.json();
      if (res.ok && data.jrAdmin) {
        onJrAdminUpdated(data.jrAdmin);
      }
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleSimulateForJr = (jr: JrAdmin) => {
    const found =
      bookings.find((b) => b.bookingId === jr.activeBookingId) ||
      bookings.find((b) => b.assignedTechnician?.name === jr.name) ||
      bookings.find((b) => ['confirmed', 'en_route', 'arrived', 'in_progress'].includes(b.status)) ||
      bookings[0];

    if (found) {
      setSimulatorBooking(found);
    } else {
      alert('No active booking available to simulate.');
    }
  };

  const activeCount = jrAdmins.filter((j) => j.status === 'active' || j.status === 'busy').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-slate-900">
              Jr Admins &amp; Doorstep Wash Experts
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
              {activeCount} Active Units
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Create field accounts, edit details, change PIN/passwords, or remove accounts from fleet
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Jr Admin</span>
        </button>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jrAdmins.map((jr) => {
          const isBusy = jr.status === 'busy';
          const isOffline = jr.status === 'offline';

          return (
            <div
              key={jr.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
                    {jr.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{jr.name}</h4>
                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                      Jr Admin / Expert
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                      isBusy
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : isOffline
                        ? 'bg-slate-100 text-slate-600 border border-slate-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {isBusy ? 'On Task' : isOffline ? 'Offline' : 'Available'}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(jr)}
                    title="Delete Jr Admin account"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Username:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] flex items-center space-x-1">
                    <AtSign className="w-3 h-3 text-blue-500" />
                    <span>{jr.username || jr.name.toLowerCase().replace(/\s+/g, '_')}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Mobile Van Reg:</span>
                  <span className="font-mono font-bold text-slate-900 flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{jr.vehicleNo}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">WhatsApp Phone:</span>
                  <span className="font-mono font-bold text-slate-800 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{jr.phone}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Password / PIN:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                      •••• ({jr.password || jr.pin || '1234'})
                    </span>
                    <button
                      onClick={() => openChangePinModal(jr)}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline ml-1"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    <span>{jr.rating} / 5.0 CSAT</span>
                  </div>
                  <span className="text-slate-500 font-bold text-[11px]">
                    {jr.totalJobs || 0} Washes Done
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSimulateForJr(jr)}
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Simulate Field App</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(jr)}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                    title="Toggle Duty Status"
                  >
                    {isOffline ? 'Check In' : 'Go Offline'}
                  </button>
                </div>

                {/* Edit details trigger */}
                <button
                  onClick={() => openEditModal(jr)}
                  className="w-full py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all"
                >
                  <Edit2 className="w-3 h-3 text-slate-400" />
                  <span>Edit Profile &amp; Van Registration</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Simulator Modal */}
      {simulatorBooking && (
        <JrAdminFieldModal
          booking={simulatorBooking}
          onClose={() => setSimulatorBooking(null)}
          onStatusUpdated={(updated) => {
            // refresh
          }}
        />
      )}

      {/* Create Jr Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Create New Jr Admin</h3>
                  <p className="text-xs text-slate-500">Wash Expert &amp; Mobile Van Dispatcher</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expert Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikas Patidar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!username) {
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Login Username *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input
                      type="text"
                      required
                      placeholder="vikas_wash"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    10-Digit WhatsApp Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9826077889"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assigned Mobile Van Registration No *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MP 09 CW 5544 (Van Unit 3)"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm uppercase font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Login Password / PIN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm font-bold"
                  />
                  <span className="text-[10px] text-slate-400">Default: 1234</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="vikas@doorstepwash.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 text-xs"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-sm"
                >
                  {loading ? 'Creating...' : 'Create Jr Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Jr Admin Modal */}
      {editingJr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Edit Jr Admin Profile</h3>
                  <p className="text-xs text-slate-500">{editingJr.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingJr(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input
                      type="text"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Van Registration</label>
                <input
                  type="text"
                  required
                  value={editVehicleNo}
                  onChange={(e) => setEditVehicleNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm uppercase font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Login Password / Secret PIN</label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duty Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 text-xs font-semibold"
                  >
                    <option value="active">Active (Available)</option>
                    <option value="busy">Busy (On Task)</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingJr(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-sm"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change PIN & Password Modal */}
      {changingPinJr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Change Password &amp; PIN</h3>
                  <p className="text-xs text-slate-500">
                    Expert: {changingPinJr.name} (@{changingPinJr.username || 'jr'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChangingPinJr(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePin} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter new password (min 4 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="text"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Optional 4-Digit Quick PIN</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono text-center font-bold text-base tracking-widest"
                />
                <span className="text-[10px] text-slate-400">
                  Allows quick PIN sign-in on field mobile devices
                </span>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {pinMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center space-x-2 font-bold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pinMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setChangingPinJr(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pinLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider shadow-sm"
                >
                  {pinLoading ? 'Updating...' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
