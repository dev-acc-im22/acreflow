'use client';

import { useState } from 'react';
import type { PropertyType, Furnishing, PossessionStatus, ListingCategory, PropertyListing } from '@/types';
import { AMENITIES, CITIES } from '@/types';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  MapPin,
  Camera,
  Building2,
  Home,
  Warehouse,
  Store,
  Hotel,
  Plus,
  X,
  FileText,
  Image as ImageIcon,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const STEPS = ['Details', 'Media', 'Review'];

const PROPERTY_TYPES: { type: PropertyType; label: string; icon: typeof Home; category?: ListingCategory }[] = [
  { type: 'apartment', label: 'Apartment', icon: Home },
  { type: 'villa', label: 'Villa', icon: Building2 },
  { type: 'plot', label: 'Plot', icon: MapPin },
  { type: 'commercial-office', label: 'Commercial Office', icon: Store, category: 'commercial' },
  { type: 'commercial-shop', label: 'Commercial Shop', icon: Store, category: 'commercial' },
  { type: 'commercial-warehouse', label: 'Warehouse', icon: Warehouse, category: 'commercial' },
];

function formatPriceLabel(price: number, category: string): string {
  if (category === 'rent') return `₹${(price / 1000).toFixed(0)},000/mo`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  return `₹${(price / 100000).toFixed(0)} Lakh`;
}

