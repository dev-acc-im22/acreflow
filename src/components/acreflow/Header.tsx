'use client';

import { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  User,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Phone,
} from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const CITIES = [
  'Chennai',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Kolkata',
  'Pune',
  'Ahmedabad',
] as const;

const NAV_LINKS = [
  { label: 'Buy', category: 'buy' as const },
  { label: 'Rent', category: 'rent' as const },
  { label: 'Commercial', category: 'commercial' as const },
  { label: 'EMI Calculator', view: 'emi-calculator' as const },
] as const;

export default function Header() {
  const {
    selectedCity,
    setSelectedCity,
    setView,
    setFilters,
    mobileMenuOpen,
    setMobileMenuOpen,
    currentView,
    filters,
  } = useAcreFlowStore();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const handleNavClick = (link: (typeof NAV_LINKS)[number]) => {
    if ('category' in link && link.category) {
      setFilters({ category: link.category });
      setView('search');
    } else {
      setView(link.view);
    }
    setMobileMenuOpen(false);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
  };

  const handlePostProperty = () => {
    setView('post-property');
    setMobileMenuOpen(false);
  };

  const isNavActive = (link: (typeof NAV_LINKS)[number]) => {
    if ('category' in link && link.category) {
      return currentView === 'search' && filters.category === link.category;
    }
    return currentView === link.view;
  };

  return (
    <header className="font-montserrat">
      {/* Top bar - hidden on mobile */}
      <div className="hidden md:block bg-sky text-navy">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-6 text-xs font-medium">
            <a
              href="tel:+911800123456"
              className="flex items-center gap-1.5 hover:text-royal transition-colors min-h-7 flex items-center"
            >
              <Phone className="size-3.5" />
              <span>1800-123-456</span>
            </a>
            <a
              href="mailto:support@acreflow.in"
              className="hover:text-royal transition-colors min-h-7 flex items-center"
            >
              support@acreflow.in
            </a>
          </div>
          <Button
            size="sm"
            onClick={handlePostProperty}
            className="bg-navy text-white hover:bg-navy-light text-xs font-semibold rounded-md px-4"
          >
            <Plus className="size-3.5" />
            Post Free Property
          </Button>
        </div>
      </div>

      {/* Main header bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
          {/* Logo */}
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 min-h-10"
          >
            <img
              src="/acreflow-logo.png"
              alt="AcreFlow"
              className="size-8 object-contain rounded"
            />
            <span className="text-xl font-bold text-navy tracking-tight">
              AcreFlow
            </span>
          </button>

          {/* Center nav links - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors min-h-10 flex items-center ${
                  isNavActive(link)
                    ? 'text-navy border-b-2 border-royal'
                    : 'text-slate-accent hover:text-navy'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* City selector dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                onBlur={() => setTimeout(() => setCityDropdownOpen(false), 150)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-accent hover:text-navy transition-colors min-h-10 px-2 py-2 rounded-md hover:bg-cream"
              >
                <MapPin className="size-4 text-royal" />
                <span>{selectedCity}</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    cityDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* City dropdown */}
              {cityDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-border shadow-lg py-1 z-50">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                        city === selectedCity
                          ? 'text-royal font-semibold bg-sky/50'
                          : 'text-slate-accent hover:bg-cream hover:text-navy'
                      }`}
                    >
                      <MapPin className="size-3.5" />
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User icon */}
            <button className="hidden md:flex items-center justify-center min-h-10 min-w-10 rounded-full hover:bg-cream transition-colors text-slate-accent hover:text-navy">
              <User className="size-5" />
            </button>

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex md:hidden items-center justify-center min-h-10 min-w-10 rounded-md hover:bg-cream transition-colors text-slate-accent">
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Mobile menu header */}
                <div className="bg-navy p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="/acreflow-logo.png"
                        alt="AcreFlow"
                        className="size-6 object-contain rounded"
                      />
                      <span className="text-lg font-bold text-white tracking-tight">
                        AcreFlow
                      </span>
                    </div>
                  </div>

                  {/* City selector in mobile menu */}
                  <div className="mt-4">
                    <button
                      onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                      className="flex items-center gap-2 w-full text-sm text-sky-deep font-medium"
                    >
                      <MapPin className="size-4" />
                      <span>{selectedCity}</span>
                      <ChevronDown
                        className={`size-3.5 ml-auto transition-transform duration-200 ${
                          cityDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {cityDropdownOpen && (
                      <div className="mt-2 grid grid-cols-2 gap-1">
                        {CITIES.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className={`text-left px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                              city === selectedCity
                                ? 'bg-royal text-white font-semibold'
                                : 'bg-navy-lighter text-sky-deep hover:bg-navy-lighter/80'
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile nav links */}
                <nav className="flex flex-col p-4 gap-1">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link)}
                      className={`flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors min-h-10 ${
                        isNavActive(link)
                          ? 'bg-sky text-royal font-semibold'
                          : 'text-slate-accent hover:bg-cream hover:text-navy'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.category === 'buy' && (
                          <Search className="size-4" />
                        )}
                        {link.category === 'rent' && (
                          <Building2 className="size-4" />
                        )}
                        {link.category === 'commercial' && (
                          <Building2 className="size-4" />
                        )}
                        {link.view === 'emi-calculator' && (
                          <span className="text-base">&#x20B9;</span>
                        )}
                        <span>{link.label}</span>
                      </div>
                      {isNavActive(link) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-royal" />
                      )}
                    </button>
                  ))}
                </nav>

                {/* Mobile CTA buttons */}
                <div className="mt-auto border-t border-border p-4 flex flex-col gap-2">
                  <Button
                    onClick={handlePostProperty}
                    className="w-full bg-navy text-white hover:bg-navy-light font-semibold"
                  >
                    <Plus className="size-4" />
                    Post Free Property
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-slate-accent border-border hover:bg-cream hover:text-navy"
                  >
                    <User className="size-4" />
                    Sign In / Register
                  </Button>

                  {/* Contact info */}
                  <div className="mt-3 flex flex-col gap-2 text-xs text-slate-accent">
                    <a
                      href="tel:+911800123456"
                      className="flex items-center gap-2 hover:text-navy transition-colors"
                    >
                      <Phone className="size-3.5" />
                      1800-123-456
                    </a>
                    <a
                      href="mailto:support@acreflow.in"
                      className="flex items-center gap-2 hover:text-navy transition-colors"
                    >
                      <span>&#9993;</span>
                      support@acreflow.in
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
