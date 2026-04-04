'use client';

import type { PropertyListing } from '@/types';
import { useAcreFlowStore } from '@/lib/store';
import { mockListings } from '@/lib/mock-data';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

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
  const principal = price * 0.8; // 80% loan
  const rate = 0.085 / 12; // 8.5% annual
  const months = 240; // 20 years
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

// ─── Main Component ───────────────────────────────────────────────────
export default function PropertyDetail() {
  const {
    selectedProperty,
    setSelectedProperty,
    goBack,
  } = useAcreFlowStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

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

  // ─── Image navigation handlers ──────────────────────────────────────
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < property.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : property.images.length - 1
    );
  };

  // ─── Action handlers ────────────────────────────────────────────────
  const handleContact = () => {
    toast.success('Contact request sent!');
  };

  const handleWhatsApp = () => {
    toast.success('Opening WhatsApp...');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved' : 'Property saved!');
  };

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
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
    <div className="min-h-screen bg-cream pb-24">
      {/* ═══════ STICKY ACTION BAR ═══════ */}
      <div className="fixed bottom-0 z-40 bg-white border-t shadow-2xl md:bottom-4 md:mx-auto md:max-w-lg md:rounded-2xl md:border">
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
          {/* Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={handleContact}
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
            className="flex items-center gap-1.5 text-sm text-slate-accent hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Results</span>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Save property"
            >
              <Heart
                className={`h-5 w-5 ${
                  isSaved
                    ? 'fill-red-500 text-red-500'
                    : 'text-slate-accent hover:text-red-500'
                } transition-colors`}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Share property"
            >
              <Share2 className="h-5 w-5 text-slate-accent hover:text-royal transition-colors" />
            </button>
          </div>
        </div>

        {/* ─── Media Gallery ───────────────────────────────────────── */}
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden bg-muted group">
          {/* Main Image */}
          <img
            src={property.images[currentImageIndex]}
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
              {currentImageIndex + 1}/{property.images.length}
            </Badge>
          </div>

          {/* 360° Tour & Video buttons - bottom left */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button className="bg-navy/80 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-navy/90 transition-colors">
              <RotateCcw className="h-3 w-3" />
              360° Tour
            </button>
            <button className="bg-navy/80 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-navy/90 transition-colors">
              <Play className="h-3 w-3" />
              Video
            </button>
          </div>

          {/* Left navigation arrow */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-navy" />
          </button>

          {/* Right navigation arrow */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-navy" />
          </button>

          {/* Image dot indicators */}
          {property.images.length > 1 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
              {property.images.map((_, idx) => (
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
    </div>
  );
}
