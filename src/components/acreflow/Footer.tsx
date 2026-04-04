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

const PROPERTY_TYPES = [
  'Apartments',
  'Villas',
  'Plots',
  'Commercial',
  'PG/Hostels',
  'Office Space',
] as const;

const TOP_CITIES = [
  'Chennai',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
] as const;

const COMPANY_LINKS = [
  'About Us',
  'Careers',
  'Blog',
  'Contact',
  'Terms of Service',
  'Privacy Policy',
] as const;

const TRUST_BADGES = [
  { label: 'RERA Compliant', icon: Shield },
  { label: 'Zero Brokerage', icon: CheckCircle2 },
  { label: 'Verified Listings', icon: CheckCircle2 },
] as const;

const SOCIAL_LINKS = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
] as const;

export default function Footer() {
  return (
    <footer className="font-montserrat">
      {/* Main Footer */}
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Column 1 - Branding */}
            <div>
              <div className="flex items-center gap-2">
                <img
                  src="/acreflow-logo.png"
                  alt="AcreFlow"
                  className="size-7 object-contain rounded brightness-0 invert"
                />
                <span className="text-xl font-bold tracking-tight">
                  AcreFlow
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-light">
                India&apos;s Premium Real Estate Marketplace
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-light">
                Discover your dream property with AcreFlow. We offer verified
                listings across India&apos;s top cities with zero brokerage
                charges and transparent pricing.
              </p>

              {/* Contact info */}
              <div className="mt-5 flex flex-col gap-2 text-sm text-slate-light">
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
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Property Types
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {PROPERTY_TYPES.map((type) => (
                  <li key={type}>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-sm text-slate-light transition-colors hover:text-white"
                    >
                      <ChevronRight className="size-3 shrink-0" />
                      {type}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Top Cities */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Top Cities
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {TOP_CITIES.map((city) => (
                  <li key={city}>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-sm text-slate-light transition-colors hover:text-white"
                    >
                      <MapPin className="size-3 shrink-0" />
                      {city}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Company */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="flex items-center gap-1.5 text-sm text-slate-light transition-colors hover:text-white"
                    >
                      <ChevronRight className="size-3 shrink-0" />
                      {link}
                    </a>
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
      <div className="border-t border-white/10 bg-navy-light">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:px-6 md:flex-row lg:px-8">
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