export default function PostPropertyWizard() {
  const { goBack } = useAcreFlowStore();
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [category, setCategory] = useState<ListingCategory>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [title, setTitle] = useState('');
  const [bhk, setBhk] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [balconies, setBalconies] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
  const [superBuiltUpArea, setSuperBuiltUpArea] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [furnishing, setFurnishing] = useState<Furnishing | ''>('');
  const [ageOfProperty, setAgeOfProperty] = useState('');
  const [possessionStatus, setPossessionStatus] = useState<PossessionStatus | ''>('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [reraId, setReraId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!confirmed) {
      toast.error('Please confirm the details are accurate');
      return;
    }

    if (!title || !propertyType || !ownerName || !ownerPhone) {
      toast.error('Please fill all required fields (Title, Property Type, Owner Name, Phone)');
      return;
    }

    const priceValue = category === 'rent'
      ? parseFloat(monthlyRent) || 0
      : parseFloat(expectedPrice) || 0;

    const now = new Date().toISOString();

    const newProperty: PropertyListing = {
      id: `prop-${Date.now()}`,
      title,
      description: title,
      category,
      propertyType: propertyType as PropertyType,
      price: priceValue,
      priceLabel: formatPriceLabel(priceValue, category),
      deposit: category === 'rent' ? parseFloat(deposit) || undefined : undefined,
      bhk: bhk === 'studio' ? 0 : parseInt(bhk) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      balconies: parseInt(balconies) || 0,
      floor: '',
      totalFloors: 0,
      carpetArea: parseFloat(carpetArea) || 0,
      superBuiltUpArea: parseFloat(superBuiltUpArea) || undefined,
      furnishing: (furnishing || 'unfurnished') as Furnishing,
      ageOfProperty: ageOfProperty || 'new',
      possessionStatus: (possessionStatus || 'ready') as PossessionStatus,
      locality: locality || 'Chennai',
      city: city || 'Chennai',
      state: 'Tamil Nadu',
      address: address || locality || 'Chennai',
      lat: 13.0827,
      lng: 80.2707,
      images: [],
      amenities: selectedAmenities,
      verified: false,
      reraRegistered: !!reraId,
      reraId: reraId || undefined,
      directFromOwner: true,
      ownerId: `owner-${Date.now()}`,
      ownerName,
      ownerPhone,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const response = await fetch('/api/listings?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      });

      if (response.ok) {
        toast.success('Property posted successfully! It will be visible after verification.');
        goBack();
      } else {
        toast.error('Failed to post property. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  const filteredPropertyTypes = PROPERTY_TYPES.filter(
    (pt) => !pt.category || pt.category === category
  );

  const formatPrice = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '—';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={goBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-navy dark:text-white">Post Property</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  idx < currentStep
                    ? 'bg-success text-white'
                    : idx === currentStep
                    ? 'bg-royal text-white'
                    : 'bg-muted text-slate-accent border border-border dark:bg-[#1D3461] dark:text-[#94A3B8] dark:border-[#1D3461]'
                }`}
              >
                {idx < currentStep ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className="text-xs text-slate-accent font-medium dark:text-[#94A3B8]">{step}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-5 transition-colors ${
                  idx < currentStep ? 'bg-success' : 'bg-border dark:bg-[#1D3461]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 - Property Details */}
      {currentStep === 0 && (
        <Card className="border-border dark:border-[#1D3461]">
          <CardContent className="p-6 space-y-8">
            {/* Property Category */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Property Category
              </Label>
              <div className="flex items-center gap-3">
                {([
                  { value: 'buy' as ListingCategory, label: 'For Sale' },
                  { value: 'rent' as ListingCategory, label: 'For Rent' },
                  { value: 'commercial' as ListingCategory, label: 'For Commercial' },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setCategory(opt.value);
                      setPropertyType('');
                    }}
                    className={`flex-1 h-12 rounded-lg text-base font-medium transition-all cursor-pointer ${
                      category === opt.value
                        ? 'bg-royal text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-300 hover:border-royal/40 hover:text-navy dark:bg-[#112240] dark:text-[#94A3B8] dark:border-[#1D3461] dark:hover:border-royal/40 dark:hover:text-white'
                    }`
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Property Type
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredPropertyTypes.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPropertyType(type)}
                    className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center gap-2 transition-all ${
                      propertyType === type
                        ? 'border-royal bg-sky/30 dark:bg-[#1D3461]/30'
                        : 'border-border hover:border-royal/40 dark:border-[#1D3461] dark:hover:border-royal/40'
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        propertyType === type ? 'text-royal dark:text-[#60A5FA]' : 'text-slate-accent dark:text-[#94A3B8]'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        propertyType === type ? 'text-royal dark:text-[#60A5FA]' : 'text-navy dark:text-white'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Details */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-navy dark:text-white">Basic Details</Label>

              <div className="space-y-2">
                <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Property Title *</Label>
                <Input
                  placeholder="e.g., Spacious 3 BHK in Anna Nagar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 rounded-xl focus:border-royal"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">BHK</Label>
                  <Select value={bhk} onValueChange={setBhk}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="5">5 BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Bathrooms</Label>
                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Balconies</Label>
                  <Select value={balconies} onValueChange={setBalconies}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Carpet Area (sqft)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1200"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(e.target.value)}
                    className="h-12 rounded-xl focus:border-royal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">
                    Super Built-up Area (sqft)
                    <span className="text-xs text-slate-light ml-1 dark:text-[#475569]">optional</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1500"
                    value={superBuiltUpArea}
                    onChange={(e) => setSuperBuiltUpArea(e.target.value)}
                    className="h-12 rounded-xl focus:border-royal"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-navy dark:text-white">Pricing</Label>

              {category !== 'rent' ? (
                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Expected Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-accent font-medium dark:text-[#94A3B8]">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="e.g., 7500000"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      className="h-12 rounded-xl pl-8 focus:border-royal"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Monthly Rent *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-accent font-medium dark:text-[#94A3B8]">
                        ₹
                      </span>
                      <Input
                        type="number"
                        placeholder="e.g., 25000"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(e.target.value)}
                        className="h-12 rounded-xl pl-8 focus:border-royal"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Deposit</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-accent font-medium dark:text-[#94A3B8]">
                        ₹
                      </span>
                      <Input
                        type="number"
                        placeholder="e.g., 100000"
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        className="h-12 rounded-xl pl-8 focus:border-royal"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Furnishing */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy dark:text-white">Furnishing</Label>
              <Select value={furnishing} onValueChange={(v) => setFurnishing(v as Furnishing)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select furnishing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnished">Fully Furnished</SelectItem>
                  <SelectItem value="semifurnished">Semi Furnished</SelectItem>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age of Property */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy dark:text-white">Age of Property</Label>
              <Select value={ageOfProperty} onValueChange={setAgeOfProperty}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="0-5">0-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10-20">10-20 years</SelectItem>
                  <SelectItem value="20+">20+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Possession Status */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy dark:text-white">Possession Status</Label>
              <Select
                value={possessionStatus}
                onValueChange={(v) => setPossessionStatus(v as PossessionStatus)}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Ready to Move</SelectItem>
                  <SelectItem value="under-construction">Under Construction</SelectItem>
                  <SelectItem value="new-launch">New Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>

              <div className="space-y-2">
                <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Address</Label>
                <Textarea
                  placeholder="Full property address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl focus:border-royal resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Locality</Label>
                  <Input
                    placeholder="e.g., Anna Nagar"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="h-12 rounded-xl focus:border-royal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-navy dark:text-white">Amenities</Label>
              <div className="grid grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => (
                  <label
                    key={amenity.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedAmenities.includes(amenity.id)
                        ? 'border-royal bg-sky/30 dark:bg-[#1D3461]/30'
                        : 'border-border hover:border-royal/40 dark:border-[#1D3461] dark:hover:border-royal/40'
                    }`}
                  >
                    <Checkbox
                      checked={selectedAmenities.includes(amenity.id)}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                      className="data-[state=checked]:bg-royal data-[state=checked]:border-royal"
                    />
                    <span className="text-sm text-navy dark:text-white">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Owner Information
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Owner Name *</Label>
                  <Input
                    placeholder="Full name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="h-12 rounded-xl focus:border-royal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-accent dark:text-[#94A3B8]" />
                    <Input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="h-12 rounded-xl pl-10 focus:border-royal"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-accent dark:text-[#94A3B8]">
                  RERA ID
                  <span className="text-xs text-slate-light ml-1 dark:text-[#475569]">optional</span>
                </Label>
                <Input
                  placeholder="e.g., RERA/2024/001234"
                  value={reraId}
                  onChange={(e) => setReraId(e.target.value)}
                  className="h-12 rounded-xl focus:border-royal"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 - Media Upload */}
      {currentStep === 1 && (
        <Card className="border-border dark:border-[#1D3461]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
              <Camera className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
              Upload Property Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Drag & Drop Area */}
            <div
              className="border-2 border-dashed rounded-xl p-12 text-center hover:border-royal transition-colors cursor-pointer dark:border-[#1D3461] dark:hover:border-[#60A5FA]"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    const names = Array.from(files).map((f) => f.name);
                    setUploadedFiles((prev) => [...prev, ...names].slice(0, 10));
                  }
                };
                input.click();
              }}
            >
              <Upload className="h-10 w-10 text-slate-accent mx-auto mb-3 dark:text-[#94A3B8]" />
              <p className="text-sm font-medium text-navy mb-1 dark:text-white">
                Drag & drop photos here
              </p>
              <p className="text-sm text-royal font-medium mb-2 dark:text-[#60A5FA]">or click to browse</p>
              <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                Supports JPG, PNG up to 5MB each
              </p>
            </div>

            {/* Thumbnail Grid */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-navy dark:text-white">
                Uploaded Photos ({uploadedFiles.length})
              </Label>
              <div className="flex flex-wrap gap-3">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={`${file}-${idx}`}
                    className="w-24 h-24 rounded-lg bg-muted border flex items-center justify-center relative group dark:bg-[#1D3461] dark:border-[#1D3461]"
                  >
                    <ImageIcon className="h-6 w-6 text-slate-accent dark:text-[#94A3B8]" />
                    <span className="absolute bottom-1 left-1 right-1 text-[9px] text-slate-accent truncate dark:text-[#94A3B8]">
                      {file}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute -top-2 -right-2 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {idx === 0 && (
                      <Badge className="absolute top-1 left-1 text-[9px] px-1 py-0 bg-royal text-white">
                        Cover
                      </Badge>
                    )}
                  </div>
                ))}
                {uploadedFiles.length < 10 && (
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.multiple = true;
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) {
                          const names = Array.from(files).map((f) => f.name);
                          setUploadedFiles((prev) => [...prev, ...names].slice(0, 10));
                        }
                      };
                      input.click();
                    }}
                    className="w-24 h-24 rounded-lg bg-muted border border-dashed border-border flex flex-col items-center justify-center hover:border-royal transition-colors dark:bg-[#1D3461] dark:border-[#1D3461] dark:hover:border-[#60A5FA]"
                  >
                    <Plus className="h-6 w-6 text-slate-accent dark:text-[#94A3B8]" />
                  </button>
                )}
              </div>
            </div>

            {/* Add More Button */}
            <Button
              variant="outline"
              className="w-full rounded-xl border-royal text-royal hover:bg-sky/30 h-12 dark:border-[#60A5FA] dark:text-[#60A5FA] dark:hover:bg-[#1D3461]/30"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    const names = Array.from(files).map((f) => f.name);
                    setUploadedFiles((prev) => [...prev, ...names].slice(0, 10));
                  }
                };
                input.click();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add More Photos
            </Button>

            {/* Tips */}
            <div className="bg-cream rounded-xl p-4 space-y-2 dark:bg-[#0A192F]">
              <p className="text-sm font-medium text-navy dark:text-white">Tips for better results</p>
              <ul className="space-y-1">
                <li className="text-xs text-slate-accent flex items-center gap-2 dark:text-[#94A3B8]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                  Add at least 5 photos for best results
                </li>
                <li className="text-xs text-slate-accent flex items-center gap-2 dark:text-[#94A3B8]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                  First photo will be the cover image
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 - Review & Submit */}
      {currentStep === 2 && (
        <Card className="border-border dark:border-[#1D3461]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy dark:text-white">
              Review Your Listing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy dark:text-white">Property Overview</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Category</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{category === 'buy' ? 'For Sale' : category === 'rent' ? 'For Rent' : 'For Commercial'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Property Type</p>
                  <p className="text-sm font-medium text-navy dark:text-white capitalize">
                    {propertyType.replace(/-/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Title</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{title || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">BHK</p>
                  <p className="text-sm font-medium text-navy dark:text-white">
                    {bhk === 'studio' ? 'Studio' : bhk ? `${bhk} BHK` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Bathrooms</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{bathrooms || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Balconies</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{balconies || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Carpet Area</p>
                  <p className="text-sm font-medium text-navy dark:text-white">
                    {carpetArea ? `${carpetArea} sqft` : '—'}
                  </p>
                </div>
                {superBuiltUpArea && (
                  <div>
                    <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Super Built-up Area</p>
                    <p className="text-sm font-medium text-navy dark:text-white">
                      {superBuiltUpArea} sqft
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-border dark:bg-[#1D3461]" />

            {/* Pricing Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy dark:text-white">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                {category !== 'rent' ? (
                  <div>
                    <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Expected Price</p>
                    <p className="text-sm font-medium text-navy dark:text-white">
                      {expectedPrice ? formatPrice(expectedPrice) : '—'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Monthly Rent</p>
                      <p className="text-sm font-medium text-navy dark:text-white">
                        {monthlyRent ? formatPrice(monthlyRent) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Deposit</p>
                      <p className="text-sm font-medium text-navy dark:text-white">
                        {deposit ? formatPrice(deposit) : '—'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="h-px bg-border dark:bg-[#1D3461]" />

            {/* Details Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy dark:text-white">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Furnishing</p>
                  <p className="text-sm font-medium text-navy dark:text-white capitalize">
                    {furnishing
                      ? furnishing === 'furnished'
                        ? 'Fully Furnished'
                        : furnishing === 'semifurnished'
                        ? 'Semi Furnished'
                        : 'Unfurnished'
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Age of Property</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{ageOfProperty || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Possession</p>
                  <p className="text-sm font-medium text-navy dark:text-white">
                    {possessionStatus
                      ? possessionStatus === 'ready'
                        ? 'Ready to Move'
                        : possessionStatus === 'under-construction'
                        ? 'Under Construction'
                        : 'New Launch'
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">RERA ID</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{reraId || '—'}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border dark:bg-[#1D3461]" />

            {/* Location Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Address</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{address || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Locality</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{locality || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">City</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{city || '—'}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border dark:bg-[#1D3461]" />

            {/* Amenities */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-navy dark:text-white">Amenities</h3>
              {selectedAmenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedAmenities.map((id) => {
                    const amenity = AMENITIES.find((a) => a.id === id);
                    return (
                      <Badge
                        key={id}
                        className="bg-sky text-royal border-0 text-xs dark:bg-[#1D3461] dark:text-[#60A5FA]"
                      >
                        {amenity?.label || id}
                      </Badge>
                    );
                  })}
                  <span className="text-sm text-slate-accent ml-2 dark:text-[#94A3B8]">
                    ({selectedAmenities.length} selected)
                  </span>
                </div>
              ) : (
                <p className="text-sm text-slate-accent dark:text-[#94A3B8]">No amenities selected</p>
              )}
            </div>

            <div className="h-px bg-border dark:bg-[#1D3461]" />

            {/* Owner Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Owner Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Name</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{ownerName || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8]">Phone</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{ownerPhone || '—'}</p>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos
              </h3>
              <p className="text-sm text-slate-accent dark:text-[#94A3B8]">
                {uploadedFiles.length} photo{uploadedFiles.length !== 1 ? 's' : ''}{' '}
                uploaded
              </p>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 bg-cream rounded-xl p-4 dark:bg-[#0A192F]">
              <Checkbox
                id="confirm"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked === true)}
                className="data-[state=checked]:bg-royal data-[state=checked]:border-royal mt-0.5"
              />
              <Label htmlFor="confirm" className="text-sm text-navy cursor-pointer dark:text-white">
                I confirm that the details provided are accurate and I am authorized to
                list this property on AcreFlow.
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center mt-6">
        {currentStep > 0 ? (
          <Button
            variant="outline"
            className="rounded-xl h-12 px-6"
            onClick={prevStep}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {currentStep < 2 ? (
          <Button
            className="rounded-xl h-12 px-8 bg-royal hover:bg-royal-dark text-white"
            onClick={nextStep}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            className="rounded-xl h-12 px-8 bg-royal hover:bg-royal-dark text-white font-semibold"
            onClick={handleSubmit}
          >
            Submit Property
          </Button>
        )}
      </div>
    </section>
  );
}
