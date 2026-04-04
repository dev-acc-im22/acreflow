'use client';

import { useAcreFlowStore } from '@/lib/store';
import Header from '@/components/acreflow/Header';
import Footer from '@/components/acreflow/Footer';
import MobileNav from '@/components/acreflow/MobileNav';
import HeroSearch from '@/components/acreflow/HeroSearch';
import ServiceIcons from '@/components/acreflow/ServiceIcons';
import FeaturedProperties from '@/components/acreflow/FeaturedProperties';
import WhyAcreFlow from '@/components/acreflow/WhyAcreFlow';
import MarketIntel from '@/components/acreflow/MarketIntel';
import MobileAppCTA from '@/components/acreflow/MobileAppCTA';
import SearchResults from '@/components/acreflow/SearchResults';
import PropertyDetail from '@/components/acreflow/PropertyDetail';
import EMICalculator from '@/components/acreflow/EMICalculator';
import PostPropertyWizard from '@/components/acreflow/PostPropertyWizard';
import LeadCenter from '@/components/acreflow/LeadCenter';
import ComparisonTray from '@/components/acreflow/ComparisonTray';
import { useEffect } from 'react';

export default function Home() {
  const { currentView, showComparison, comparisonList, scrollPosition } = useAcreFlowStore();

  // Scroll to top when view changes to non-home
  useEffect(() => {
    if (currentView !== 'home') {
      window.scrollTo({ top: 0 });
    }
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return <SearchResults />;
      case 'property-detail':
        return <PropertyDetail />;
      case 'emi-calculator':
      case 'budget-calculator':
        return <EMICalculator />;
      case 'post-property':
        return <PostPropertyWizard />;
      case 'lead-center':
        return <LeadCenter />;
      case 'home':
      default:
        return (
          <>
            <HeroSearch />
            <ServiceIcons />
            <FeaturedProperties />
            <WhyAcreFlow />
            <MarketIntel />
            <MobileAppCTA />
          </>
        );
    }
  };

  const isFullPageView = ['search', 'property-detail', 'emi-calculator', 'budget-calculator', 'post-property', 'lead-center'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer - only show on home view */}
      {!isFullPageView && <Footer />}

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Comparison Tray */}
      {showComparison && <ComparisonTray />}

      {/* Comparison floating button */}
      {comparisonList.length > 0 && !showComparison && (
        <button
          onClick={() => useAcreFlowStore.getState().setShowComparison(true)}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-30 bg-navy text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 hover:bg-royal transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold">Compare ({comparisonList.length})</span>
          <span className="w-5 h-5 bg-royal rounded-full flex items-center justify-center text-xs font-bold">
            {comparisonList.length}
          </span>
        </button>
      )}
    </div>
  );
}
