'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  UserCheck,
  ShieldCheck,
  Percent,
  Phone,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const INDUSTRIES = ['IT/Software', 'BFSI', 'Healthcare', 'Manufacturing', 'Retail', 'Consulting', 'Other'];
const REQUIREMENTS = ['Office Space', 'Retail Space', 'Warehouse', 'Co-working', 'Multiple Cities'];
const BUDGET_RANGES = ['<₹50K', '₹50K-1L', '₹1L-5L', '₹5L-20L', '₹20L+'];
const TIMELINES = ['Immediate', '1-3 Months', '3-6 Months', '6-12 Months', 'Just Exploring'];

const CITY_OPTIONS = [
  'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

const WHY_CORPORATE = [
  {
    icon: UserCheck,
    title: 'Dedicated Account Manager',
    desc: 'A single point of contact for all your property needs',
  },
  {
    icon: Building2,
    title: 'Customized Property Shortlisting',
    desc: 'Tailored property recommendations based on your requirements',
  },
  {
    icon: ShieldCheck,
    title: 'Negotiation Support',
    desc: 'Expert negotiation to get you the best deals',
  },
  {
    icon: Percent,
    title: 'Zero Brokerage',
    desc: 'No hidden charges or brokerage fees on any transaction',
  },
];

export default function CorporateEnquiry() {
  const { goBack } = useAcreFlowStore();

  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    companySize: '',
    industry: '',
    requirements: [] as string[],
    cityPreferences: [] as string[],
    budgetRange: '',
    timeline: '',
    additionalRequirements: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRequirement = (req: string) => {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.includes(req)
        ? prev.requirements.filter((r) => r !== req)
        : [...prev.requirements, req],
    }));
  };

  const toggleCity = (city: string) => {
    setForm((prev) => ({
      ...prev,
      cityPreferences: prev.cityPreferences.includes(city)
        ? prev.cityPreferences.filter((c) => c !== city)
        : [...prev.cityPreferences, city],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0A192F]">
      {/* Back bar */}
      <div className="bg-white dark:bg-[#112240] border-b border-border dark:border-[#1D3461] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1D3461] transition flex items-center justify-center cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-navy dark:text-white" />
        </button>
        <h1 className="text-lg font-bold text-navy dark:text-white">Corporate Enquiry</h1>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy to-royal px-4 py-10 md:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            Corporate Property Solutions
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto">
            Get customized property solutions for your business. Our corporate team will find the perfect space for your team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {submitted ? (
          /* Success State */
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-3">
              Enquiry Submitted Successfully!
            </h2>
            <p className="text-slate-accent dark:text-[#94A3B8] mb-2">
              Thank you for reaching out to AcreFlow Corporate.
            </p>
            <p className="text-slate-accent dark:text-[#94A3B8] mb-8">
              Our team will contact you within <span className="font-semibold text-royal dark:text-[#60A5FA]">24 hours</span> with customized property recommendations.
            </p>
            <Button
              onClick={goBack}
              className="bg-royal hover:bg-royal-dark text-white px-8"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-5 md:p-8">
                <h2 className="text-lg font-bold text-navy dark:text-white mb-6">
                  Tell Us About Your Requirements
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row: Company Name + Contact Person */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy dark:text-white">Company Name *</label>
                      <Input
                        value={form.companyName}
                        onChange={(e) => updateForm('companyName', e.target.value)}
                        placeholder="Enter company name"
                        required
                        className="bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy dark:text-white">Contact Person *</label>
                      <Input
                        value={form.contactPerson}
                        onChange={(e) => updateForm('contactPerson', e.target.value)}
                        placeholder="Enter contact name"
                        required
                        className="bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm"
                      />
                    </div>
                  </div>

                  {/* Row: Email + Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy dark:text-white">Email *</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy dark:text-white">Phone *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border dark:border-[#334155] bg-gray-100 dark:bg-[#0A192F] text-sm text-slate-accent dark:text-[#94A3B8]">
                          +91
                        </span>
                        <Input
                          value={form.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                          placeholder="Enter phone number"
                          required
                          className="rounded-l-none bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row: Company Size + Industry */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy dark:text-white">Company Size *</label>
                      <Select
                        value={form.companySize}
                        onValueChange={(v) => updateForm('companySize', v)}
                        required
                      >
                        <SelectTrigger className="w-full bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size} employees
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy dark:text-white">Industry *</label>
                      <Select
                        value={form.industry}
                        onValueChange={(v) => updateForm('industry', v)}
                        required
                      >
                        <SelectTrigger className="w-full bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Property Requirements Checkboxes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-navy dark:text-white">
                      Property Requirement
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {REQUIREMENTS.map((req) => (
                        <label
                          key={req}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <Checkbox
                            checked={form.requirements.includes(req)}
                            onCheckedChange={() => toggleRequirement(req)}
                            className="data-[state=checked]:bg-royal data-[state=checked]:border-royal"
                          />
                          <span className="text-sm text-slate-accent dark:text-[#94A3B8]">{req}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* City Preferences Chips */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-navy dark:text-white">
                      City Preferences
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CITY_OPTIONS.map((city) => {
                        const isActive = form.cityPreferences.includes(city);
                        return (
                          <button
                            key={city}
                            type="button"
                            onClick={() => toggleCity(city)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              isActive
                                ? 'bg-royal text-white'
                                : 'bg-white dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border border-border dark:border-[#334155] hover:border-royal dark:hover:border-[#60A5FA]'
                            }`}
                          >
                            {city}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row: Budget Range + Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy dark:text-white">Budget Range</label>
                      <Select
                        value={form.budgetRange}
                        onValueChange={(v) => updateForm('budgetRange', v)}
                      >
                        <SelectTrigger className="w-full bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUDGET_RANGES.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b} / month
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-navy dark:text-white">Timeline</label>
                      <Select
                        value={form.timeline}
                        onValueChange={(v) => updateForm('timeline', v)}
                      >
                        <SelectTrigger className="w-full bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMELINES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-navy dark:text-white">
                      Additional Requirements
                    </label>
                    <Textarea
                      value={form.additionalRequirements}
                      onChange={(e) => updateForm('additionalRequirements', e.target.value)}
                      placeholder="Any specific requirements like amenities, location preferences, etc."
                      className="min-h-[100px] bg-cream dark:bg-[#1D3461] border-border dark:border-[#334155] text-sm"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-royal to-navy hover:from-royal-dark hover:to-navy-light text-white py-3 text-sm font-semibold rounded-xl cursor-pointer"
                  >
                    Submit Enquiry
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Why Corporate Choose AcreFlow */}
              <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-5">
                <h3 className="text-sm font-bold text-navy dark:text-white mb-4">
                  Why Corporate Choose AcreFlow
                </h3>
                <div className="space-y-4">
                  {WHY_CORPORATE.map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky dark:bg-[#1D3461] flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-royal dark:text-[#60A5FA]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-navy dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-accent dark:text-[#94A3B8] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trusted By */}
              <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-5">
                <h3 className="text-sm font-bold text-navy dark:text-white mb-4">
                  Trusted by 500+ Companies
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-cream dark:bg-[#1D3461] border border-border dark:border-[#334155] flex items-center justify-center"
                    >
                      <Building2 className="w-6 h-6 text-slate-accent dark:text-[#475569]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-royal to-navy rounded-2xl p-5 text-center">
                <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="text-white font-bold text-sm mb-1">Need Immediate Assistance?</h3>
                <p className="text-white/70 text-xs mb-4">
                  Our corporate team is ready to help
                </p>
                <a
                  href="tel:+9118001234567"
                  className="inline-flex items-center gap-2 bg-white text-navy px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-sky transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Us: +91 1800-123-4567
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
