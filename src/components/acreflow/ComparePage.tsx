'use client';

import { useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  X,
  BedDouble,
  Bath,
  Maximize,
  CheckCircle2,
  Shield,
  Star,
  MapPin,
  Car,
  Dumbbell,
  Waves,
  Trees,
  Building2,
  Plus,
  Trash2,
  ArrowUpDown,
  Sparkles,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const AMENITY_ICON_MAP: Record<string, typeof Car> = {
  parking: Car,
  gym: Dumbbell,
  pool: Waves,
  security: Shield,
  garden: Trees,
  lift: ArrowUpDown,
};

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

interface ComparisonRowProps {
  label: string;
  values: (string | number | boolean | React.ReactNode | undefined)[];
  highlightBest?: 'min' | 'max';
  rowIdx: number;
}

function ComparisonRow({ label, values, highlightBest, rowIdx }: ComparisonRowProps) {
  const isEven = rowIdx % 2 === 0;
  const bestIdx: number = highlightBest
    ? values.reduce<number>((bestIdx, val, idx) => {
        if (typeof val !== 'number') return bestIdx;
        if (bestIdx === -1) return idx;
        const bestVal = values[bestIdx];
        if (typeof bestVal !== 'number') return idx;
        if (highlightBest === 'min' && val < bestVal) return idx;
        if (highlightBest === 'max' && val > bestVal) return idx;
        return bestIdx;
      }, -1)
    : -1;

  return (
    <div
      className={`grid gap-0 ${
        isEven ? 'bg-cream dark:bg-[#0A192F]' : 'bg-white dark:bg-[#112240]'
      }`}
    >
      <div className="min-w-[100px] sm:min-w-[140px] p-2.5 sm:p-3 text-xs sm:text-sm font-medium text-slate-accent dark:text-[#94A3B8] border-r border-border flex items-center">
        {label}
      </div>
      {values.map((val, idx) => (
        <div
          key={idx}
          className={`min-w-[130px] sm:min-w-[180px] p-2.5 sm:p-3 text-xs sm:text-sm text-navy dark:text-white font-medium flex items-center border-r border-border last:border-r-0 ${
            bestIdx === idx ? 'text-success bg-success/10 dark:bg-success/20' : ''
          }`}
        >
          {typeof val === 'boolean' ? (
            val ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <X className="h-4 w-4 text-slate-light dark:text-[#64748B]" />
            )
          ) : (
            <span>{val !== undefined && val !== '' ? val : '—'}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ComparePage() {
  const { goBack, comparisonList, removeFromComparison, clearComparison } = useAcreFlowStore();

  const bestValueProperty = useMemo(() => {
    if (comparisonList.length < 2) return null;
    const buyProperties = comparisonList.filter((p) => p.category !== 'rent');
    if (buyProperties.length < 2) return null;
    const minPrice = Math.min(...buyProperties.map((p) => p.price));
    return buyProperties.find((p) => p.price === minPrice) || null;
  }, [comparisonList]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] flex flex-col">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-[#112240] border-b dark:border-[#1D3461] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-slate-accent dark:text-[#94A3B8] hover:text-navy dark:hover:text-white"
            onClick={goBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-navy dark:text-white">
                Compare Properties
              </h1>
              {comparisonList.length > 0 && (
                <Badge className="bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA] text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full border-0">
                  {comparisonList.length}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8]">
              Compare up to 3 properties side by side
            </p>
          </div>
          {comparisonList.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearComparison}
              className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0 text-xs sm:text-sm h-9 sm:h-10 min-w-[44px]"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          {comparisonList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4 sm:mb-6">
                <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-royal dark:text-[#60A5FA]" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-navy dark:text-white mb-2">
                No properties to compare
              </h3>
              <p className="text-sm sm:text-base text-slate-accent dark:text-[#94A3B8] max-w-sm">
                Add properties from search results or property details to compare them side by side. You can compare up to 3 properties at a time.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Property Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {comparisonList.map((property) => (
                  <Card
                    key={property.id}
                    className="overflow-hidden border border-border dark:border-[#1D3461] rounded-xl dark:bg-[#0A192F]"
                  >
                    <div className="relative">
                      {property.images[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="h-36 sm:h-44 w-full object-cover"
                        />
                      ) : (
                        <div className="h-36 sm:h-44 w-full bg-cream dark:bg-[#1D3461] flex items-center justify-center">
                          <Building2 className="w-10 h-10 text-slate-accent dark:text-[#94A3B8]" />
                        </div>
                      )}
                      <button
                        onClick={() => removeFromComparison(property.id)}
                        className="absolute top-2 right-2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 dark:bg-[#112240] rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-md cursor-pointer min-w-[44px] min-h-[44px]"
                        aria-label="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold text-navy dark:text-white line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{property.locality}, {property.city}</span>
                      </p>
                      <p className="text-base sm:text-xl font-bold text-royal dark:text-[#60A5FA] mt-2">
                        {formatPrice(property.price)}
                        {property.category === 'rent' && (
                          <span className="text-xs sm:text-sm font-normal text-slate-accent dark:text-[#94A3B8]">/month</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="rounded-xl border border-border dark:border-[#1D3461] overflow-hidden">
                <ScrollArea className="w-full overflow-x-auto acreflow-scrollbar">
                  <div className="min-w-fit">
                    {/* Property Type */}
                    <ComparisonRow
                      label="Property Type"
                      values={comparisonList.map((p) =>
                        p.propertyType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                      )}
                      rowIdx={0}
                    />

                    {/* BHK */}
                    <ComparisonRow
                      label="Beds"
                      values={comparisonList.map((p) => (
                        <span key={p.id} className="flex items-center">
                          <BedDouble className="h-3.5 w-3.5 mr-1 text-slate-accent dark:text-[#94A3B8]" />
                          {p.bhk} BHK
                        </span>
                      ))}
                      rowIdx={1}
                    />

                    {/* Bathrooms */}
                    <ComparisonRow
                      label="Baths"
                      values={comparisonList.map((p) => (
                        <span key={p.id} className="flex items-center">
                          <Bath className="h-3.5 w-3.5 mr-1 text-slate-accent dark:text-[#94A3B8]" />
                          {p.bathrooms}
                        </span>
                      ))}
                      rowIdx={2}
                    />

                    {/* Carpet Area */}
                    <ComparisonRow
                      label="Carpet Area"
                      values={comparisonList.map((p) => (
                        <span key={p.id} className="flex items-center">
                          <Maximize className="h-3.5 w-3.5 mr-1 text-slate-accent dark:text-[#94A3B8]" />
                          {p.carpetArea} sqft
                        </span>
                      ))}
                      rowIdx={3}
                      highlightBest="max"
                    />

                    {/* Furnishing */}
                    <ComparisonRow
                      label="Furnishing"
                      values={comparisonList.map((p) =>
                        p.furnishing === 'furnished'
                          ? 'Fully Furnished'
                          : p.furnishing === 'semifurnished'
                          ? 'Semi Furnished'
                          : 'Unfurnished'
                      )}
                      rowIdx={4}
                    />

                    {/* Possession */}
                    <ComparisonRow
                      label="Possession"
                      values={comparisonList.map((p) =>
                        p.possessionStatus === 'ready'
                          ? 'Ready to Move'
                          : p.possessionStatus === 'under-construction'
                          ? 'Under Construction'
                          : 'New Launch'
                      )}
                      rowIdx={5}
                    />

                    {/* Floor */}
                    <ComparisonRow
                      label="Floor"
                      values={comparisonList.map((p) => p.floor || '—')}
                      rowIdx={6}
                    />

                    {/* Age */}
                    <ComparisonRow
                      label="Age"
                      values={comparisonList.map((p) => p.ageOfProperty || '—')}
                      rowIdx={7}
                    />

                    {/* Verified */}
                    <ComparisonRow
                      label="Verified"
                      values={comparisonList.map((p) => (
                        <span key={p.id} className="flex items-center gap-1">
                          {p.verified ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <X className="h-4 w-4 text-slate-light dark:text-[#64748B]" />
                          )}
                          {p.verified ? 'Verified' : 'Not Verified'}
                        </span>
                      ))}
                      rowIdx={8}
                    />

                    {/* RERA */}
                    <ComparisonRow
                      label="RERA"
                      values={comparisonList.map((p) => (
                        <span key={p.id} className="flex items-center gap-1">
                          {p.reraRegistered ? (
                            <Shield className="h-4 w-4 text-success" />
                          ) : (
                            <X className="h-4 w-4 text-slate-light dark:text-[#64748B]" />
                          )}
                          {p.reraRegistered ? 'Registered' : 'Not Registered'}
                        </span>
                      ))}
                      rowIdx={9}
                    />

                    {/* Amenities Count */}
                    <ComparisonRow
                      label="Amenities"
                      values={comparisonList.map((p) => p.amenities.length)}
                      rowIdx={10}
                      highlightBest="max"
                    />
                  </div>
                </ScrollArea>
              </div>

              {/* Best Value Card */}
              {bestValueProperty && (
                <Card className="bg-gradient-to-r from-royal/5 to-sky/5 dark:from-[#60A5FA]/5 dark:to-[#60A5FA]/10 border-royal/20 dark:border-[#60A5FA]/20 rounded-xl">
                  <CardContent className="p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-royal/10 dark:bg-[#60A5FA]/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-royal dark:text-[#60A5FA]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-bold text-navy dark:text-white flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Best Value
                      </p>
                      <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8] mt-0.5 line-clamp-2">
                        <span className="font-semibold text-navy dark:text-white">{bestValueProperty.title}</span>
                        {' '}offers the lowest price at{' '}
                        <span className="font-semibold text-royal dark:text-[#60A5FA]">{formatPrice(bestValueProperty.price)}</span>
                        {' '}with {bestValueProperty.carpetArea} sqft area and {bestValueProperty.amenities.length} amenities.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
