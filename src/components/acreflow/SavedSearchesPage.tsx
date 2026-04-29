'use client';

import { useMemo, useState } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import type { SavedSearch } from '@/types';
import {
  ArrowLeft,
  Bookmark,
  Bell,
  BellOff,
  Trash2,
  Search,
  MapPin,
  Home,
  IndianRupee,
  Plus,
  BookmarkCheck,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

function formatPriceShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

function generateSearchName(filters: SavedSearch['filters'], city: string): string {
  const parts: string[] = [];
  parts.push(city);
  if (filters.category !== 'buy') {
    parts.push(filters.category.charAt(0).toUpperCase() + filters.category.slice(1));
  }
  if (filters.propertyTypes.length === 1) {
    const pt = filters.propertyTypes[0];
    parts.push(pt.charAt(0).toUpperCase() + pt.slice(1));
  }
  const [bhkMin, bhkMax] = filters.bhkRange;
  if (bhkMin > 1 || bhkMax < 5) {
    if (bhkMin === bhkMax) {
      parts.push(`${bhkMin} BHK`);
    } else {
      parts.push(`${bhkMin}-${bhkMax} BHK`);
    }
  }
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) {
    parts.push(`${formatPriceShort(filters.priceRange[0])}-${formatPriceShort(filters.priceRange[1])}`);
  }
  if (filters.furnishing !== 'all') {
    parts.push(filters.furnishing.charAt(0).toUpperCase() + filters.furnishing.slice(1));
  }
  if (filters.query) {
    parts.push(filters.query);
  }
  return parts.join(' ') || 'Property Search';
}

