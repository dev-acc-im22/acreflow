'use client';

import type { PropertyListing, ListingCategory } from '@/types';
import { useAcreFlowStore } from '@/lib/store';
import {
  MapPin,
  BedDouble,
  Maximize,
  ArrowRight,
  CheckCircle2,
  Heart,
  Share2,
  Bath,
  Building2,
  Users,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const recentProperties: PropertyListing[] = [
  {
    id: 'ra1', title: 'Elegant 2 BHK in Andheri West', description: 'Modern apartment with premium amenities',
    category: 'buy', propertyType: 'apartment', price: 12000000, priceLabel: '₹1.2 Cr',
    bhk: 2, bathrooms: 2, balconies: 1, floor: '10', totalFloors: 22,
    carpetArea: 1050, furnishing: 'semifurnished', ageOfProperty: 'New',
    possessionStatus: 'ready', locality: 'Andheri West', city: 'Mumbai', state: 'Maharashtra',
    address: 'Tower A, Skyline Residency, Andheri West, Mumbai',
    lat: 19.1364, lng: 72.8298,
    images: [], amenities: ['parking', 'gym', 'pool', 'security', 'lift'],
    verified: true, reraRegistered: true, reraId: 'RERA/MH/2024/001',
    directFromOwner: false, ownerId: 'ra-o1', ownerName: 'Godrej Properties',
    ownerPhone: '+91 99123 45678', views: 340, createdAt: '2025-06-10', updatedAt: '2025-06-10',
  },
  {
    id: 'ra2', title: 'Luxury 3 BHK at Whitefield', description: 'Premium villa in gated community',
    category: 'buy', propertyType: 'villa', price: 18000000, priceLabel: '₹1.8 Cr',
    bhk: 3, bathrooms: 3, balconies: 2, floor: 'Ground+1', totalFloors: 2,
    carpetArea: 2400, furnishing: 'furnished', ageOfProperty: 'New',
    possessionStatus: 'ready', locality: 'Whitefield', city: 'Bangalore', state: 'Karnataka',
    address: 'Prestige Shantiniketan, Whitefield, Bangalore',
    lat: 12.9698, lng: 77.7500,
    images: [], amenities: ['parking', 'garden', 'pool', 'security', 'gym', 'clubhouse'],
    verified: true, reraRegistered: true,
    directFromOwner: false, ownerId: 'ra-o2', ownerName: 'Prestige Group',
    ownerPhone: '+91 99234 56789', views: 520, createdAt: '2025-06-09', updatedAt: '2025-06-09',
  },
  {
    id: 'ra3', title: 'Spacious 4 BHK in Dwarka', description: 'Family-friendly apartment near metro',
    category: 'buy', propertyType: 'apartment', price: 22000000, priceLabel: '₹2.2 Cr',
    bhk: 4, bathrooms: 3, balconies: 2, floor: '7', totalFloors: 15,
    carpetArea: 2100, furnishing: 'unfurnished', ageOfProperty: '1 year',
    possessionStatus: 'ready', locality: 'Dwarka', city: 'Delhi', state: 'Delhi',
    address: 'DDA Flats, Sector 12, Dwarka, New Delhi',
    lat: 28.5733, lng: 77.0420,
    images: [], amenities: ['parking', 'lift', 'security', 'power-backup', 'garden'],
    verified: true, reraRegistered: false,
    directFromOwner: true, ownerId: 'ra-o3', ownerName: 'Sanjay Verma',
    ownerPhone: '+91 99345 67890', views: 280, createdAt: '2025-06-08', updatedAt: '2025-06-08',
  },
  {
    id: 'ra4', title: 'Modern 2 BHK in OMR, Chennai', description: 'IT corridor living with sea breeze',
    category: 'rent', propertyType: 'apartment', price: 35000, priceLabel: '₹35,000/mo',
    deposit: 140000, bhk: 2, bathrooms: 2, balconies: 1, floor: '8', totalFloors: 16,
    carpetArea: 1100, furnishing: 'furnished', ageOfProperty: '2 years',
    possessionStatus: 'ready', locality: 'Thoraipakkam', city: 'Chennai', state: 'Tamil Nadu',
    address: 'TVH Aura, OMR, Thoraipakkam, Chennai',
    lat: 12.9325, lng: 80.2314,
    images: [], amenities: ['parking', 'gym', 'security', 'lift', 'power-backup'],
    verified: true, reraRegistered: false,
    directFromOwner: true, ownerId: 'ra-o4', ownerName: 'Meena Krishnan',
    ownerPhone: '+91 99456 78901', views: 190, createdAt: '2025-06-07', updatedAt: '2025-06-07',
  },
  {
    id: 'ra5', title: 'Premium 3 BHK in HITEC City', description: 'Tech hub apartment with smart features',
    category: 'buy', propertyType: 'apartment', price: 9500000, priceLabel: '₹95 Lakh',
    bhk: 3, bathrooms: 2, balconies: 2, floor: '12', totalFloors: 20,
    carpetArea: 1650, furnishing: 'semifurnished', ageOfProperty: 'New',
    possessionStatus: 'ready', locality: 'HITEC City', city: 'Hyderabad', state: 'Telangana',
    address: 'Aparna Sarovar, HITEC City, Hyderabad',
    lat: 17.4435, lng: 78.3772,
    images: [], amenities: ['parking', 'gym', 'pool', 'security', 'lift', 'clubhouse', 'intercom'],
    verified: true, reraRegistered: true,
    directFromOwner: false, ownerId: 'ra-o5', ownerName: 'Aparna Constructions',
    ownerPhone: '+91 99567 89012', views: 410, createdAt: '2025-06-06', updatedAt: '2025-06-06',
  },
  {
    id: 'ra6', title: 'Compact 1 BHK in Hinjewadi', description: 'Budget-friendly near IT park',
    category: 'buy', propertyType: 'apartment', price: 4200000, priceLabel: '₹42 Lakh',
    bhk: 1, bathrooms: 1, balconies: 1, floor: '5', totalFloors: 12,
    carpetArea: 580, furnishing: 'unfurnished', ageOfProperty: 'New',
    possessionStatus: 'under-construction', locality: 'Hinjewadi', city: 'Pune', state: 'Maharashtra',
    address: 'Kumar Solaris, Hinjewadi Phase 1, Pune',
    lat: 18.5921, lng: 73.7390,
    images: [], amenities: ['parking', 'lift', 'security', 'power-backup', 'water-supply'],
    verified: false, reraRegistered: true,
    directFromOwner: true, ownerId: 'ra-o6', ownerName: 'Rahul Deshmukh',
    ownerPhone: '+91 99678 90123', views: 150, createdAt: '2025-06-05', updatedAt: '2025-06-05',
  },
];

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

// Gradient backgrounds for image placeholders (different per property)
const GRADIENTS = [
  'from-blue-200 to-cyan-100 dark:from-[#1D3461] dark:to-[#0F2744]',
  'from-emerald-200 to-teal-100 dark:from-[#1D3461] dark:to-[#112240]',
  'from-amber-200 to-orange-100 dark:from-[#1D3461] dark:to-[#0F2744]',
  'from-rose-200 to-pink-100 dark:from-[#1D3461] dark:to-[#112240]',
  'from-violet-200 to-purple-100 dark:from-[#1D3461] dark:to-[#0F2744]',
  'from-sky-200 to-blue-100 dark:from-[#1D3461] dark:to-[#112240]',
];

export default function RecentlyAdded() {
  const { setView, setSelectedProperty, toggleWishlist, isInWishlist } = useAcreFlowStore();

  const handleCardClick = (property: PropertyListing) => {
    setSelectedProperty(property);
    setView('property-detail');
  };

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-[#0A192F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
              Recently Added Properties
            </h2>
            <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-1">
              Fresh listings added in the last 7 days
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2"
            onClick={() => setView('search')}
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden flex items-center gap-1"
            onClick={() => setView('search')}
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile: horizontal scroll, Desktop: 3-column grid */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none -mx-4 px-4 lg:mx-0 lg:px-0">
          {recentProperties.map((property, index) => (
            <Card
              key={property.id}
              className="flex-shrink-0 w-[85vw] sm:w-[300px] lg:w-auto overflow-hidden rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] property-card cursor-pointer snap-start"
              onClick={() => handleCardClick(property)}
            >
              <CardContent className="p-0">
                {/* Image placeholder */}
                <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`}>
                  {/* Building icon placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Building2 className="w-20 h-20 text-navy dark:text-[#60A5FA]" />
                  </div>

                  {/* Top-left badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {/* New badge */}
                    <Badge className="bg-amber-500 text-white border-0 gap-1 text-xs">
                      <Sparkles className="w-3 h-3" />
                      New
                    </Badge>
                    {property.verified && (
                      <Badge className="bg-success text-white border-0 gap-1 text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                    {property.directFromOwner && (
                      <Badge className="bg-royal text-white border-0 gap-1 text-xs">
                        <Users className="w-3 h-3" />
                        Direct Owner
                      </Badge>
                    )}
                  </div>

                  {/* Top-right action icons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      className={`rounded-full p-2 shadow transition-colors cursor-pointer ${
                        isInWishlist(property.id)
                          ? 'bg-red-50 dark:bg-red-900/30'
                          : 'bg-white/90 dark:bg-[#0A192F]/90 hover:bg-white dark:hover:bg-[#112240]'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(property.id);
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(property.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-slate-accent dark:text-[#94A3B8]'
                        }`}
                      />
                    </button>
                    <button
                      className="bg-white/90 dark:bg-[#0A192F]/90 rounded-full p-2 shadow hover:bg-white dark:hover:bg-[#112240] transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Share2 className="w-4 h-4 text-slate-accent dark:text-[#94A3B8]" />
                    </button>
                  </div>

                  {/* Bottom-left category label */}
                  <div className="absolute bottom-3 left-0">
                    <span className="bg-navy/80 text-white rounded-r-lg px-3 py-1 text-xs font-semibold">
                      {getCategoryLabel(property.category)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Price */}
                  <p className="text-xl font-bold text-royal dark:text-[#60A5FA]">
                    {property.priceLabel}
                  </p>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-navy dark:text-white mt-1 line-clamp-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-slate-accent dark:text-[#94A3B8] mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">
                      {property.locality}, {property.city}
                    </span>
                  </div>

                  {/* Specs Row */}
                  <div className="flex gap-4 text-sm text-slate-accent dark:text-[#94A3B8] mt-3">
                    {property.bhk > 0 && (
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" />
                        <span>{property.bhk} Bed</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>{property.carpetArea} sqft</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms} Bath</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border dark:border-[#1D3461] my-3" />

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs text-slate-accent dark:text-[#94A3B8]">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="line-clamp-1">{property.ownerName}</span>
                    </div>
                    <button
                      className="text-royal dark:text-[#60A5FA] text-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(property);
                      }}
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
