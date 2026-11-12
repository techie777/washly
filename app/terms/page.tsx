'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, CheckCircle, Clock, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function TermsPage() {
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
                <FileText className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isHindi ? 'उपयोग के नियम व शर्तें (Terms of Use)' : 'Terms of Use & Service Agreement'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'अंतिम अपडेट: 1 जनवरी 2026 • Washly Doorstep Car Care Pvt. Ltd.' : 'Last Updated: January 1, 2026 • Washly Doorstep Car Care Pvt. Ltd.'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {isHindi
                ? 'Washly प्लेटफ़ॉर्म का उपयोग करने या डोरस्टेप कार व बाइक वॉश सेवा बुक करने से पूर्व कृपया इन नियमों व शर्तों को ध्यानपूर्वक पढ़ें। सेवा बुक करने पर यह माना जाएगा कि आप इन शर्तों से पूर्णतः सहमत हैं।'
                : 'Please read these terms and conditions carefully before booking or utilizing doorstep vehicle wash services with Washly. By placing a booking through our website, WhatsApp, or phone, you agree to be bound by these terms.'}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">

          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <span>{isHindi ? 'डोरस्टेप सेवा व कार्यप्रणाली' : 'Doorstep Service Scope & Operations'}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'Washly इंदौर शहर के निर्धारित पिनकोड क्षेत्रों में ग्राहकों के घर, अपार्टमेंट या कार्यालय की पार्किंग में ऑन-डिमांड कार व बाइक धुलाई सेवा प्रदान करता है। हमारी सर्विस यूनिट्स में हाई-प्रेशर मशीन, स्नो फोम गन, वैक्यूम व पॉलिशर जैसी आवश्यक मशीनें उपलब्ध होती हैं। पानी एवं बिजली के ऑन-बोर्ड विकल्प भविष्य के लिए प्रस्तावित हैं—फिलहाल वॉशिंग के दौरान पानी व बिजली का कनेक्शन ग्राहक द्वारा उपलब्ध कराया जाएगा।'
                : 'Washly provides on-demand doorstep automotive detailing and wash services at customer parking locations (residential societies, bungalows, offices) across serviced localities in Indore, MP. Our service bikes and vans carry high-pressure washers, foam guns, and vacuums. Onboard water and power options are planned for the future; currently, water and an electricity connection must be provided by the customer during the wash.'}
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <span>{isHindi ? 'ग्राहक की जिम्मेदारियां व पार्किंग अनुमति' : 'Customer Responsibilities & Parking Access'}</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
              <li>
                {isHindi
                  ? 'ग्राहक को यह सुनिश्चित करना होगा कि वाहन ऐसी जगह पार्क हो जहां हमारी सर्विस यूनिट पहुंच सके और धुलाई के लिए पर्याप्त जगह हो।'
                  : 'Customer must ensure suitable vehicle parking access with reasonable clearance for our technician and equipment.'}
              </li>
              <li>
                {isHindi
                  ? 'सोसायटी या अपार्टमेंट परिसर में यदि बाहरी सर्विस वैन के प्रवेश हेतु अनुमति की आवश्यकता है, तो ग्राहक सुरक्षा गार्ड को पूर्व सूचना देंगे।'
                  : 'If society or gate permission is required for wash van/bike entry, the customer is responsible for clearing security gate entry.'}
              </li>
              <li>
                {isHindi
                  ? 'इंटीरियर वैक्यूम सेवा के दौरान वाहन के अंदर से सभी मूल्यवान वस्तुएं, गहने या नकदी निकाल लें।'
                  : 'Customers are advised to remove all personal valuables, jewelry, and cash from the vehicle before interior detailing.'}
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <span>{isHindi ? 'मूल्य निर्धारण, फ्री होम विजिट व पेमेंट नीति' : 'Pricing, Free Home Visit & Payment Policy'}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'सभी कीमतें पारदर्शी हैं और इनमें सभी टैक्स व ₹99 की डोर/होम विजिट शामिल है। कोई छिपा हुआ शुल्क नहीं है। ग्राहक सेवा पूर्ण होने पर आसान कैश या UPI (Google Pay, PhonePe, Paytm) के माध्यम से भुगतान कर सकते हैं।'
                : 'All package rates displayed on Washly are transparent, inclusive of all taxes and Free Door / Home Visit worth ₹99, with zero hidden fees. Payment is due upon completion via Cash or instant UPI.'}
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">4</span>
              <span>{isHindi ? 'सुरक्षा, पेंट-सेफ केयर व दायित्व' : 'Safety, Paint-Safe Care & Liability'}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'हम वाहन की सुरक्षा के लिए उच्च गुणवत्ता वाले 500 GSM माइक्रोफाइबर टॉवेल्स और पीएच-न्यूट्रल शैम्पू का उपयोग करते हैं। वाहन में पहले से मौजूद खरोंच, डेंट, या पेंट उड़ने के लिए Washly उत्तरदायी नहीं होगा। सर्विस शुरू करने से पहले तकनीशियन वाहन का प्रारंभिक निरीक्षण कर सकते हैं।'
                : 'We deploy professional-grade 500+ GSM microfiber towels and pH-balanced snow foam to prevent swirl marks. Washly is not liable for pre-existing vehicle damages, stone chips, repainted non-OEM panels peeling, or pre-existing interior electrical defects.'}
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-2">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">5</span>
              <span>{isHindi ? 'लागू कानून व न्यायिक क्षेत्र' : 'Governing Law & Jurisdiction'}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'ये नियम व शर्तें भारत के कानूनों के अधीन हैं। किसी भी विवाद की स्थिति में इंदौर (मध्य प्रदेश) स्थित न्यायालयों का विशेष क्षेत्राधिकार होगा।'
                : 'These Terms of Use are governed by the laws of India. Any legal dispute or claims arising out of doorstep services will be subject to the exclusive jurisdiction of the competent courts in Indore, Madhya Pradesh.'}
            </p>
          </div>

          {/* Contact Box */}
          <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                {isHindi ? 'कोई प्रश्न या स्पष्टीकरण चाहिए?' : 'Have Questions About Our Terms?'}
              </h3>
              <p className="text-xs text-slate-600">
                {isHindi ? 'हमारी इंदौर हेल्पलाइन पर संपर्क करें: सुबह 7:00 से रात 8:00 तक' : 'Reach out to our customer helpline in Indore: 7:00 AM - 8:00 PM'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:+919685232340"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-amber-400 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 96852 32340</span>
              </a>
              <a
                href="mailto:support@washly.in"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-slate-800 font-bold text-xs hover:bg-amber-50 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>support@washly.in</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

