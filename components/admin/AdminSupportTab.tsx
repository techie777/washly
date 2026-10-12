'use client';

import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Plus, 
  X, 
  ExternalLink,
  AlertCircle,
  Filter
} from 'lucide-react';
import { SupportEnquiry } from '@/types';

export default function AdminSupportTab() {
  const [enquiries, setEnquiries] = useState<SupportEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');

  // New enquiry modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newBookingId, setNewBookingId] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch enquiries
  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/support');
      const data = await res.json();
      if (res.ok && data.enquiries) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error('Failed to load support enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'open' | 'resolved') => {
    const nextStatus = currentStatus === 'open' ? 'resolved' : 'open';
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.enquiry) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? data.enquiry : item))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone || !newMessage) {
      alert('Please fill customer name, phone, and inquiry message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newCustomerName,
          customerPhone: newCustomerPhone,
          bookingId: newBookingId || undefined,
          subject: newSubject || 'Customer Phone Inquiry',
          message: newMessage,
        }),
      });
      const data = await res.json();
      if (res.ok && data.enquiry) {
        setEnquiries((prev) => [data.enquiry, ...prev]);
        setShowAddModal(false);
        setNewCustomerName('');
        setNewCustomerPhone('');
        setNewBookingId('');
        setNewSubject('');
        setNewMessage('');
      } else {
        alert(data.message || 'Failed to create enquiry');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = enquiries.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const openCount = enquiries.filter((e) => e.status === 'open').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-extrabold text-slate-900">Support &amp; Customer Enquiries</h3>
            {openCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                {openCount} Open
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Handle customer questions, reschedule requests, and direct WhatsApp support
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({enquiries.length})
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'open' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Open ({openCount})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'resolved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Resolved ({enquiries.length - openCount})
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Inquiry</span>
          </button>
        </div>
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading enquiries...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">All customer inquiries are resolved!</h4>
          <p className="text-xs text-slate-400 mt-1">
            New customer support tickets from website or phone will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isOpen = item.status === 'open';
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all bg-white shadow-xs ${
                  isOpen ? 'border-rose-200' : 'border-slate-200 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isOpen
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isOpen ? 'Open Ticket' : 'Resolved'}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{item.subject}</span>
                    {item.bookingId && (
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        #{item.bookingId}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="py-3 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <span className="font-bold text-slate-900">{item.customerName}</span>
                    <span>•</span>
                    <span className="font-mono flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{item.customerPhone}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Direct WhatsApp button */}
                    <a
                      href={`https://wa.me/${item.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `नमस्ते ${item.customerName} जी, डोरस्टेप कार वॉश सपोर्ट टीम इंदौर से। हमें आपकी इन्क्वायरी (${item.subject}) प्राप्त हुई। हम आपकी क्या सहायता कर सकते हैं?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Reply on WhatsApp</span>
                    </a>

                    {/* Toggle status */}
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        isOpen
                          ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isOpen ? 'Mark as Resolved' : 'Re-open Ticket'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log New Enquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Log Customer Support Inquiry</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Verma"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9826012345"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Related Booking ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. WSH-89241"
                  value={newBookingId}
                  onChange={(e) => setNewBookingId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inquiry Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Reschedule request / Pricing query"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message / Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter details of customer concern or request..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Save Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
