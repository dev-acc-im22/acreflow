'use client';

import { useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCheck,
  X,
  Home,
  TrendingDown,
  UserCheck,
  CalendarCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  'New Property Match': Home,
  'Price Drop Alert': TrendingDown,
  'Lead Response': UserCheck,
  'Schedule Reminder': CalendarCheck,
};

export default function NotificationsPage() {
  const {
    goBack,
    notifications,
    markNotificationRead,
    unreadCount,
  } = useAcreFlowStore();

  const unread = useMemo(() => unreadCount(), [notifications, unreadCount]);

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
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
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-navy dark:text-white">
                Notifications
              </h1>
              {unread > 0 && (
                <Badge className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full border-0 min-w-[20px] text-center">
                  {unread}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8]">
              {unread > 0 ? `${unread} unread` : 'All caught up!'}
            </p>
          </div>
          {unread > 0 && (
            <Button
              variant="ghost"
              onClick={handleMarkAllRead}
              className="text-royal dark:text-[#60A5FA] hover:bg-royal/5 dark:hover:bg-[#60A5FA]/10 shrink-0 text-xs sm:text-sm h-9 sm:h-10 min-w-[44px]"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Mark all read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4 sm:mb-6">
                <BellOff className="w-7 h-7 sm:w-8 sm:h-8 text-royal dark:text-[#60A5FA]" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-navy dark:text-white mb-2">
                No notifications yet
              </h3>
              <p className="text-sm sm:text-base text-slate-accent dark:text-[#94A3B8] max-w-sm">
                You&apos;re all caught up! We&apos;ll notify you when there are new property matches or updates.
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {notifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.title] || Bell;
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all cursor-pointer group min-h-[44px] flex items-start gap-3 ${
                      notification.read
                        ? 'bg-cream/50 dark:bg-[#112240]/50 border-transparent hover:bg-cream dark:hover:bg-[#112240]'
                        : 'bg-white dark:bg-[#112240] border-border dark:border-[#1D3461] shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        notification.read
                          ? 'bg-slate-100 dark:bg-[#1D3461]'
                          : 'bg-royal/10 dark:bg-[#60A5FA]/10'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          notification.read
                            ? 'text-slate-accent dark:text-[#64748B]'
                            : 'text-royal dark:text-[#60A5FA]'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4
                            className={`text-sm sm:text-base font-semibold line-clamp-1 ${
                              notification.read
                                ? 'text-navy/70 dark:text-white/70'
                                : 'text-navy dark:text-white'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p
                            className={`text-xs sm:text-sm mt-0.5 line-clamp-2 ${
                              notification.read
                                ? 'text-slate-accent/70 dark:text-[#64748B]'
                                : 'text-slate-accent dark:text-[#94A3B8]'
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-accent/60 dark:text-[#64748B] mt-1.5">
                            {notification.time}
                          </p>
                        </div>

                        {/* Read/Unread indicator */}
                        <div className="shrink-0 mt-1.5">
                          {!notification.read ? (
                            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-royal dark:bg-[#60A5FA] block" />
                          ) : (
                            <CheckCheck className="w-4 h-4 text-slate-300 dark:text-[#475569]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
