'use client';

import {
  Building2,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Shield,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Smartphone,
  Download,
} from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';
import type { PropertyType } from '@/types';

const PROPERTY_TYPE_LINKS: { label: string; mappedType: PropertyType; category: 'buy' | 'rent' | 'commercial' }[] = [
  { label: 'Apartments', mappedType: 'apartment', category: 'buy' },
  { label: 'Villas', mappedType: 'villa', category: 'buy' },
  { label: 'Plots', mappedType: 'plot', category: 'buy' },
  { label: 'Commercial', mappedType: 'commercial-office', category: 'commercial' },
  { label: 'PG/Hostels', mappedType: 'pg', category: 'rent' },
  { label: 'Office Space', mappedType: 'commercial-office', category: 'commercial' },
];

const TOP_CITIES = [
  'Chennai',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
] as const;

const COMPANY_LINKS = [
  { label: 'About Us', view: 'about' as const },
  { label: 'Blog & News', view: 'blog' as const },
  { label: 'Contact', view: 'lead-center' as const },
  { label: 'Careers', view: 'home' as const },
  { label: 'Terms of Service', view: 'home' as const },
  { label: 'Privacy Policy', view: 'home' as const },
] as const;

const TRUST_BADGES = [
  { label: 'RERA Compliant', icon: Shield },
  { label: 'Zero Brokerage', icon: CheckCircle2 },
  { label: 'Verified Listings', icon: CheckCircle2 },
] as const;

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/acreflow' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/acreflow' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/acreflow' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/acreflow' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@acreflow' },
] as const;

export default function Footer() {
  const { setFilters, setView, setSelectedCity } = useAcreFlowStore();

  const handlePropertyTypeClick = (mappedType: PropertyType, category: 'buy' | 'rent' | 'commercial') => {
    setFilters({ category, propertyTypes: [mappedType] });
    setView('search');
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setView('search');
  };

  const handleCompanyClick = (link: { label: string; view: string }) => {
    setView(link.view as any);
  };

  return (
    <footer className="font-montserrat mt-auto">
      {/* Main Footer — bg-navy is already dark; add top border for dark mode separation */}
      <div className="bg-navy text-white border-t border-border dark:border-[#1D3461]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {/* Column 1 - Branding */}
            <div>
              <div className="flex items-center gap-2">
                <img
                  src="/acreflow-logo.png"
                  alt="AcreFlow"
                  className="size-7 object-contain rounded brightness-0 invert"
                />
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  AcreFlow
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-light">
                India&apos;s Premium Real Estate Marketplace
              </p>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-light">
                Discover your dream property with AcreFlow. We offer verified
                listings across India&apos;s top cities with zero brokerage
                charges and transparent pricing.
              </p>

              {/* Contact info */}
              <div className="mt-5 flex flex-col gap-2 text-xs sm:text-sm text-slate-light">
                <a
                  href="tel:+911800123456"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="size-4" />
                  <span>1800-123-456</span>
                </a>
                <a
                  href="mailto:support@acreflow.in"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="size-4" />
                  <span>support@acreflow.in</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  <span>Chennai, Tamil Nadu, India</span>
                </div>
              </div>

              {/* Social icons */}
              <div className="mt-5 flex items-center gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-royal"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>

              {/* App download badges */}
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium transition-colors hover:bg-white/20"
                >
                  <Smartphone className="size-4" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] text-slate-light">
                      GET IT ON
                    </span>
                    <span>Google Play</span>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium transition-colors hover:bg-white/20"
                >
                  <Download className="size-4" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] text-slate-light">
                      DOWNLOAD ON
                    </span>
                    <span>App Store</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Column 2 - Property Types */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider">
                Property Types
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {PROPERTY_TYPE_LINKS.map(({ label, mappedType, category }) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => handlePropertyTypeClick(mappedType, category)}
                      className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-light transition-colors hover:text-white"
                    >
                      <ChevronRight className="size-3 shrink-0" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Top Cities */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider">
                Top Cities
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {TOP_CITIES.map((city) => (
                  <li key={city}>
                    <button
                      type="button"
                      onClick={() => handleCityClick(city)}
                      className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-light transition-colors hover:text-white"
                    >
                      <MapPin className="size-3 shrink-0" />
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Company */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleCompanyClick(link)}
                      className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-light transition-colors hover:text-white"
                    >
                      <ChevronRight className="size-3 shrink-0" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>

              <h3 className='text-sm sm:text-base font-semibold uppercase tracking-wider mt-8'>Services</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {['Packers & Movers', 'Rental Agreement', 'Home Loans', 'Interior Design', 'Legal Assistance', 'Home Maintenance'].map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => setView('services')}
                      className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-light transition-colors hover:text-white"
                    >
                      <ChevronRight className="size-3 shrink-0" />
                      {s}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-2">
                {TRUST_BADGES.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs text-slate-light"
                  >
                    <Icon className="size-3.5 text-sky" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border dark:border-[#1D3461] bg-navy-light">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:px-6 md:flex-row lg:px-8 py-3 sm:py-4">
          <p className="text-xs text-slate-light">
            &copy; 2025 AcreFlow. All rights reserved.
          </p>
          <p className="text-xs text-slate-light">
            Made with &#10084;&#65039; in India
          </p>
        </div>
      </div>
    </footer>
  );
}
