'use client';

import { useState, useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import { CITIES } from '@/types';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Ruler,
  Layers,
  Calendar,
  Home,
  Check,
  X,
  TrendingUp,
  Info,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial'] as const;
const AGE_OPTIONS = [
  { value: '0-5', label: '0-5 years', depreciation: 1.0 },
  { value: '5-10', label: '5-10 years', depreciation: 0.92 },
  { value: '10-15', label: '10-15 years', depreciation: 0.82 },
  { value: '15-20', label: '15-20 years', depreciation: 0.72 },
  { value: '20+', label: '20+ years', depreciation: 0.60 },
] as const;
const FURNISHING_FACTORS: Record<string, number> = {
  unfurnished: 1.0,
  semifurnished: 1.05,
  furnished: 1.12,
};
const AMENITY_PREMIUMS = [
  { id: 'parking', label: 'Parking', premium: 0.02 },
  { id: 'gym', label: 'Gym', premium: 0.015 },
  { id: 'pool', label: 'Pool', premium: 0.02 },
  { id: 'security', label: 'Security', premium: 0.01 },
  { id: 'lift', label: 'Lift', premium: 0.015 },
  { id: 'power-backup', label: 'Power Backup', premium: 0.01 },
  { id: 'clubhouse', label: 'Club House', premium: 0.015 },
];

const BASE_RATES: Record<string, number> = {
  Chennai: 6500,
  Mumbai: 12000,
  Delhi: 8500,
  Bangalore: 7500,
  Hyderabad: 5500,
  Kolkata: 4500,
  Pune: 6000,
  Ahmedabad: 4200,
  Jaipur: 3800,
  Lucknow: 3200,
};

const COMPARABLE_PROPERTIES = [
  { name: 'Prestige Lakeside', type: '3 BHK Apartment', price: '₹85 L', area: '1650 sq ft', pricePerSqFt: '₹5,152' },
  { name: 'Sobha City View', type: '3 BHK Apartment', price: '₹92 L', area: '1700 sq ft', pricePerSqFt: '₹5,412' },
  { name: 'Godrej Reserve', type: '3 BHK Villa', price: '₹1.2 Cr', area: '2200 sq ft', pricePerSqFt: '₹5,455' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyFull(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Crore`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PropertyValuation() {
  const { goBack } = useAcreFlowStore();

  const [propertyType, setPropertyType] = useState<string>('Apartment');
  const [city, setCity] = useState<string>('Chennai');
  const [locality, setLocality] = useState('');
  const [carpetArea, setCarpetArea] = useState<string>('1200');
  const [bhk, setBhk] = useState<string>('3');
  const [ageOfProperty, setAgeOfProperty] = useState<string>('0-5');
  const [floor, setFloor] = useState<string>('5');
  const [totalFloors, setTotalFloors] = useState<string>('15');
  const [furnishing, setFurnishing] = useState<string>('unfurnished');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [calculated, setCalculated] = useState(false);

  const toggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const results = useMemo(() => {
    if (!calculated) return null;

    const area = parseInt(carpetArea) || 1200;
    const baseRate = BASE_RATES[city] || 5000;
    const ageData = AGE_OPTIONS.find((a) => a.value === ageOfProperty);
    const ageDepreciation = ageData?.depreciation || 1.0;
    const furnishingFactor = FURNISHING_FACTORS[furnishing] || 1.0;

    const amenitiesPremium = amenities.reduce((sum, id) => {
      const found = AMENITY_PREMIUMS.find((a) => a.id === id);
      return sum + (found?.premium || 0);
    }, 0);

    const propertyTypeFactor = propertyType === 'Villa' ? 1.2 : propertyType === 'Commercial' ? 1.3 : propertyType === 'Plot' ? 0.7 : 1.0;

    const estimatedValue = Math.round(
      area * baseRate * ageDepreciation * furnishingFactor * (1 + amenitiesPremium) * propertyTypeFactor
    );

    const minValue = Math.round(estimatedValue * 0.9);
    const maxValue = Math.round(estimatedValue * 1.1);
    const pricePerSqFt = Math.round(estimatedValue / area);
    const appreciation = 8 + Math.random() * 10;

    return { estimatedValue, minValue, maxValue, pricePerSqFt, area, appreciation };
  }, [calculated, city, carpetArea, ageOfProperty, furnishing, amenities, propertyType]);

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
            <TrendingUp className="h-6 w-6 text-royal dark:text-[#60A5FA]" />
            Property Valuation
          </h1>
          <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-0.5">
            Know the market value of your property
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── Left Column – Input Form ──────────────────────────────────── */}
        <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6 space-y-5">
          <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
            Property Details
          </h2>

          {/* Property Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white">Property Type</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461]">
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-navy dark:text-white">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City + Locality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-royal dark:text-[#60A5FA]" /> City
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461]">
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-navy dark:text-white">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-navy dark:text-white">Locality</Label>
              <Input
                placeholder="e.g., Anna Nagar"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white placeholder:text-slate-light"
              />
            </div>
          </div>

          {/* Carpet Area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5 text-royal dark:text-[#60A5FA]" /> Carpet Area (sq ft)
            </Label>
            <Input
              type="number"
              placeholder="1200"
              value={carpetArea}
              onChange={(e) => setCarpetArea(e.target.value)}
              className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white placeholder:text-slate-light"
            />
          </div>

          {/* BHK */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-royal dark:text-[#60A5FA]" /> BHK Configuration
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {([1, 2, 3, 4] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBhk(String(b))}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    bhk === String(b)
                      ? 'bg-royal text-white border-royal'
                      : 'bg-white dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border-border dark:border-[#1D3461]'
                  }`}
                >
                  {b} BHK
                </button>
              ))}
            </div>
          </div>

          {/* Age of Property */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-royal dark:text-[#60A5FA]" /> Age of Property
            </Label>
            <Select value={ageOfProperty} onValueChange={setAgeOfProperty}>
              <SelectTrigger className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461]">
                {AGE_OPTIONS.map((a) => (
                  <SelectItem key={a.value} value={a.value} className="text-navy dark:text-white">{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Floor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-navy dark:text-white">Floor</Label>
              <Input
                type="number"
                placeholder="5"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white placeholder:text-slate-light"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-navy dark:text-white">Total Floors</Label>
              <Input
                type="number"
                placeholder="15"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value)}
                className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white placeholder:text-slate-light"
              />
            </div>
          </div>

          {/* Furnishing */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-royal dark:text-[#60A5FA]" /> Furnishing Status
            </Label>
            <Select value={furnishing} onValueChange={setFurnishing}>
              <SelectTrigger className="h-11 rounded-xl border-border dark:border-[#1D3461] bg-white dark:bg-[#1D3461] text-navy dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461]">
                {['unfurnished', 'semifurnished', 'furnished'].map((f) => (
                  <SelectItem key={f} value={f} className="text-navy dark:text-white capitalize">
                    {f === 'semifurnished' ? 'Semi-Furnished' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-navy dark:text-white">Key Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_PREMIUMS.map((a) => {
                const isActive = amenities.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAmenity(a.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                      isActive
                        ? 'bg-royal text-white border-royal'
                        : 'bg-white dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border-border dark:border-[#1D3461]'
                    }`}
                  >
                    {isActive ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            className="w-full h-12 bg-royal hover:bg-royal-dark text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Calculate Valuation
          </Button>
        </div>

        {/* ─── Right Column – Results ─────────────────────────────────────── */}
        <div className="space-y-6">
          {results ? (
            <>
              {/* Main Value Card */}
              <div className="bg-navy dark:bg-[#112240] rounded-2xl p-6 text-white border border-transparent dark:border-[#1D3461]">
                <p className="text-sm text-white/60 mb-1">Estimated Market Value</p>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  {formatCurrencyFull(results.estimatedValue)}
                </p>
                <p className="text-sm text-white/50 mt-2">
                  {propertyType} in {city}{locality ? `, ${locality}` : ''}
                </p>

                {/* Value Range */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span>{formatCurrency(results.minValue)}</span>
                    <span className="text-white/80 font-medium">Value Range</span>
                    <span>{formatCurrency(results.maxValue)}</span>
                  </div>
                  <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-royal-light to-sky-deep rounded-full transition-all duration-700"
                      style={{ left: '0%', width: '100%' }}
                    />
                    <div
                      className="absolute h-full w-1.5 bg-white rounded-full transition-all duration-700"
                      style={{
                        left: `${50}%`,
                      }}
                    />
                  </div>
                </div>

                <Separator className="bg-white/10 my-5" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/50 mb-1">Price per sq ft</p>
                    <p className="text-lg font-bold text-white">₹{results.pricePerSqFt.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-white/50 mb-1">YoY Appreciation</p>
                    <p className="text-lg font-bold text-green-400">+{results.appreciation.toFixed(1)}%</p>
                    <p className="text-xs text-white/40 mt-0.5">Year-over-year growth</p>
                  </div>
                </div>
              </div>

              {/* Valuation Factors */}
              <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
                <h3 className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                  Valuation Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-accent dark:text-[#94A3B8]">Base Rate (per sq ft)</span>
                    <span className="font-medium text-navy dark:text-white">₹{(BASE_RATES[city] || 5000).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-accent dark:text-[#94A3B8]">Carpet Area</span>
                    <span className="font-medium text-navy dark:text-white">{results.area.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-accent dark:text-[#94A3B8]">Age Depreciation</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium ${
                        ageOfProperty === '0-5'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : ageOfProperty === '20+'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                    >
                      {AGE_OPTIONS.find((a) => a.value === ageOfProperty)?.depreciation === 1.0
                        ? 'No depreciation'
                        : `${(1 - (AGE_OPTIONS.find((a) => a.value === ageOfProperty)?.depreciation || 1)) * 100}% depreciation`}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-accent dark:text-[#94A3B8]">Furnishing Factor</span>
                    <Badge variant="secondary" className="text-xs bg-sky text-royal dark:bg-[#1D3461] dark:text-[#60A5FA]">
                      {(FURNISHING_FACTORS[furnishing] || 1.0) > 1.0 ? `+${((FURNISHING_FACTORS[furnishing] || 1) - 1) * 100}%` : 'Base'}
                    </Badge>
                  </div>
                  {amenities.length > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-accent dark:text-[#94A3B8]">Amenities Premium</span>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        +{(amenities.reduce((sum, id) => sum + (AMENITY_PREMIUMS.find((a) => a.id === id)?.premium || 0), 0) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Comparable Properties */}
              <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
                <h3 className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                  Comparable Properties
                </h3>
                <div className="space-y-3">
                  {COMPARABLE_PROPERTIES.map((prop, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-border dark:border-[#1D3461] hover:border-royal/30 dark:hover:border-[#60A5FA]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-navy dark:text-white">{prop.name}</p>
                        <p className="text-sm font-bold text-royal dark:text-[#60A5FA]">{prop.price}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-accent dark:text-[#94A3B8]">
                        <span>{prop.type}</span>
                        <span>&middot;</span>
                        <span>{prop.area}</span>
                        <span>&middot;</span>
                        <span>{prop.pricePerSqFt}/sqft</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full h-12 bg-royal hover:bg-royal-dark text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                List Your Property
              </Button>

              {/* Disclaimer */}
              <div className="bg-sky/50 dark:bg-[#1D3461]/30 rounded-xl p-4 border border-sky dark:border-[#1D3461]">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-royal dark:text-[#60A5FA] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-accent dark:text-[#94A3B8] leading-relaxed">
                    This is an estimated market value based on city averages and property parameters.
                    For a professional valuation, please consult a certified property valuer.
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Placeholder */
            <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-20 h-20 rounded-2xl bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4">
                <TrendingUp className="h-10 w-10 text-royal dark:text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-semibold text-navy dark:text-white mb-2">
                Get Your Property Valued
              </h3>
              <p className="text-sm text-slate-accent dark:text-[#94A3B8] max-w-sm">
                Enter your property details on the left and click &ldquo;Calculate Valuation&rdquo;
                to get an instant market value estimate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
