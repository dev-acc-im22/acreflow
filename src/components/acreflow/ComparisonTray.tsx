'use client';

import type { PropertyListing } from '@/types';
import { useAcreFlowStore } from '@/lib/store';
import {
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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
  values: (string | number | boolean | undefined)[];
  highlightBest?: 'min' | 'max';
  rowIdx: number;
}

function ComparisonRow({ label, values, highlightBest, rowIdx }: ComparisonRowProps) {
  const isEven = rowIdx % 2 === 0;
  const bestIdx = highlightBest
    ? values.reduce((bestIdx, val, idx) => {
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
      {/* Label column */}
      <div
        className={`min-w-[140px] p-3 text-xs font-medium text-slate-accent dark:text-[#94A3B8] border-r border-border flex items-center`}
      >
        {label}
      </div>
      {/* Value columns */}
      {values.map((val, idx) => (
        <div
          key={idx}
          className={`min-w-[180px] p-3 text-sm text-navy dark:text-white font-medium flex items-center border-r border-border last:border-r-0 ${
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

export default function ComparisonTray() {
  const {
    showComparison,
    setShowComparison,
    comparisonList,
    removeFromComparison,
    clearComparison,
  } = useAcreFlowStore();

  if (!showComparison) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#112240] rounded-t-2xl shadow-2xl border-t comparison-tray ${
        showComparison ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Handle bar */}
      <div className="w-12 h-1.5 bg-gray-300 dark:bg-[#475569] rounded-full mx-auto mt-2" />

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-[#1D3461]">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-navy dark:text-white">Compare Properties</h2>
          <Badge variant="secondary" className="bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA] text-xs">
            Up to 3
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          {comparisonList.length > 0 && (
            <button
              onClick={clearComparison}
              className="text-sm text-slate-accent dark:text-[#94A3B8] hover:text-danger transition-colors"
            >
              Clear All
            </button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowComparison(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {comparisonList.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-cream dark:bg-[#1D3461] flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-slate-accent dark:text-[#94A3B8]" />
          </div>
          <p className="text-sm font-medium text-navy dark:text-white mb-1">
            Add properties to compare
          </p>
          <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
            Click the compare icon on listings to add them here. You can compare up to 3
            properties at a time.
          </p>
        </div>
      ) : (
        <ScrollArea className="max-h-[60vh] overflow-x-auto acreflow-scrollbar">
          <div className="min-w-fit">
            {/* Property Cards Row */}
            <div className="grid gap-0">
              {/* Label header */}
              <div className="min-w-[140px]" />

              {/* Property card columns */}
              {comparisonList.map((property) => (
                <div key={property.id} className="min-w-[280px] p-3">
                  <Card className="overflow-hidden border border-border dark:border-[#1D3461] rounded-xl relative dark:bg-[#0A192F]">
                    <button
                      onClick={() => removeFromComparison(property.id)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 dark:bg-[#112240] rounded-full flex items-center justify-center hover:bg-danger hover:text-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="h-40 w-full bg-cream dark:bg-[#1D3461] flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-slate-accent dark:text-[#94A3B8]" />
                      </div>
                    )}
                    <CardContent className="p-3">
                      <h3 className="text-sm font-semibold text-navy dark:text-white line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-xs text-slate-accent dark:text-[#94A3B8] flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {property.locality}, {property.city}
                      </p>
                      <p className="text-lg font-bold text-royal dark:text-[#60A5FA] mt-2">
                        {formatPrice(property.price)}
                        {property.category === 'rent' && (
                          <span className="text-xs font-normal text-slate-accent dark:text-[#94A3B8]">/mo</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            {/* Comparison Rows */}
            <div className="rounded-xl border border-border dark:border-[#1D3461] overflow-hidden">
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
                    <BedDouble className="h-3.5 w-3.5 mr-1 text-slate-accent dark:text-[#94A3B8] inline" />
                    {p.bhk} BHK
                  </span>
                ))}
                rowIdx={1}
              />

              {/* Bathrooms */}
              <ComparisonRow
                label="Bathrooms"
                values={comparisonList.map((p) => (
                  <span key={p.id} className="flex items-center">
                    <Bath className="h-3.5 w-3.5 mr-1 text-slate-accent dark:text-[#94A3B8] inline" />
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
                    <Maximize className="h-3.5 w-3.5 mr-1 text-slate-accent dark:text-[#94A3B8] inline" />
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
                values={comparisonList.map((p) => `${p.amenities.length} amenities`)}
                rowIdx={10}
                highlightBest="max"
              />

              {/* Amenities Chips */}
              <div className={`grid gap-0 ${10 % 2 === 0 ? 'bg-white dark:bg-[#112240]' : 'bg-cream dark:bg-[#0A192F]'}`}>
                <div className="min-w-[140px] p-3 text-xs font-medium text-slate-accent dark:text-[#94A3B8] border-r border-border items-start">
                  Amenities List
                </div>
                {comparisonList.map((property) => (
                  <div
                    key={property.id}
                    className="min-w-[180px] p-3 border-r border-border last:border-r-0"
                  >
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 6).map((amenityId) => {
                        const amenity = AMENITY_ICON_MAP[amenityId];
                        const IconComponent = amenity;
                        return (
                          <Badge
                            key={amenityId}
                            variant="secondary"
                            className="bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA] text-[10px] px-1.5 py-0"
                          >
                            {IconComponent && <IconComponent className="h-3 w-3 mr-0.5" />}
                            {amenityId}
                          </Badge>
                        );
                      })}
                      {property.amenities.length > 6 && (
                        <span className="text-[10px] text-slate-accent dark:text-[#94A3B8]">
                          +{property.amenities.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price comparison highlight */}
            <div className="mt-4 px-4 pb-4">
              <Card className="bg-sky/50 dark:bg-[#1D3461]/50 border-royal/20 dark:border-[#60A5FA]/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <Star className="h-5 w-5 text-royal dark:text-[#60A5FA] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-white">Best Value</p>
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                      {(() => {
                        const prices = comparisonList
                          .filter((p) => p.category !== 'rent')
                          .map((p) => p.price);
                        if (prices.length < 2) return 'Compare pricing and features to find the best value.';
                        const minPrice = Math.min(...prices);
                        const minProp = comparisonList.find(
                          (p) => p.price === minPrice && p.category !== 'rent'
                        );
                        return minProp
                          ? `${minProp.title} offers the lowest price at ${formatPrice(minPrice)}`
                          : 'Compare pricing and features to find the best value.';
                      })()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
