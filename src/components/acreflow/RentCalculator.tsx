'use client';

import { useState, useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import { CITIES } from '@/types';
import {
  ArrowLeft,
  Calculator,
  Home,
  MapPin,
  Building2,
  Layers,
  Check,
  X,
  TrendingUp,
  Info,
  ArrowRight,
  SquareCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = ['Apartment', 'Villa', 'PG', 'Independent House'] as const;
const BHK_OPTIONS = [1, 2, 3, 4] as const;
const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished', premium: 0 },
  { value: 'semifurnished', label: 'Semi-Furnished', premium: 1500 },
  { value: 'furnished', label: 'Furnished', premium: 3000 },
] as const;
const FLOOR_OPTIONS = [
  { value: 'ground', label: 'Ground', multiplier: 0.95 },
  { value: '1-5', label: '1-5', multiplier: 1.0 },
  { value: '5-10', label: '5-10', multiplier: 1.05 },
  { value: '10+', label: '10+', multiplier: 1.1 },
] as const;
const AMENITY_OPTIONS = [
  { id: 'parking', label: 'Parking', premium: 1500 },
  { id: 'gym', label: 'Gym', premium: 1000 },
  { id: 'pool', label: 'Pool', premium: 800 },
  { id: 'security', label: 'Security', premium: 500 },
  { id: 'lift', label: 'Lift', premium: 700 },
  { id: 'power-backup', label: 'Power Backup', premium: 600 },
] as const;

const BASE_RENTS: Record<string, number> = {
  Chennai: 15000,
  Mumbai: 25000,
  Delhi: 20000,
  Bangalore: 22000,
  Hyderabad: 18000,
  Kolkata: 12000,
  Pune: 16000,
  Ahmedabad: 13000,
  Jaipur: 11000,
  Lucknow: 10000,
};

const BHK_MULTIPLIERS: Record<number, number> = {
  1: 0.6,
  2: 1.0,
  3: 1.5,
  4: 2.0,
};

const PROPERTY_TYPE_MULTIPLIERS: Record<string, number> = {
  Apartment: 1.0,
  Villa: 1.4,
  PG: 0.5,
  'Independent House': 1.2,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RentCalculator() {
  const { goBack, setView } = useAcreFlowStore();

  const [propertyType, setPropertyType] = useState<string>('Apartment');
  const [bhk, setBhk] = useState<number>(2);
  const [city, setCity] = useState<string>('Chennai');
  const [locality, setLocality] = useState('');
  const [furnishing, setFurnishing] = useState<string>('unfurnished');
  const [floor, setFloor] = useState<string>('1-5');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [calculated, setCalculated] = useState(false);

  const toggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const results = useMemo(() => {
    if (!calculated) return null;

    const baseRent = BASE_RENTS[city] || 15000;
    const bhkMultiplier = BHK_MULTIPLIERS[bhk] || 1.0;
    const typeMultiplier = PROPERTY_TYPE_MULTIPLIERS[propertyType] || 1.0;
    const floorMultiplier = FLOOR_OPTIONS.find((f) => f.value === floor)?.multiplier || 1.0;
    const furnishingPremium = FURNISHING_OPTIONS.find((f) => f.value === furnishing)?.premium || 0;

    const amenitiesPremium = amenities.reduce((sum, id) => {
      const found = AMENITY_OPTIONS.find((a) => a.id === id);
      return sum + (found?.premium || 0);
    }, 0);

    const estimatedRent = Math.round(
      baseRent * bhkMultiplier * typeMultiplier * floorMultiplier + furnishingPremium + amenitiesPremium
    );

    const minRent = Math.round(estimatedRent * 0.85);
    const maxRent = Math.round(estimatedRent * 1.15);
    const cityAvg = Math.round(baseRent * 1.0);
    const avgArea = bhk * 450;
    const pricePerSqFt = Math.round(estimatedRent / avgArea);

    const factors = [
      {
        name: `${bhk} BHK configuration`,
        impact: bhkMultiplier >= 1.2 ? 'positive' : bhkMultiplier <= 0.8 ? 'negative' : 'neutral',
        detail: `${bhkMultiplier >= 1.2 ? '+' : bhkMultiplier <= 0.8 ? '' : ''}${((bhkMultiplier - 1) * 100).toFixed(0)}%`,
      },
      {
        name: `${propertyType} type`,
        impact: typeMultiplier > 1.0 ? 'positive' : typeMultiplier < 1.0 ? 'negative' : 'neutral',
        detail: `${((typeMultiplier - 1) * 100).toFixed(0)}%`,
      },
      {
        name: `${furnishing} furnishing`,
        impact: furnishingPremium > 0 ? 'positive' : 'neutral',
        detail: furnishingPremium > 0 ? `+₹${furnishingPremium.toLocaleString()}/mo` : 'Base rate',
      },
      {
        name: `Floor: ${floor}`,
        impact: floorMultiplier > 1.0 ? 'positive' : floorMultiplier < 1.0 ? 'negative' : 'neutral',
        detail: `${((floorMultiplier - 1) * 100).toFixed(0)}%`,
      },
      ...(amenities.length > 0
        ? [
            {
              name: `${amenities.length} amenities selected`,
              impact: 'positive' as const,
              detail: `+₹${amenitiesPremium.toLocaleString()}/mo`,
            },
          ]
        : []),
    ];

    return {
      estimatedRent,
      minRent,
      maxRent,
      cityAvg,
      pricePerSqFt,
      avgArea,
      factors,
    };
  }, [calculated, city, bhk, propertyType, furnishing, floor, amenities]);

  const handleCalculate = () => {
    setCalculated(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-cream dark:bg-[#0A192F] min-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="rounded-full hover:bg-cream dark:hover:bg-[#1D3461] text-navy dark:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white flex items-center gap-2">
            <Calculator className="h-6 w-6 text-royal dark:text-[#60A5FA]" />
            Rent Calculator
          </h1>
          <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-0.5">
            Estimate the fair rent for any property
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── Left Column – Inputs ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
            <Home className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
            Property Details
          </h2>

          {/* Property Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Property Type
            </Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461]">
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-navy dark:text-white">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BHK Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              BHK Type
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {BHK_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBhk(b)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    bhk === b
                      ? 'bg-royal text-white border-royal shadow-sm'
                      : 'bg-white dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border-border dark:border-[#1D3461] hover:border-royal/50 dark:hover:border-[#60A5FA]/50'
                  }`}
                >
                  {b} BHK
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              City
            </Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461]">
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-navy dark:text-white">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Locality */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Locality
            </Label>
            <Input
              placeholder="e.g., Anna Nagar, Bandra, Koramangala"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white placeholder:text-slate-light"
            />
          </div>

          {/* Furnishing Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-2">
              <Home className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Furnishing Status
            </Label>
            <Select value={furnishing} onValueChange={setFurnishing}>
              <SelectTrigger className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461]">
                {FURNISHING_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-navy dark:text-white">
                    {f.label} {f.premium > 0 ? `(+₹${f.premium.toLocaleString()})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Floor Preference */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Floor Preference
            </Label>
            <Select value={floor} onValueChange={setFloor}>
              <SelectTrigger className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461]">
                {FLOOR_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-navy dark:text-white">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-2">
              <SquareCode className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Amenities
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_OPTIONS.map((a) => {
                const isActive = amenities.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAmenity(a.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                      isActive
                        ? 'bg-royal text-white border-royal'
                        : 'bg-white dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border-border dark:border-[#1D3461] hover:border-royal/50'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isActive ? 'bg-white border-white' : 'border-current'
                      }`}
                    >
                      {isActive && <Check className="h-3 w-3 text-royal" />}
                    </span>
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            className="w-full h-12 bg-royal hover:bg-royal-dark text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2"
          >
            <Calculator className="h-4 w-4" />
            Calculate Rent Estimate
          </Button>
        </div>

        {/* ─── Right Column – Results ─────────────────────────────────────── */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Estimated Rent Card */}
              <div className="bg-navy dark:bg-[#112240] rounded-2xl p-6 text-white border border-transparent dark:border-[#1D3461]">
                <p className="text-sm text-white/60 mb-1">Estimated Monthly Rent</p>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  {formatCurrency(results.estimatedRent)}
                </p>
                <p className="text-sm text-white/50 mt-2">
                  For {bhk} BHK {propertyType} in {city}
                  {locality ? `, ${locality}` : ''}
                </p>

                {/* Rent Range Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span>{formatCurrency(results.minRent)}</span>
                    <span className="text-white/80 font-medium">Estimated Range</span>
                    <span>{formatCurrency(results.maxRent)}</span>
                  </div>
                  <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-royal-light to-sky-deep rounded-full transition-all duration-700"
                      style={{
                        left: '0%',
                        width: '100%',
                      }}
                    />
                    <div
                      className="absolute h-full w-1 bg-white rounded-full transition-all duration-700"
                      style={{
                        left: `${((results.estimatedRent - results.minRent) / (results.maxRent - results.minRent)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <Separator className="bg-white/10 my-5" />

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/50 mb-1">City Average Rent</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(results.cityAvg)}</p>
                    <p className={`text-xs mt-0.5 ${results.estimatedRent > results.cityAvg ? 'text-sky' : 'text-amber-400'}`}>
                      {results.estimatedRent > results.cityAvg ? 'Above average' : 'Below average'}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/50 mb-1">Price per sq ft</p>
                    <p className="text-lg font-bold text-white">
                      ₹{results.pricePerSqFt}/sqft
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      Est. area ~{results.avgArea} sq ft
                    </p>
                  </div>
                </div>
              </div>

              {/* Factors Affecting Rent */}
              <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
                <h3 className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                  Factors Affecting Rent
                </h3>
                <div className="space-y-3">
                  {results.factors.map((factor, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-border/50 dark:border-[#1D3461]/50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        {factor.impact === 'positive' ? (
                          <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </span>
                        ) : factor.impact === 'negative' ? (
                          <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <X className="h-3 w-3 text-red-500 dark:text-red-400" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Info className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                          </span>
                        )}
                        <span className="text-sm text-navy dark:text-white">{factor.name}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs font-medium ${
                          factor.impact === 'positive'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : factor.impact === 'negative'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {factor.detail}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Properties Link */}
              <button
                onClick={() => {
                  setView('search');
                }}
                className="w-full bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-4 flex items-center justify-between hover:border-royal dark:hover:border-[#60A5FA] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                    <Home className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-white">
                      Similar Properties for Rent
                    </p>
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                      Browse {bhk} BHK rentals in {city}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-accent dark:text-[#94A3B8] group-hover:text-royal dark:group-hover:text-[#60A5FA] transition-colors" />
              </button>

              {/* Disclaimer */}
              <div className="bg-sky/50 dark:bg-[#1D3461]/30 rounded-xl p-4 border border-sky dark:border-[#1D3461]">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-royal dark:text-[#60A5FA] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-accent dark:text-[#94A3B8] leading-relaxed">
                    This is an estimated rent based on market averages. Actual rent may vary based on
                    exact location, property condition, builder reputation, and market dynamics.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Placeholder before calculation */
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-20 h-20 rounded-2xl bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4">
                <Calculator className="h-10 w-10 text-royal dark:text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                Ready to Calculate
              </h3>
              <p className="text-sm text-slate-accent dark:text-[#94A3B8] max-w-sm">
                Fill in the property details on the left and click &ldquo;Calculate Rent Estimate&rdquo;
                to see the estimated monthly rent and detailed breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
