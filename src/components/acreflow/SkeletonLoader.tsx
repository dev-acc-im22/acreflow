'use client';

import { Card, CardContent } from '@/components/ui/card';

export function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-border dark:border-[#1D3461] rounded-xl dark:bg-[#112240]">
      {/* Image skeleton */}
      <div className="h-48 w-full skeleton-shimmer" />
      <CardContent className="p-4 space-y-3">
        {/* Price skeleton */}
        <div className="skeleton-shimmer h-6 w-28 rounded-md" />
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="skeleton-shimmer h-4 w-full rounded-md" />
          <div className="skeleton-shimmer h-4 w-3/4 rounded-md" />
        </div>
        {/* Location skeleton */}
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer h-3 w-3 rounded-full" />
          <div className="skeleton-shimmer h-3 w-40 rounded-md" />
        </div>
        {/* Tags skeleton */}
        <div className="flex gap-2 pt-1">
          <div className="skeleton-shimmer h-6 w-14 rounded-full" />
          <div className="skeleton-shimmer h-6 w-18 rounded-full" />
          <div className="skeleton-shimmer h-6 w-16 rounded-full" />
        </div>
        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-border dark:border-[#1D3461]">
          <div className="skeleton-shimmer h-3 w-24 rounded-md" />
          <div className="skeleton-shimmer h-3 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PropertyCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SectionTitleSkeleton() {
  return (
    <div className="space-y-3 mb-8">
      <div className="skeleton-shimmer h-8 w-64 rounded-lg mx-auto" />
      <div className="skeleton-shimmer h-4 w-80 rounded-md mx-auto" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#112240] rounded-xl p-6 border border-border dark:border-[#1D3461]">
      <div className="skeleton-shimmer h-10 w-10 rounded-lg mb-3" />
      <div className="skeleton-shimmer h-7 w-20 rounded-md mb-1" />
      <div className="skeleton-shimmer h-3 w-28 rounded-md" />
    </div>
  );
}

export function TextLineSkeleton({ width = '100%' }: { width?: string }) {
  return (
    <div className="skeleton-shimmer h-4 rounded-md" style={{ width }} />
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="skeleton-shimmer h-3 w-12 rounded-md" />
        <div className="skeleton-shimmer h-3 w-3 rounded-full" />
        <div className="skeleton-shimmer h-3 w-16 rounded-md" />
        <div className="skeleton-shimmer h-3 w-3 rounded-full" />
        <div className="skeleton-shimmer h-3 w-32 rounded-md" />
      </div>

      {/* Image gallery */}
      <div className="skeleton-shimmer h-72 sm:h-96 w-full rounded-2xl" />

      {/* Thumbnail row */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-16 w-16 rounded-lg" />
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Title + Price */}
          <div className="space-y-2">
            <div className="skeleton-shimmer h-7 w-3/4 rounded-md" />
            <div className="skeleton-shimmer h-8 w-48 rounded-md" />
            <div className="flex items-center gap-2">
              <div className="skeleton-shimmer h-3 w-3 rounded-full" />
              <div className="skeleton-shimmer h-3 w-40 rounded-md" />
            </div>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-cream dark:bg-[#1D3461] rounded-xl p-4 text-center">
                <div className="skeleton-shimmer h-5 w-5 rounded mx-auto mb-2" />
                <div className="skeleton-shimmer h-5 w-16 rounded-md mx-auto mb-1" />
                <div className="skeleton-shimmer h-3 w-12 rounded-md mx-auto" />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="skeleton-shimmer h-5 w-32 rounded-md" />
            <div className="space-y-2">
              <div className="skeleton-shimmer h-3 w-full rounded-md" />
              <div className="skeleton-shimmer h-3 w-full rounded-md" />
              <div className="skeleton-shimmer h-3 w-5/6 rounded-md" />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <div className="skeleton-shimmer h-5 w-28 rounded-md" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#112240] rounded-xl border border-border dark:border-[#1D3461] p-6 space-y-4">
            <div className="skeleton-shimmer h-5 w-32 rounded-md" />
            <div className="skeleton-shimmer h-10 w-full rounded-lg" />
            <div className="skeleton-shimmer h-10 w-full rounded-lg" />
            <div className="skeleton-shimmer h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkeletonLoader() {
  return <PropertyCardGridSkeleton />;
}
