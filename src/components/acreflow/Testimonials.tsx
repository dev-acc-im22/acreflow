'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'First-time Buyer',
    stars: 5,
    quote:
      'AcreFlow made buying our first home completely stress-free. The verified listings gave us confidence, and zero brokerage saved us lakhs!',
    property: 'Bought 3 BHK in Anna Nagar',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Property Owner',
    stars: 5,
    quote:
      'As a property owner, I got genuine leads within 24 hours of posting. The platform\'s reach is incredible.',
    property: 'Listed 2 BHK in T Nagar',
  },
  {
    name: 'Amit Patel',
    role: 'Investor',
    stars: 4,
    quote:
      'The EMI calculator and price trends helped me make an informed decision. Highly recommended for serious buyers.',
    property: 'Invested in OMR property',
  },
  {
    name: 'Sneha Reddy',
    role: 'IT Professional',
    stars: 5,
    quote:
      'The comparison feature let me evaluate 3 properties side by side. Made the final decision so much easier!',
    property: 'Bought 2 BHK in Velachery',
  },
  {
    name: 'Dr. Venkat',
    role: 'Landlord',
    stars: 5,
    quote:
      'Posted my apartment for rent and found a tenant within a week. The rental agreement service was a bonus!',
    property: 'Rented 3 BHK in Adyar',
  },
  {
    name: 'Meera Krishnan',
    role: 'Family Buyer',
    stars: 4,
    quote:
      'The locality insights feature showed me safety ratings and nearby amenities. Exactly what I needed for my family.',
    property: 'Bought 4 BHK in Nungambakkam',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center font-montserrat">
          What Our Customers Say
        </h2>
        <p className="text-slate-accent text-center font-montserrat">
          Real stories from real homeowners
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border p-6 hover:shadow-md transition"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sky flex items-center justify-center text-royal font-bold text-lg font-montserrat shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy font-montserrat">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-accent font-montserrat">
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mt-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    size={14}
                    className={
                      si < t.stars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200'
                    }
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-accent italic leading-relaxed mt-3 font-montserrat">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Property info */}
              <p className="text-xs text-slate-light mt-2 font-montserrat">
                {t.property}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
