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
  Copy,
  GitCompareArrows,
  BadgeCheck,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

// ─── Time slots for schedule visit ────────────────────────────────────
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', range: '9:00 AM – 12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', range: '2:00 PM – 5:00 PM' },
  { id: 'evening', label: 'Evening', range: '5:00 PM – 7:00 PM' },
];

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
              : 'fill-gray-200 text-gray-200'
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
    <Card className="bg-white rounded-2xl border overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
          <Tag className="h-4 w-4 text-royal" />
          Price Trend
        </CardTitle>
        <p className="text-xs text-slate-accent">
          6-month price trend for {locality}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
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
                  <text x={p.x} y={chartHeight - 4} textAnchor="middle" className="text-[9px] fill-slate-accent" fontSize="9">
                    {chartData[i].month}
                  </text>
                </g>
              ))}
              {/* Price labels on first and last */}
              <text x={points[0].x} y={points[0].y - 8} textAnchor="middle" className="text-[8px] fill-royal font-semibold" fontSize="8">
                {prices[0]}
              </text>
              <text x={points[points.length - 1].x} y={points[points.length - 1].y - 8} textAnchor="middle" className="text-[8px] fill-royal font-semibold" fontSize="8">
                {prices[prices.length - 1]}
              </text>
            </svg>
          </div>
          {/* Stats */}
          <div className="flex flex-col gap-2 sm:min-w-[140px]">
            <div className="bg-cream rounded-xl p-3">
              <p className="text-xs text-slate-accent">Avg Price</p>
              <p className="text-lg font-bold text-royal">₹{avgPrice.toLocaleString('en-IN')}/sqft</p>
            </div>
            <div className="bg-cream rounded-xl p-3 flex items-center gap-2">
              {Number(yoyChange) >= 0 ? (
                <ArrowRight className="h-4 w-4 text-green-600 rotate-[-45deg]" />
              ) : (
                <ArrowRight className="h-4 w-4 text-red-500 rotate-45" />
              )}
              <div>
                <p className="text-xs text-slate-accent">YoY</p>
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
  } = useAcreFlowStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Contact modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Schedule visit dialog state
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTimeSlot, setVisitTimeSlot] = useState('');
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');

  // Quick enquiry state
  const [eqName, setEqName] = useState('');
  const [eqPhone, setEqPhone] = useState('');

  // No property selected — render skeleton
  if (!selectedProperty) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-5xl mx-auto px-4 pt-4">
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
  // T13: Contact button opens modal
  const handleContactClick = () => {
    setContactMessage(`Hi, I'm interested in ${property.title} at ${property.locality}. Please share more details.`);
    setShowContactModal(true);
  };

  // T13: Contact form submit
  const handleContactSubmit = () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      toast.error('Please fill in your name and phone number');
      return;
    }
    setShowContactModal(false);
    toast.success('Owner contact details sent to your phone!');
    // Open tel: link
    window.open(`tel:${property.ownerPhone}`, '_self');
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

  // T12: Schedule Visit confirm
  const handleScheduleSubmit = () => {
    if (!visitDate || !visitTimeSlot || !visitName.trim() || !visitPhone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setShowScheduleDialog(false);
    toast.success('Visit scheduled!');
    // Reset form
    setVisitDate('');
    setVisitTimeSlot('');
    setVisitName('');
    setVisitPhone('');
  };

  // T28: Quick Enquiry submit
  const handleQuickEnquiry = () => {
    if (!eqName.trim() || !eqPhone.trim()) {
      toast.error('Please fill in your name and phone number');
      return;
    }
    toast.success('Enquiry sent successfully!');
    setEqName('');
    setEqPhone('');
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
    <div className="min-h-screen bg-cream pb-36 md:pb-24">
      {/* ═══════ STICKY ACTION BAR (T3: above MobileNav on mobile) ═══════ */}
      <div className="fixed bottom-16 z-40 bg-white border-t shadow-2xl md:bottom-4 md:mx-auto md:max-w-lg md:rounded-2xl md:border">
        <div className="flex items-center gap-3 p-3 md:p-4">
          {/* Price + EMI */}
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-bold text-royal whitespace-nowrap">
              {priceDisplay}
            </span>
            {emiText && (
              <span className="text-xs text-slate-accent">{emiText}</span>
            )}
          </div>
          {/* T1: Add to Compare button */}
          <Button
            onClick={handleCompare}
            variant={inComparison ? 'default' : 'outline'}
            className={`h-10 rounded-xl font-semibold px-3 hidden sm:flex ${
              inComparison
                ? 'bg-royal text-white hover:bg-royal-dark'
                : 'border-royal/30 text-royal hover:bg-royal/5'
            }`}
          >
            <GitCompareArrows className="h-4 w-4 mr-1.5" />
            <span className="hidden md:inline">{inComparison ? 'Comparing' : 'Compare'}</span>
          </Button>
          {/* Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={handleContactClick}
              className="bg-royal hover:bg-royal-dark text-white flex-1 md:flex-none md:px-6 h-11 rounded-xl font-semibold"
            >
              <Phone className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Contact Seller</span>
              <span className="sm:hidden">Contact</span>
            </Button>
            <Button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-4 h-11 rounded-xl font-semibold"
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        {/* ─── Back button row ──────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm text-slate-accent hover:text-navy transition-colors min-h-10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Results</span>
          </button>
          <div className="flex items-center gap-1">
            {/* T5: Working Wishlist Heart */}
            <button
              onClick={handleSave}
              className="p-2 rounded-full hover:bg-white transition-colors min-h-10 min-w-10 flex items-center justify-center"
              aria-label="Save property"
            >
              <Heart
                className={`h-5 w-5 ${
                  saved
                    ? 'fill-red-500 text-red-500'
                    : 'text-slate-accent hover:text-red-500'
                } transition-colors`}
              />
            </button>
            {/* T6: Actual Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-white transition-colors min-h-10 min-w-10 flex items-center justify-center"
              aria-label="Share property"
            >
              <Share2 className="h-5 w-5 text-slate-accent hover:text-royal transition-colors" />
            </button>
            {/* T1: Add to Compare (mobile, shown in top bar) */}
            <button
              onClick={handleCompare}
              className={`p-2 rounded-full transition-colors min-h-10 min-w-10 flex items-center justify-center ${
                inComparison ? 'bg-royal/10' : 'hover:bg-white'
              }`}
              aria-label="Compare"
            >
              <GitCompareArrows
                className={`h-5 w-5 ${
                  inComparison ? 'text-royal' : 'text-slate-accent hover:text-royal'
                } transition-colors`}
              />
            </button>
          </div>
        </div>

        {/* ─── Media Gallery ───────────────────────────────────────── */}
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden bg-muted group">
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
            <button className="bg-navy/80 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-navy/90 transition-colors min-h-10">
              <RotateCcw className="h-3 w-3" />
              360° Tour
            </button>
            <button className="bg-navy/80 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-navy/90 transition-colors min-h-10">
              <Play className="h-3 w-3" />
              Video
            </button>
          </div>

          {/* T23: Left navigation arrow - always visible on mobile */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-navy" />
          </button>

          {/* T23: Right navigation arrow - always visible on mobile */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-navy" />
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
              className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden transition-all ${
                idx === currentImageIndex
                  ? 'border-2 border-royal ring-2 ring-royal/20'
                  : 'border border-border hover:border-slate-accent/40'
              }`}
            >
              {hasMultipleImages && property.images[idx] ? (
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Camera className="h-4 w-4 text-slate-accent" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ─── Property Info Card ──────────────────────────────────── */}
        <Card className="mt-4 bg-white rounded-2xl border overflow-hidden">
          <CardContent className="p-6">
            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl md:text-3xl font-bold text-royal">
                {priceDisplay}
              </span>
              {property.originalPrice && (
                <span className="text-lg text-slate-accent line-through">
                  {formatPrice(property.originalPrice, property.category)}
                </span>
              )}
              {emiText && (
                <Badge variant="secondary" className="bg-cream text-slate-accent border-0 text-xs">
                  {emiText}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-navy mt-2 leading-tight">
              {property.title}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-slate-accent mt-1.5">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </div>

            {/* Views + Posted */}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-accent">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-cream rounded-xl">
              {property.bhk > 0 && (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky flex items-center justify-center">
                    <BedDouble className="h-4 w-4 text-royal" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{property.bhk} Beds</p>
                    <p className="text-xs text-slate-accent">Bedrooms</p>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky flex items-center justify-center">
                    <Bath className="h-4 w-4 text-royal" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{property.bathrooms} Baths</p>
                    <p className="text-xs text-slate-accent">Bathrooms</p>
                  </div>
                </div>
              )}
              {property.carpetArea > 0 && (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky flex items-center justify-center">
                    <Maximize className="h-4 w-4 text-royal" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {property.carpetArea.toLocaleString()} sqft
                    </p>
                    <p className="text-xs text-slate-accent">Carpet Area</p>
                  </div>
                </div>
              )}
              {property.ageOfProperty && property.ageOfProperty !== 'N/A' && (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-royal" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{property.ageOfProperty}</p>
                    <p className="text-xs text-slate-accent">Age</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Specs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 text-sm">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-accent">Furnishing</span>
                <span className="font-medium text-navy capitalize">
                  {property.furnishing === 'semifurnished' ? 'Semi-Furnished' : property.furnishing === 'unfurnished' ? 'Unfurnished' : 'Furnished'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-accent">Floor</span>
                <span className="font-medium text-navy">{property.floor}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-accent">Total Floors</span>
                <span className="font-medium text-navy">{property.totalFloors > 0 ? property.totalFloors : 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-accent">Possession</span>
                <span className="font-medium text-navy capitalize">
                  {property.possessionStatus === 'ready'
                    ? 'Ready to Move'
                    : property.possessionStatus === 'under-construction'
                      ? 'Under Construction'
                      : 'New Launch'}
                </span>
              </div>
              {property.plotArea && property.plotArea > 0 && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-accent">Plot Area</span>
                  <span className="font-medium text-navy">{property.plotArea.toLocaleString()} sqft</span>
                </div>
              )}
              {property.superBuiltUpArea && property.superBuiltUpArea > 0 && (
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-accent">Super Built-up</span>
                  <span className="font-medium text-navy">{property.superBuiltUpArea.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ─── Description ─────────────────────────────────────────── */}
        <Card className="mt-4 bg-white rounded-2xl border overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
              <Copy className="h-4 w-4 text-royal" />
              Property Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-accent leading-relaxed">
              {descriptionExpanded
                ? property.description
                : property.description.length > 150
                  ? `${property.description.slice(0, 150)}...`
                  : property.description}
            </p>
            {property.description.length > 150 && (
              <button
                onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                className="text-sm font-semibold text-royal hover:text-royal-dark mt-2 transition-colors"
              >
                {descriptionExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </CardContent>
        </Card>

        {/* ─── Amenities ───────────────────────────────────────────── */}
        <Card className="mt-4 bg-white rounded-2xl border overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
              <Star className="h-4 w-4 text-royal" />
              Amenities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenityId) => {
                const amenityDef = AMENITIES.find((a) => a.id === amenityId);
                const IconComponent = AMENITY_ICON_MAP[amenityId];
                return (
                  <div
                    key={amenityId}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="bg-sky rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0">
                      {IconComponent ? (
                        <IconComponent className="h-4 w-4 text-royal" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-royal" />
                      )}
                    </div>
                    <span className="text-navy font-medium">
                      {amenityDef?.label || amenityId}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ─── T14: Price Trend ────────────────────────────────────── */}
        <div className="mt-4">
          <PriceTrendChart locality={property.locality} />
        </div>

        {/* ─── T15: Owner Details Card ─────────────────────────────── */}
        <Card className="mt-4 bg-white rounded-2xl border overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
              <UserRound className="h-4 w-4 text-royal" />
              About the Owner/Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              {/* Owner avatar - first letter circle */}
              <div className="w-14 h-14 rounded-full bg-royal/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-royal">
                  {property.ownerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-navy">
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
                <p className="text-sm text-slate-accent mt-0.5">
                  {property.directFromOwner ? 'Property Owner' : 'Agent'}
                </p>
                {/* Response time */}
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-accent">
                  <Clock className="h-3 w-3" />
                  <span>Usually responds within 1 hour</span>
                </div>
                {/* View All Listings button */}
                <Button
                  variant="outline"
                  className="mt-3 h-10 rounded-xl border-royal/30 text-royal hover:bg-royal/5 font-semibold text-sm"
                >
                  <Building2 className="h-4 w-4 mr-1.5" />
                  View All Listings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Location & Neighborhood ─────────────────────────────── */}
        <Card className="mt-4 bg-white rounded-2xl border overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
              <MapPin className="h-4 w-4 text-royal" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Map placeholder */}
            <div className="bg-cream rounded-xl h-48 flex flex-col items-center justify-center border-2 border-dashed border-border">
              <MapPin className="h-8 w-8 text-slate-accent mb-2" />
              <span className="text-sm font-medium text-slate-accent">Map View</span>
              <span className="text-xs text-slate-accent mt-0.5">{property.locality}, {property.city}</span>
            </div>

            {/* Nearby Places */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-navy mb-3">Nearby Places</h3>
              <div className="flex flex-col gap-2.5">
                {NEARBY_PLACES.map((place, idx) => {
                  const PlaceIcon = place.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-1"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center flex-shrink-0">
                        <PlaceIcon className="h-4 w-4 text-slate-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy truncate">{place.name}</p>
                        <p className="text-xs text-slate-accent">{place.type}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-cream text-slate-accent border-0 text-xs whitespace-nowrap"
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
        <Card className="mt-4 bg-white rounded-2xl border overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
              <Shield className="h-4 w-4 text-royal" />
              Locality Insights
            </CardTitle>
            <p className="text-xs text-slate-accent">
              Ratings for {property.locality} neighbourhood
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {DEFAULT_RATINGS.map((rating) => (
                <div
                  key={rating.label}
                  className="flex flex-col items-center gap-1.5 min-w-[90px]"
                >
                  <span className="text-sm text-navy font-medium">{rating.label}</span>
                  <StarRating score={rating.score} />
                  <span className="text-xs text-slate-accent">{rating.score}/5</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ─── T28: Quick Enquiry Inline Form (desktop only) ───────── */}
        <div className="mt-4 hidden lg:block">
          <Card className="bg-cream rounded-xl border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
                <Send className="h-4 w-4 text-royal" />
                Quick Enquiry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-accent mb-4">
                I&apos;m interested in <span className="font-semibold text-navy">{property.title}</span>
              </p>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor="eq-name" className="text-xs text-slate-accent mb-1.5">Name</Label>
                  <Input
                    id="eq-name"
                    placeholder="Your name"
                    value={eqName}
                    onChange={(e) => setEqName(e.target.value)}
                    className="bg-white h-10 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="eq-phone" className="text-xs text-slate-accent mb-1.5">Phone</Label>
                  <Input
                    id="eq-phone"
                    placeholder="+91 98765 43210"
                    value={eqPhone}
                    onChange={(e) => setEqPhone(e.target.value)}
                    className="bg-white h-10 rounded-lg"
                  />
                </div>
                <Button
                  onClick={handleQuickEnquiry}
                  className="bg-royal hover:bg-royal-dark text-white h-10 rounded-xl font-semibold px-6 flex-shrink-0"
                >
                  <Send className="h-4 w-4 mr-1.5" />
                  Enquire Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Similar Properties ──────────────────────────────────── */}
        <div className="mt-4 mb-8">
          <h2 className="text-lg font-semibold text-navy flex items-center gap-2 mb-4">
            <Home className="h-4 w-4 text-royal" />
            Similar Properties
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {similarProperties.map((sp) => (
              <button
                key={sp.id}
                onClick={() => handleSimilarClick(sp)}
                className="w-64 flex-shrink-0 bg-white rounded-xl border overflow-hidden hover:shadow-lg hover:border-royal/20 transition-all text-left"
              >
                {/* Image */}
                <div className="relative h-32 bg-muted">
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
                  <p className="text-sm font-bold text-royal">{formatPrice(sp.price, sp.category)}</p>
                  <p className="text-sm font-medium text-navy mt-0.5 truncate">{sp.title}</p>
                  <p className="text-xs text-slate-accent flex items-center gap-1 mt-1 truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    {sp.locality}, {sp.city}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-accent">
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

      {/* ═══════ T13: CONTACT / LEAD CAPTURE MODAL ═══════ */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy text-xl">Get Owner Details</DialogTitle>
            <DialogDescription className="text-slate-accent">
              Fill in your details to receive the owner&apos;s contact information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                placeholder="Your full name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                placeholder="+91 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">I&apos;m interested in</Label>
              <Textarea
                id="contact-message"
                placeholder="Your message..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="rounded-lg min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {/* Schedule Visit button inside contact modal */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 rounded-xl border-royal/30 text-royal hover:bg-royal/5 font-semibold"
              onClick={() => {
                setShowContactModal(false);
                // Pre-fill visit name/phone from contact form if available
                if (contactName.trim()) setVisitName(contactName);
                if (contactPhone.trim()) setVisitPhone(contactPhone);
                setTimeout(() => setShowScheduleDialog(true), 200);
              }}
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              Schedule Visit
            </Button>
            <Button
              type="button"
              className="w-full h-10 rounded-xl bg-royal hover:bg-royal-dark text-white font-semibold"
              onClick={handleContactSubmit}
            >
              <Phone className="h-4 w-4 mr-1.5" />
              Get Contact Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════ T12: SCHEDULE VISIT DIALOG ═══════ */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy text-xl">Schedule a Visit</DialogTitle>
            <DialogDescription className="text-slate-accent">
              Pick a date and time slot to visit {property.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Date picker */}
            <div className="space-y-2">
              <Label htmlFor="visit-date">Preferred Date</Label>
              <Input
                id="visit-date"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-10 rounded-lg"
              />
            </div>
            {/* Time slot selection */}
            <div className="space-y-2">
              <Label>Preferred Time Slot</Label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setVisitTimeSlot(slot.id)}
                    className={`min-h-10 rounded-xl border px-3 py-2 text-center transition-all ${
                      visitTimeSlot === slot.id
                        ? 'border-royal bg-royal/10 text-royal font-semibold'
                        : 'border-border hover:border-royal/30 text-slate-accent hover:text-navy'
                    }`}
                  >
                    <p className="text-sm font-medium">{slot.label}</p>
                    <p className="text-[10px] mt-0.5">{slot.range}</p>
                  </button>
                ))}
              </div>
            </div>
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="visit-name">Your Name</Label>
              <Input
                id="visit-name"
                placeholder="Your full name"
                value={visitName}
                onChange={(e) => setVisitName(e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="visit-phone">Phone Number</Label>
              <Input
                id="visit-phone"
                placeholder="+91 98765 43210"
                value={visitPhone}
                onChange={(e) => setVisitPhone(e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl font-semibold"
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-10 rounded-xl bg-royal hover:bg-royal-dark text-white font-semibold"
              onClick={handleScheduleSubmit}
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              Confirm Visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
