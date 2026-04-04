'use client';

import type { PropertyListing, SearchFilters, ListingCategory } from '@/types';
import { mockListings } from '@/lib/mock-data';
import { useAcreFlowStore } from '@/lib/store';
import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  SlidersHorizontal,
  Grid3X3,
  Map,
  X,
  CheckCircle2,
  ArrowUpDown,
  Building2,
  Users,
  ChevronDown,
  Home,
  Store,
  Car,
  Dumbbell,
  Waves,
  Shield,
  Trees,
  Zap,
  Droplets,
  Building,
  Footprints,
  Baby,
  Phone,
  Snowflake,
  Wifi,
  Camera,
  Flame,
  Compass,
  UserRound,
  Heart,
  Share2,
  ArrowLeft,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useMemo } from 'react';

// ─── Amenity icon map ────────────────────────────────────────────────
const amenityIcons: Record<string, React.ReactNode> = {
  parking: <Car className="w-3.5 h-3.5" />,
  gym: <Dumbbell className="w-3.5 h-3.5" />,
  pool: <Waves className="w-3.5 h-3.5" />,
  security: <Shield className="w-3.5 h-3.5" />,
  garden: <Trees className="w-3.5 h-3.5" />,
  lift: <ArrowUpDown className="w-3.5 h-3.5" />,
  'power-backup': <Zap className="w-3.5 h-3.5" />,
  'water-supply': <Droplets className="w-3.5 h-3.5" />,
  clubhouse: <Building2 className="w-3.5 h-3.5" />,
  'jogging-track': <Footprints className="w-3.5 h-3.5" />,
  'children-play': <Baby className="w-3.5 h-3.5" />,
  intercom: <Phone className="w-3.5 h-3.5" />,
  ac: <Snowflake className="w-3.5 h-3.5" />,
  wifi: <Wifi className="w-3.5 h-3.5" />,
  cctv: <Camera className="w-3.5 h-3.5" />,
  'fire-safety': <Flame className="w-3.5 h-3.5" />,
  vaastu: <Compass className="w-3.5 h-3.5" />,
  'servant-room': <UserRound className="w-3.5 h-3.5" />,
};

const AMENITIES_LIST = [
  { id: 'parking', label: 'Parking' },
  { id: 'gym', label: 'Gym' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'security', label: 'Security' },
  { id: 'garden', label: 'Garden' },
  { id: 'lift', label: 'Lift' },
  { id: 'power-backup', label: 'Power Backup' },
  { id: 'water-supply', label: 'Water Supply' },
  { id: 'clubhouse', label: 'Club House' },
  { id: 'jogging-track', label: 'Jogging Track' },
  { id: 'children-play', label: 'Children Play' },
  { id: 'intercom', label: 'Intercom' },
  { id: 'ac', label: 'AC' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'cctv', label: 'CCTV' },
  { id: 'fire-safety', label: 'Fire Safety' },
  { id: 'vaastu', label: 'Vaastu' },
  { id: 'servant-room', label: 'Servant Room' },
];

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'villa', label: 'Villa' },
  { id: 'plot', label: 'Plot' },
  { id: 'house', label: 'House' },
  { id: 'pg', label: 'PG' },
];

const BHK_OPTIONS = [1, 2, 3, 4, 5];

// ─── Helpers ─────────────────────────────────────────────────────────
function getCategoryLabel(category: ListingCategory): string {
  switch (category) {
    case 'buy':
      return 'FOR SALE';
    case 'rent':
      return 'FOR RENT';
    case 'commercial':
      return 'COMMERCIAL';
    default:
      return 'FOR SALE';
  }
}

