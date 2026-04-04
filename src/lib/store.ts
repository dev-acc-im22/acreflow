import { create } from 'zustand';
import type { AppView, SearchFilters, PropertyListing, defaultFilters } from '@/types';

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
  filters: typeof defaultFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Comparison
  comparisonList: PropertyListing[];
  addToComparison: (property: PropertyListing) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;

  // Search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected city
  selectedCity: string;
  setSelectedCity: (city: string) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Filter drawer
  filterDrawerOpen: boolean;
  setFilterDrawerOpen: (open: boolean) => void;

  // Scroll position for restoring
  scrollPosition: number;
  setScrollPosition: (pos: number) => void;
}

export const useAcreFlowStore = create<AcreFlowState>((set) => ({
  // View management
  currentView: 'home',
  previousView: null,
  setView: (view) =>
    set((state) => ({
      previousView: state.currentView,
      currentView: view,
      scrollPosition: window.scrollY,
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
  filters: {
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
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () =>
    set({
      filters: {
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
      },
    }),

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
  clearComparison: () => set({ comparisonList: [] }),
  showComparison: false,
  setShowComparison: (show) => set({ showComparison: show }),

  // Search query
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // City
  selectedCity: 'Chennai',
  setSelectedCity: (city) => set({ selectedCity: city }),

  // Mobile menu
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Filter drawer
  filterDrawerOpen: false,
  setFilterDrawerOpen: (open) => set({ filterDrawerOpen: open }),

  // Scroll
  scrollPosition: 0,
  setScrollPosition: (pos) => set({ scrollPosition: pos }),
}));
