'use client';

import type { PropertyListing } from '@/types';
import { useAcreFlowStore } from '@/lib/store';
import { mockListings, mockPriceTrends } from '@/lib/mock-data';
import { AMENITIES } from '@/types';
import { toast } from 'sonner';
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Calendar,
  Building2,
  CheckCircle2,
  Shield,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Star,
  Car,
  Dumbbell,
  Waves,
  Trees,
  Zap,
  Droplets,
  Building,
  Footprints,
  Baby,
  PhoneCall,
  Snowflake,
  Wifi,
  Camera,
  Flame,
  Compass,
  UserRound,
  Eye,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Clock,
  Tag,
  Home,
  ArrowRight,
  GitCompareArrows,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';

// ─── Amenity icon mapping ─────────────────────────────────────────────
const AMENITY_ICON_MAP: Record<string, React.ElementType> = {
  parking: Car,
  gym: Dumbbell,
  pool: Waves,
  security: Shield,
  garden: Trees,
  lift: ArrowRight,
  'power-backup': Zap,
  'water-supply': Droplets,
  clubhouse: Building,
  'jogging-track': Footprints,
  'children-play': Baby,
  intercom: PhoneCall,
  ac: Snowflake,
  wifi: Wifi,
  cctv: Camera,
  'fire-safety': Flame,
  vaastu: Compass,
  'servant-room': UserRound,
};

// ─── Helper: format price to EMI estimate ────────────────────────────
function formatEMI(price: number, category: string): string {
  if (category === 'rent') return '';
  const principal = price * 0.8;
  const rate = 0.085 / 12;
  const months = 240;
  const emi = principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
  return `EMI ~₹${Math.round(emi / 1000)}K/mo`;
}

