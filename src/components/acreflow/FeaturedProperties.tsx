'use client';

import type { PropertyListing, ListingCategory } from '@/types';
import { useAcreFlowStore } from '@/lib/store';
import {
  MapPin,
  BedDouble,
  Maximize,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  Star,
  Heart,
  Share2,
  Bath,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const featuredProperties: PropertyListing[] = [
  {
    id: 'fp1', title: 'Luxury 3 BHK in Anna Nagar', description: 'Premium apartment with world-class amenities',
    category: 'buy', propertyType: 'apartment', price: 8500000, priceLabel: '₹85 Lakh',
    bhk: 3, bathrooms: 2, balconies: 2, floor: '8', totalFloors: 20,
    carpetArea: 1450, furnishing: 'semifurnished', ageOfProperty: 'New',
    possessionStatus: 'ready', locality: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu',
    address: 'Tower A, Prestige Belle Vue, Anna Nagar, Chennai',
    lat: 13.0878, lng: 80.2108,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop'],
    amenities: ['parking', 'gym', 'pool', 'security', 'garden', 'lift'],
    verified: true, reraRegistered: true, reraId: 'RERA/2024/001',
    directFromOwner: false, ownerId: 'o1', ownerName: 'Prestige Constructions',
    ownerPhone: '+91 98765 43210', views: 1240, createdAt: '2025-01-15', updatedAt: '2025-03-20',
  },
  {
    id: 'fp2', title: 'Modern 2 BHK at OMR', description: 'IT corridor premium living with great connectivity',
    category: 'buy', propertyType: 'apartment', price: 6200000, priceLabel: '₹62 Lakh',
    bhk: 2, bathrooms: 2, balconies: 1, floor: '12', totalFloors: 18,
    carpetArea: 1100, furnishing: 'unfurnished', ageOfProperty: '0-5 years',
    possessionStatus: 'ready', locality: 'OMR', city: 'Chennai', state: 'Tamil Nadu',
    address: 'Block B, Hiranandani Egattur, OMR, Chennai',
    lat: 12.9010, lng: 80.2279,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'],
    amenities: ['parking', 'gym', 'security', 'lift', 'clubhouse'],
    verified: true, reraRegistered: true,
    directFromOwner: true, ownerId: 'o2', ownerName: 'Rajesh Kumar',
    ownerPhone: '+91 98765 43211', views: 890, createdAt: '2025-02-10', updatedAt: '2025-03-18',
  },
  {
    id: 'fp3', title: 'Spacious Villa in ECR', description: 'Independent villa with private garden and pool',
    category: 'buy', propertyType: 'villa', price: 25000000, priceLabel: '₹2.5 Cr',
    bhk: 4, bathrooms: 4, balconies: 3, floor: 'Ground', totalFloors: 2,
    carpetArea: 3200, furnishing: 'furnished', ageOfProperty: 'New',
    possessionStatus: 'ready', locality: 'ECR', city: 'Chennai', state: 'Tamil Nadu',
    address: 'No. 42, Beach Road, ECR, Chennai',
    lat: 13.0020, lng: 80.2572,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop'],
    amenities: ['parking', 'pool', 'garden', 'security', 'cctv', 'power-backup'],
    verified: true, reraRegistered: true,
    directFromOwner: false, ownerId: 'o3', ownerName: 'VIP Housing',
    ownerPhone: '+91 98765 43212', views: 2100, createdAt: '2025-01-05', updatedAt: '2025-03-22',
  },
  {
    id: 'fp4', title: '1 BHK for Rent in T Nagar', description: 'Fully furnished flat near metro station',
    category: 'rent', propertyType: 'apartment', price: 25000, priceLabel: '₹25,000/mo',
    deposit: 100000, bhk: 1, bathrooms: 1, balconies: 1, floor: '5', totalFloors: 10,
    carpetArea: 650, furnishing: 'furnished', ageOfProperty: '5-10 years',
    possessionStatus: 'ready', locality: 'T Nagar', city: 'Chennai', state: 'Tamil Nadu',
    address: 'Flat 502, Sri Sai Residency, T Nagar, Chennai',
    lat: 13.0418, lng: 80.2341,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop'],
    amenities: ['parking', 'lift', 'security'],
    verified: true, reraRegistered: false,
    directFromOwner: true, ownerId: 'o4', ownerName: 'Priya Sharma',
    ownerPhone: '+91 98765 43213', views: 560, createdAt: '2025-03-01', updatedAt: '2025-03-20',
  },
  {
    id: 'fp5', title: 'Premium Office Space, Guindy', description: 'Grade A commercial space in business hub',
    category: 'commercial', propertyType: 'commercial-office', price: 45000000, priceLabel: '₹4.5 Cr',
    bhk: 0, bathrooms: 4, balconies: 0, floor: '3', totalFloors: 8,
    carpetArea: 5000, furnishing: 'unfurnished', ageOfProperty: 'New',
    possessionStatus: 'ready', locality: 'Guindy', city: 'Chennai', state: 'Tamil Nadu',
    address: 'Tower C, Olympia Tech Park, Guindy, Chennai',
    lat: 13.0067, lng: 80.2206,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop'],
    amenities: ['parking', 'lift', 'security', 'cctv', 'fire-safety', 'power-backup'],
    verified: true, reraRegistered: true,
    directFromOwner: false, ownerId: 'o5', ownerName: 'Olympia Group',
    ownerPhone: '+91 98765 43214', views: 340, createdAt: '2025-02-20', updatedAt: '2025-03-15',
  },
  {
    id: 'fp6', title: '3 BHK Villa, Porur', description: 'Serene residential villa with modern amenities',
    category: 'buy', propertyType: 'villa', price: 12500000, priceLabel: '₹1.25 Cr',
    bhk: 3, bathrooms: 3, balconies: 2, floor: 'Ground', totalFloors: 2,
    carpetArea: 2200, furnishing: 'semifurnished', ageOfProperty: 'New',
    possessionStatus: 'ready', locality: 'Porur', city: 'Chennai', state: 'Tamil Nadu',
    address: 'Plot 15, Green Valley Villas, Porur, Chennai',
    lat: 13.0381, lng: 80.1564,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop'],
    amenities: ['parking', 'garden', 'security', 'power-backup', 'water-supply'],
    verified: true, reraRegistered: true,
    directFromOwner: true, ownerId: 'o6', ownerName: 'Arun Patel',
    ownerPhone: '+91 98765 43215', views: 780, createdAt: '2025-02-05', updatedAt: '2025-03-19',
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

export default function FeaturedProperties() {
  const { setView, setSelectedProperty } = useAcreFlowStore();

  const handleCardClick = (property: PropertyListing) => {
    setSelectedProperty(property);
    setView('property-detail');
  };

  return (
    <section className="py-16 bg-white dark:bg-[#0A192F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white">
              Featured Properties
            </h2>
            <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-1">
              Handpicked premium listings for you
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

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] property-card cursor-pointer"
              onClick={() => handleCardClick(property)}
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-muted dark:bg-[#1D3461]">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Top-left badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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
                    {property.reraRegistered && (
                      <Badge className="bg-navy text-white border-0 text-xs">
                        RERA
                      </Badge>
                    )}
                  </div>

                  {/* Top-right action icons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      className="bg-white/90 dark:bg-[#0A192F]/90 rounded-full p-2 shadow hover:bg-white dark:hover:bg-[#112240] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Heart className="w-4 h-4 text-slate-accent dark:text-[#94A3B8]" />
                    </button>
                    <button
                      className="bg-white/90 dark:bg-[#0A192F]/90 rounded-full p-2 shadow hover:bg-white dark:hover:bg-[#112240] transition-colors"
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
                      className="text-royal dark:text-[#60A5FA] text-sm font-semibold hover:underline flex items-center gap-1"
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
