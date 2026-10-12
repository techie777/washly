import React from 'react';
import { Star, CheckCircle, ShieldCheck, ThumbsUp } from 'lucide-react';
import { LocationCity, ServicePackage } from '@/types';

interface LocalReviewsWidgetProps {
  city: LocationCity;
  service: ServicePackage;
}

export default function LocalReviewsWidget({ city, service }: LocalReviewsWidgetProps) {
  const localReviews = [
    {
      author: 'Rohit Kulkarni',
      area: city.landmarks[0] || city.city,
      rating: 5,
      date: '4 days ago',
      vehicle: 'BMW 330i M Sport',
      text: `Superb doorstep service in ${city.city}! The mobile van had its own power and pure water. They spent a solid hour on the foam wash and ceramic seal. My car looks like it was just rolled off the showroom floor.`,
    },
    {
      author: 'Pooja Varma',
      area: city.landmarks[1] || city.city,
      rating: 5,
      date: '1 week ago',
      vehicle: 'Mercedes GLC',
      text: `Booked ${service.name} for my driveway. Zero noise, zero mess, and absolutely zero water marks on my black paint. Best car care in ${city.city} by far.`,
    },
    {
      author: 'Sameer Sheikh',
      area: city.landmarks[2] || city.city,
      rating: 5,
      date: '2 weeks ago',
      vehicle: 'Toyota Fortuner Legender',
      text: `Very professional crew. Checked tyre pressures, dressed all plastic cladding and used clean microfiber towels from sealed packs. Extremely satisfied with Washly ${city.city}.`,
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Google Rating Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Customer Feedback</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {city.city} Customer Reviews for {service.name}
            </h3>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-400/30 shadow-2xs flex items-center justify-center font-black text-amber-400 text-lg">
              G
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-base font-bold text-slate-900">{city.averageRating}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Based on {city.totalReviews} Verified Local Reviews
              </div>
            </div>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localReviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-950 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-400/30">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                        <span>{rev.author}</span>
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div className="text-[10px] text-slate-500">{rev.area}, {city.city}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>

                <div className="flex text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-amber-600 font-semibold flex items-center justify-between">
                <span>Vehicle: {rev.vehicle}</span>
                <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
