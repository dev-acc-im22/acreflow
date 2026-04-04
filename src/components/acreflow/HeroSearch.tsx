'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type { ListingCategory, PropertyListing } from '@/types';
import { useAcreFlowStore } from '@/lib/store';
import {
  Search,
  MapPin,
  Home,
  Building2,
  Store,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Star,
  Users,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const MOCK_LOCALITIES = [
  'T Nagar',
  'Anna Nagar',
  'Velachery',
  'OMR',
  'ECR',
  'Adyar',
  'Nungambakkam',
  'Porur',
  'Guindy',
  'Sholinganallur',
  'Kelambakkam',
  'Thoraipakkam',
];

const MOCK_LANDMARKS = [
  'Chennai Central Station',
  'Chennai Airport',
  'Phoenix Mall',
  'Marina Beach',
];

const QUICK_FILTERS = [
  { label: 'Direct from Owner', filterKey: 'directOwnerOnly' as const },
  { label: 'Verified Only', filterKey: 'verifiedOnly' as const },
  { label: 'Ready to Move', filterKey: 'readyToMoveOnly' as const },
  { label: 'Under ₹50L', filterKey: 'priceUnder50L' as const },
  { label: '3+ BHK', filterKey: 'bhk3Plus' as const },
];

const TRUST_STATS = [
  { value: '10K+', label: 'Properties', icon: TrendingUp },
  { value: '50+', label: 'Cities', icon: MapPin },
  { value: '5K+', label: 'Happy Customers', icon: Users },
  { value: '₹0', label: 'Brokerage', icon: Star },
];

export default function HeroSearch() {
  const {
    filters,
    setFilters,
    setSearchQuery,
    setView,
    selectedCity,
  } = useAcreFlowStore();

  const [localQuery, setLocalQuery] = useState(filters.query || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (localQuery.length < 2) return [];

    const q = localQuery.toLowerCase();
    const filteredLocalities = MOCK_LOCALITIES.filter((loc) =>
      loc.toLowerCase().includes(q)
    );
    const filteredLandmarks = MOCK_LANDMARKS.filter((lm) =>
      lm.toLowerCase().includes(q)
    );

    return [
      ...filteredLocalities.map((loc) => ({ name: loc, type: 'locality' as const })),
      ...filteredLandmarks.map((lm) => ({ name: lm, type: 'landmark' as const })),
    ];
  }, [localQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(value?: string) {
    const query = value || localQuery;
    setSearchQuery(query);
    setFilters({ query, category: filters.category });
    setShowSuggestions(false);
    setView('search');
  }

  function handleTabChange(value: string) {
    const category = value as ListingCategory;
    setFilters({ category });
  }

  function handleSuggestionClick(suggestion: { name: string; type: string }) {
    setLocalQuery(suggestion.name);
    setShowSuggestions(false);
    handleSearch(suggestion.name);
  }

  function handleQuickFilterToggle(filterKey: string) {
    const newActiveFilters = { ...activeFilters, [filterKey]: !activeFilters[filterKey] };
    setActiveFilters(newActiveFilters);

    // Apply the filter to the store
    const isActive = newActiveFilters[filterKey];
    switch (filterKey) {
      case 'directOwnerOnly':
        setFilters({ directOwnerOnly: isActive });
        break;
      case 'verifiedOnly':
        setFilters({ verifiedOnly: isActive });
        break;
      case 'readyToMoveOnly':
        setFilters({ readyToMoveOnly: isActive });
        break;
      case 'priceUnder50L':
        setFilters({ priceRange: isActive ? [0, 5000000] : [0, 100000000] });
        break;
      case 'bhk3Plus':
        setFilters({ bhkRange: isActive ? [3, 5] : [1, 5] });
        break;
    }

    setView('search');
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch();
  }

  return (
    <section className="hero-gradient hero-pattern w-full min-h-[480px] md:min-h-[520px] relative">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 relative flex flex-col items-center gap-0">
        {/* Headline */}
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center leading-tight">
          Find Your Dream Property
        </h1>
        <p className="text-base md:text-lg text-white/80 text-center mt-3">
          Zero Brokerage. Verified Listings. Data-Driven Trust.
        </p>

        {/* Search Tabs */}
        <Tabs
          value={filters.category}
          onValueChange={handleTabChange}
          className="mt-8"
        >
          <TabsList className="bg-transparent gap-1 h-10 rounded-full p-1">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-white data-[state=active]:text-navy bg-white/20 text-white hover:bg-white/30 rounded-full px-4 md:px-6 gap-2 text-sm font-medium transition-all border-0 shadow-none"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">Buy</span>
            </TabsTrigger>
            <TabsTrigger
              value="rent"
              className="data-[state=active]:bg-white data-[state=active]:text-navy bg-white/20 text-white hover:bg-white/30 rounded-full px-4 md:px-6 gap-2 text-sm font-medium transition-all border-0 shadow-none"
            >
              <Building2 className="size-4" />
              <span className="hidden sm:inline">Rent</span>
            </TabsTrigger>
            <TabsTrigger
              value="commercial"
              className="data-[state=active]:bg-white data-[state=active]:text-navy bg-white/20 text-white hover:bg-white/30 rounded-full px-4 md:px-6 gap-2 text-sm font-medium transition-all border-0 shadow-none"
            >
              <Store className="size-4" />
              <span className="hidden sm:inline">Commercial</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div ref={searchRef} className="w-full mt-4 relative">
          <form onSubmit={handleFormSubmit}>
            <div className="rounded-2xl bg-white shadow-2xl p-2 flex items-center gap-2">
              {/* City badge */}
              <div className="flex items-center gap-2 shrink-0">
                <MapPin className="size-5 text-slate-500 ml-1" />
                <span className="bg-sky text-navy rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                  {selectedCity}
                </span>
                <div className="w-px h-8 bg-border mx-1" />
              </div>

              {/* Search input */}
              <Input
                ref={inputRef}
                type="text"
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by locality, landmark, or project name..."
                className="flex-1 h-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm md:text-base placeholder:text-slate-400 px-0"
              />

              {/* Search button */}
              <Button
                type="submit"
                className="bg-royal hover:bg-royal-dark text-white rounded-xl px-4 md:px-6 h-12 font-semibold flex items-center gap-2 shrink-0"
              >
                <Search className="size-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </form>

          {/* Auto-suggest Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-white rounded-xl shadow-2xl border border-border overflow-hidden">
              <div className="max-h-72 overflow-y-auto acreflow-scrollbar py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.name}-${index}`}
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-sky/50 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <MapPin className="size-4 text-slate-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-navy">
                        {suggestion.name}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">
                        {suggestion.type === 'locality' ? 'Locality' : 'Landmark'}, {selectedCity}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.filterKey}
              type="button"
              onClick={() => handleQuickFilterToggle(filter.filterKey)}
              className={`filter-chip ${
                activeFilters[filter.filterKey]
                  ? 'filter-chip-active'
                  : 'filter-chip-inactive'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 mt-6">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-xs text-white/70 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
