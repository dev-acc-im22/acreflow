'use client';

import { Search, PlusCircle, Heart, Bell, User } from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';

const NAV_ITEMS = [
  {
    icon: Search,
    label: 'Search',
    activeViews: ['search', 'home'],
    view: 'search' as const,
  },
  {
    icon: Heart,
    label: 'Shortlist',
    activeViews: [],
    view: 'home' as const,
  },
  {
    icon: PlusCircle,
    label: 'Post',
    activeViews: ['post-property'],
    view: 'post-property' as const,
  },
  {
    icon: Bell,
    label: 'Activity',
    activeViews: [],
    view: 'home' as const,
  },
  {
    icon: User,
    label: 'Profile',
    activeViews: ['lead-center'],
    view: 'lead-center' as const,
  },
] as const;

export default function MobileNav() {
  const { currentView, setView, setFilters, unreadCount } = useAcreFlowStore();

  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    setView(item.view);
  };

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    return item.activeViews.includes(currentView as never);
  };

  const notifications = unreadCount();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-[#112240] border-t border-border dark:border-[#1D3461] shadow-lg dark:shadow-none pb-safe"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 h-12 min-w-[3.5rem] transition-colors relative"
            >
              {item.label === 'Activity' && notifications > 0 && (
                <span className="absolute -top-0.5 right-1 bg-danger text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                  {notifications}
                </span>
              )}
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${active ? 'text-royal dark:text-[#60A5FA]' : 'text-slate-accent dark:text-[#64748B]'}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] sm:text-xs leading-tight font-medium transition-colors ${
                  active ? 'text-royal dark:text-[#60A5FA]' : 'text-slate-accent dark:text-[#64748B]'
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
