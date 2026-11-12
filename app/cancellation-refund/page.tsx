'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Clock, CheckCircle2, ShieldAlert, Phone, Mail, Sparkles, Banknote } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function CancellationRefundPage() {
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
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isHindi ? 'रद्दीकरण एवं रिफंड नीति (Cancellation & Refund Policy)' : 'Cancellation & Refund Policy'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'ग्राहक संतुष्टि व निष्पक्ष नीतियां • Washly Doorstep Car Care' : 'Transparent & Customer-Friendly Policies • Washly Doorstep Car Care'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {isHindi
                ? 'Washly में हम पारदर्शिता और ग्राहक सुविधा को सर्वोच्च प्राथमिकता देते हैं। हमारी सभी सेवाओं में ₹99 कीमत की होम विजिट बिल्कुल फ्री शामिल है और कैश व UPI दोनों विकल्प उपलब्ध हैं। नीचे दी गई शर्तें रद्दीकरण, री-शेड्यूल और रिफंड पर लागू होती हैं।'
                : 'At Washly, we believe in complete transparency and customer convenience. Every package includes a Free Door / Home Visit worth ₹99 with easy Cash and UPI payment options. Below are the terms governing booking cancellations, rescheduling, and refunds.'}
            </p>
          </div>
        </div>

        {/* Highlight Banner: Free Home Visit Worth ₹99 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 mb-6 shadow-xs flex items-center gap-3.5">
          <Sparkles className="w-6 h-6 shrink-0 fill-slate-950 text-slate-950" />
          <div className="text-xs sm:text-sm">
            <strong className="block font-black text-sm sm:text-base">
              {isHindi ? 'फ्री होम विजिट (₹99 वैल्यू मुफ्त) + पेंट-सेफ केयर' : 'Free Door / Home Visit Worth ₹99 + Paint-Safe Care'}
            </strong>
            <span>
              {isHindi
                ? 'हमारी टीम आपके पते पर ₹99 की होम विजिट बिना किसी अतिरिक्त शुल्क के लाती है और काम में किसी कमी पर तुरंत ऑन-स्पॉट री-टच करती है।'
                : 'Our doorstep team brings a ₹99 home visit at zero extra fee and provides an instant on-the-spot re-touch if any area needs extra attention.'}
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">

          {/* Section 1: Free Cancellation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? '1. निःशुल्क रद्दीकरण (Free Cancellation Window)' : '1. Free Cancellation Window'}</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
              <li>
                <strong className="text-slate-800">{isHindi ? 'सर्विस स्लॉट से 1 घंटा पहले तक:' : 'Up to 1 hour before scheduled slot:'}</strong>{' '}
                {isHindi ? 'आप बिना किसी शुल्क के कभी भी अपनी बुकिंग रद्द कर सकते हैं।' : 'You can cancel your booking completely free of charge at zero penalty.'}
              </li>
              <li>
                <strong className="text-slate-800">{isHindi ? 'वैन रास्ते में होने पर:' : 'When the technician is already en-route or at location:'}</strong>{' '}
                {isHindi ? 'यदि सर्विस वैन आपके पते पर पहुंच चुकी है और बिना किसी वैध कारण के रद्दीकरण किया जाता है, तो न्यूनतम विजिट शुल्क (₹50) लग सकता है।' : 'If the service unit has already arrived at your address and service is refused without valid cause, a minimal travel allowance of ₹50 may apply.'}
              </li>
            </ul>
          </div>

          {/* Section 2: Rescheduling */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? '2. तारीख व समय स्लॉट बदलना (Rescheduling)' : '2. Rescheduling Policy'}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'यदि किसी कारणवश आपको निर्धारित समय पर बाहर जाना पड़े, तो आप अपनी प्रोफ़ाइल में जाकर या हमारे व्हाट्सएप हेल्पलाइन (+91 96852 32340) पर संदेश भेजकर किसी अन्य तारीख या समय का स्लॉट निःशुल्क चुन सकते हैं।'
                : 'Need to change your wash time? You can reschedule your booking to another available slot at zero extra charge through your account dashboard or by messaging our WhatsApp support (+91 96852 32340).'}
            </p>
          </div>

          {/* Section 3: Refunds */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? '3. ऑनलाइन प्रीपेड बुकिंग्स का रिफंड' : '3. Online Prepaid Order Refunds'}</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
              <li>
                <strong className="text-slate-800">{isHindi ? 'कैश ऑन डिलीवरी (COD):' : 'Cash / On-Site Payment (COD):'}</strong>{' '}
                {isHindi ? 'इसमें पहले कोई पैसा नहीं काटा जाता, अतः रद्दीकरण पर रिफंड का कोई झंझट नहीं है।' : 'No payment is taken upfront, eliminating refund hassle upon cancellation.'}
              </li>
              <li>
                <strong className="text-slate-800">{isHindi ? 'ऑनलाइन भुगतान (UPI/कार्ड):' : 'Prepaid Online Orders (UPI/Card):'}</strong>{' '}
                {isHindi ? 'यदि अग्रिम ऑनलाइन भुगतान किया गया है और बुकिंग रद्द होती है, तो रिफंड 24 घंटे के भीतर प्रोसेस किया जाएगा और 3-5 कार्य दिवसों में आपके बैंक खाते/UPI खाते में वापस आ जाएगा।' : 'If an order was prepaid online and cancelled within the eligible window, the refund is initiated within 24 hours and credited to your original payment source within 3-5 business days.'}
              </li>
            </ul>
          </div>

          {/* Section 4: Severe Weather or Technical Issues */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? '4. अप्रत्याशित मौसम या तकनीकी बाधा' : '4. Bad Weather or Technical Exceptions'}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'भारी बारिश, जलभराव या सुरक्षा कारणों से यदि हमारी वैन समय पर नहीं पहुंच पाती, तो ग्राहक को तुरंत सूचित कर नया सुविधाजनक स्लॉट दिया जाएगा या पूरा अग्रिम भुगतान बिना किसी कटौती के वापस कर दिया जाएगा।'
                : 'In cases of torrential rain, severe storms, or localized waterlogging preventing safe electric power operations, Washly reserves the right to postpone the appointment with prior notice, or provide an immediate 100% refund.'}
            </p>
          </div>

          {/* Contact Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                {isHindi ? 'रद्दीकरण या रिफंड में सहायता चाहिए?' : 'Need Help with a Cancellation or Refund?'}
              </h3>
              <p className="text-xs text-slate-600">
                {isHindi ? 'हमसे सीधे संपर्क करें: व्हाट्सएप या फोन कॉल' : 'Connect with our Indore support desk instantly:'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://wa.me/919685232340?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20Washly!%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%AC%E0%A5%81%E0%A4%95%E0%A4%BF%E0%A4%82%E0%A4%97%20%E0%A4%B0%E0%A4%A6%E0%A5%8D%E0%A4%A6%20%E0%A4%AF%E0%A4%BE%20%E0%A4%B0%E0%A4%BF%E0%A4%AB%E0%A4%82%E0%A4%A1%20%E0%A4%95%E0%A5%87%20%E0%A4%B2%E0%A4%BF%E0%A4%8F%20%E0%A4%B8%E0%A4%B9%E0%A4%BE%E0%A4%AF%E0%A4%A4%E0%A4%BE%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Helpline</span>
              </a>
              <a
                href="mailto:support@washly.in"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>support@washly.in</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

