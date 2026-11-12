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
        ? 'क्या वॉशिंग के लिए मुझे पानी और बिजली उपलब्ध करानी होगी?' 
        : 'Do I need to provide water and electricity during the wash?',
      a: isHindi 
        ? 'जी हाँ। पानी एवं बिजली के लिए हम भविष्य में ऑन-बोर्ड सुविधा की प्लानिंग कर रहे हैं। फिलहाल हमारे पास पानी और बिजली के विकल्प नहीं हैं, इसलिए वॉशिंग के दौरान आपको पानी और बिजली (पावर पॉइंट) उपलब्ध करानी होगी। हमारी टीम हाई-प्रेशर वॉशर, फोम गन, वैक्यूम और लंबी होज पाइप व केबल साथ लाती है।'
        : 'Yes. We are planning onboard water and electricity options for the future, but currently we do not have onboard water or power. You will need to provide water and an electricity point during the wash—our team brings the pressure washer, foam gun, vacuum, and long hose/extension cable.'
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
        ? 'हमारा पूरा ध्यान पेंट-सेफ केयर पर रहता है। हम इंटरनेशनल स्टैंडर्ड 500 GSM के सुपर-सॉफ्ट माइक्रोफाइबर और pH-न्यूट्रल शैम्पू का इस्तेमाल करते हैं। कभी भी गंदे कपड़े से गाड़ी नहीं घिसते।'
        : 'We follow strict paint-safe care protocols. We use 500 GSM microfiber cloths and pH-neutral foam shampoos with zero rough rubbing or dirty recycled rags.'
    },
    {
      q: isHindi 
        ? 'होम विजिट चार्ज कितना लगता है?' 
        : 'Is there any separate home visit fee?',
      a: isHindi 
        ? 'हमारी ₹99 कीमत की डोर/होम विजिट बिल्कुल फ्री है! सभी पैकेज रेट में होम विजिट और सभी टैक्स पहले से शामिल हैं—कोई अतिरिक्त विजिट चार्ज नहीं लिया जाता।'
        : 'Our Door / Home Visit worth ₹99 is completely FREE! Home visit charges and all taxes are already included in every package rate with zero extra visit fees.'
    },
    {
      q: isHindi 
        ? 'पेमेंट कब और कैसे करना है?' 
        : 'When and how do I make the payment?',
      a: isHindi 
        ? 'पेमेंट करना बेहद आसान है! सेवा पूरी होने पर आप हमारे ऑपरेटर को सीधे नकद (Cash) या किसी भी UPI ऐप (Google Pay, PhonePe, Paytm) से भुगतान कर सकते हैं।'
        : 'Payment is completely hassle-free! Once your service is completed, you can pay easily via Cash or any UPI app (GPay, PhonePe, Paytm) at your doorstep.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Questions'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight mb-3">
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
