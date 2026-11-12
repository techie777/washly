'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, UserCheck, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function PrivacyPolicyPage() {
  const { isHindi } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link & Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isHindi ? 'होम पेज पर वापस जाएं' : 'Back to Home'}</span>
          </Link>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isHindi ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'अंतिम अपडेट: 1 जनवरी 2026 • आपकी व्यक्तिगत जानकारी की सुरक्षा' : 'Last Updated: January 1, 2026 • Commitment to Your Data Security'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {isHindi
                ? 'Washly Doorstep Car Care Pvt. Ltd. आपकी निजता (Privacy) का पूर्ण सम्मान करता है। यह नीति स्पष्ट करती है कि हम आपकी सेवा के दौरान कौन सी जानकारी एकत्र करते हैं और उसका उपयोग किस प्रकार किया जाता है।'
                : 'Washly Doorstep Car Care Pvt. Ltd. respects your privacy. This policy explains what personal and location information we collect when providing doorstep vehicle care services and how we safeguard your data.'}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? '1. हम कौन सी जानकारी एकत्र करते हैं' : '1. Information We Collect'}</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
              <li>
                <strong className="text-slate-800">{isHindi ? 'संपर्क जानकारी:' : 'Contact Data:'}</strong>{' '}
                {isHindi ? 'आपका नाम, व्हाट्सएप मोबाइल नंबर और ईमेल पता।' : 'Your name, WhatsApp mobile number, and email address.'}
              </li>
              <li>
                <strong className="text-slate-800">{isHindi ? 'डोरस्टेप लोकेशन:' : 'Service Location:'}</strong>{' '}
                {isHindi ? 'सोसायटी / मकान नंबर, सड़क, लैंडमार्क, शहर (इंदौर) और पिनकोड, ताकि वैन सही पते पर पहुंचे।' : 'Society/House name, street, nearby landmark, city (Indore), and postal pincode for dispatching the service unit.'}
              </li>
              <li>
                <strong className="text-slate-800">{isHindi ? 'वाहन विवरण:' : 'Vehicle Details:'}</strong>{' '}
                {isHindi ? 'वाहन का प्रकार (कार/बाइक), मेक, मॉडल व नंबर प्लेट (यदि प्रदान किया गया हो)।' : 'Vehicle segment (Hatchback/Sedan/SUV/Bike), brand, model, and registration plate number (if provided).'}
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? '2. हम आपकी जानकारी का उपयोग कैसे करते हैं' : '2. How We Use Your Information'}</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
              <li>{isHindi ? 'आपकी डोरस्टेप बुकिंग की पुष्टि और सर्विस वैन/बाइक को असाइन करने के लिए।' : 'To schedule and dispatch the nearest mobile wash van or service bike to your address.'}</li>
              <li>{isHindi ? 'लाइव ट्रैकिंग लिंक और सुरक्षा OTP (वन-टाइम पासवर्ड) एसएमएस व व्हाट्सएप पर भेजने के लिए।' : 'To transmit real-time vehicle dispatch updates, technician arrival status, and Start OTP.'}</li>
              <li>{isHindi ? 'धुलाई पूर्ण होने पर डिजिटल बिल व रसीद उपलब्ध कराने के लिए।' : 'To issue digital wash completion invoices and collect satisfaction ratings.'}</li>
              <li>{isHindi ? 'कस्टमर सपोर्ट और सेवा संबंधी आवश्यक सूचनाओं के लिए।' : 'To provide dedicated customer support regarding slot changes or inquiries.'}</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? '3. डेटा सुरक्षा व गोपनीयता नीति' : '3. Zero Data Sale & Data Protection'}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'Washly किसी भी तृतीय पक्ष (Third Party) को आपका व्यक्तिगत डेटा या मोबाइल नंबर नहीं बेचता है। आपका डेटा सुरक्षित एन्क्रिप्टेड सर्वर पर संग्रहीत रहता है और केवल सर्विस एग्जीक्यूटिव को असाइन किए गए ऑर्डर के लिए ही सीमित जानकारी साझा की जाती है।'
                : 'We will never sell, rent, or trade your personal or vehicle data to third-party telemarketers or advertisers. All data is protected with industry-standard TLS encryption, and assigned technicians only receive minimal operational data needed to locate your car and complete the wash.'}
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? '4. ग्राहक के अधिकार व डेटा नियंत्रण' : '4. Customer Rights & Data Management'}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'ग्राहक किसी भी समय अपनी प्रोफ़ाइल में जाकर संपर्क विवरण अपडेट कर सकते हैं अथवा हमारे सपोर्ट को ईमेल कर अपना खाता व बुकिंग इतिहास हटाने का अनुरोध कर सकते हैं।'
                : 'Customers may access, review, or update their personal details at any time via the profile dashboard or request account and booking deletion by emailing our privacy team.'}
            </p>
          </div>

          {/* Contact Box */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                {isHindi ? 'डेटा सुरक्षा अधिकारी (Grievance Officer)' : 'Privacy & Data Grievance Contact'}
              </h3>
              <p className="text-xs text-slate-600">
                Washly Doorstep Car Care Pvt. Ltd., Vijay Nagar, Indore, Madhya Pradesh - 452010
              </p>
            </div>
            <a
              href="mailto:privacy@washly.in"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>privacy@washly.in</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

