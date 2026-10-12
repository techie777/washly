'use client';

import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';

export default function SocialProofSection() {
  const { isHindi } = useTranslation();
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const testimonials = isHindi
    ? [
        {
          name: 'अमित पटेल',
          area: 'विजय नगर, इंदौर',
          comment: 'सुबह 8 बजे वैन मेरे घर आ गई। बिना पानी या बिजली मांगे उन्होंने मेरी क्रेटा को ऐसा चमका दिया जैसे शोरूम से नई निकली हो!',
          rating: 5,
        },
        {
          name: 'रोहित वर्मा',
          area: 'स्कीम 54, इंदौर',
          comment: 'कार वॉश सेंटर पर 2 घंटे बर्बाद करने से छुटकारा मिल गया। हाई प्रेशर जेट वॉश और मशीन पॉलिश वाकई पैसे वसूल है।',
          rating: 5,
        },
        {
          name: 'डॉ. नेहा शर्मा',
          area: 'साकेत नगर, इंदौर',
          comment: 'मेरे अपार्टमेंट की पार्किंग में ही पूरी सफाई और वैक्यूमिंग हो गई। फ्री परफ्यूम की खुशबू भी बहुत अच्छी है।',
          rating: 5,
        },
      ]
    : [
        {
          name: 'Amit Patel',
          area: 'Vijay Nagar, Indore',
          comment: 'The van arrived right at 8 AM. Without asking for water or power, they washed my Creta like a brand new showroom car!',
          rating: 5,
        },
        {
          name: 'Rohit Verma',
          area: 'Scheme 54, Indore',
          comment: 'No more wasting 2 hours at local car wash centers. High-pressure jet wash and machine rotator shine is 100% value for money.',
          rating: 5,
        },
        {
          name: 'Dr. Neha Sharma',
          area: 'Saket Nagar, Indore',
          comment: 'Done right in my apartment parking lot. Complete foam wash, interior vacuuming and free perfume. Super convenient!',
          rating: 5,
        },
      ];

  const nextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentReview = testimonials[activeReviewIndex] || testimonials[0];

  return (
    <section id="reviews" className="py-18 sm:py-24 relative bg-gradient-to-b from-[#FAF4E8] via-[#F6EDE0] to-[#FAF3E6] border-b border-amber-200/90 overflow-hidden">
      {/* Soft warm amber ambient glow */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-6 right-10 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-800 text-xs font-semibold mb-2.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'संतुष्ट ग्राहक' : 'Verified Reviews'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {isHindi ? 'इंदौर के ग्राहकों का' : 'Loved by Vehicle Owners in'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">{isHindi ? 'भरोसा' : 'Indore'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {isHindi 
              ? 'सैकड़ों वाहन मालिक नियमित रूप से घर बैठे हमारी सेवा का आनंद लेते हैं।'
              : 'Real customer feedback from doorstep foam wash and rotator shine sessions.'}
          </p>
        </div>

        {/* Clean Testimonial Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md relative overflow-hidden">
            <Quote className="w-14 h-14 text-slate-100 absolute top-4 right-5 pointer-events-none" />
            
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-amber-400/30 flex items-center justify-center font-black text-base text-amber-400 shadow-2xs">
                  {currentReview.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {currentReview.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {currentReview.area}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center space-x-0.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                {[...Array(currentReview.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed mb-6">
              "{currentReview.comment}"
            </p>

            {/* Carousel Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReviewIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === activeReviewIndex ? 'w-6 bg-slate-950' : 'w-2 bg-slate-200'
                    }`}
                    title={`Review ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={prevReview}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextReview}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
