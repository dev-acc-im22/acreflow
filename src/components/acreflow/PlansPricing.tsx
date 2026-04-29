'use client';

import { useState } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import type { SubscriptionPlan } from '@/types';
import {
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Crown,
  Gem,
  Star,
  Zap,
  BadgePercent,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const plansData: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: 'month',
    features: [
      '5 Contacts/month',
      'Basic Filters',
      'Email Support',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    duration: 'month',
    features: [
      '25 Contacts/month',
      'All Filters',
      'Priority Support',
      'Saved Searches',
      'Property Alerts',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 999,
    duration: 'month',
    popular: true,
    badge: 'POPULAR',
    features: [
      '50 Contacts/month',
      'All Filters + Advanced',
      'Direct Owner Connect',
      'Property Notes',
      'Travel Time Filter',
      'Compare Properties',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1999,
    duration: 'month',
    features: [
      'Unlimited Contacts',
      'Everything in Plus',
      'Dedicated Relationship Manager',
      'Early Access to New Listings',
      'Verified Property Reports',
    ],
  },
];

const planIcons: Record<string, typeof Star> = {
  Free: Zap,
  Basic: Star,
  Plus: Crown,
  Premium: Gem,
};

const planColors: Record<string, string> = {
  Free: 'from-gray-400 to-gray-500',
  Basic: 'from-blue-500 to-blue-600',
  Plus: 'from-royal to-royal-light',
  Premium: 'from-amber-500 to-amber-600',
};

const faqItems = [
  {
    question: 'Can I upgrade my plan anytime?',
    answer:
      'Yes, you can upgrade your plan at any time. The price difference will be prorated for the remaining billing period. Your upgraded features will be available immediately.',
  },
  {
    question: 'What happens when my contact limit is reached?',
    answer:
      'When you reach your monthly contact limit, you can either wait for the next billing cycle or upgrade your plan to get more contacts. You will receive a notification when you are approaching your limit.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer:
      'Yes! All paid plans come with a 7-day free trial. You can explore all premium features during the trial period. No charges will be applied until the trial ends.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Absolutely. You can cancel your subscription at any time from your account settings. You will continue to have access to premium features until the end of your current billing period.',
  },
  {
    question: 'How does the yearly billing work?',
    answer:
      'With yearly billing, you pay for 12 months upfront and get a 20% discount compared to monthly billing. Your subscription renews automatically at the end of each year.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards, UPI, net banking, and popular wallets. All transactions are secured with 256-bit encryption.',
  },
];

export default function PlansPricing() {
  const { goBack } = useAcreFlowStore();
  const [isYearly, setIsYearly] = useState(false);

  const getPrice = (plan: SubscriptionPlan) => {
    if (plan.price === 0) return '₹0';
    if (isYearly) {
      const yearlyPrice = Math.round(plan.price * 12 * 0.8);
      return `₹${yearlyPrice.toLocaleString('en-IN')}`;
    }
    return `₹${plan.price.toLocaleString('en-IN')}`;
  };

  const getDurationLabel = () => (isYearly ? '/year' : '/mo');

  const handleSubscribe = (planName: string) => {
    if (planName === 'Free') {
      toast.info('You are already on the Free plan!');
    } else {
      toast.success(`Redirecting to ${planName} plan checkout...`);
    }
  };

  // Max features for checkmark/x-mark alignment
  const maxFeatures = Math.max(...plansData.map((p) => p.features.length));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F]">
      {/* Back Button Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-6">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl hover:bg-cream dark:hover:bg-[#1D3461]"
          onClick={goBack}
        >
          <ArrowLeft className="w-5 h-5 text-navy dark:text-white" />
        </Button>
      </div>

      {/* Hero */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-sky dark:bg-[#1D3461]/50 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-royal dark:text-[#60A5FA]" />
            <span className="text-sm font-medium text-royal dark:text-[#60A5FA]">
              Pricing Plans
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-3">
            Choose Your Plan
          </h1>
          <p className="text-slate-accent dark:text-[#94A3B8] text-base md:text-lg max-w-2xl mx-auto mb-8">
            Get the best value for your property search with flexible plans that grow with you.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-cream dark:bg-[#112240] rounded-full p-1.5 border border-border dark:border-[#1D3461]">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                !isYearly
                  ? 'bg-white dark:bg-[#1D3461] text-navy dark:text-white shadow-sm'
                  : 'text-slate-accent dark:text-[#94A3B8] hover:text-navy dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                isYearly
                  ? 'bg-white dark:bg-[#1D3461] text-navy dark:text-white shadow-sm'
                  : 'text-slate-accent dark:text-[#94A3B8] hover:text-navy dark:hover:text-white'
              }`}
            >
              Yearly
              <Badge className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full border-0">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plansData.map((plan) => {
              const Icon = planIcons[plan.name] || Star;
              const gradient = planColors[plan.name] || 'from-gray-400 to-gray-500';
              const isPopular = plan.popular;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isPopular
                      ? 'bg-white dark:bg-[#112240] border-2 border-royal dark:border-[#60A5FA] shadow-lg'
                      : 'bg-white dark:bg-[#112240] border border-border dark:border-[#1D3461]'
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-royal dark:bg-[#60A5FA] text-white text-xs font-bold px-4 py-1 rounded-full">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy dark:text-white">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-navy dark:text-white">
                        {getPrice(plan)}
                      </span>
                      <span className="text-sm text-slate-accent dark:text-[#94A3B8]">
                        {plan.price > 0 ? getDurationLabel() : ''}
                      </span>
                    </div>
                    {isYearly && plan.price > 0 && (
                      <p className="text-xs text-success mt-1">
                        Save ₹{(plan.price * 12 * 0.2).toLocaleString('en-IN')}/year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-1 space-y-3 mb-6">
                    {Array.from({ length: maxFeatures }).map((_, idx) => {
                      const feature = plan.features[idx];
                      if (feature) {
                        return (
                          <div key={idx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-accent dark:text-[#94A3B8]">
                              {feature}
                            </span>
                          </div>
                        );
                      }
                      // Placeholder for plans with fewer features
                      return (
                        <div key={idx} className="flex items-start gap-2.5">
                          <X className="w-4 h-4 text-slate-300 dark:text-[#334155] shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-300 dark:text-[#334155]">
                            —
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <Button
                    className={`w-full h-11 rounded-xl font-semibold transition-colors ${
                      isPopular
                        ? 'bg-royal hover:bg-royal-dark text-white'
                        : 'bg-cream hover:bg-sky/70 dark:bg-[#1D3461] dark:hover:bg-[#1D3461]/80 text-navy dark:text-white border border-border dark:border-[#1D3461]'
                    }`}
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {plan.price === 0 ? 'Current Plan' : 'Get Started'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 md:py-12 bg-cream dark:bg-[#112240]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-accent dark:text-[#94A3B8] text-center mb-8">
            Everything you need to know about our plans
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="bg-white dark:bg-[#0A192F] rounded-xl border border-border dark:border-[#1D3461] px-5 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-sm font-medium text-navy dark:text-white hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
