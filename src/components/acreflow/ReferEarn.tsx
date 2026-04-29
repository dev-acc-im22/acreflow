'use client';

import { useState } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import type { ReferralStats } from '@/types';
import {
  ArrowLeft,
  Share2,
  UserPlus,
  Wallet,
  Users,
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  Link2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

const referralStats: ReferralStats = {
  totalReferrals: 12,
  successfulReferrals: 8,
  totalEarnings: 4000,
  pendingRewards: 2000,
};

const steps = [
  {
    icon: Share2,
    title: 'Share Your Referral Link',
    description: 'Share your unique referral link with friends and family via WhatsApp, email, or social media.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: UserPlus,
    title: 'Friend Signs Up & Lists/Views',
    description: 'When your friend signs up and views or lists a property on AcreFlow, the referral is tracked.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Wallet,
    title: 'Earn ₹500 Reward',
    description: 'Once the referral is successful, ₹500 is credited to your AcreFlow wallet instantly.',
    color: 'from-amber-500 to-amber-600',
  },
];

const referralHistory = [
  { id: '1', friendName: 'Priya Sharma', date: '2024-12-15', status: 'completed' as const, reward: 500 },
  { id: '2', friendName: 'Rajesh Kumar', date: '2024-12-10', status: 'completed' as const, reward: 500 },
  { id: '3', friendName: 'Anita Patel', date: '2024-12-05', status: 'pending' as const, reward: 500 },
  { id: '4', friendName: 'Vikram Reddy', date: '2024-11-28', status: 'completed' as const, reward: 500 },
  { id: '5', friendName: 'Deepa Nair', date: '2024-11-20', status: 'pending' as const, reward: 500 },
  { id: '6', friendName: 'Suresh Babu', date: '2024-11-15', status: 'completed' as const, reward: 500 },
  { id: '7', friendName: 'Kavitha Ram', date: '2024-11-10', status: 'completed' as const, reward: 500 },
  { id: '8', friendName: 'Mohammed Ali', date: '2024-11-05', status: 'completed' as const, reward: 500 },
];

const termsContent = [
  'Referral rewards are credited only after the referred user completes a property listing or views at least 5 properties on the platform.',
  'Each referral is valid for 30 days from the date of sign-up. If the referred user does not complete the required action within 30 days, the referral will expire.',
  'A maximum of ₹5,000 can be earned per month through referrals. Unused earnings do not roll over.',
  'Self-referrals and referrals from the same household or IP address are not eligible for rewards.',
  'AcreFlow reserves the right to modify the referral program terms at any time. Changes will be communicated via email and in-app notification.',
  'Referral rewards are non-transferable and cannot be exchanged for cash. They can only be used for AcreFlow services.',
];

const REFERRAL_CODE = 'ACREFLOW-RK2024';
const REFERRAL_LINK = 'https://acreflow.com/ref/ACREFLOW-RK2024';

export default function ReferEarn() {
  const { goBack } = useAcreFlowStore();
  const [showTerms, setShowTerms] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).then(() => {
      toast.success('Referral code copied!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(REFERRAL_LINK).then(() => {
      toast.success('Referral link copied!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join AcreFlow - India\'s No-Brokerage Property Platform',
        text: `Use my referral code ${REFERRAL_CODE} to sign up and we both get rewards!`,
        url: REFERRAL_LINK,
      });
    } else {
      handleCopyLink();
    }
  };

  const statCards = [
    {
      label: 'Total Referrals',
      value: referralStats.totalReferrals,
      icon: Users,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Successful',
      value: referralStats.successfulReferrals,
      icon: CheckCircle2,
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Total Earned',
      value: `₹${referralStats.totalEarnings.toLocaleString('en-IN')}`,
      icon: Wallet,
      color: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Pending',
      value: `₹${referralStats.pendingRewards.toLocaleString('en-IN')}`,
      icon: Clock,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

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
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-sky dark:bg-[#1D3461]/50 px-4 py-1.5 rounded-full mb-4">
              <Gift className="w-4 h-4 text-royal dark:text-[#60A5FA]" />
              <span className="text-sm font-medium text-royal dark:text-[#60A5FA]">
                Referral Program
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-3">
              Refer Friends, Earn Rewards
            </h1>
            <p className="text-slate-accent dark:text-[#94A3B8] text-base md:text-lg max-w-2xl mx-auto">
              Earn <span className="font-bold text-royal dark:text-[#60A5FA]">₹500</span> for every
              successful referral. Share the love of zero brokerage!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461] rounded-xl hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-navy dark:text-white">{stat.value}</p>
                      <p className="text-xs text-slate-accent dark:text-[#94A3B8]">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="pb-8 md:pb-12 bg-cream dark:bg-[#112240]">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center mb-2">
            How It Works
          </h2>
          <p className="text-slate-accent dark:text-[#94A3B8] text-center mb-10">
            Three simple steps to start earning
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative text-center">
                  {/* Connector line (desktop only) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-royal/20 to-transparent" />
                  )}

                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-9 h-9 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-[#0A192F] border-2 border-royal dark:border-[#60A5FA] flex items-center justify-center">
                        <span className="text-xs font-bold text-royal dark:text-[#60A5FA]">
                          {idx + 1}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-navy dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-accent dark:text-[#94A3B8] max-w-xs leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Referral Code & Link */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Referral Code */}
          <Card className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461] rounded-2xl p-6 mb-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                  <Gift className="w-5 h-5 text-royal dark:text-[#60A5FA]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy dark:text-white">Your Referral Code</p>
                  <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                    Share this code with friends
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-cream dark:bg-[#0A192F] rounded-xl px-5 py-3 text-center border border-border dark:border-[#1D3461]">
                  <span className="text-lg md:text-xl font-bold tracking-widest text-navy dark:text-white">
                    {REFERRAL_CODE}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="h-11 px-4 rounded-xl border-royal/30 text-royal dark:text-[#60A5FA] dark:border-[#60A5FA]/30 hover:bg-sky dark:hover:bg-[#1D3461]"
                  onClick={handleCopyCode}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Referral Link */}
          <Card className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461] rounded-2xl p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-royal dark:text-[#60A5FA]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy dark:text-white">Your Referral Link</p>
                  <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                    Share via WhatsApp, email, or social media
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-cream dark:bg-[#0A192F] rounded-xl px-4 py-3 border border-border dark:border-[#1D3461] overflow-hidden">
                  <span className="text-sm text-navy dark:text-white truncate block">
                    {REFERRAL_LINK}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl border-royal/30 text-royal dark:text-[#60A5FA] dark:border-[#60A5FA]/30 hover:bg-sky dark:hover:bg-[#1D3461] shrink-0"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  className="h-11 px-4 rounded-xl bg-royal hover:bg-royal-dark text-white shrink-0"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rewards History */}
      <section className="pb-8 md:pb-12 bg-cream dark:bg-[#112240]">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">Rewards History</h2>
          <p className="text-slate-accent dark:text-[#94A3B8] text-sm mb-6">
            Track your referral rewards
          </p>

          <div className="bg-white dark:bg-[#0A192F] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 bg-cream dark:bg-[#112240] border-b border-border dark:border-[#1D3461]">
              <span className="text-xs font-semibold text-slate-accent dark:text-[#94A3B8] uppercase tracking-wider">
                Friend Name
              </span>
              <span className="text-xs font-semibold text-slate-accent dark:text-[#94A3B8] uppercase tracking-wider">
                Date
              </span>
              <span className="text-xs font-semibold text-slate-accent dark:text-[#94A3B8] uppercase tracking-wider">
                Status
              </span>
              <span className="text-xs font-semibold text-slate-accent dark:text-[#94A3B8] uppercase tracking-wider text-right">
                Reward
              </span>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border dark:divide-[#1D3461]">
              {referralHistory.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-6 py-4 hover:bg-cream/50 dark:hover:bg-[#112240]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center text-xs font-bold text-navy dark:text-white">
                      {item.friendName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-navy dark:text-white truncate">
                      {item.friendName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-slate-accent dark:text-[#94A3B8]">
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Badge
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                    >
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {item.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-sm font-bold text-navy dark:text-white">
                      ₹{item.reward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Accordion type="single" collapsible>
            <AccordionItem
              value="terms"
              className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] px-6"
            >
              <AccordionTrigger className="text-base font-semibold text-navy dark:text-white hover:no-underline py-4">
                <span className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" />
                  Terms & Conditions
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <ul className="space-y-3">
                  {termsContent.map((term, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-royal dark:text-[#60A5FA]">
                          {idx + 1}
                        </span>
                      </span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
