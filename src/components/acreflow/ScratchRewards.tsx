'use client';

import { useState } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Gift,
  Coins,
  Calendar,
  Trophy,
  Percent,
  Zap,
  Tag,
  Users,
  Crown,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// ─── Constants ────────────────────────────────────────────────────────────────

const WALLET_BALANCE = 2500;

const STREAK_DAYS = [
  { day: 'Mon', label: 'Day 1', reward: '₹50', done: true },
  { day: 'Tue', label: 'Day 2', reward: '₹50', done: true },
  { day: 'Wed', label: 'Day 3', reward: '₹100', done: true },
  { day: 'Thu', label: 'Day 4', reward: '₹100', done: true },
  { day: 'Fri', label: 'Day 5', reward: '₹200', done: false, today: true },
  { day: 'Sat', label: 'Day 6', reward: '₹200', done: false },
  { day: 'Sun', label: 'Day 7', reward: '₹500', done: false, mega: true },
] as const;

interface ScratchCardData {
  id: string;
  gradient: string;
  reward: string;
  rewardType: string;
  revealed: boolean;
}

const INITIAL_SCRATCH_CARDS: ScratchCardData[] = [
  { id: 'card-1', gradient: 'from-purple-500 to-pink-500', reward: '₹100 Off', rewardType: 'discount', revealed: false },
  { id: 'card-2', gradient: 'from-amber-500 to-orange-500', reward: 'Free Premium Week', rewardType: 'premium', revealed: false },
  { id: 'card-3', gradient: 'from-emerald-500 to-teal-500', reward: '₹500 Cashback', rewardType: 'cashback', revealed: false },
];

