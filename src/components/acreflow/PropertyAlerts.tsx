'use client';

import { useState, useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import type { SavedSearch } from '@/types';
import {
  ArrowLeft,
  Bell,
  BellOff,
  BellRing,
  Trash2,
  Search,
  MapPin,
  Home,
  IndianRupee,
  SlidersHorizontal,
  Plus,
  TrendingUp,
  Zap,
  Clock,
  Lightbulb,
  Home as HomeIcon,
  BarChart3,
  CalendarCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import SaveSearchPanel from './SaveSearchPanel';

export default function PropertyAlerts() {
  const {
    goBack,
    setFilters,
    setView,
    savedSearches,
    removeSavedSearch,
    toggleSearchAlert,
  } = useAcreFlowStore();

  const [savePanelOpen, setSavePanelOpen] = useState(false);

  const alerts = useMemo(
    () => savedSearches.filter((s) => s.alertEnabled),
    [savedSearches]
  );

  const stats = useMemo(
    () => ({
      activeAlerts: alerts.length,
      propertiesFound: alerts.length * 4 + 3,
      triggeredToday: Math.min(alerts.length, 2),
    }),
    [alerts]
  );

  const handleToggleAlert = (id: string) => {
    toggleSearchAlert(id);
    const search = savedSearches.find((s) => s.id === id);
    if (search) {
      toast.success(
        search.alertEnabled
          ? 'Alert disabled'
          : 'Alert enabled - you will be notified about new matches'
      );
    }
  };

  const handleDelete = (id: string) => {
    removeSavedSearch(id);
    toast.success('Alert deleted');
  };

  const handleEditFilters = (search: SavedSearch) => {
    setFilters(search.filters);
    setView('search');
    toast.success('Filters applied');
  };

  const getFilterSummary = (search: SavedSearch) => {
    const parts: string[] = [];
    const [bhkMin, bhkMax] = search.filters.bhkRange;
    if (bhkMin > 1 || bhkMax < 5) {
      parts.push(
        bhkMin === bhkMax ? `${bhkMin} BHK` : `${bhkMin}-${bhkMax} BHK`
      );
    }
    if (search.filters.propertyTypes.length === 1) {
      parts.push(
        search.filters.propertyTypes[0].charAt(0).toUpperCase() +
          search.filters.propertyTypes[0].slice(1)
      );
    }
    if (search.filters.furnishing !== 'all') {
      parts.push(
        search.filters.furnishing.charAt(0).toUpperCase() +
          search.filters.furnishing.slice(1)
      );
    }
    return parts.join(' · ') || 'All Properties';
  };

  const getPriceRange = (search: SavedSearch) => {
    const formatP = (val: number) => {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
      return `₹${val}`;
    };
    const [min, max] = search.filters.priceRange;
    if (min === 0 && max >= 100000000) return 'Any Budget';
    if (min === 0) return `Up to ${formatP(max)}`;
    if (max >= 100000000) return `${formatP(min)}+`;
    return `${formatP(min)} - ${formatP(max)}`;
  };

  const getLastTriggered = (index: number) => {
    const times = ['2 hours ago', '5 hours ago', 'Yesterday', '3 days ago', '1 week ago'];
    return times[index % times.length];
  };

  const getPropertiesFound = (index: number) => {
    const counts = [12, 8, 5, 15, 3, 7];
    return counts[index % counts.length];
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const tips = [
    {
      icon: <SlidersHorizontal className="w-5 h-5" />,
      title: 'Be Specific with Your Filters',
      description:
        'Narrow down your search with specific BHK, locality, and budget filters to get more relevant alerts.',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Set Price Alerts for Market Changes',
      description:
        'Enable alerts to track price movements in your preferred localities and catch the best deals early.',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Enable Notifications for Instant Updates',
      description:
        'Turn on alert notifications to be the first to know when new properties matching your criteria are listed.',
    },
  ];

  return (
    <section className="min-h-screen bg-cream dark:bg-[#0A192F]">
      {/* ── Top Bar ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white dark:bg-[#112240] border-b dark:border-[#1D3461] shadow-sm py-3">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-slate-accent dark:text-[#94A3B8] hover:text-navy dark:hover:text-white"
            onClick={goBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-navy dark:text-white">
              Property Alerts
            </h1>
            <p className="text-xs text-slate-accent dark:text-[#94A3B8] truncate">
              Get notified when new properties match your criteria
            </p>
          </div>
          <Button
            onClick={() => setSavePanelOpen(true)}
            className="bg-royal hover:bg-royal-dark text-white rounded-xl shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">New Alert</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* ── Stats Section ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] p-4 text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-royal/10 dark:bg-[#1D3461]">
              <Bell className="w-5 h-5 text-royal dark:text-[#60A5FA]" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-navy dark:text-white">
              {stats.activeAlerts}
            </p>
            <p className="text-xs text-slate-accent dark:text-[#64748B] mt-0.5">
              Active Alerts
            </p>
          </div>
          <div className="rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] p-4 text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Home className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-navy dark:text-white">
              {stats.propertiesFound}
            </p>
            <p className="text-xs text-slate-accent dark:text-[#64748B] mt-0.5">
              Properties This Week
            </p>
          </div>
          <div className="rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] p-4 text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <BellRing className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-navy dark:text-white">
              {stats.triggeredToday}
            </p>
            <p className="text-xs text-slate-accent dark:text-[#64748B] mt-0.5">
              Triggered Today
            </p>
          </div>
        </div>

        {/* ── Alerts List ───────────────────────────────────── */}
        {alerts.length === 0 && savedSearches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-6">
              <Bell className="w-8 h-8 text-royal dark:text-[#60A5FA]" />
            </div>
            <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
              No alerts set up yet
            </h3>
            <p className="text-sm text-slate-accent dark:text-[#94A3B8] max-w-sm mb-6">
              Create your first alert to get notified when new properties match your search criteria.
            </p>
            <Button
              onClick={() => setSavePanelOpen(true)}
              className="bg-royal hover:bg-royal-dark text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Alert
            </Button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-6">
              <BellOff className="w-8 h-8 text-royal dark:text-[#60A5FA]" />
            </div>
            <h3 className="text-xl font-semibold text-navy dark:text-white mb-2">
              No active alerts
            </h3>
            <p className="text-sm text-slate-accent dark:text-[#94A3B8] max-w-sm mb-6">
              You have saved searches but no alerts enabled. Enable alerts on your saved searches to get notified.
            </p>
            <Button
              onClick={() => setSavePanelOpen(true)}
              className="bg-royal hover:bg-royal-dark text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Alert
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-navy dark:text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-royal dark:text-[#60A5FA]" />
              Active Alerts ({alerts.length})
            </h2>
            {alerts.map((alert, index) => (
              <Card
                key={alert.id}
                className="rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] p-4 sm:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-navy dark:text-white truncate">
                        {alert.name}
                      </h3>
                      <Badge className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 text-[10px] px-2 py-0.5 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                      {getFilterSummary(alert)}
                    </p>
                    <p className="text-xs text-slate-accent dark:text-[#64748B] mt-0.5">
                      Budget: {getPriceRange(alert)}
                    </p>
                  </div>
                  <Switch
                    checked={alert.alertEnabled}
                    onCheckedChange={() => handleToggleAlert(alert.id)}
                    className="data-[state=checked]:bg-emerald-500 shrink-0"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-accent dark:text-[#64748B] mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last triggered: {getLastTriggered(index)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    {getPropertiesFound(index)} properties found
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border dark:border-[#1D3461]">
                  <span className="text-[11px] text-slate-accent dark:text-[#64748B]">
                    Created {formatDate(alert.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditFilters(alert)}
                      className="text-xs h-7 px-2.5 text-royal dark:text-[#60A5FA] border-royal/30 dark:border-[#60A5FA]/30 hover:bg-royal/5 dark:hover:bg-[#60A5FA]/10"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      Edit Filters
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(alert.id)}
                      className="text-xs h-7 px-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── Tips Section ──────────────────────────────────── */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Tips for Better Alerts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tips.map((tip, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border dark:border-[#1D3461] bg-white dark:bg-[#112240] p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-3 text-amber-600 dark:text-amber-400">
                  {tip.icon}
                </div>
                <h3 className="text-sm font-semibold text-navy dark:text-white mb-1.5">
                  {tip.title}
                </h3>
                <p className="text-xs text-slate-accent dark:text-[#94A3B8] leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Search Panel for creating new alerts */}
      <SaveSearchPanel open={savePanelOpen} onOpenChange={setSavePanelOpen} />
    </section>
  );
}
