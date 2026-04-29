'use client';

import { useAcreFlowStore } from '@/lib/store';
import {
  ChevronRight,
  MapPin,
  Star,
  Wifi,
  UtensilsCrossed,
  Snowflake,
  WashingMachine,
  User as UserIcon,
  Briefcase,
  CalendarDays,
  MessageCircle,
  GraduationCap,
  IndianRupee,
  Home,
  Building2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

// ─── Mock Data ──────────────────────────────────────────────────

interface PGListing {
  id: string;
  name: string;
  monthlyRent: number;
  location: string;
  sharingType: 'Single' | 'Double' | 'Triple';
  gender: 'Male' | 'Female' | 'Co-ed';
  amenities: string[];
  rating: number;
  gradient: string;
}

interface FlatmateListing {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  profession: string;
  preferredLocation: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  avatarInitial: string;
}

const PG_LISTINGS: PGListing[] = [
  {
    id: 'pg-1',
    name: 'Zolo Pearl PG',
    monthlyRent: 8500,
    location: 'Velachery, Chennai',
    sharingType: 'Double',
    gender: 'Male',
    amenities: ['wifi', 'meals', 'ac', 'laundry'],
    rating: 4.2,
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'pg-2',
    name: 'Stanza Living',
    monthlyRent: 12000,
    location: 'Anna Nagar, Chennai',
    sharingType: 'Single',
    gender: 'Female',
    amenities: ['wifi', 'meals', 'ac', 'laundry'],
    rating: 4.5,
    gradient: 'from-violet-500 to-purple-400',
  },
  {
    id: 'pg-3',
    name: 'CoLive Emerald',
    monthlyRent: 6500,
    location: 'T. Nagar, Chennai',
    sharingType: 'Triple',
    gender: 'Male',
    amenities: ['wifi', 'meals', 'laundry'],
    rating: 3.8,
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'pg-4',
    name: 'YourSpace Comforts',
    monthlyRent: 9800,
    location: 'OMR, Chennai',
    sharingType: 'Double',
    gender: 'Co-ed',
    amenities: ['wifi', 'meals', 'ac'],
    rating: 4.0,
    gradient: 'from-amber-500 to-orange-400',
  },
];

const FLATMATE_LISTINGS: FlatmateListing[] = [
  {
    id: 'fm-1',
    name: 'Arjun Mehta',
    age: 26,
    gender: 'Male',
    profession: 'Software Engineer',
    preferredLocation: 'Anna Nagar, Chennai',
    budgetMin: 15000,
    budgetMax: 25000,
    moveInDate: '15 Jan 2025',
    avatarInitial: 'AM',
  },
  {
    id: 'fm-2',
    name: 'Priya Sharma',
    age: 24,
    gender: 'Female',
    profession: 'Data Analyst',
    preferredLocation: 'Velachery, Chennai',
    budgetMin: 10000,
    budgetMax: 18000,
    moveInDate: '1 Feb 2025',
    avatarInitial: 'PS',
  },
  {
    id: 'fm-3',
    name: 'Karthik Raman',
    age: 28,
    gender: 'Male',
    profession: 'Product Manager',
    preferredLocation: 'Adyar, Chennai',
    budgetMin: 20000,
    budgetMax: 35000,
    moveInDate: '20 Jan 2025',
    avatarInitial: 'KR',
  },
];

// ─── Amenity Icons Map ──────────────────────────────────────────

const PG_AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  meals: <UtensilsCrossed className="w-3.5 h-3.5" />,
  ac: <Snowflake className="w-3.5 h-3.5" />,
  laundry: <WashingMachine className="w-3.5 h-3.5" />,
};

const PG_AMENITY_LABELS: Record<string, string> = {
  wifi: 'WiFi',
  meals: 'Meals',
  ac: 'AC',
  laundry: 'Laundry',
};

// ─── Helpers ────────────────────────────────────────────────────