function getFilterChips(search: SavedSearch) {
  const chips: { label: string; icon?: React.ReactNode }[] = [];
  if (search.filters.category !== 'buy') {
    chips.push({
      label: search.filters.category.charAt(0).toUpperCase() + search.filters.category.slice(1),
    });
  }
  if (search.filters.propertyTypes.length > 0 && search.filters.propertyTypes.length <= 2) {
    search.filters.propertyTypes.forEach((pt) => {
      chips.push({
        label: pt.charAt(0).toUpperCase() + pt.slice(1),
      });
    });
  }
  const [bhkMin, bhkMax] = search.filters.bhkRange;
  if (bhkMin > 1 || bhkMax < 5) {
    chips.push({
      label: bhkMin === bhkMax ? `${bhkMin} BHK` : `${bhkMin}-${bhkMax} BHK`,
      icon: <Home className="w-3 h-3" />,
    });
  }
  if (search.filters.priceRange[0] > 0 || search.filters.priceRange[1] < 100000000) {
    chips.push({
      label: `${formatPriceShort(search.filters.priceRange[0])} - ${formatPriceShort(search.filters.priceRange[1])}`,
      icon: <IndianRupee className="w-3 h-3" />,
    });
  }
  if (search.filters.furnishing !== 'all') {
    chips.push({
      label: search.filters.furnishing.charAt(0).toUpperCase() + search.filters.furnishing.slice(1),
    });
  }
  if (search.filters.query) {
    chips.push({
      label: search.filters.query,
      icon: <MapPin className="w-3 h-3" />,
    });
  }
  return chips;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function SavedSearchesPage() {
  const {
    goBack,
    filters,
    setFilters,
    setView,
    selectedCity,
    savedSearches,
    addSavedSearch,
    removeSavedSearch,
    toggleSearchAlert,
  } = useAcreFlowStore();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  const autoName = useMemo(
    () => generateSearchName(filters, selectedCity),
    [filters, selectedCity]
  );

  const handleSaveCurrentSearch = () => {
    setSearchName(autoName);
    setSaveDialogOpen(true);
  };

  const handleSave = () => {
    if (!searchName.trim()) return;
    addSavedSearch({
      id: `saved-${Date.now()}`,
      name: searchName.trim(),
      filters: { ...filters },
      createdAt: new Date().toISOString(),
      alertEnabled: false,
    });
    setSaveDialogOpen(false);
    setSearchName('');
    toast.success('Search saved successfully!');
  };

  const handleApplySearch = (search: SavedSearch) => {
    setFilters(search.filters);
    setView('search');
    toast.success('Filters applied!');
  };

  const handleDelete = (id: string) => {
    removeSavedSearch(id);
    toast.success('Saved search deleted');
  };

  const handleToggleAlert = (id: string) => {
    toggleSearchAlert(id);
    const search = savedSearches.find((s) => s.id === id);
    if (search) {
      toast.success(
        search.alertEnabled
          ? 'Alert enabled for this search'
          : 'Alert disabled for this search'
      );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] flex flex-col">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-[#112240] border-b dark:border-[#1D3461] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-slate-accent dark:text-[#94A3B8] hover:text-navy dark:hover:text-white"
            onClick={goBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-navy dark:text-white">
              Saved Searches
            </h1>
            <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8]">
              {savedSearches.length} saved{savedSearches.length === 1 ? '' : ''}
            </p>
          </div>
          <Button
            onClick={handleSaveCurrentSearch}
            className="bg-royal hover:bg-royal-dark text-white rounded-xl shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline text-sm">Save Current</span>
            <span className="sm:hidden text-xs">Save</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto">
          {savedSearches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4 sm:mb-6">
                <Bookmark className="w-7 h-7 sm:w-8 sm:h-8 text-royal dark:text-[#60A5FA]" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-navy dark:text-white mb-2">
                No saved searches yet
              </h3>
              <p className="text-sm sm:text-base text-slate-accent dark:text-[#94A3B8] max-w-sm mb-6">
                Search for properties and save your filters to easily access them later.
              </p>
              <Button
                onClick={handleSaveCurrentSearch}
                className="bg-royal hover:bg-royal-dark text-white rounded-xl text-sm sm:text-base"
              >
                <BookmarkCheck className="w-4 h-4 mr-2" />
                Save Current Search
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {savedSearches.map((search) => {
                const chips = getFilterChips(search);
                return (
                  <div
                    key={search.id}
                    className="rounded-xl border border-border dark:border-[#1D3461] bg-cream/50 dark:bg-[#112240] p-4 sm:p-5 transition-shadow hover:shadow-md"
                  >
                    {/* Header: Name + Actions */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h4 className="text-sm sm:text-base font-semibold text-navy dark:text-white line-clamp-1 flex-1">
                        {search.name}
                      </h4>
                      <button
                        onClick={() => handleDelete(search.id)}
                        className="shrink-0 p-2 rounded-lg text-slate-accent dark:text-[#94A3B8] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Delete saved search"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Filter Chips */}
                    {chips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {chips.map((chip, idx) => (
                          <Badge
                            key={idx}
                            className="bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA] border-0 text-[11px] sm:text-xs px-2 py-0.5 font-medium gap-1"
                          >
                            {chip.icon}
                            {chip.label}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Footer: Date + Alert Toggle + Apply */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border dark:border-[#1D3461]">
                      <span className="text-xs sm:text-sm text-slate-accent dark:text-[#64748B]">
                        {formatDate(search.createdAt)}
                      </span>
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Alert Toggle */}
                        <div className="flex items-center gap-1.5">
                          {search.alertEnabled ? (
                            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                          ) : (
                            <BellOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-accent dark:text-[#64748B]" />
                          )}
                          {search.alertEnabled && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          )}
                          <Switch
                            checked={search.alertEnabled}
                            onCheckedChange={() => handleToggleAlert(search.id)}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>

                        {/* Apply Search Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplySearch(search)}
                          className="text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 text-royal dark:text-[#60A5FA] border-royal/30 dark:border-[#60A5FA]/30 hover:bg-royal/5 dark:hover:bg-[#60A5FA]/10 min-w-[44px]"
                        >
                          <Search className="w-3.5 h-3.5 mr-1" />
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Save Search Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461] sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-navy dark:text-white text-base sm:text-lg">
              Save This Search
            </DialogTitle>
            <DialogDescription className="text-slate-accent dark:text-[#94A3B8] text-xs sm:text-sm">
              Give your search a name to easily find it later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search name..."
              className="bg-cream/50 dark:bg-[#1D3461]/50 border-border dark:border-[#1D3461] focus:border-royal dark:focus:border-[#60A5FA] text-sm sm:text-base h-11 sm:h-12 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              className="text-slate-accent dark:text-[#94A3B8] text-sm sm:text-base h-10 sm:h-11 rounded-xl min-w-[44px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!searchName.trim()}
              className="bg-royal hover:bg-royal-dark text-white text-sm sm:text-base h-10 sm:h-11 rounded-xl min-w-[44px]"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Save Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
