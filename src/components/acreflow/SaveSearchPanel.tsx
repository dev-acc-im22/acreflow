'use client';

import { useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import type { SavedSearch, SearchFilters } from '@/types';
import {
  Bookmark,
  Bell,
  BellOff,
  Trash2,
  Search,
  MapPin,
  Home,
  IndianRupee,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface SaveSearchPanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function generateSearchName(filters: SearchFilters, city: string): string {
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
  const formatBudget = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) {
    parts.push(`${formatBudget(filters.priceRange[0])}-${formatBudget(filters.priceRange[1])}`);
  }
  if (filters.furnishing !== 'all') {
    parts.push(
      filters.furnishing.charAt(0).toUpperCase() + filters.furnishing.slice(1)
    );
  }
  if (filters.query) {
    parts.push(filters.query);
  }
  return parts.join(' ') || 'Property Search';
}

function formatPriceShort(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

export default function SaveSearchPanel({
  open: _open,
  onOpenChange: _onOpenChange,
}: SaveSearchPanelProps) {
  const {
    filters,
    setFilters,
    setView,
    selectedCity,
    savedSearches,
    addSavedSearch,
    removeSavedSearch,
    toggleSearchAlert,
  } = useAcreFlowStore();

  const autoName = useMemo(
    () => generateSearchName(filters, selectedCity),
    [filters, selectedCity]
  );

  const handleSave = () => {
    const newSearch: SavedSearch = {
      id: `saved-${Date.now()}`,
      name: autoName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
      alertEnabled: false,
    };
    addSavedSearch(newSearch);
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

  const getFilterChips = (search: SavedSearch) => {
    const chips: { label: string; icon?: React.ReactNode }[] = [];
    if (search.filters.category !== 'buy') {
      chips.push({
        label:
          search.filters.category.charAt(0).toUpperCase() +
          search.filters.category.slice(1),
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
        label:
          bhkMin === bhkMax ? `${bhkMin} BHK` : `${bhkMin}-${bhkMax} BHK`,
        icon: <Home className="w-3 h-3" />,
      });
    }
    if (
      search.filters.priceRange[0] > 0 ||
      search.filters.priceRange[1] < 100000000
    ) {
      chips.push({
        label: `${formatPriceShort(search.filters.priceRange[0])} - ${formatPriceShort(search.filters.priceRange[1])}`,
        icon: <IndianRupee className="w-3 h-3" />,
      });
    }
    if (search.filters.furnishing !== 'all') {
      chips.push({
        label:
          search.filters.furnishing.charAt(0).toUpperCase() +
          search.filters.furnishing.slice(1),
      });
    }
    if (search.filters.query) {
      chips.push({
        label: search.filters.query,
        icon: <MapPin className="w-3 h-3" />,
      });
    }
    return chips;
  };

  const formatDate = (dateStr: string) => {
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
  };

  return (
    <div className="w-full">
      {/* Save Current Search Button */}
      <Button
        onClick={handleSave}
        className="w-full bg-royal hover:bg-royal-dark text-white rounded-xl mb-6 h-11 sm:h-12 text-sm sm:text-base"
      >
        <Check className="w-4 h-4 mr-2" />
        Save Current Search
      </Button>

      {/* Saved Searches List */}
      {savedSearches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4">
            <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 text-royal dark:text-[#60A5FA]" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-navy dark:text-white mb-1.5">
            No saved searches yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8] max-w-[260px]">
            Search for properties and save your filters to get notified about new listings
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedSearches.map((search) => {
            const chips = getFilterChips(search);
            return (
              <div
                key={search.id}
                className="rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#0A192F] p-3 sm:p-4 transition-shadow hover:shadow-md"
              >
                {/* Header: Name + Actions */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-navy dark:text-white line-clamp-1 flex-1">
                    {search.name}
                  </h4>
                  <button
                    onClick={() => handleDelete(search.id)}
                    className="shrink-0 p-1.5 sm:p-2 rounded-lg text-slate-accent dark:text-[#94A3B8] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
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
                        className="bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA] border-0 text-[10px] sm:text-[11px] px-2 py-0.5 font-medium gap-1"
                      >
                        {chip.icon}
                        {chip.label}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Footer: Date + Alert Toggle + Apply */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border dark:border-[#1D3461]">
                  <span className="text-[10px] sm:text-xs text-slate-accent dark:text-[#64748B]">
                    {formatDate(search.createdAt)}
                  </span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Alert Toggle */}
                    <div className="flex items-center gap-1.5">
                      {search.alertEnabled ? (
                        <Bell className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <BellOff className="w-3.5 h-3.5 text-slate-accent dark:text-[#64748B]" />
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
                      className="text-[10px] sm:text-xs h-8 px-2 sm:px-3 text-royal dark:text-[#60A5FA] border-royal/30 dark:border-[#60A5FA]/30 hover:bg-royal/5 dark:hover:bg-[#60A5FA]/10"
                    >
                      <Search className="w-3 h-3 mr-1" />
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
  );
}
