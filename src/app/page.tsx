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
import Testimonials from '@/components/acreflow/Testimonials';
import FAQ from '@/components/acreflow/FAQ';
import BuilderProjects from '@/components/acreflow/BuilderProjects';
import TopAgents from '@/components/acreflow/TopAgents';
import UrgencyBanner from '@/components/acreflow/UrgencyBanner';
import PropertyOwnerCTA from '@/components/acreflow/PropertyOwnerCTA';
import HomeLoanBanner from '@/components/acreflow/HomeLoanBanner';
import StoriesCarousel from '@/components/acreflow/StoriesCarousel';
import RecentlyAdded from '@/components/acreflow/RecentlyAdded';
import CityShowcase from '@/components/acreflow/CityShowcase';
import RentCalculator from '@/components/acreflow/RentCalculator';
import InteriorCostCalculator from '@/components/acreflow/InteriorCostCalculator';
import PropertyValuation from '@/components/acreflow/PropertyValuation';
import BankRateComparison from '@/components/acreflow/BankRateComparison';
import ScratchRewards from '@/components/acreflow/ScratchRewards';
import CorporateEnquiry from '@/components/acreflow/CorporateEnquiry';
import ServicesPage from '@/components/acreflow/ServicesPage';
import PlansPricing from '@/components/acreflow/PlansPricing';
import ReferEarn from '@/components/acreflow/ReferEarn';
import AboutPage from '@/components/acreflow/AboutPage';
import BlogNews from '@/components/acreflow/BlogNews';
import PGFlatmatesSection from '@/components/acreflow/PGFlatmatesSection';
import WhatsAppButton from '@/components/acreflow/WhatsAppButton';
import ContactOwnerPage from '@/components/acreflow/ContactOwnerPage';
import ScheduleVisitPage from '@/components/acreflow/ScheduleVisitPage';
import ChatPage from '@/components/acreflow/ChatPage';
import SavedSearchesPage from '@/components/acreflow/SavedSearchesPage';
import BlogArticlePage from '@/components/acreflow/BlogArticlePage';
import NotificationsPage from '@/components/acreflow/NotificationsPage';
import ComparePage from '@/components/acreflow/ComparePage';
import PropertyAlertsPage from '@/components/acreflow/PropertyAlertsPage';
import { useEffect } from 'react';
import { GitCompareArrows } from 'lucide-react';

export default function Home() {
  const { currentView, comparisonList, darkMode, setView } = useAcreFlowStore();

  // Dark mode class toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
      case 'rent-calculator':
        return <RentCalculator />;
      case 'interior-calc':
        return <InteriorCostCalculator />;
      case 'valuation':
        return <PropertyValuation />;
      case 'bank-rates':
        return <BankRateComparison />;
      case 'scratch-rewards':
        return <ScratchRewards />;
      case 'corporate':
        return <CorporateEnquiry />;
      case 'services':
        return <ServicesPage />;
      case 'plans':
        return <PlansPricing />;
      case 'refer-earn':
        return <ReferEarn />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogNews />;
      case 'contact-owner':
        return <ContactOwnerPage />;
      case 'schedule-visit':
        return <ScheduleVisitPage />;
      case 'chat':
        return <ChatPage />;
      case 'saved-searches':
        return <SavedSearchesPage />;
      case 'blog-article':
        return <BlogArticlePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'compare':
        return <ComparePage />;
      case 'property-alerts':
        return <PropertyAlertsPage />;
      case 'home':
      default:
        return (
          <>
            <UrgencyBanner />
            <HeroSearch />
            <ServiceIcons />
            <FeaturedProperties />
            <RecentlyAdded />
            <StoriesCarousel />
            <BuilderProjects />
            <HomeLoanBanner />
            <WhyAcreFlow />
            <MarketIntel />
            <CityShowcase />
            <PGFlatmatesSection />
            <PropertyOwnerCTA />
            <Testimonials />
            <TopAgents />
            <FAQ />
            <MobileAppCTA />
          </>
        );
    }
  };

  const isFullPageView = [
    'search', 'property-detail', 'emi-calculator', 'budget-calculator',
    'post-property', 'lead-center', 'rent-calculator', 'interior-calc',
    'valuation', 'bank-rates', 'scratch-rewards', 'corporate',
    'services', 'plans', 'refer-earn', 'about', 'blog',
    'contact-owner', 'schedule-visit', 'chat', 'saved-searches',
    'blog-article', 'notifications', 'compare', 'property-alerts',
  ].includes(currentView);

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

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Comparison floating button - navigates to compare view */}
      {comparisonList.length > 0 && currentView !== 'compare' && (
        <button
          onClick={() => setView('compare')}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-30 bg-navy dark:bg-[#1D3461] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 hover:bg-royal dark:hover:bg-[#60A5FA] transition-colors cursor-pointer"
        >
          <GitCompareArrows className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm font-semibold">Compare ({comparisonList.length})</span>
          <span className="w-5 h-5 bg-royal dark:bg-[#60A5FA] rounded-full flex items-center justify-center text-xs font-bold">
            {comparisonList.length}
          </span>
        </button>
      )}
    </div>
  );
}
