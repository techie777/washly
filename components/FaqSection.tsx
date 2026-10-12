'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function FaqSection() {
  const { isHindi } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(0); // First item open by default

  const faqs = [
    {
      q: isHindi 
        ? 'क्या मुझे पानी या बिजली का कनेक्शन देना होगा?' 
        : 'Do I need to provide water or electricity?',
      a: isHindi 
        ? 'बिल्कुल नहीं! हमारी कस्टम-इक्विप्ड वैन में 500 लीटर शुद्ध सॉफ्ट पानी का टैंक और खुद का साइलेंट इनवर्टर जनरेटर ऑन-बोर्ड लगा है। आपको अपनी तरफ से एक बूँद पानी या बिजली का प्लग देने की कोई ज़रूरत नहीं है।'
        : 'Not at all! Our doorstep van is equipped with a 500-liter purified soft water tank and an onboard silent generator. Zero water or power is needed from your home.'
    },
    {
      q: isHindi 
        ? 'गाड़ी धोने में कितना समय लगता है?' 
        : 'How long does the wash process take?',
      a: isHindi 
        ? 'एक्सटीरियर प्रेशर फोम वॉश में 30 से 35 मिनट लगते हैं। वहीं कम्प्लीट इंटीरियर डीप वैक्यूम और रोटेटर शाइन वाले पैकेज में 50 से 60 मिनट लगते हैं।'
        : 'Standard exterior pressure foam wash takes 30-35 minutes. Full deep detailing with interior vacuuming takes approximately 50-60 minutes.'
    },
    {
      q: isHindi 
        ? 'क्या फ्लैट/अपार्टमेंट की बेसमेंट या कवर्ड पार्किंग में सर्विस संभव है?' 
        : 'Can you wash inside apartment basement parking?',
      a: isHindi 
        ? 'हाँ, 100%! हमारे पास 30 मीटर (100 फीट) लंबी फ्लेक्सिबल प्रेशर होज पाइप होती है। वैन बाहर सोसायटी गेट या पार्किंग लेन में रहती है और पाइप आपकी गाड़ी तक आसानी से पहुँच जाती है।'
        : 'Yes, absolutely! We carry a 30-meter high-pressure hose. The van parks in the driveway while the hose reaches your parking slot without disturbing neighbors.'
    },
    {
      q: isHindi 
        ? 'गाड़ी के पेंट पर खरोंच (स्वर्ल मार्क्स) तो नहीं आएगी?' 
        : 'Will there be any scratches or swirl marks?',
      a: isHindi 
        ? '100% स्क्रैच-फ्री गारंटी है। हम इंटरनेशनल स्टैंडर्ड 500 GSM के सुपर-सॉफ्ट माइक्रोफाइबर और pH-न्यूट्रल शैम्पू का इस्तेमाल करते हैं। कभी भी गंदे कपड़े से गाड़ी नहीं घिसते।'
        : '100% Scratch-free guarantee. We use 500 GSM microfiber cloths and pH-neutral foam shampoos. No rough rubbing or dirty recycled rags.'
    },
    {
      q: isHindi 
        ? 'धुलाई के तुरंत बाद बारिश हो जाए तो क्या होगा?' 
        : 'What if it rains right after the wash?',
      a: isHindi 
        ? 'Washly रेन गारंटी: यदि धुलाई पूरी होने के 6 घंटे के भीतर बारिश हो जाती है, तो हमारे ऑपरेटर अगले दिन आपके पास आकर फ्री वाटर-स्पॉट टच-अप और ग्लास क्लीनिंग कर देंगे।'
        : 'Washly Rain Protection: If it rains within 6 hours of your service, we provide a free exterior touch-up the very next day upon request.'
    },
    {
      q: isHindi 
        ? 'पेमेंट कब और कैसे करना है?' 
        : 'When and how do I make the payment?',
      a: isHindi 
        ? 'कोई एडवांस पेमेंट नहीं! धुलाई पूरी होने के बाद जब आप अपनी गाड़ी की चमक से 100% संतुष्ट हो जाएँ, तभी आप ऑपरेटर को नकद (Cash) या किसी भी UPI (Google Pay, PhonePe, Paytm) से भुगतान कर सकते हैं।'
        : 'Zero advance payment! You inspect the vehicle and pay only after 100% satisfaction via Cash or any UPI app (GPay, PhonePe, Paytm).'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Questions'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            {isHindi ? 'मन में कोई सवाल है?' : 'Got Questions?'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isHindi 
              ? 'डोरस्टेप कार और बाइक वॉश से जुड़े सबसे महत्वपूर्ण सवालों के सीधे व स्पष्ट जवाब।'
              : 'Clear and direct answers about our doorstep car & bike wash services in Indore.'}
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'border-amber-400 bg-amber-50/30 shadow-md shadow-amber-500/5' 
                    : 'border-slate-200 bg-white hover:border-amber-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4.5 px-5 sm:px-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`text-sm sm:text-base font-bold transition-colors ${
                    isOpen ? 'text-slate-950' : 'text-slate-800'
                  }`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-slate-950 text-amber-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-amber-200/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isHindi ? 'कोई और सवाल या खास मांग है?' : 'Have a custom inquiry or special requirement?'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {isHindi 
                ? 'हमारे इंदौर कस्टमर केयर से तुरंत बात करें'
                : 'Chat with our Indore support team directly'}
            </p>
          </div>
          <a
            href="https://wa.me/919685232340?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20Washly!%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B5%E0%A5%89%E0%A4%B6%20%E0%A4%95%E0%A5%87%20%E0%A4%AC%E0%A4%BE%E0%A4%B0%E0%A5%87%20%E0%A4%AE%E0%A5%87%E0%A4%82%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-colors"
          >
            {isHindi ? 'व्हाट्सएप पर पूछें' : 'Ask on WhatsApp'}
          </a>
        </div>

      </div>
    </section>
  );
}
