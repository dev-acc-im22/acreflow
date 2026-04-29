'use client';

import { useAcreFlowStore } from '@/lib/store';
import { Building2, Users, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { icon: Building2, value: '10,000+', label: 'Properties Listed' },
  { icon: Users, value: '5,000+', label: 'Owners Trust Us' },
  { icon: MapPin, value: '50+', label: 'Cities Covered' },
];

export default function PropertyOwnerCTA() {
  const { setView } = useAcreFlowStore();

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0F2744] to-royal" />

      {/* Building pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="building-pattern"
              x="0"
              y="0"
              width="60"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              {/* Building 1 */}
              <rect x="5" y="10" width="18" height="70" rx="1" fill="white" />
              <rect x="8" y="15" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
              <rect x="14" y="15" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
              <rect x="8" y="22" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
              <rect x="14" y="22" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
              <rect x="8" y="29" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
              <rect x="14" y="29" width="4" height="4" rx="0.5" fill="white" opacity="0.5" />
              {/* Building 2 */}
              <rect x="28" y="25" width="14" height="55" rx="1" fill="white" />
              <rect x="30" y="30" width="3" height="3" rx="0.5" fill="white" opacity="0.5" />
              <rect x="35" y="30" width="3" height="3" rx="0.5" fill="white" opacity="0.5" />
              <rect x="30" y="36" width="3" height="3" rx="0.5" fill="white" opacity="0.5" />
              <rect x="35" y="36" width="3" height="3" rx="0.5" fill="white" opacity="0.5" />
              {/* Building 3 */}
              <rect x="45" y="40" width="12" height="40" rx="1" fill="white" />
              <rect x="47" y="44" width="3" height="3" rx="0.5" fill="white" opacity="0.5" />
              <rect x="52" y="44" width="3" height="3" rx="0.5" fill="white" opacity="0.5" />
              <rect x="47" y="50" width="3" height="3" rx="0.5" fill="white" opacity="0.5" />
              <rect x="52" y="50" width="3" height="3" rx="0.5" fill="white" opacity="0.5" />
              {/* House */}
              <polygon points="12,5 15,0 18,5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#building-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left side - Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Building2 className="w-4 h-4 text-sky" />
              <span className="text-xs font-medium text-white/80">
                For Property Owners
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              Are you a{' '}
              <span className="text-sky">Property Owner?</span>
            </h2>
            <p className="text-sm sm:text-base text-white/70 mt-3 max-w-lg mx-auto md:mx-0 leading-relaxed">
              List your property for <span className="text-white font-semibold">FREE</span> and
              reach millions of genuine buyers and tenants. No brokerage, no hidden charges.
            </p>
          </div>

          {/* Right side - CTA */}
          <div className="flex-shrink-0">
            <Button
              size="lg"
              onClick={() => setView('post-property')}
              className="bg-white text-navy hover:bg-white/90 font-bold text-base px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all h-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post Free Property Ad
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-10 pt-8 border-t border-white/10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 text-white/80"
            >
              <stat.icon className="w-4 h-4 text-sky" />
              <span className="text-sm font-semibold text-white">
                {stat.value}
              </span>
              <span className="text-sm text-white/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
