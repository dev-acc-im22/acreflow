import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppView, SearchFilters, PropertyListing } from '@/types';

const defaultFilters: SearchFilters = {
  category: 'buy',
  query: '',
  propertyTypes: [],
  bhkRange: [1, 5],
  priceRange: [0, 100000000],
  areaRange: [0, 10000],
  furnishing: 'all',
  possessionStatus: 'all',
  verifiedOnly: false,
  directOwnerOnly: false,
  readyToMoveOnly: false,
  amenities: [],
  sortBy: 'relevance',
};

interface AcreFlowState {
  // View management
  currentView: AppView;
  previousView: AppView | null;
  setView: (view: AppView) => void;
  goBack: () => void;

  // Selected property
  selectedProperty: PropertyListing | null;
  setSelectedProperty: (property: PropertyListing | null) => void;

  // Search
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Comparison
  comparisonList: PropertyListing[];
  addToComparison: (property: PropertyListing) => void;
  removeFromComparison: (id: string) => void;
  toggleComparison: (property: PropertyListing) => void;
  isInComparison: (id: string) => boolean;
  clearComparison: () => void;
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;

  // Wishlist / Shortlist
  wishlist: string[]; // property IDs
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;

  // Recently Viewed
  recentlyViewed: PropertyListing[];
  addToRecentlyViewed: (property: PropertyListing) => void;

  // Search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected city
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Notification panel
  showNotificationPanel: boolean;
  setShowNotificationPanel: (show: boolean) => void;
  notifications: Array<{ id: string; title: string; message: string; time: string; read: boolean }>;
  markNotificationRead: (id: string) => void;
  unreadCount: () => number;

  // Schedule visit modal
  showScheduleVisit: boolean;
  setShowScheduleVisit: (show: boolean) => void;

  // Contact modal
  showContactModal: boolean;
  setShowContactModal: (show: boolean) => void;

  // Scroll position for restoring
  scrollPosition: number;
  setScrollPosition: (pos: number) => void;
}

export const useAcreFlowStore = create<AcreFlowState>()(
  persist(
    (set, get) => ({
      // View management
      currentView: 'home',
      previousView: null,
      setView: (view) =>
        set((state) => ({
          previousView: state.currentView,
          currentView: view,
          scrollPosition: typeof window !== 'undefined' ? window.scrollY : 0,
        })),
      goBack: () =>
        set((state) => ({
          currentView: state.previousView || 'home',
          previousView: null,
        })),

      // Selected property
      selectedProperty: null,
      setSelectedProperty: (property) => set({ selectedProperty: property }),

      // Search filters
      filters: { ...defaultFilters },
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: { ...defaultFilters } }),

      // Comparison
      comparisonList: [],
      addToComparison: (property) =>
        set((state) => {
          if (state.comparisonList.length >= 3) return state;
          if (state.comparisonList.find((p) => p.id === property.id)) return state;
          return { comparisonList: [...state.comparisonList, property] };
        }),
      removeFromComparison: (id) =>
        set((state) => ({
          comparisonList: state.comparisonList.filter((p) => p.id !== id),
        })),
      toggleComparison: (property) =>
        set((state) => {
          const exists = state.comparisonList.find((p) => p.id === property.id);
          if (exists) {
            return { comparisonList: state.comparisonList.filter((p) => p.id !== property.id) };
          }
          if (state.comparisonList.length >= 3) return state;
          return { comparisonList: [...state.comparisonList, property] };
        }),
      isInComparison: (id) => {
        return get().comparisonList.some((p) => p.id === id);
      },
      clearComparison: () => set({ comparisonList: [] }),
      showComparison: false,
      setShowComparison: (show) => set({ showComparison: show }),

      // Wishlist / Shortlist
      wishlist: [],
      toggleWishlist: (id) =>
        set((state) => {
          if (state.wishlist.includes(id)) {
            return { wishlist: state.wishlist.filter((w) => w !== id) };
          }
          return { wishlist: [...state.wishlist, id] };
        }),
      isInWishlist: (id) => {
        return get().wishlist.includes(id);
      },

      // Recently Viewed
      recentlyViewed: [],
      addToRecentlyViewed: (property) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((p) => p.id !== property.id);
          return { recentlyViewed: [property, ...filtered].slice(0, 20) };
        }),

      // Search query
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // City
      selectedCity: 'Chennai',
      setSelectedCity: (city) => set({ selectedCity: city }),

      // Mobile menu
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      // Dark mode
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Notification panel
      showNotificationPanel: false,
      setShowNotificationPanel: (show) => set({ showNotificationPanel: show }),
      notifications: [
        { id: 'n1', title: 'New Property Match', message: '3 new properties match your search in Anna Nagar', time: '2 hours ago', read: false },
        { id: 'n2', title: 'Price Drop Alert', message: 'A 3 BHK in Velachery dropped by ₹5 Lakh', time: '5 hours ago', read: false },
        { id: 'n3', title: 'Lead Response', message: 'Rajesh Kumar responded to your inquiry', time: '1 day ago', read: true },
        { id: 'n4', title: 'Schedule Reminder', message: 'Site visit tomorrow at 11 AM - Prestige Belle Vue', time: '1 day ago', read: true },
      ],
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      // Schedule visit modal
      showScheduleVisit: false,
      setShowScheduleVisit: (show) => set({ showScheduleVisit: show }),

      // Contact modal
      showContactModal: false,
      setShowContactModal: (show) => set({ showContactModal: show }),

      // Scroll
      scrollPosition: 0,
      setScrollPosition: (pos) => set({ scrollPosition: pos }),
    }),
    {
      name: 'acreflow-storage',
      partialize: (state) => ({
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        darkMode: state.darkMode,
        selectedCity: state.selectedCity,
      }),
    }
  )
);
