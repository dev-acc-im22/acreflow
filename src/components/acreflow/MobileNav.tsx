'use client';

import { Search, Home, PlusCircle, Heart, User } from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';

const NAV_ITEMS = [
  {
    icon: Search,
    label: 'Search',
    activeViews: ['search', 'home'],
    view: 'search',
  },
  {
    icon: Home,
    label: 'Buy',
    activeViews: ['property-detail'],
    view: 'search',
    category: 'buy' as const,
  },
  {
    icon: PlusCircle,
    label: 'Post',
    activeViews: ['post-property'],
    view: 'post-property',
  },
  {
    icon: Heart,
    label: 'Favorites',
    activeViews: [],
    view: 'home',
  },
  {
    icon: User,
    label: 'Profile',
    activeViews: ['lead-center'],
    view: 'lead-center',
  },
] as const;

export default function MobileNav() {
  const { currentView, setView, setFilters } = useAcreFlowStore();

  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    if ('category' in item && item.category) {
      setFilters({ category: item.category });
    }
    setView(item.view);
  };

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    return item.activeViews.includes(currentView as never);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-border shadow-lg">
      <div className="flex items-center justify-around px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center gap-0.5 py-1.5 px-3 min-h-10 min-w-[3.5rem] transition-colors"
            >
              <Icon
                className={`size-5 transition-colors ${active ? 'text-royal' : 'text-slate-accent'}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] leading-tight font-medium transition-colors ${
                  active ? 'text-royal' : 'text-slate-accent'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
