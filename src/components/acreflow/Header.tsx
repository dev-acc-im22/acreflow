'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  User,
  Menu,
  ChevronDown,
  MapPin,
  Phone,
  Bell,
  Sun,
  Moon,
  Check,
  Building2,
  Home,
  Store,
  IndianRupee,
} from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

const MOCK_LOCALITIES = [
  'T Nagar', 'Anna Nagar', 'Velachery', 'OMR', 'ECR',
  'Adyar', 'Nungambakkam', 'Porur', 'Guindy', 'Sholinganallur',
  'Kelambakkam', 'Thoraipakkam',
];

const MOCK_LANDMARKS = [
  'Chennai Central Station', 'Chennai Airport', 'Phoenix Mall', 'Marina Beach',
];

const CATEGORY_TABS = [
  { label: 'Buy', category: 'buy' as const, icon: Home },
  { label: 'Rent', category: 'rent' as const, icon: Building2 },
  { label: 'Commercial', category: 'commercial' as const, icon: Store },
  { label: 'PG/Co-living', category: 'buy' as const, icon: Building2 },
  { label: 'Plots/Land', category: 'commercial' as const, icon: MapPin },
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
    searchQuery,
    setSearchQuery,
    darkMode,
    toggleDarkMode,
    unreadCount,
    showNotificationPanel,
    setShowNotificationPanel,
    notifications,
    markNotificationRead,
  } = useAcreFlowStore();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(filters.query || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const notifPanelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const suggestions = (() => {
    if (localQuery.length < 2) return [];
    const q = localQuery.toLowerCase();
    const filteredLocalities = MOCK_LOCALITIES.filter((loc) =>
      loc.toLowerCase().includes(q)
    );
    const filteredLandmarks = MOCK_LANDMARKS.filter((lm) =>
      lm.toLowerCase().includes(q)
    );
    return [
      ...filteredLocalities.map((loc) => ({ name: loc, type: 'locality' as const })),
      ...filteredLandmarks.map((lm) => ({ name: lm, type: 'landmark' as const })),
    ];
  })();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifPanelRef.current && !notifPanelRef.current.contains(event.target as Node)) {
        setShowNotificationPanel(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowNotificationPanel]);

  const handleSearch = (value?: string) => {
    const query = value || localQuery;
    setSearchQuery(query);
    setFilters({ query, category: filters.category });
    setShowSuggestions(false);
    setView('search');
  };

  const handleTabChange = (tab: (typeof CATEGORY_TABS)[number]) => {
    setFilters({ category: tab.category });
  };

  const handleSuggestionClick = (suggestion: { name: string; type: string }) => {
    setLocalQuery(suggestion.name);
    setShowSuggestions(false);
    handleSearch(suggestion.name);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
  };

  const handlePostProperty = () => {
    setView('post-property');
    setMobileMenuOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const isTabActive = (tab: (typeof CATEGORY_TABS)[number]) => {
    return filters.category === tab.category && tab.label === (
      CATEGORY_TABS.find(t => t.category === filters.category)?.label
    );
  };

  const activeTabLabel = CATEGORY_TABS.find(t => t.category === filters.category)?.label || 'Buy';

  const currentUnreadCount = unreadCount();

  return (
    <header className="font-montserrat">
      {/* ========== MAIN WHITE HEADER BAR ========== */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-6 h-16">
          {/* Left: Logo */}
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-navy tracking-tight hidden sm:block">
              AcreFlow
            </span>
          </button>

          {/* Center: EMI Calculator link (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setView('emi-calculator')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-navy transition-colors rounded-md hover:bg-gray-50"
            >
              <IndianRupee className="size-4" />
              <span>EMI Calculator</span>
            </button>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notification bell - desktop */}
            <div className="relative hidden md:flex items-center" ref={notifPanelRef}>
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-navy"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                {currentUnreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                    {currentUnreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown panel */}
              {showNotificationPanel && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-navy">Notifications</h3>
                    {currentUnreadCount > 0 && (
                      <button
                        onClick={() => {
                          notifications.forEach((n) => {
                            if (!n.read) markNotificationRead(n.id);
                          });
                        }}
                        className="text-xs font-medium text-royal hover:text-royal-dark transition-colors flex items-center gap-1"
                      >
                        <Check className="size-3" />
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto acreflow-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="flex items-center justify-center py-10">
                        <p className="text-sm text-gray-400">No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className="w-full flex gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex flex-col items-center pt-1.5 shrink-0">
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-royal shrink-0" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy truncate">{notif.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark mode toggle - desktop */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-navy"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>

            {/* Divider - desktop */}
            <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

            {/* Log in - desktop */}
            <button
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-navy transition-colors rounded-md hover:bg-gray-50"
            >
              <User className="size-4" />
              <span>Log in</span>
            </button>

            {/* Sign up - desktop */}
            <button
              className="hidden sm:flex items-center px-3 py-2 text-sm font-semibold text-royal hover:text-royal-dark transition-colors rounded-md hover:bg-sky/50"
            >
              Sign up
            </button>

            {/* Post Free Property CTA */}
            <Button
              onClick={handlePostProperty}
              className="hidden sm:flex bg-navy hover:bg-navy-light text-white text-sm font-semibold rounded-lg px-4 h-10 gap-1.5"
            >
              <Plus className="size-4" />
              <span className="hidden md:inline">Post Free Property</span>
            </Button>

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex sm:hidden items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 transition-colors text-gray-600">
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Mobile menu header */}
                <div className="bg-navy p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-base">A</span>
                      </div>
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
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.label}
                      onClick={() => {
                        handleTabChange(tab);
                        setView('search');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        filters.category === tab.category
                          ? 'bg-sky text-royal font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-navy'
                      }`}
                    >
                      <tab.icon className="size-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  <div className="h-px bg-gray-100 my-2" />
                  <button
                    onClick={() => {
                      setView('emi-calculator');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-navy"
                  >
                    <IndianRupee className="size-4" />
                    <span>EMI Calculator</span>
                  </button>
                </nav>

                {/* Mobile CTA buttons */}
                <div className="mt-auto border-t border-gray-100 p-4 flex flex-col gap-2">
                  <Button
                    onClick={handlePostProperty}
                    className="w-full bg-navy text-white hover:bg-navy-light font-semibold"
                  >
                    <Plus className="size-4" />
                    Post Free Property
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-navy"
                  >
                    <User className="size-4" />
                    Sign In / Register
                  </Button>

                  <div className="mt-3 flex flex-col gap-2 text-xs text-gray-500">
                    <a
                      href="tel:+911800123456"
                      className="flex items-center gap-2 hover:text-navy transition-colors"
                    >
                      <Phone className="size-3.5" />
                      1800-123-456
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ========== CATEGORY TABS + SEARCH BAR ========== */}
      {currentView === 'home' && (
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            {/* Category Tabs */}
            <div className="flex items-center gap-0 -mb-px overflow-x-auto">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    filters.category === tab.category
                      ? 'text-royal border-royal'
                      : 'text-gray-500 border-transparent hover:text-navy hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Integrated Search Bar */}
            <div ref={searchRef} className="pb-5 pt-4 relative">
              <form onSubmit={handleFormSubmit}>
                <div className="flex items-center gap-0 rounded-lg border border-gray-300 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-gray-400 focus-within:border-royal focus-within:shadow-[0_0_0_3px_rgba(30,64,175,0.1)] transition-all">
                  {/* City Selector */}
                  <div className="relative shrink-0" ref={cityRef}>
                    <button
                      type="button"
                      onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                      className="flex items-center gap-1.5 h-12 pl-4 pr-3 text-sm font-medium text-gray-700 hover:text-navy border-r border-gray-200 rounded-l-lg hover:bg-gray-50 transition-colors"
                    >
                      <MapPin className="size-4 text-royal shrink-0" />
                      <span>{selectedCity}</span>
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-200 ${
                          cityDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* City dropdown */}
                    {cityDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-lg border border-gray-200 shadow-xl py-1 z-50">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Select City</p>
                        </div>
                        {CITIES.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2.5 ${
                              city === selectedCity
                                ? 'text-royal font-semibold bg-sky/40'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-navy'
                            }`}
                          >
                            <MapPin className={`size-3.5 shrink-0 ${city === selectedCity ? 'text-royal' : 'text-gray-400'}`} />
                            {city}
                            {city === selectedCity && (
                              <Check className="size-4 ml-auto text-royal" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search input */}
                  <Input
                    type="text"
                    value={localQuery}
                    onChange={(e) => {
                      setLocalQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search by locality, landmark, or project name..."
                    className="flex-1 h-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm placeholder:text-gray-400 px-4 rounded-none"
                  />

                  {/* Search button */}
                  <Button
                    type="submit"
                    className="bg-royal hover:bg-royal-dark text-white rounded-r-lg rounded-l-none px-5 md:px-6 h-12 font-semibold flex items-center gap-2 shrink-0"
                  >
                    <Search className="size-4" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </form>

              {/* Auto-suggest Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 z-40 bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden">
                  <div className="max-h-64 overflow-y-auto acreflow-scrollbar py-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.name}-${index}`}
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <MapPin className="size-4 text-gray-400 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-navy">{suggestion.name}</span>
                          <span className="text-xs text-gray-400 capitalize">
                            {suggestion.type === 'locality' ? 'Locality' : 'Landmark'}, {selectedCity}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
