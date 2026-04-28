'use client'

import { Building2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const agents = [
  {
    name: 'Suresh Properties',
    experience: '15 years exp',
    deals: '200+',
    rating: 4.8,
  },
  {
    name: 'Chennai Homes',
    experience: '10 years exp',
    deals: '150+',
    rating: 4.7,
  },
  {
    name: 'Green Valley Realty',
    experience: '8 years exp',
    deals: '120+',
    rating: 4.9,
  },
  {
    name: 'Metro Builders',
    experience: '12 years exp',
    deals: '180+',
    rating: 4.6,
  },
]

export default function TopAgents() {
  return (
    <section className="py-16 bg-cream dark:bg-[#0A192F]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-navy dark:text-white text-center font-montserrat">
          Trusted Agents &amp; Builders
        </h2>
        <p className="text-slate-accent dark:text-[#94A3B8] text-center font-montserrat">
          Verified professionals with proven track records
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {agents.map((a, i) => {
            const fullStars = Math.floor(a.rating)
            const hasHalf = a.rating % 1 >= 0.5

            return (
              <div
                key={i}
                className="bg-white dark:bg-[#112240] rounded-xl border dark:border-[#1D3461] p-5 text-center hover:shadow-md transition"
              >
                {/* Avatar */}
                <div className="w-16 h-16 mx-auto rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                  <Building2 size={28} className="text-royal dark:text-[#60A5FA]" />
                </div>

                {/* Name */}
                <p className="text-sm font-semibold text-navy dark:text-white mt-3 font-montserrat">
                  {a.name}
                </p>

                {/* Experience */}
                <p className="text-xs text-slate-accent dark:text-[#94A3B8] font-montserrat">
                  {a.experience}
                </p>

                {/* Deals */}
                <p className="text-xs font-medium text-royal dark:text-[#60A5FA] mt-1 font-montserrat">
                  {a.deals} Deals
                </p>

                {/* Stars */}
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={13}
                      className={
                        si < fullStars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200 dark:text-[#334155]'
                      }
                    />
                  ))}
                </div>

                {/* Rating number */}
                <p className="text-xs text-slate-accent dark:text-[#94A3B8] mt-0.5 font-montserrat">
                  {a.rating}★
                </p>

                {/* Contact button */}
                <Button className="mt-3 w-full bg-royal hover:bg-royal-dark text-white rounded-lg h-9 text-xs font-semibold font-montserrat">
                  Contact
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