function GenderIcon({ gender }: { gender: string }) {
  if (gender === 'Male')
    return <UserIcon className="w-4 h-4 text-blue-500" />;
  if (gender === 'Female')
    return <UserIcon className="w-4 h-4 text-pink-500" />;
  return (
    <div className="flex -space-x-1">
      <UserIcon className="w-3.5 h-3.5 text-blue-500" />
      <UserIcon className="w-3.5 h-3.5 text-pink-500" />
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-gray-200 text-gray-200 dark:fill-[#334155] dark:text-[#334155]'
          }`}
        />
      ))}
      <span className="text-xs text-slate-accent dark:text-[#94A3B8] ml-1 font-medium">
        {rating}
      </span>
    </div>
  );
}

function formatBudget(min: number, max: number): string {
  const fmt = (v: number) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
    return `₹${v}`;
  };
  return `${fmt(min)} - ${fmt(max)}`;
}

// ─── Main Component ────────────────────────────────────────────

export default function PGFlatmatesSection() {
  const { setFilters, setView } = useAcreFlowStore();

  const handleBrowsePG = () => {
    setFilters({
      category: 'rent',
      propertyTypes: ['pg'],
    });
    setView('search');
  };

  const handleContactPG = (pg: PGListing) => {
    toast.success(`Contact request sent to ${pg.name}`);
  };

  const handleConnect = (flatmate: FlatmateListing) => {
    toast.success(`Connection request sent to ${flatmate.name}`);
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#0A192F]">
      <div className="max-w-7xl mx-auto px-4">
        {/* ── Section Header ─────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy dark:text-white">
              PG & Co-living Spaces
            </h2>
            <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-1">
              Affordable furnished stays with amenities included
            </p>
          </div>
          <button
            onClick={handleBrowsePG}
            className="text-royal dark:text-[#60A5FA] text-sm font-semibold hover:underline flex items-center gap-1 shrink-0"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── PG Accommodations ──────────────────────────────── */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-royal dark:text-[#60A5FA]" />
            Popular PG Accommodations
          </h3>

          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory acreflow-scrollbar md:grid md:grid-cols-4 md:overflow-x-visible md:pb-0">
            {PG_LISTINGS.map((pg) => (
              <Card
                key={pg.id}
                className="min-w-[260px] sm:min-w-[280px] snap-start rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] overflow-hidden hover:shadow-lg transition-shadow group shrink-0 md:min-w-0"
              >
                {/* Gradient Placeholder Image */}
                <div
                  className={`h-36 bg-gradient-to-br ${pg.gradient} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="w-12 h-12 text-white/40" />
                  </div>
                  {/* Sharing type badge */}
                  <Badge className="absolute top-3 left-3 bg-white/90 dark:bg-navy/80 text-navy dark:text-white border-0 text-[11px] font-medium px-2 py-0.5">
                    {pg.sharingType} Sharing
                  </Badge>
                  {/* Gender badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={`border-0 text-[10px] px-2 py-0.5 font-medium ${
                        pg.gender === 'Male'
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                          : pg.gender === 'Female'
                            ? 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300'
                            : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      <GenderIcon gender={pg.gender} />
                      <span className="ml-1">{pg.gender}</span>
                    </Badge>
                  </div>
                  {/* Monthly rent overlay */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 dark:bg-navy/90 backdrop-blur-sm rounded-lg px-2.5 py-1">
                      <span className="text-sm font-bold text-navy dark:text-white">
                        ₹{pg.monthlyRent.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-accent dark:text-[#94A3B8]">
                        /bed/month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-navy dark:text-white mb-1 group-hover:text-royal dark:group-hover:text-[#60A5FA] transition-colors">
                    {pg.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-accent dark:text-[#94A3B8] mb-2.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="line-clamp-1">{pg.location}</span>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-2 mb-3">
                    {pg.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-1 bg-sky dark:bg-[#1D3461] rounded-md px-2 py-0.5 text-[11px] text-royal dark:text-[#60A5FA]"
                        title={PG_AMENITY_LABELS[amenity]}
                      >
                        {PG_AMENITY_ICONS[amenity]}
                        <span>{PG_AMENITY_LABELS[amenity]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rating + Contact */}
                  <div className="flex items-center justify-between pt-3 border-t border-border dark:border-[#1D3461]">
                    <RatingStars rating={pg.rating} />
                    <Button
                      size="sm"
                      onClick={() => handleContactPG(pg)}
                      className="text-xs h-8 px-3 bg-royal hover:bg-royal-dark text-white rounded-lg"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Find Flatmates ─────────────────────────────────── */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-royal dark:text-[#60A5FA]" />
            Find Flatmates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLATMATE_LISTINGS.map((flatmate) => (
              <Card
                key={flatmate.id}
                className="rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar Placeholder */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white ${
                      flatmate.gender === 'Female'
                        ? 'bg-gradient-to-br from-pink-400 to-rose-500'
                        : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                    }`}
                  >
                    {flatmate.avatarInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-navy dark:text-white group-hover:text-royal dark:group-hover:text-[#60A5FA] transition-colors">
                      {flatmate.name}
                    </h4>
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                      {flatmate.age} yrs, {flatmate.gender}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-accent dark:text-[#94A3B8]">
                    <Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-accent dark:text-[#64748B]" />
                    <span>{flatmate.profession}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-accent dark:text-[#94A3B8]">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-accent dark:text-[#64748B]" />
                    <span>{flatmate.preferredLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-accent dark:text-[#94A3B8]">
                    <IndianRupee className="w-3.5 h-3.5 shrink-0 text-slate-accent dark:text-[#64748B]" />
                    <span>Budget: {formatBudget(flatmate.budgetMin, flatmate.budgetMax)}/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-accent dark:text-[#94A3B8]">
                    <CalendarDays className="w-3.5 h-3.5 shrink-0 text-slate-accent dark:text-[#64748B]" />
                    <span>Move-in: {flatmate.moveInDate}</span>
                  </div>
                </div>

                {/* Connect Button */}
                <Button
                  size="sm"
                  onClick={() => handleConnect(flatmate)}
                  className="w-full text-xs h-9 bg-royal hover:bg-royal-dark text-white rounded-lg"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Connect
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* ── CTA Banner ─────────────────────────────────────── */}
        <div className="rounded-xl bg-gradient-to-r from-navy to-[#112240] dark:from-[#112240] dark:to-[#1D3461] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Looking for PG?
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Browse 500+ verified PG accommodations across Chennai
            </p>
          </div>
          <Button
            onClick={handleBrowsePG}
            className="bg-white dark:bg-[#60A5FA] text-navy dark:text-[#0A192F] hover:bg-gray-100 dark:hover:bg-[#93C5FD] rounded-xl font-semibold px-6 shrink-0"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse PG Listings
          </Button>
        </div>
      </div>
    </section>
  );
}
