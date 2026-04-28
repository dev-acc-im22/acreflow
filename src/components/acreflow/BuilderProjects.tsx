'use client'

import { Building2, MapPin, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const projects = [
  {
    name: 'Prestige Belle Vue',
    builder: 'Prestige Group',
    locality: 'Anna Nagar',
    price: '₹85L - 1.5Cr',
    configs: ['2', '3', '4'],
    type: 'BHK',
    verified: true,
    rera: true,
  },
  {
    name: 'Hiranandani Egattur',
    builder: 'Hiranandani Communities',
    locality: 'OMR',
    price: '₹62L - 1.2Cr',
    configs: ['1', '2', '3'],
    type: 'BHK',
    verified: true,
    rera: true,
  },
  {
    name: 'VIP Golf Avenue',
    builder: 'VIP Housing',
    locality: 'ECR',
    price: '₹1.5Cr - 3Cr',
    configs: ['3', '4'],
    type: 'BHK Villa',
    verified: true,
    rera: true,
  },
  {
    name: 'Casagrand Florenza',
    builder: 'Casagrand Builder',
    locality: 'Porur',
    price: '₹55L - 95L',
    configs: ['1', '2', '3'],
    type: 'BHK',
    verified: true,
    rera: true,
  },
  {
    name: 'Purva Windermere',
    builder: 'Puravankara',
    locality: 'Pallikaranai',
    price: '₹70L - 1.1Cr',
    configs: ['2', '3'],
    type: 'BHK',
    verified: true,
    rera: true,
  },
  {
    name: 'Akshaya Today',
    builder: 'Akshaya Homes',
    locality: 'OMR',
    price: '₹48L - 85L',
    configs: ['1', '2'],
    type: 'BHK',
    verified: true,
    rera: true,
  },
]

export default function BuilderProjects() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy font-montserrat">
              Top Builder Projects
            </h2>
            <p className="text-sm text-slate-accent font-montserrat">
              Premium projects from trusted builders
            </p>
          </div>
          <Button variant="outline" className="font-montserrat">
            View All Projects
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border overflow-hidden property-card"
            >
              {/* Image area */}
              <div className="h-44 bg-gradient-to-br from-navy/5 to-royal/10 flex flex-col items-center justify-center relative">
                <Building2 size={40} className="text-royal/20" />
                <span className="text-xs text-royal/40 font-medium mt-2 font-montserrat">
                  {p.name}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-slate-accent font-montserrat">
                  {p.builder}
                </p>
                <h3 className="text-base font-semibold text-navy mt-1 font-montserrat">
                  {p.name}
                </h3>

                <div className="flex items-center gap-1 mt-1.5">
                  <MapPin size={13} className="text-slate-accent" />
                  <span className="text-sm text-slate-accent font-montserrat">
                    {p.locality}, Chennai
                  </span>
                </div>

                <p className="text-sm font-bold text-royal mt-2 font-montserrat">
                  {p.price}
                </p>

                {/* Config badges */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {p.configs.map((c) => (
                    <span
                      key={c}
                      className="bg-sky rounded-full px-2 py-0.5 text-xs text-navy font-montserrat"
                    >
                      {c} {p.type}
                    </span>
                  ))}
                </div>

                {/* Verified + RERA badges */}
                <div className="flex items-center gap-3 mt-2.5">
                  {p.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-success font-medium font-montserrat">
                      <BadgeCheck size={13} className="text-success" />
                      Verified
                    </span>
                  )}
                  {p.rera && (
                    <span className="text-xs text-slate-accent font-montserrat">
                      RERA Approved
                    </span>
                  )}
                </div>

                <button className="text-royal text-sm font-semibold hover:underline mt-3 font-montserrat">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
