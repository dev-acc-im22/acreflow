'use client';

import { Fragment } from 'react';
import {
  MapPin,
  TrendingUp,
  Star,
  Users,
  Shield,
  ChevronRight,
  Home,
  Building2,
} from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';

const TRUST_STATS = [
  { value: '10K+', label: 'Properties', icon: TrendingUp },
  { value: '50+', label: 'Cities', icon: MapPin },
  { value: '5K+', label: 'Happy Customers', icon: Users },
  { value: '₹0', label: 'Brokerage', icon: Star },
];

const QUICK_LINKS = [
  { label: 'Ready to Move', icon: Home },
  { label: 'Under Construction', icon: Building2 },
  { label: 'New Launches', icon: Star },
  { label: 'Verified Properties', icon: Shield },
];

export default function HeroSearch() {
  const { filters, setFilters, setView } = useAcreFlowStore();

  function handleQuickLinkClick(label: string) {
    switch (label) {
      case 'Ready to Move':
        setFilters({ readyToMoveOnly: true });
        break;
      case 'Under Construction':
        setFilters({ possessionStatus: 'under-construction' });
        break;
      case 'New Launches':
        setFilters({ sortBy: 'newest' });
        break;
      case 'Verified Properties':
        setFilters({ verifiedOnly: true });
        break;
    }
    setView('search');
  }

  return (
    <section className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-20 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          {/* Left: Headline + Subheadline + Trust Stats */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-[1.15] tracking-tight">
              Find Your Dream Property{' '}
              <span className="text-royal">Without Brokerage</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 mt-5 leading-relaxed max-w-lg">
              Browse verified listings across top Indian cities. Zero brokerage, direct owner connect, and data-driven insights.
            </p>

            {/* Trust Stats - horizontal */}
            <div className="mt-10">
              {/* Mobile: 2x2 grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:hidden">
                {TRUST_STATS.map((stat) => (
                  <div key={stat.label} className="text-center px-3 py-4">
                    <stat.icon className="size-5 text-royal mx-auto mb-2" />
                    <p className="text-xl font-bold text-navy">{stat.value}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Desktop: inline with dividers */}
              <div className="hidden lg:flex items-center gap-8">
                {TRUST_STATS.map((stat, index) => (
                  <Fragment key={stat.label}>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-sky/50 flex items-center justify-center shrink-0">
                        <stat.icon className="size-5 text-royal" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-navy">{stat.value}</p>
                        <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                      </div>
                    </div>
                    {index < TRUST_STATS.length - 1 && (
                      <div className="w-px h-12 bg-gray-200" />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Links */}
          <div className="shrink-0 w-full lg:w-64">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Quick Explore
            </p>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleQuickLinkClick(link.label)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 hover:border-royal/30 hover:shadow-sm transition-all group min-w-fit lg:min-w-0 bg-white"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky/40 flex items-center justify-center shrink-0 group-hover:bg-royal/10 transition-colors">
                    <link.icon className="size-[18px] text-royal" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-navy transition-colors whitespace-nowrap">
                    {link.label}
                  </span>
                  <ChevronRight className="size-4 text-gray-300 group-hover:text-royal transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