function formatPrice(value: number, category: ListingCategory): string {
  if (category === 'rent' || category === 'commercial') {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  return `₹${(value / 1000).toFixed(0)}K`;
}

// ─── Filter Sidebar Content (shared between desktop & mobile) ────────
function FilterSidebarContent({
  filters,
  setFilters,
}: {
  filters: SearchFilters;
  setFilters: (f: Partial<SearchFilters>) => void;
}) {
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  const togglePropertyType = (type: string) => {
    const current = filters.propertyTypes;
    const updated = current.includes(type as SearchFilters['propertyTypes'][number])
      ? current.filter((t) => t !== type)
      : [...current, type as SearchFilters['propertyTypes'][number]];
    setFilters({ propertyTypes: updated });
  };

  const toggleBhk = (bhk: number) => {
    const [min, max] = filters.bhkRange;
    if (bhk === min) {
      setFilters({ bhkRange: [min + 1, max] });
    } else if (bhk === max) {
      setFilters({ bhkRange: [min, max - 1] });
    } else if (bhk < min || bhk > max) {
      setFilters({ bhkRange: [Math.min(min, bhk), Math.max(max, bhk)] });
    }
  };

  const isBhkSelected = (bhk: number) => {
    const [min, max] = filters.bhkRange;
    // For 5+, we check if max >= 5
    if (bhk === 5) return max >= 5;
    return bhk >= min && bhk <= max;
  };

  const budgetMax = filters.category === 'rent' || filters.category === 'commercial' ? 100000 : 50000000;
  const budgetStep = filters.category === 'rent' || filters.category === 'commercial' ? 5000 : 100000;

  return (
    <div className="space-y-5">
      {/* Property Type */}
      <div>
        <h4 className="text-sm font-semibold text-navy mb-3">Property Type</h4>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((pt) => (
            <label
              key={pt.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={filters.propertyTypes.includes(pt.id as SearchFilters['propertyTypes'][number])}
                onCheckedChange={() => togglePropertyType(pt.id)}
                className="data-[state=checked]:bg-royal data-[state=checked]:border-royal"
              />
              <span className="text-sm text-slate-accent group-hover:text-navy transition-colors">
                {pt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* BHK */}
      <div>
        <h4 className="text-sm font-semibold text-navy mb-3">BHK</h4>
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map((bhk) => (
            <button
              key={bhk}
              onClick={() => toggleBhk(bhk)}
              className={`min-h-9 px-3.5 rounded-lg text-sm font-medium transition-all border ${
                isBhkSelected(bhk)
                  ? 'bg-royal text-white border-royal'
                  : 'bg-white text-slate-accent border-border hover:border-royal hover:text-royal'
              }`}
            >
              {bhk === 5 ? '5+' : bhk}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Budget */}
      <div>
        <h4 className="text-sm font-semibold text-navy mb-3">Budget</h4>
        <Slider
          value={filters.priceRange}
          onValueChange={(val) => setFilters({ priceRange: val as [number, number] })}
          min={0}
          max={budgetMax}
          step={budgetStep}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-slate-accent mt-2">
          <span>{formatPrice(filters.priceRange[0], filters.category)}</span>
          <span>{formatPrice(filters.priceRange[1], filters.category)}</span>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Furnishing */}
      <div>
        <h4 className="text-sm font-semibold text-navy mb-3">Furnishing</h4>
        <div className="flex flex-wrap gap-2">
          {(['all', 'furnished', 'semifurnished', 'unfurnished'] as const).map(
            (val) => (
              <button
                key={val}
                onClick={() => setFilters({ furnishing: val })}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  filters.furnishing === val
                    ? 'bg-royal text-white border-royal'
                    : 'bg-white text-slate-accent border-border hover:border-royal hover:text-royal'
                }`}
              >
                {val === 'all'
                  ? 'All'
                  : val === 'semifurnished'
                    ? 'Semi'
                    : val.charAt(0).toUpperCase() + val.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Quick Filters */}
      <div>
        <h4 className="text-sm font-semibold text-navy mb-3">Quick Filters</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) =>
                setFilters({ verifiedOnly: !!checked })
              }
              className="data-[state=checked]:bg-royal data-[state=checked]:border-royal"
            />
            <span className="text-sm text-slate-accent group-hover:text-navy transition-colors">
              Verified Only
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox
              checked={filters.directOwnerOnly}
              onCheckedChange={(checked) =>
                setFilters({ directOwnerOnly: !!checked })
              }
              className="data-[state=checked]:bg-royal data-[state=checked]:border-royal"
            />
            <span className="text-sm text-slate-accent group-hover:text-navy transition-colors">
              Direct Owner
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <Checkbox
              checked={filters.readyToMoveOnly}
              onCheckedChange={(checked) =>
                setFilters({ readyToMoveOnly: !!checked })
              }
              className="data-[state=checked]:bg-royal data-[state=checked]:border-royal"
            />
            <span className="text-sm text-slate-accent group-hover:text-navy transition-colors">
              Ready to Move
            </span>
          </label>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Amenities (Collapsible) */}
      <div>
        <button
          onClick={() => setAmenitiesOpen(!amenitiesOpen)}
          className="flex items-center justify-between w-full text-sm font-semibold text-navy mb-3"
        >
          Amenities
          <ChevronDown
            className={`w-4 h-4 text-slate-accent transition-transform ${
              amenitiesOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {amenitiesOpen && (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto acreflow-scrollbar">
            {AMENITIES_LIST.map((amenity) => (
              <label
                key={amenity.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={filters.amenities.includes(amenity.id)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...filters.amenities, amenity.id]
                      : filters.amenities.filter((a) => a !== amenity.id);
                    setFilters({ amenities: updated });
                  }}
                  className="data-[state=checked]:bg-royal data-[state=checked]:border-royal"
                />
                <span className="text-xs text-slate-accent group-hover:text-navy transition-colors flex items-center gap-1">
                  {amenityIcons[amenity.id]}
                  {amenity.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Clear All */}
      <Button
        variant="outline"
        className="w-full text-sm text-slate-accent hover:text-royal hover:border-royal"
        onClick={() =>
          setFilters({
            propertyTypes: [],
            bhkRange: [1, 5],
            priceRange: [0, 100000000],
            furnishing: 'all',
            verifiedOnly: false,
            directOwnerOnly: false,
            readyToMoveOnly: false,
            amenities: [],
          })
        }
      >
        Clear All Filters
      </Button>
    </div>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl border border-border">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <Skeleton className="w-full sm:w-48 h-36 shrink-0" />
          <div className="p-4 flex flex-col justify-between flex-1 gap-3">
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1.5" />
              <Skeleton className="h-3 w-1/2 mb-2.5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function SearchResults() {
  const {
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    goBack,
    setView,
    setSelectedProperty,
  } = useAcreFlowStore();

  const [localQuery, setLocalQuery] = useState(filters.query || searchQuery);
  const [loading, setLoading] = useState(true);

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ─── Filtering & sorting ─────────────────────────────────────────
  const filteredListings = useMemo(() => {
    let results = [...mockListings];

    // Category filter
    if (filters.category !== 'all' as ListingCategory) {
      results = results.filter((p) => p.category === filters.category);
    }

    // Text query filter
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q),
      );
    }

    // Property types
    if (filters.propertyTypes.length > 0) {
      results = results.filter((p) =>
        filters.propertyTypes.includes(p.propertyType),
      );
    }

    // BHK range
    const [bhkMin, bhkMax] = filters.bhkRange;
    results = results.filter(
      (p) => p.bhk === 0 || (p.bhk >= bhkMin && p.bhk <= bhkMax),
    );

    // Price range
    results = results.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    // Furnishing
    if (filters.furnishing !== 'all') {
      results = results.filter((p) => p.furnishing === filters.furnishing);
    }

    // Verified only
    if (filters.verifiedOnly) {
      results = results.filter((p) => p.verified);
    }

    // Direct owner only
    if (filters.directOwnerOnly) {
      results = results.filter((p) => p.directFromOwner);
    }

    // Ready to move only
    if (filters.readyToMoveOnly) {
      results = results.filter((p) => p.possessionStatus === 'ready');
    }

    // Amenities
    if (filters.amenities.length > 0) {
      results = results.filter((p) =>
        filters.amenities.every((a) => p.amenities.includes(a)),
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case 'area-high':
        results.sort(
          (a, b) => (b.carpetArea || b.plotArea || 0) - (a.carpetArea || a.plotArea || 0),
        );
        break;
      default:
        // relevance: verified first, then by views
        results.sort((a, b) => {
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return b.views - a.views;
        });
    }

    return results;
  }, [filters]);

  // ─── Handlers ────────────────────────────────────────────────────
  const handleSearch = () => {
    setFilters({ query: localQuery });
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const handleCategoryChange = (value: string) => {
    const cat = value === 'all' ? 'buy' : (value as ListingCategory);
    setFilters({ category: cat });
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const handleCardClick = (property: PropertyListing) => {
    setSelectedProperty(property);
    setView('property-detail');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ─── Active filters count for badge ─────────────────────────────
  const activeFilterCount = [
    filters.propertyTypes.length > 0,
    filters.bhkRange[0] !== 1 || filters.bhkRange[1] !== 5,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000,
    filters.furnishing !== 'all',
    filters.verifiedOnly,
    filters.directOwnerOnly,
    filters.readyToMoveOnly,
    filters.amenities.length > 0,
  ].filter(Boolean).length;

  return (
    <section className="min-h-screen bg-cream">
      {/* ── Top Search Bar (sticky) ────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-slate-accent hover:text-navy"
            onClick={goBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-accent" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by locality, city, property..."
              className="w-full h-11 rounded-xl border border-border pl-10 pr-4 text-sm bg-cream/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all"
            />
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery('');
                  setFilters({ query: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-accent hover:text-navy"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            className="bg-royal hover:bg-royal-dark text-white rounded-xl shrink-0"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Mobile filter trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden shrink-0 relative"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-royal text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto acreflow-scrollbar">
              <SheetHeader>
                <SheetTitle className="text-navy">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FilterSidebarContent filters={filters} setFilters={setFilters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* ── Category Tabs Row (sticky) ──────────────────────────────── */}
      <div className="sticky top-[60px] z-20 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <Tabs
              value={filters.category}
              onValueChange={handleCategoryChange}
            >
              <TabsList className="bg-transparent h-auto p-0 gap-0 border-0">
                {(['buy', 'rent', 'commercial'] as const).map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="rounded-none px-4 py-2.5 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-royal data-[state=active]:text-navy data-[state=active]:font-semibold data-[state=active]:shadow-none text-slate-accent bg-transparent hover:text-navy transition-colors"
                  >
                    {cat === 'buy'
                      ? 'Buy'
                      : cat === 'rent'
                        ? 'Rent'
                        : 'Commercial'}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <span className="text-sm text-slate-accent hidden sm:block">
              Showing{' '}
              <span className="font-semibold text-navy">
                {loading ? '...' : filteredListings.length}
              </span>{' '}
              properties
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* ── Left Sidebar (Desktop) ─────────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-[140px] max-h-[calc(100vh-180px)] overflow-y-auto acreflow-scrollbar bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-navy flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <Badge className="bg-royal text-white border-0 text-xs">
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>
              <FilterSidebarContent filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          {/* ── Right Content ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex justify-between items-center mb-4">
              <Select
                value={filters.sortBy}
                onValueChange={(val) =>
                  setFilters({
                    sortBy: val as SearchFilters['sortBy'],
                  })
                }
              >
                <SelectTrigger className="w-[200px] h-10 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="area-high">Area: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View toggle (desktop) */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-royal bg-sky"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-accent hover:text-royal"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results count (mobile) */}
            <p className="text-sm text-slate-accent mb-4 sm:hidden">
              {loading ? '...' : filteredListings.length} Properties found
            </p>

            {/* Results count (desktop) */}
            <p className="text-sm text-slate-accent mb-4 hidden sm:block">
              {loading ? '...' : filteredListings.length} Properties found
            </p>

            {/* ── Cards Grid ───────────────────────────────────────── */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : filteredListings.length === 0 ? (
              /* ── Empty State ────────────────────────────────────── */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-sky flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-royal" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">
                  No properties found
                </h3>
                <p className="text-sm text-slate-accent max-w-sm mb-6">
                  Try adjusting your filters or search query to find what
                  you&apos;re looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      propertyTypes: [],
                      bhkRange: [1, 5],
                      priceRange: [0, 100000000],
                      furnishing: 'all',
                      verifiedOnly: false,
                      directOwnerOnly: false,
                      readyToMoveOnly: false,
                      amenities: [],
                      query: '',
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredListings.map((property) => (
                  <Card
                    key={property.id}
                    className="overflow-hidden rounded-xl border border-border property-card cursor-pointer"
                    onClick={() => handleCardClick(property)}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative w-full sm:w-48 h-36 shrink-0 overflow-hidden bg-muted">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />

                          {/* Category badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-navy/80 text-white border-0 text-[10px] px-2 py-0.5">
                              {getCategoryLabel(property.category)}
                            </Badge>
                          </div>

                          {/* Verified badge */}
                          {property.verified && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-success text-white border-0 text-[10px] gap-0.5 px-2 py-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified
                              </Badge>
                            </div>
                          )}

                          {/* Heart icon */}
                          <button
                            className="absolute bottom-2 right-2 bg-white/90 rounded-full p-1.5 shadow hover:bg-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Heart className="w-3.5 h-3.5 text-slate-accent" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col justify-between flex-1">
                          <div>
                            {/* Price */}
                            <p className="text-lg font-bold text-royal">
                              {property.priceLabel}
                            </p>

                            {/* Title */}
                            <h3 className="text-sm font-semibold text-navy mt-0.5 line-clamp-1">
                              {property.title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center gap-1 text-xs text-slate-accent mt-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="line-clamp-1">
                                {property.locality}, {property.city}
                              </span>
                            </div>

                            {/* Specs */}
                            <div className="flex items-center gap-3 text-xs text-slate-accent mt-2">
                              {property.bhk > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <BedDouble className="w-3 h-3" />
                                  {property.bhk} Bed
                                </span>
                              )}
                              {property.bathrooms > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <Bath className="w-3 h-3" />
                                  {property.bathrooms} Bath
                                </span>
                              )}
                              <span className="flex items-center gap-0.5">
                                <Maximize className="w-3 h-3" />
                                {property.carpetArea || property.plotArea || 0}{' '}
                                sqft
                              </span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                            <div className="flex items-center gap-1 text-xs text-slate-accent">
                              <Building2 className="w-3 h-3 shrink-0" />
                              <span className="line-clamp-1">
                                {property.ownerName}
                              </span>
                            </div>
                            <button
                              className="text-royal text-xs font-semibold hover:underline flex items-center gap-0.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(property);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