// ─── Helper: format price display ─────────────────────────────────────
function formatPrice(price: number, category: string): string {
  if (category === 'rent') {
    return price >= 100000
      ? `₹${(price / 100000).toFixed(1)} Lakh/mo`
      : `₹${price.toLocaleString('en-IN')}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

// ─── Star rating sub-component ────────────────────────────────────────
function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(score)
              ? 'fill-amber-500 text-amber-500'
              : 'fill-gray-200 dark:fill-[#475569] text-gray-200 dark:text-[#475569]'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Nearby places data ───────────────────────────────────────────────
const NEARBY_PLACES = [
  { icon: Building2, name: 'Chettinad Vidyashram', distance: '5 min', type: 'School' },
  { icon: Building2, name: 'Apollo Hospital', distance: '12 min', type: 'Hospital' },
  { icon: MapPin, name: 'Anna Nagar Tower Metro', distance: '8 min', type: 'Metro' },
  { icon: Building, name: 'VR Chennai Mall', distance: '10 min', type: 'Shopping' },
  { icon: Star, name: 'Saravana Bhavan', distance: '3 min', type: 'Restaurant' },
];

// ─── Locality ratings data ────────────────────────────────────────────
const DEFAULT_RATINGS = [
  { label: 'Safety', score: 4.5 },
  { label: 'Connectivity', score: 4.0 },
  { label: 'Healthcare', score: 4.5 },
  { label: 'Education', score: 3.5 },
  { label: 'Shopping', score: 4.5 },
  { label: 'Nightlife', score: 3.5 },
];

// ─── Price Trend SVG Chart Component ──────────────────────────────────
function PriceTrendChart({ locality }: { locality: string }) {
  const trendData = useMemo(() => {
    const data = mockPriceTrends[locality];
    if (data && data.length > 0) return data;
    return mockPriceTrends['Anna Nagar'] || [];
  }, [locality]);

  if (trendData.length === 0) return null;

  // Take last 6 months for display
  const chartData = trendData.slice(-6);
  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  // YoY calculation (first vs last in full trend)
  const yoyChange = trendData.length > 0
    ? (((trendData[trendData.length - 1].price - trendData[0].price) / trendData[0].price) * 100).toFixed(1)
    : '0';

  const chartWidth = 280;
  const chartHeight = 100;
  const padding = { top: 10, right: 10, bottom: 25, left: 10 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const points = chartData.map((d, i) => ({
    x: padding.left + (i / (chartData.length - 1)) * innerW,
    y: padding.top + innerH - ((d.price - minPrice) / priceRange) * innerH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + innerH} L${points[0].x},${padding.top + innerH} Z`;

  return (
    <Card className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
          <Tag className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
          Price Trend
        </CardTitle>
        <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
          6-month price trend for {locality}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
          {/* SVG Chart */}
          <div className="flex-1">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path d={areaPath} fill="url(#trendGrad)" />
              {/* Line */}
              <path d={linePath} fill="none" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Dots */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="3.5" fill="#1E40AF" stroke="white" strokeWidth="1.5" />
                  {/* Month labels */}
                  <text x={p.x} y={chartHeight - 4} textAnchor="middle" className="text-[9px] fill-slate-accent dark:fill-[#94A3B8]" fontSize="9">
                    {chartData[i].month}
                  </text>
                </g>
              ))}
              {/* Price labels on first and last */}
              <text x={points[0].x} y={points[0].y - 8} textAnchor="middle" className="text-[8px] fill-royal dark:fill-[#60A5FA] font-semibold" fontSize="8">
                {prices[0]}
              </text>
              <text x={points[points.length - 1].x} y={points[points.length - 1].y - 8} textAnchor="middle" className="text-[8px] fill-royal dark:fill-[#60A5FA] font-semibold" fontSize="8">
                {prices[prices.length - 1]}
              </text>
            </svg>
          </div>
          {/* Stats */}
          <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[140px]">
            <div className="bg-cream dark:bg-[#1D3461] rounded-xl p-3 flex-1 sm:flex-none">
              <p className="text-xs text-slate-accent dark:text-[#94A3B8]">Avg Price</p>
              <p className="text-base sm:text-lg font-bold text-royal dark:text-[#60A5FA]">₹{avgPrice.toLocaleString('en-IN')}/sqft</p>
            </div>
            <div className="bg-cream dark:bg-[#1D3461] rounded-xl p-3 flex items-center gap-2 flex-1 sm:flex-none">
              {Number(yoyChange) >= 0 ? (
                <ArrowRight className="h-4 w-4 text-green-600 rotate-[-45deg]" />
              ) : (
                <ArrowRight className="h-4 w-4 text-red-500 rotate-45" />
              )}
              <div>
                <p className="text-xs text-slate-accent dark:text-[#94A3B8]">YoY</p>
                <p className={`text-sm font-bold ${Number(yoyChange) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {Number(yoyChange) >= 0 ? '↑' : '↓'} {Math.abs(Number(yoyChange))}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function PropertyDetail() {
  const {
    selectedProperty,
    setSelectedProperty,
    goBack,
    isInWishlist,
    toggleWishlist,
    isInComparison,
    toggleComparison,
    setView,
  } = useAcreFlowStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // No property selected — render skeleton
  if (!selectedProperty) {
    return (
      <div className="min-h-screen bg-cream dark:bg-[#0A192F]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-64 md:h-96 rounded-2xl mb-4" />
          <Skeleton className="h-48 rounded-2xl mb-4" />
          <Skeleton className="h-32 rounded-2xl mb-4" />
          <Skeleton className="h-40 rounded-2xl mb-4" />
        </div>
      </div>
    );
  }

  const property = selectedProperty;

  // ─── Similar properties (same category, different id, limit 3) ───
  const similarProperties = mockListings
    .filter(
      (p) =>
        p.category === property.category &&
        p.id !== property.id
    )
    .slice(0, 3);

  // ─── Thumbnail images (use actual or placeholders) ────────────────
  const hasMultipleImages = property.images.length > 1;
  const thumbnailImages = hasMultipleImages
    ? property.images
    : Array.from({ length: 5 }, (_, i) =>
        `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=160&h=160&fit=crop&seed=${i}`
      );

  // ─── Image navigation handlers ──────────────────────────────────────
  const nextImage = () => {
    const maxIdx = hasMultipleImages ? property.images.length - 1 : thumbnailImages.length - 1;
    setCurrentImageIndex((prev) => (prev < maxIdx ? prev + 1 : 0));
  };

  const prevImage = () => {
    const maxIdx = hasMultipleImages ? property.images.length - 1 : thumbnailImages.length - 1;
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : maxIdx));
  };

  const currentImageSrc = hasMultipleImages
    ? property.images[currentImageIndex]
    : thumbnailImages[currentImageIndex];

  // ─── Action handlers ────────────────────────────────────────────────
  const handleContactClick = () => {
    setView('contact-owner');
  };

  const handleScheduleClick = () => {
    setView('schedule-visit');
  };

  // T4: WhatsApp deep link
  const handleWhatsApp = () => {
    const cleanPhone = property.ownerPhone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi, I'm interested in ${property.title} at ${property.locality}`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // T5: Wishlist toggle using store
  const saved = isInWishlist(property.id);
  const handleSave = () => {
    toggleWishlist(property.id);
    toast.success(saved ? 'Removed from Shortlist' : 'Saved to Shortlist!');
  };

  // T6: Share - clipboard
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  // T1: Compare toggle
  const inComparison = isInComparison(property.id);
  const handleCompare = () => {
    toggleComparison(property);
    if (inComparison) {
      toast.success('Removed from comparison');
    } else {
      toast.success('Added to comparison!');
    }
  };

  const handleSimilarClick = (p: PropertyListing) => {
    setSelectedProperty(p);
    setCurrentImageIndex(0);
    setDescriptionExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const emiText = formatEMI(property.price, property.category);
  const priceDisplay = formatPrice(property.price, property.category);

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0A192F] pb-40 md:pb-24">
      {/* ═══════ STICKY ACTION BAR (T3: above MobileNav on mobile) ═══════ */}
      <div className="fixed bottom-16 z-40 bg-white dark:bg-[#112240] border-t dark:border-[#1D3461] shadow-2xl md:bottom-4 md:mx-auto md:max-w-lg md:rounded-2xl md:border md:border-border md:dark:border-[#1D3461] pb-safe">
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
          {/* Price + EMI */}
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg font-bold text-royal dark:text-[#60A5FA] whitespace-nowrap">
              {priceDisplay}
            </span>
            {emiText && (
              <span className="text-[10px] sm:text-xs text-slate-accent dark:text-[#94A3B8]">{emiText}</span>
            )}
          </div>
          {/* T1: Add to Compare button */}
          <Button
            onClick={handleCompare}
            variant={inComparison ? 'default' : 'outline'}
            className={`h-11 rounded-xl font-semibold px-3 hidden sm:flex ${
              inComparison
                ? 'bg-royal text-white hover:bg-royal-dark'
                : 'border-royal/30 text-royal dark:text-[#60A5FA] hover:bg-royal/5'
            }`}
          >
            <GitCompareArrows className="h-4 w-4 mr-1.5" />
            <span className="hidden md:inline">{inComparison ? 'Comparing' : 'Compare'}</span>
          </Button>
          {/* Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            <Button
              onClick={handleContactClick}
              className="bg-royal hover:bg-royal-dark text-white flex-1 md:flex-none md:px-6 h-11 rounded-xl font-semibold text-sm sm:text-base"
            >
              <Phone className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Contact Seller</span>
              <span className="sm:hidden">Contact</span>
            </Button>
            <Button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 h-11 rounded-xl font-semibold"
            >
              <MessageCircle className="h-4 w-4 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4">
        {/* ─── Back button row ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm text-slate-accent dark:text-[#94A3B8] hover:text-navy dark:hover:text-white transition-colors min-h-11 min-w-11 px-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Results</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="flex items-center gap-1">
            {/* T5: Working Wishlist Heart */}
            <button
              onClick={handleSave}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-[#112240] transition-colors min-h-11 min-w-11 flex items-center justify-center"
              aria-label="Save property"
            >
              <Heart
                className={`h-5 w-5 ${
                  saved
                    ? 'fill-red-500 text-red-500'
                    : 'text-slate-accent dark:text-[#94A3B8] hover:text-red-500'
                } transition-colors`}
              />
            </button>
            {/* T6: Actual Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-[#112240] transition-colors min-h-11 min-w-11 flex items-center justify-center"
              aria-label="Share property"
            >
              <Share2 className="h-5 w-5 text-slate-accent dark:text-[#94A3B8] hover:text-royal dark:hover:text-[#60A5FA] transition-colors" />
            </button>
            {/* T1: Add to Compare (mobile, shown in top bar) */}
            <button
              onClick={handleCompare}
              className={`p-2 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center ${
                inComparison ? 'bg-royal/10' : 'hover:bg-white dark:hover:bg-[#112240]'
              }`}
              aria-label="Compare"
            >
              <GitCompareArrows
                className={`h-5 w-5 ${
                  inComparison ? 'text-royal dark:text-[#60A5FA]' : 'text-slate-accent dark:text-[#94A3B8] hover:text-royal dark:hover:text-[#60A5FA]'
                } transition-colors`}
              />
            </button>
          </div>
        </div>

        {/* ─── Media Gallery ───────────────────────────────────────── */}
        <div className="relative h-56 sm:h-64 md:h-96 rounded-2xl overflow-hidden bg-muted dark:bg-[#1D3461] group">
          {/* Main Image */}
          <img
            src={currentImageSrc}
            alt={property.title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Badge overlays - top left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {property.verified && (
              <Badge className="bg-success text-white border-0 gap-1 text-xs">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {property.reraRegistered && (
              <Badge className="bg-navy text-white border-0 text-xs">
                RERA
              </Badge>
            )}
            {property.directFromOwner && (
              <Badge className="bg-royal text-white border-0 text-xs">
                Direct Owner
              </Badge>
            )}
          </div>

          {/* Image counter - bottom right */}
          <div className="absolute bottom-3 right-3">
            <Badge
              variant="secondary"
              className="bg-black/60 text-white border-0 text-xs"
            >
              <Camera className="h-3 w-3 mr-1" />
              {currentImageIndex + 1}/{hasMultipleImages ? property.images.length : thumbnailImages.length}
            </Badge>
          </div>

          {/* 360° Tour & Video buttons - bottom left */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button className="bg-navy/80 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-navy/90 transition-colors min-h-11">
              <RotateCcw className="h-3 w-3" />
              360° Tour
            </button>
            <button className="bg-navy/80 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-navy/90 transition-colors min-h-11">
              <Play className="h-3 w-3" />
              Video
            </button>
          </div>

          {/* T23: Left navigation arrow - always visible on mobile */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#112240]/90 hover:bg-white dark:hover:bg-[#112240] rounded-full p-2 shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-navy dark:text-white" />
          </button>

          {/* T23: Right navigation arrow - always visible on mobile */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#112240]/90 hover:bg-white dark:hover:bg-[#112240] rounded-full p-2 shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-navy dark:text-white" />
          </button>

          {/* Image dot indicators */}
          {(hasMultipleImages ? property.images : thumbnailImages).length > 1 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
              {(hasMultipleImages ? property.images : thumbnailImages).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`rounded-full transition-all ${
                    idx === currentImageIndex
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── T16: Image Thumbnail Strip ──────────────────────────── */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {thumbnailImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`flex-shrink-0 h-14 sm:h-16 w-14 sm:w-16 rounded-lg overflow-hidden transition-all ${
                idx === currentImageIndex
                  ? 'border-2 border-royal dark:border-[#60A5FA] ring-2 ring-royal/20'
                  : 'border border-border dark:border-[#1D3461] hover:border-slate-accent/40'
              }`}
            >
              {hasMultipleImages && property.images[idx] ? (
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted dark:bg-[#1D3461] flex items-center justify-center">
                  <Camera className="h-4 w-4 text-slate-accent dark:text-[#94A3B8]" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ─── Property Info Card ──────────────────────────────────── */}
        <Card className="mt-3 sm:mt-4 bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:p-5">
            {/* Price */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-royal dark:text-[#60A5FA]">
                {priceDisplay}
              </span>
              {property.originalPrice && (
                <span className="text-base sm:text-lg text-slate-accent dark:text-[#94A3B8] line-through">
                  {formatPrice(property.originalPrice, property.category)}
                </span>
              )}
              {emiText && (
                <Badge variant="secondary" className="bg-cream dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border-0 text-xs">
                  {emiText}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-navy dark:text-white mt-2 leading-tight">
              {property.title}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm sm:text-base text-slate-accent dark:text-[#94A3B8] mt-1.5">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </div>

            {/* Views + Posted */}
            <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-slate-accent dark:text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {property.views.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Posted {new Date(property.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Quick Specs Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4 p-3 sm:p-4 bg-cream dark:bg-[#1D3461] rounded-xl">
              {property.bhk > 0 && (
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                    <BedDouble className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-navy dark:text-white">{property.bhk} Beds</p>
                    <p className="text-[10px] sm:text-xs text-slate-accent dark:text-[#94A3B8]">Bedrooms</p>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                    <Bath className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-navy dark:text-white">{property.bathrooms} Baths</p>
                    <p className="text-[10px] sm:text-xs text-slate-accent dark:text-[#94A3B8]">Bathrooms</p>
                  </div>
                </div>
              )}
              {property.carpetArea > 0 && (
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                    <Maximize className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-navy dark:text-white">
                      {property.carpetArea.toLocaleString()} sqft
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-accent dark:text-[#94A3B8]">Carpet Area</p>
                  </div>
                </div>
              )}
              {property.ageOfProperty && property.ageOfProperty !== 'N/A' && (
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-navy dark:text-white">{property.ageOfProperty}</p>
                    <p className="text-[10px] sm:text-xs text-slate-accent dark:text-[#94A3B8]">Age</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Specs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 sm:mt-4 text-sm">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-accent dark:text-[#94A3B8]">Furnishing</span>
                <span className="font-medium text-navy dark:text-white capitalize">
                  {property.furnishing === 'semifurnished' ? 'Semi-Furnished' : property.furnishing === 'unfurnished' ? 'Unfurnished' : 'Furnished'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-accent dark:text-[#94A3B8]">Floor</span>
                <span className="font-medium text-navy dark:text-white">{property.floor}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-accent dark:text-[#94A3B8]">Total Floors</span>
                <span className="font-medium text-navy dark:text-white">{property.totalFloors > 0 ? property.totalFloors : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-accent dark:text-[#94A3B8]">Possession</span>
                <span className="font-medium text-navy dark:text-white capitalize">
                  {property.possessionStatus === 'ready'
                    ? 'Ready to Move'
                    : property.possessionStatus === 'under-construction'
                      ? 'Under Construction'
                      : 'New Launch'}
                </span>
              </div>
              {property.plotArea && property.plotArea > 0 && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-accent dark:text-[#94A3B8]">Plot Area</span>
                  <span className="font-medium text-navy dark:text-white">{property.plotArea.toLocaleString()} sqft</span>
                </div>
              )}
              {property.superBuiltUpArea && property.superBuiltUpArea > 0 && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-accent dark:text-[#94A3B8]">Super Built-up</span>
                  <span className="font-medium text-navy dark:text-white">{property.superBuiltUpArea.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ─── Description ─────────────────────────────────────────── */}
        <Card className="mt-3 sm:mt-4 bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
              <Maximize className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Property Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-slate-accent dark:text-[#94A3B8] leading-relaxed">
              {descriptionExpanded
                ? property.description
                : property.description.length > 150
                  ? `${property.description.slice(0, 150)}...`
                  : property.description}
            </p>
            {property.description.length > 150 && (
              <button
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                className="text-sm font-semibold text-royal dark:text-[#60A5FA] hover:text-royal-dark mt-2 transition-colors"
              >
                {descriptionExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </CardContent>
        </Card>

        {/* ─── Amenities ───────────────────────────────────────────── */}
        <Card className="mt-3 sm:mt-4 bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
              <Star className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Amenities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {property.amenities.map((amenityId) => {
                const amenityDef = AMENITIES.find((a) => a.id === amenityId);
                const IconComponent = AMENITY_ICON_MAP[amenityId];
                return (
                  <div
                    key={amenityId}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="bg-sky dark:bg-[#1D3461] rounded-lg w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                      {IconComponent ? (
                        <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-royal dark:text-[#60A5FA]" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-royal dark:text-[#60A5FA]" />
                      )}
                    </div>
                    <span className="text-navy dark:text-white font-medium text-xs sm:text-sm">
                      {amenityDef?.label || amenityId}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ─── T14: Price Trend ────────────────────────────────────── */}
        <div className="mt-3 sm:mt-4">
          <PriceTrendChart locality={property.locality} />
        </div>

        {/* ─── T15: Owner Details Card ─────────────────────────────── */}
        <Card className="mt-3 sm:mt-4 bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
              <UserRound className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              About the Owner/Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Owner avatar - first letter circle */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-royal/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl font-bold text-royal dark:text-[#60A5FA]">
                  {property.ownerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-semibold text-navy dark:text-white">
                    {property.ownerName}
                  </h3>
                  {/* Verified badge */}
                  {property.verified && (
                    <Badge className="bg-success/10 text-success border-success/20 gap-1 text-xs">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                {/* Label: Owner or Agent */}
                <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8] mt-0.5">
                  {property.directFromOwner ? 'Property Owner' : 'Agent'}
                </p>
                {/* Response time */}
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-accent dark:text-[#94A3B8]">
                  <Clock className="h-3 w-3" />
                  <span>Usually responds within 1 hour</span>
                </div>
                {/* View All Listings button */}
                <Button
                  variant="outline"
                  className="mt-3 h-11 rounded-xl border-royal/30 text-royal dark:text-[#60A5FA] hover:bg-royal/5 font-semibold text-sm"
                >
                  <Building2 className="h-4 w-4 mr-1.5" />
                  View All Listings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Location & Neighborhood ─────────────────────────────── */}
        <Card className="mt-3 sm:mt-4 bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Map placeholder */}
            <div className="bg-cream dark:bg-[#1D3461] rounded-xl h-40 sm:h-48 flex flex-col items-center justify-center border-2 border-dashed border-border dark:border-[#1D3461]">
              <MapPin className="h-8 w-8 text-slate-accent dark:text-[#94A3B8] mb-2" />
              <span className="text-sm font-medium text-slate-accent dark:text-[#94A3B8]">Map View</span>
              <span className="text-xs text-slate-accent dark:text-[#94A3B8] mt-0.5">{property.locality}, {property.city}</span>
            </div>

            {/* Nearby Places */}
            <div className="mt-3 sm:mt-4">
              <h3 className="text-sm font-semibold text-navy dark:text-white mb-3">Nearby Places</h3>
              <div className="flex flex-col gap-2 sm:gap-2.5">
                {NEARBY_PLACES.map((place, idx) => {
                  const PlaceIcon = place.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-1"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cream dark:bg-[#1D3461] flex items-center justify-center flex-shrink-0">
                        <PlaceIcon className="h-4 w-4 text-slate-accent dark:text-[#94A3B8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy dark:text-white truncate">{place.name}</p>
                        <p className="text-xs text-slate-accent dark:text-[#94A3B8]">{place.type}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-cream dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border-0 text-xs whitespace-nowrap"
                      >
                        {place.distance}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Locality Ratings ────────────────────────────────────── */}
        <Card className="mt-3 sm:mt-4 bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Locality Insights
            </CardTitle>
            <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
              Ratings for {property.locality} neighbourhood
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {DEFAULT_RATINGS.map((rating) => (
                <div
                  key={rating.label}
                  className="flex flex-col items-center gap-1.5 min-w-[80px] sm:min-w-[90px]"
                >
                  <span className="text-xs sm:text-sm text-navy dark:text-white font-medium">{rating.label}</span>
                  <StarRating score={rating.score} />
                  <span className="text-xs text-slate-accent dark:text-[#94A3B8]">{rating.score}/5</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ─── Enquire Now CTA ──────────────────────────────────────── */}
        <div className="mt-3 sm:mt-4">
          <Card className="bg-gradient-to-r from-royal to-royal-dark rounded-2xl overflow-hidden">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Interested in this property?
                </h3>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                  Contact the owner or schedule a visit
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleContactClick}
                  className="bg-white text-royal hover:bg-white/90 flex-1 sm:flex-none h-11 rounded-xl font-semibold text-sm"
                >
                  <Phone className="h-4 w-4 mr-1.5" />
                  Contact Seller
                </Button>
                <Button
                  onClick={handleScheduleClick}
                  className="bg-white/20 text-white hover:bg-white/30 border border-white/30 flex-1 sm:flex-none h-11 rounded-xl font-semibold text-sm"
                >
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Schedule Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Similar Properties ──────────────────────────────────── */}
        <div className="mt-3 sm:mt-4 mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-navy dark:text-white flex items-center gap-2 mb-3 sm:mb-4">
            <Home className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
            Similar Properties
          </h2>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {similarProperties.map((sp) => (
              <button
                key={sp.id}
                onClick={() => handleSimilarClick(sp)}
                className="w-56 sm:w-64 flex-shrink-0 bg-white dark:bg-[#112240] rounded-xl border border-border dark:border-[#1D3461] overflow-hidden hover:shadow-lg hover:border-royal/20 transition-all text-left"
              >
                {/* Image */}
                <div className="relative h-28 sm:h-32 bg-muted dark:bg-[#1D3461]">
                  <img
                    src={sp.images[0]}
                    alt={sp.title}
                    className="w-full h-full object-cover"
                  />
                  {sp.verified && (
                    <Badge className="absolute top-2 left-2 bg-success text-white border-0 text-xs gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                {/* Content */}
                <div className="p-3">
                  <p className="text-sm font-bold text-royal dark:text-[#60A5FA]">{formatPrice(sp.price, sp.category)}</p>
                  <p className="text-sm font-medium text-navy dark:text-white mt-0.5 truncate">{sp.title}</p>
                  <p className="text-xs text-slate-accent dark:text-[#94A3B8] flex items-center gap-1 mt-1 truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {sp.locality}, {sp.city}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-accent dark:text-[#94A3B8]">
                    {sp.bhk > 0 && (
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3 w-3" />
                        {sp.bhk} Bed
                      </span>
                    )}
                    {sp.bathrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        {sp.bathrooms} Bath
                      </span>
                    )}
                    {sp.carpetArea > 0 && (
                      <span className="flex items-center gap-1">
                        <Maximize className="h-3 w-3" />
                        {sp.carpetArea} sqft
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
