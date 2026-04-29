'use client';

import { useAcreFlowStore } from '@/lib/store';
import { MapPin, Building2, ArrowRight } from 'lucide-react';

interface CityCard {
  name: string;
  gradient: string;
  darkGradient: string;
  propertyCount: string;
  avgPrice: string;
  topLocalities: string[];
  icon: string;
}

const cities: CityCard[] = [
  {
    name: 'Chennai',
    gradient: 'from-[#0A192F] to-[#1E40AF]',
    darkGradient: 'dark:from-[#0F2744] dark:to-[#2563EB]',
    propertyCount: '2,100+',
    avgPrice: '₹5,500 – ₹14,000/sqft',
    topLocalities: ['Anna Nagar', 'OMR', 'Velachery'],
    icon: '🏛️',
  },
  {
    name: 'Mumbai',
    gradient: 'from-[#1E3A5F] to-[#3B82F6]',
    darkGradient: 'dark:from-[#1D3461] dark:to-[#60A5FA]',
    propertyCount: '3,200+',
    avgPrice: '₹12,000 – ₹28,000/sqft',
    topLocalities: ['Andheri', 'Bandra', 'Powai'],
    icon: '🌆',
  },
  {
    name: 'Delhi',
    gradient: 'from-[#334155] to-[#475569]',
    darkGradient: 'dark:from-[#1E293B] dark:to-[#475569]',
    propertyCount: '2,500+',
    avgPrice: '₹8,500 – ₹18,000/sqft',
    topLocalities: ['Dwarka', 'Rohini', 'Lajpat Nagar'],
    icon: '🏛️',
  },
  {
    name: 'Bangalore',
    gradient: 'from-[#134E4A] to-[#14B8A6]',
    darkGradient: 'dark:from-[#134E4A] dark:to-[#2DD4BF]',
    propertyCount: '2,800+',
    avgPrice: '₹5,200 – ₹12,000/sqft',
    topLocalities: ['Whitefield', 'Electronic City', 'HSR Layout'],
    icon: '🏙️',
  },
  {
    name: 'Hyderabad',
    gradient: 'from-[#064E3B] to-[#10B981]',
    darkGradient: 'dark:from-[#064E3B] dark:to-[#34D399]',
    propertyCount: '1,800+',
    avgPrice: '₹4,500 – ₹9,000/sqft',
    topLocalities: ['HITEC City', 'Gachibowli', 'Kondapur'],
    icon: '🕌',
  },
  {
    name: 'Pune',
    gradient: 'from-[#164E63] to-[#06B6D4]',
    darkGradient: 'dark:from-[#164E63] dark:to-[#22D3EE]',
    propertyCount: '1,600+',
    avgPrice: '₹4,800 – ₹10,500/sqft',
    topLocalities: ['Hinjewadi', 'Wakad', 'Baner'],
    icon: '🏢',
  },
];

export default function CityShowcase() {
  const { setSelectedCity, setView } = useAcreFlowStore();

  const handleCityClick = (cityName: string) => {
    setSelectedCity(cityName);
    setView('search');
  };

  return (
    <section className="py-12 md:py-16 bg-cream dark:bg-[#0A192F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
            Explore Properties in Top Cities
          </h2>
          <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-1">
            Find your perfect property across India&apos;s fastest-growing cities
          </p>
        </div>

        {/* City grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCityClick(city.name)}
              className="group relative overflow-hidden rounded-2xl text-left cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Gradient background */}
              <div className={`bg-gradient-to-br ${city.gradient} ${city.darkGradient} p-5 md:p-6 min-h-[220px] flex flex-col justify-between`}>
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`city-${city.name}`} x="0" y="0" width="40" height="60" patternUnits="userSpaceOnUse">
                        <rect x="5" y="5" width="12" height="55" rx="1" fill="white" />
                        <rect x="22" y="15" width="10" height="45" rx="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#city-${city.name})`} />
                  </svg>
                </div>

                <div className="relative z-10">
                  {/* Top row: icon + property count */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{city.icon}</span>
                    <span className="text-xs font-medium text-white/80 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1">
                      {city.propertyCount} Properties
                    </span>
                  </div>

                  {/* City name */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {city.name}
                  </h3>

                  {/* Avg price */}
                  <div className="flex items-center gap-1.5 text-white/80 text-sm mb-4">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{city.avgPrice}</span>
                  </div>

                  {/* Top localities */}
                  <div className="flex flex-wrap gap-1.5">
                    {city.topLocalities.map((locality) => (
                      <span
                        key={locality}
                        className="text-xs bg-white/15 backdrop-blur-sm text-white/90 rounded-full px-2.5 py-0.5 font-medium"
                      >
                        {locality}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explore arrow (bottom right) */}
                <div className="relative z-10 flex justify-end mt-4">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
