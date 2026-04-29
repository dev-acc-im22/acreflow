'use client';

import { useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import type { BlogArticle } from '@/types';
import {
  ArrowLeft,
  Clock,
  User,
  ArrowRight,
  Calendar,
  Tag,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// ── Articles data (copied from BlogNews to avoid circular deps) ──────

const articles: BlogArticle[] = [
  {
    id: 'a1',
    title: '5 Tips for First-Time Home Buyers in Chennai',
    excerpt: 'Buying your first home is exciting but overwhelming. Here are essential tips to navigate the Chennai real estate market with confidence.',
    category: 'Buying Guide',
    image: '',
    author: 'Arjun Mehta',
    date: 'Dec 15, 2024',
    readTime: '6 min read',
  },
  {
    id: 'a2',
    title: 'Best Localities for Investment in 2024',
    excerpt: 'Discover the top emerging localities across Indian cities that offer the best ROI for property investors this year.',
    category: 'Investment',
    image: '',
    author: 'Sneha Iyer',
    date: 'Dec 12, 2024',
    readTime: '8 min read',
  },
  {
    id: 'a3',
    title: 'How to Check RERA Registration',
    excerpt: 'A complete guide to verifying RERA registration of any property or project before making your investment decision.',
    category: 'Buying Guide',
    image: '',
    author: 'Rahul Kapoor',
    date: 'Dec 10, 2024',
    readTime: '5 min read',
  },
  {
    id: 'a4',
    title: 'Complete Guide to Home Loan EMI',
    excerpt: 'Everything you need to know about home loan EMIs — calculation methods, factors affecting rates, and tips to reduce your EMI burden.',
    category: 'Home Loans',
    image: '',
    author: 'Priya Desai',
    date: 'Dec 8, 2024',
    readTime: '10 min read',
  },
  {
    id: 'a5',
    title: 'Top 10 Interior Design Trends for 2025',
    excerpt: 'From sustainable materials to smart home integration, explore the interior design trends that will define the coming year.',
    category: 'Interior Design',
    image: '',
    author: 'Kavitha Ram',
    date: 'Dec 5, 2024',
    readTime: '7 min read',
  },
  {
    id: 'a6',
    title: 'Rent vs Buy: What Makes More Sense?',
    excerpt: 'A data-driven analysis of whether renting or buying makes more financial sense in the current Indian real estate market.',
    category: 'Market Trends',
    image: '',
    author: 'Arjun Mehta',
    date: 'Dec 2, 2024',
    readTime: '9 min read',
  },
  {
    id: 'a7',
    title: 'Understanding Property Valuation',
    excerpt: 'Learn the key methods and factors used to determine the fair market value of residential and commercial properties in India.',
    category: 'Investment',
    image: '',
    author: 'Sneha Iyer',
    date: 'Nov 28, 2024',
    readTime: '6 min read',
  },
  {
    id: 'a8',
    title: 'GST Impact on Real Estate Transactions',
    excerpt: 'A simplified breakdown of how GST applies to different types of real estate transactions and what it means for buyers and sellers.',
    category: 'Market Trends',
    image: '',
    author: 'Rahul Kapoor',
    date: 'Nov 25, 2024',
    readTime: '7 min read',
  },
  {
    id: 'a9',
    title: 'Smart Home Features That Add Real Value',
    excerpt: 'Which smart home upgrades actually increase property value? We break down the features that offer the best return on investment.',
    category: 'Interior Design',
    image: '',
    author: 'Priya Desai',
    date: 'Nov 22, 2024',
    readTime: '5 min read',
  },
];

const fullContent: Record<string, string[]> = {
  a1: [
    'Buying your first home is one of the most significant financial decisions you will ever make. The Chennai real estate market offers diverse options from luxury apartments in OMR to affordable homes in Tambaram. However, navigating the process requires careful planning and research.',
    'First, determine your budget realistically. Factor in not just the property price but also registration charges (typically 7-8% of property value), stamp duty, and moving costs. Most banks finance up to 80-85% of the property value, so you will need 15-20% as down payment. Use AcreFlow\'s EMI calculator to plan your finances.',
    'Second, choose the right locality based on your lifestyle needs. Proximity to your workplace, quality of schools nearby, healthcare facilities, and public transport connectivity should all factor into your decision. Areas like Anna Nagar, Velachery, and T. Nagar remain popular, while emerging areas like Perungalathur and Chengalpattu offer better value.',
    'Third, always verify RERA registration and legal documents before proceeding. Check for clear title, approved building plan, and completion certificate (for ready-to-move properties). AcreFlow makes this easy by displaying RERA status and verification badges on every listed property.',
  ],
  a2: [
    'As India\'s real estate market matures, several localities are emerging as hot investment destinations offering excellent returns. Our data-driven analysis identifies the top areas across major cities that are poised for significant appreciation.',
    'In Bangalore, areas around the new metro corridors — particularly Devanahalli, Yelahanka, and Hebbal — are seeing increased demand. Property prices in these areas have grown 15-20% in the last year alone, with infrastructure development driving the appreciation.',
    'Mumbai\'s Thane and Navi Mumbai continue to attract investors, especially with the upcoming Navi Mumbai International Airport and Trans-Harbour Link. Areas like Ghodbunder Road and Dombivli offer properties at relatively affordable prices with strong growth potential.',
    'Hyderabad\'s IT corridor extensions — Gachibowli to Kokapet — present exciting opportunities. The state government\'s proactive approach to infrastructure and the city\'s growing IT sector are fueling demand. Prices in Kokapet have already doubled from their 2020 levels.',
  ],
  a3: [
    'The Real Estate (Regulation and Development) Act, 2016 (RERA) was designed to protect homebuyers and bring transparency to the real estate sector. Checking RERA registration is a crucial step before investing in any property.',
    'Visit the official RERA website of the respective state where the property is located. For example, Tamil Nadu RERA can be accessed at tnrera.in. You can search by project name, promoter name, or RERA registration number to verify the project\'s status.',
    'Look for key details: the project registration number, date of registration, project completion timeline, and any complaints or legal disputes filed against the project. The RERA database also shows the quarterly progress updates submitted by the developer.',
    'If a project is not RERA-registered, it may be illegal. Section 3 of the RERA Act mandates that all projects with land area over 500 sq. meters or more than 8 apartments must be registered. AcreFlow only lists RERA-verified properties and prominently displays the registration number.',
  ],
  a4: [
    'An Equated Monthly Installment (EMI) is the fixed payment you make to the bank every month to repay your home loan. Understanding how EMIs work is essential for financial planning and choosing the right loan structure.',
    'EMI is calculated using the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is the principal loan amount, R is the monthly interest rate, and N is the loan tenure in months. A ₹50 lakh loan at 8.5% for 20 years results in an EMI of approximately ₹43,391.',
    'Factors affecting your EMI include: the loan amount (higher principal = higher EMI), interest rate (even a 0.5% change matters significantly over the loan tenure), and loan tenure (longer tenure = lower EMI but more total interest paid). A small prepayment each year can dramatically reduce your total interest outgo.',
    'To reduce your EMI burden: compare rates from multiple banks (AcreFlow partners with 20+ banks), maintain a good credit score (750+ for best rates), opt for a shorter tenure if affordable, and make regular prepayments when you receive bonuses or windfalls.',
  ],
  a5: [
    'Interior design is evolving rapidly, with 2025 set to bring exciting new trends that blend aesthetics with functionality. Here are the top 10 trends that will define home interiors in the coming year.',
    'Sustainable and eco-friendly materials are taking center stage. Recycled wood, bamboo flooring, cork wall panels, and natural stone countertops are not just environmentally responsible — they also add warmth and character to any space. Homeowners are increasingly choosing materials with low VOC emissions and responsible sourcing.',
    'Smart home integration has moved beyond gadgets. Built-in smart lighting systems, motorized curtains, intelligent HVAC controls, and voice-activated security systems are now integral to the design process rather than afterthoughts. The key is seamless integration that doesn\'t compromise on aesthetics.',
    'Biophilic design continues to gain momentum. Indoor gardens, living walls, natural light optimization, and organic shapes create spaces that connect occupants with nature. Studies show that biophilic elements reduce stress and improve productivity by up to 15%.',
  ],
  a6: [
    'The rent vs buy debate is one of the most discussed topics in personal finance, especially in the Indian context where home ownership is deeply tied to cultural values. But what does the data actually say?',
    'In the current market, renting often makes financial sense for young professionals in their 20s and early 30s. With property prices in metro cities averaging ₹1-2 crore for a decent 2BHK, the opportunity cost of tying up that capital is significant. If the same amount were invested in equity mutual funds with 12% average returns, it could potentially outpace property appreciation.',
    'However, buying becomes compelling when: you plan to stay in the same city for 7+ years, property prices in your target area are appreciating at 8%+ annually, rental yields are below 3% (making rent expensive), and you value the emotional security of owning your home. Tax benefits on home loan interest (up to ₹2 lakh) and principal repayment (up to ₹1.5 lakh) also make buying attractive.',
    'The sweet spot: consider buying if your EMI is less than 40% of your monthly take-home pay, you have an emergency fund of 6 months, and the loan tenure is not more than 20 years. Otherwise, renting and investing the difference may yield better long-term wealth creation.',
  ],
  a7: [
    'Property valuation is the process of determining the fair market value of a property. Whether you are buying, selling, or refinancing, understanding valuation methods helps you make informed decisions and negotiate better deals.',
    'The most common methods include: Comparative Market Analysis (CMA), which compares the property with recently sold similar properties in the same area; the Cost Approach, which calculates the cost of replacing the structure minus depreciation; and the Income Approach, which values the property based on its rental income potential.',
    'Key factors affecting property value include: location (proximity to amenities, transport, employment hubs), property age and condition, floor and orientation (higher floors and east-facing units command premium), legal clearances (RERA registration, approved plans), and market conditions (demand-supply dynamics in the area).',
    'For accurate valuation, consider hiring a certified valuer — they typically charge ₹5,000-15,000 for a residential property valuation report. Banks require this for loan processing. AcreFlow\'s Valuation Calculator tool gives you an instant estimate based on locality-specific data from recent transactions.',
  ],
  a8: [
    'Goods and Services Tax (GST) has significantly impacted real estate transactions in India since its introduction. Understanding how GST applies helps both buyers and sellers plan their finances better.',
    'For residential properties: Under-construction apartments attract 5% GST (without Input Tax Credit) for affordable housing (carpet area up to 60 sq.m. in metros, 90 sq.m. in non-metros, priced under ₹45 lakh). For other residential properties, the GST rate is 1% without ITC. Ready-to-move properties are exempt from GST.',
    'For commercial properties: GST on commercial real estate is 12% with full Input Tax Credit (ITC). This means developers can claim credit for taxes paid on inputs like cement, steel, and services used in construction. Buyers of commercial properties can also claim ITC.',
    'Key points to remember: stamp duty and registration charges are not part of GST and are levied separately by state governments. These typically range from 5-8% of property value. The GST on under-construction properties is payable on the basic sale price and does not include stamp duty, registration, electricity, and water charges.',
  ],
  a9: [
    'Smart home technology has evolved from novelty to necessity. But not all smart features add equal value to your property. Here\'s a data-backed look at which upgrades offer the best return on investment.',
    'High-impact features that consistently add value: smart security systems (CCTV, smart locks, video doorbells) offer 3-5% value appreciation, smart thermostats reduce energy costs by 10-15% and are highly sought after, and automated lighting systems with motion sensors add both convenience and energy efficiency.',
    'Medium-impact features: voice-controlled home automation (controlling lights, AC, curtains with voice commands), smart kitchen appliances (robotic vacuums, smart refrigerators), and automated irrigation systems for gardens. These are increasingly expected in premium properties.',
    'Features with diminishing returns: overly complex proprietary systems that lock buyers into specific ecosystems, technology that becomes quickly outdated, and features that require significant maintenance. The key is to invest in interoperable, standards-based systems (like Matter protocol) that work across brands.',
  ],
};

const categoryGradients: Record<string, string> = {
  'Buying Guide': 'from-blue-600 to-blue-800',
  'Investment': 'from-emerald-600 to-emerald-800',
  'Market Trends': 'from-purple-600 to-purple-800',
  'Home Loans': 'from-amber-600 to-amber-800',
  'Interior Design': 'from-pink-600 to-pink-800',
};

export default function BlogArticlePage() {
  const { selectedBlogArticle, goBack, setSelectedBlogArticle } = useAcreFlowStore();

  const content = useMemo(() => {
    if (!selectedBlogArticle) return [];
    return fullContent[selectedBlogArticle.id] || [];
  }, [selectedBlogArticle]);

  const relatedArticles = useMemo(() => {
    if (!selectedBlogArticle) return [];
    return articles
      .filter((a) => a.id !== selectedBlogArticle.id && a.category === selectedBlogArticle.category)
      .slice(0, 3);
  }, [selectedBlogArticle]);

  const gradientClass = selectedBlogArticle
    ? categoryGradients[selectedBlogArticle.category] || 'from-navy to-royal'
    : 'from-navy to-royal';

  const handleRelatedClick = (article: BlogArticle) => {
    setSelectedBlogArticle(article);
    window.scrollTo({ top: 0 });
  };

  // Skeleton / Empty state
  if (!selectedBlogArticle) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A192F] flex flex-col">
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
            <h1 className="text-base sm:text-lg font-bold text-navy dark:text-white">
              Article
            </h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4">
          <Skeleton className="h-48 sm:h-56 w-full rounded-2xl" />
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] flex flex-col">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#112240]/80 backdrop-blur-md border-b dark:border-[#1D3461] shadow-sm">
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
            <h1 className="text-base sm:text-lg font-bold text-navy dark:text-white truncate">
              Article
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Image Area with Gradient */}
        <div className={`relative h-44 sm:h-56 md:h-64 bg-gradient-to-br ${gradientClass} -mx-4 sm:-mx-6 lg:-mx-8 mt-4 sm:mt-0`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white/20" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black/60 to-transparent">
            <Badge className="bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-sm mb-2 border-0">
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
              {selectedBlogArticle.category}
            </Badge>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
              {selectedBlogArticle.title}
            </h1>
          </div>
        </div>

        <div className="py-4 sm:py-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8] mb-4 sm:mb-6">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-sm sm:text-base">{selectedBlogArticle.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-sm sm:text-base">{selectedBlogArticle.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-sm sm:text-base">{selectedBlogArticle.readTime}</span>
            </span>
          </div>

          <Separator className="mb-4 sm:mb-6 dark:bg-[#1D3461]" />

          {/* Full Content */}
          <div className="space-y-4 sm:space-y-5">
            {content.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-base text-slate-accent dark:text-[#94A3B8] leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <>
              <Separator className="my-6 sm:my-8 dark:bg-[#1D3461]" />
              <h3 className="text-lg sm:text-xl font-bold text-navy dark:text-white mb-3 sm:mb-4">
                Related Articles
              </h3>
              <div className="space-y-3">
                {relatedArticles.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => handleRelatedClick(related)}
                    className="w-full text-left p-3 sm:p-4 bg-cream dark:bg-[#112240] rounded-xl border border-border dark:border-[#1D3461] hover:shadow-sm transition-all cursor-pointer group min-h-[44px]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Badge
                          className="bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA] text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full mb-2 border-0"
                        >
                          {related.category}
                        </Badge>
                        <p className="text-sm sm:text-base font-semibold text-navy dark:text-white line-clamp-1 group-hover:text-royal dark:group-hover:text-[#60A5FA] transition-colors">
                          {related.title}
                        </p>
                        <p className="text-xs text-slate-accent dark:text-[#94A3B8] mt-1">
                          {related.readTime}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-accent dark:text-[#94A3B8] group-hover:text-royal dark:group-hover:text-[#60A5FA] shrink-0 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
