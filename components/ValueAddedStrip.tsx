'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  ShieldCheck, 
  BatteryCharging, 
  Crown, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const VALUE_SERVICES = [
  {
    title: 'Instant Fastag Recharge',
    desc: 'Instant toll balance top-up via NETC NPCI gateway with low-balance SMS alerts.',
    icon: CreditCard,
    accent: '#00D2FF',
    actionText: 'Top Up Fastag',
  },
  {
    title: 'Insurance Claim Concierge',
    desc: 'Doorstep zero-dep inspection, cashless tie-ups with 24+ insurers & towing assist.',
    icon: ShieldCheck,
    accent: '#10B981',
    actionText: 'Check Claim Status',
  },
  {
    title: 'Doorstep Battery Jumpstart',
    desc: 'Emergency 12V test, alternator diagnostics & 20-minute rapid jumpstart rescue.',
    icon: BatteryCharging,
    accent: '#F59E0B',
    actionText: 'Request Assistance',
  },
  {
    title: 'Washly Care Club',
    desc: 'Unlimited bi-weekly foam washes, free quarterly interior spa & VIP priority slots.',
    icon: Crown,
    accent: '#D4AF37',
    badge: 'Save 45%',
    actionText: 'Explore Memberships',
  },
];

export default function ValueAddedStrip() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <section className="py-20 relative bg-[#090D14] border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#00D2FF] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Mobility Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Value-Added <span className="gold-gradient-text">Automotive Services</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md">
            More than detailing. One unified digital concierge managing every aspect of your vehicle health and convenience.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_SERVICES.map((serv) => {
            const Icon = serv.icon;
            return (
              <div
                key={serv.title}
                className="glass-card rounded-2xl p-6 border border-[#1E293B] hover:border-[#D4AF37]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${serv.accent}15`, 
                        borderColor: `${serv.accent}40` 
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: serv.accent }} />
                    </div>
                    {serv.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E5C07B] border border-[#D4AF37]/30">
                        {serv.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#E5C07B] transition-colors">
                    {serv.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">
                    {serv.desc}
                  </p>
                </div>

                <button
                  onClick={() => setActiveModal(serv.title)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] text-[#F1F5F9] text-xs font-semibold border border-[#1E293B] flex items-center justify-between transition-colors"
                >
                  <span>{serv.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00D2FF]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Modal Demo */}
        {activeModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-[#D4AF37]/40 relative">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-[#E5C07B]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {activeModal}
              </h3>
              <p className="text-xs text-[#94A3B8] mb-6">
                Our 24/7 VIP Concierge will instantly assist you with {activeModal}. Connect directly via phone or WhatsApp for immediate dispatch.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+919820048822"
                  className="w-full py-3 rounded-xl gold-gradient text-[#0B0F17] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <span>Call Concierge: +91 98200 48822</span>
                </a>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-xl bg-[#131B2A] text-xs text-[#94A3B8] hover:text-white border border-[#1E293B]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