const OFFERS = [
  {
    id: 'offer-1',
    title: '20% Off on Interior Design',
    description: 'Get 20% discount on interior design consultation and execution',
    validity: 'Valid till Dec 31',
    badge: 'Interior',
    badgeColor: 'bg-royal text-white dark:bg-[#60A5FA]',
    icon: '🏠',
  },
  {
    id: 'offer-2',
    title: 'Free Rental Agreement',
    description: 'Get a free rental agreement draft when you sign up for Premium plan',
    validity: 'Premium plan',
    badge: 'Premium',
    badgeColor: 'bg-amber-500 text-white',
    icon: '📄',
  },
  {
    id: 'offer-3',
    title: '₹1,000 Cashback on Home Loan',
    description: 'Get ₹1,000 cashback when you apply for a home loan through AcreFlow',
    validity: 'First-time users',
    badge: 'New User',
    badgeColor: 'bg-green-600 text-white',
    icon: '💰',
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma', referrals: 15, earnings: '₹12,000', avatar: 'PS' },
  { rank: 2, name: 'Rajesh Kumar', referrals: 12, earnings: '₹9,600', avatar: 'RK' },
  { rank: 3, name: 'Amit Patel', referrals: 10, earnings: '₹8,000', avatar: 'AP' },
  { rank: 4, name: 'Sneha Reddy', referrals: 8, earnings: '₹6,400', avatar: 'SR' },
  { rank: 5, name: 'Vikram Singh', referrals: 7, earnings: '₹5,600', avatar: 'VS' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScratchRewards() {
  const { goBack } = useAcreFlowStore();

  const [scratchCards, setScratchCards] = useState<ScratchCardData[]>([...INITIAL_SCRATCH_CARDS]);
  const [checkedIn, setCheckedIn] = useState(false);

  const handleScratch = (cardId: string) => {
    setScratchCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, revealed: true } : card
      )
    );
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
  };

  const claimedCount = scratchCards.filter((c) => c.revealed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-cream dark:bg-[#0A192F] min-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="rounded-full hover:bg-cream dark:hover:bg-[#1D3461] text-navy dark:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white flex items-center gap-2">
            <Gift className="h-6 w-6 text-royal dark:text-[#60A5FA]" />
            Rewards &amp; Offers
          </h1>
          <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-0.5">
            Scratch cards, referral rewards, and exclusive deals
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Left Column ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-royal to-royal-dark p-6 text-white">
            <div className="absolute inset-0 bg-white/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60 mb-1">Wallet Balance</p>
                  <p className="text-4xl md:text-5xl font-bold">
                    ₹{WALLET_BALANCE.toLocaleString()}
                  </p>
                  <p className="text-sm text-white/50 mt-2">Rewards &amp; cashback earned</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Coins className="h-8 w-8 text-amber-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <Button className="h-9 bg-white text-navy hover:bg-white/90 rounded-xl text-sm font-semibold">
                  Redeem Rewards
                </Button>
                <Button variant="outline" className="h-9 border-white/30 text-white hover:bg-white/10 rounded-xl text-sm">
                  View History
                </Button>
              </div>
            </div>
          </div>

          {/* Daily Check-in */}
          <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
            <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
              Daily Check-in
            </h2>
            <p className="text-sm text-slate-accent dark:text-[#94A3B8] mb-4">
              Check in daily to earn rewards. 7-day streak unlocks a mega reward!
            </p>
            <div className="grid grid-cols-7 gap-2">
              {STREAK_DAYS.map((day, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 ${
                    day.today
                      ? 'ring-2 ring-royal dark:ring-[#60A5FA] bg-royal/10 dark:bg-[#60A5FA]/10'
                      : day.done
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-cream dark:bg-[#1D3461]'
                  }`}
                >
                  <span className="text-[10px] font-medium text-slate-accent dark:text-[#94A3B8]">
                    {day.day}
                  </span>
                  {day.done ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : day.today ? (
                    <button
                      onClick={handleCheckIn}
                      disabled={checkedIn}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        checkedIn
                          ? 'bg-green-500'
                          : 'bg-royal dark:bg-[#60A5FA] hover:scale-110 active:scale-95'
                      }`}
                    >
                      {checkedIn ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Zap className="h-4 w-4 text-white" />
                      )}
                    </button>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#334155] flex items-center justify-center">
                      <span className="text-[10px] text-slate-accent dark:text-[#94A3B8]">?</span>
                    </div>
                  )}
                  <span
                    className={`text-[10px] font-medium ${
                      day.mega
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-accent dark:text-[#94A3B8]'
                    }`}
                  >
                    {day.reward}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-accent dark:text-[#94A3B8] mb-1.5">
                <span>Streak Progress</span>
                <span className="font-medium text-navy dark:text-white">4/7 days</span>
              </div>
              <Progress value={(4 / 7) * 100} className="h-2" />
            </div>
          </div>

          {/* Scratch Cards */}
          <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
            <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2 mb-1">
              <Gift className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
              Scratch Cards
            </h2>
            <p className="text-sm text-slate-accent dark:text-[#94A3B8] mb-5">
              Tap to scratch and reveal your reward!
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {scratchCards.map((card) => (
                <div key={card.id} className="relative">
                  {/* Card Base */}
                  <div className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br ${card.gradient}`}>
                    {/* Reward underneath */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 z-0">
                      <Gift className="h-10 w-10 mb-3 text-white/90" />
                      <p className="text-2xl font-bold">{card.reward}</p>
                      <p className="text-xs text-white/70 mt-1">
                        {card.rewardType === 'discount'
                          ? 'On your next listing'
                          : card.rewardType === 'premium'
                            ? 'Premium access free'
                            : 'Added to wallet'}
                      </p>
                    </div>

                    {/* Scratch overlay */}
                    {!card.revealed ? (
                      <button
                        onClick={() => handleScratch(card.id)}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-800/90 dark:bg-gray-900/95 transition-all duration-500 hover:bg-gray-800/70 active:scale-[0.98] cursor-pointer group"
                        style={{
                          transition: 'all 0.5s ease',
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Coins className="h-6 w-6 text-amber-400" />
                        </div>
                        <p className="text-white font-bold text-sm">Scratch to Win!</p>
                        <p className="text-white/50 text-xs mt-1">Tap to reveal</p>
                      </button>
                    ) : (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                        <div className="mt-auto mb-4">
                          <Badge className="bg-white/20 text-white backdrop-blur-sm border-0 text-xs">
                            Claimed
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-slate-accent dark:text-[#94A3B8] mt-4">
              {claimedCount} of {scratchCards.length} cards scratched
            </p>
          </div>
        </div>

        {/* ─── Right Column ──────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Referral Earnings */}
          <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
            <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
              Referral Earnings
            </h2>

            <div className="space-y-4">
              <div className="bg-cream dark:bg-[#1D3461] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">This Month</p>
                    <p className="text-xl font-bold text-navy dark:text-white">₹500</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">From</p>
                    <p className="text-sm font-semibold text-royal dark:text-[#60A5FA]">1 referral</p>
                  </div>
                </div>
              </div>

              <div className="bg-cream dark:bg-[#1D3461] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">All Time</p>
                    <p className="text-xl font-bold text-navy dark:text-white">₹4,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">From</p>
                    <p className="text-sm font-semibold text-royal dark:text-[#60A5FA]">8 referrals</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-amber-700 dark:text-amber-400">Pending</p>
                    <p className="text-xl font-bold text-amber-800 dark:text-amber-300">₹2,000</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                    <Percent className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Referral reward will be credited after 7 days
                </p>
              </div>
            </div>

            <Button className="w-full h-11 bg-royal hover:bg-royal-dark text-white rounded-xl font-semibold text-sm mt-4 flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              Invite Friends
            </Button>
          </div>

          {/* Active Offers */}
          <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
            <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
              Active Offers
            </h2>

            <div className="space-y-3">
              {OFFERS.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-xl border border-border dark:border-[#1D3461] p-4 hover:border-royal/30 dark:hover:border-[#60A5FA]/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{offer.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-navy dark:text-white truncate">
                          {offer.title}
                        </p>
                      </div>
                      <p className="text-xs text-slate-accent dark:text-[#94A3B8] leading-relaxed">
                        {offer.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-[10px] font-medium ${offer.badgeColor}`}>
                          {offer.badge}
                        </Badge>
                        <span className="text-[10px] text-slate-light">
                          {offer.validity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
            <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
              Top Referrers This Month
            </h2>

            <div className="space-y-3">
              {LEADERBOARD.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-3 p-2.5 rounded-xl ${
                    user.rank === 1
                      ? 'bg-amber-50 dark:bg-amber-900/10'
                      : user.rank === 2
                        ? 'bg-gray-50 dark:bg-gray-800/20'
                        : user.rank === 3
                          ? 'bg-orange-50 dark:bg-orange-900/10'
                          : ''
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1
                        ? 'bg-amber-400 text-white'
                        : user.rank === 2
                          ? 'bg-gray-400 text-white'
                          : user.rank === 3
                            ? 'bg-orange-400 text-white'
                            : 'bg-cream dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8]'
                    }`}
                  >
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center text-xs font-bold text-royal dark:text-[#60A5FA]">
                    {user.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                      {user.referrals} referrals
                    </p>
                  </div>

                  {/* Earnings */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-royal dark:text-[#60A5FA]">{user.earnings}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4 bg-border dark:bg-[#1D3461]" />

            <div className="text-center">
              <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                Your rank: <span className="font-semibold text-navy dark:text-white">#12</span>
              </p>
              <p className="text-xs text-slate-accent dark:text-[#94A3B8] mt-0.5">
                2 more referrals to reach Top 10
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
