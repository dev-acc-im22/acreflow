// ==========================================
// AcreFlow Type Definitions
// ==========================================

export type ListingCategory = 'buy' | 'rent' | 'commercial';
export type PropertyType = 'apartment' | 'villa' | 'plot' | 'commercial-office' | 'commercial-shop' | 'commercial-warehouse' | 'pg' | 'house';
export type Furnishing = 'unfurnished' | 'semifurnished' | 'furnished';
export type ListingStatus = 'active' | 'sold' | 'rented' | 'expired';
export type LeadStatus = 'hot' | 'warm' | 'cold';
export type VerificationStatus = 'none' | 'pending' | 'verified';
export type PossessionStatus = 'ready' | 'under-construction' | 'new-launch';

export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  propertyType: PropertyType;
  price: number;
  priceLabel: string;
  originalPrice?: number;
  deposit?: number;
  bhk: number;
  bathrooms: number;
  balconies: number;
  floor: string;
  totalFloors: number;
  carpetArea: number;
  superBuiltUpArea?: number;
  plotArea?: number;
  furnishing: Furnishing;
  ageOfProperty: string;
  possessionStatus: PossessionStatus;
  locality: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  amenities: string[];
  verified: boolean;
  reraRegistered: boolean;
  reraId?: string;
  directFromOwner: boolean;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  category: ListingCategory;
  query: string;
  propertyTypes: PropertyType[];
  bhkRange: [number, number];
  priceRange: [number, number];
  areaRange: [number, number];
  furnishing: Furnishing | 'all';
  possessionStatus: PossessionStatus | 'all';
  verifiedOnly: boolean;
  directOwnerOnly: boolean;
  readyToMoveOnly: boolean;
  amenities: string[];
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'area-high';
}

export interface Lead {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface LocalityInsight {
  safety: number;
  connectivity: number;
  infrastructure: number;
  airQuality: number;
  nightlife: number;
  restaurants: number;
}

export interface PriceTrend {
  month: string;
  price: number;
}

export type AppView =
  | 'home'
  | 'search'
  | 'property-detail'
  | 'post-property'
  | 'lead-center'
  | 'emi-calculator'
  | 'budget-calculator'
  | 'services'
  | 'plans'
  | 'refer-earn'
  | 'about'
  | 'blog'
  | 'rent-calculator'
  | 'interior-calc'
  | 'valuation'
  | 'bank-rates'
  | 'scratch-rewards'
  | 'corporate';

export const defaultFilters: SearchFilters = {
  category: 'buy',
  query: '',
  propertyTypes: [],
  bhkRange: [1, 5],
  priceRange: [0, 100000000],
  areaRange: [0, 10000],
  furnishing: 'all',
  possessionStatus: 'all',
  verifiedOnly: false,
  directOwnerOnly: false,
  readyToMoveOnly: false,
  amenities: [],
  sortBy: 'relevance',
};

export const AMENITIES = [
  { id: 'parking', label: 'Parking', icon: 'Car' },
  { id: 'gym', label: 'Gym', icon: 'Dumbbell' },
  { id: 'pool', label: 'Swimming Pool', icon: 'Waves' },
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'garden', label: 'Garden', icon: 'Trees' },
  { id: 'lift', label: 'Lift', icon: 'ArrowUpDown' },
  { id: 'power-backup', label: 'Power Backup', icon: 'Zap' },
  { id: 'water-supply', label: 'Water Supply', icon: 'Droplets' },
  { id: 'clubhouse', label: 'Club House', icon: 'Building2' },
  { id: 'jogging-track', label: 'Jogging Track', icon: 'Footprints' },
  { id: 'children-play', label: 'Children Play Area', icon: 'Baby' },
  { id: 'intercom', label: 'Intercom', icon: 'Phone' },
  { id: 'ac', label: 'AC', icon: 'Snowflake' },
  { id: 'wifi', label: 'WiFi', icon: 'Wifi' },
  { id: 'cctv', label: 'CCTV', icon: 'Camera' },
  { id: 'fire-safety', label: 'Fire Safety', icon: 'Flame' },
  { id: 'vaastu', label: 'Vaastu Compliant', icon: 'Compass' },
  { id: 'servant-room', label: 'Servant Room', icon: 'UserRound' },
] as const;

export const CITIES = [
  'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
] as const;

export const BHK_OPTIONS = [1, 2, 3, 4, 5] as const;

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  alertEnabled: boolean;
}

export interface PropertyNote {
  propertyId: string;
  note: string;
  createdAt: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  pricing: { label: string; price: string }[];
  steps: { step: string; description: string }[];
}

export interface CityData {
  name: string;
  image: string;
  propertyCount: number;
  avgPrice: string;
  growth: string;
  topLocalities: string[];
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingRewards: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  time: string;
}
