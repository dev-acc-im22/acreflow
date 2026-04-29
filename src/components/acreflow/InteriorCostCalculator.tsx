'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Paintbrush,
  Sparkles,
  IndianRupee,
  Lightbulb,
  Info,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── Constants ────────────────────────────────────────────────────────────────

type BudgetType = 'budget' | 'standard' | 'premium';

const BUDGET_MULTIPLIER: Record<BudgetType, number> = {
  budget: 0.6,
  standard: 1.0,
  premium: 1.8,
};

const COST_ITEMS = [
  {
    id: 'kitchen',
    name: 'Modular Kitchen',
    icon: '🍳',
    costByBHK: { 1: [100000, 200000], 2: [150000, 300000], 3: [200000, 500000], 4: [250000, 600000] },
    options: ['L-shaped', 'U-shaped'],
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe (per room)',
    icon: '👔',
    costByBHK: { 1: [30000, 80000], 2: [30000, 80000], 3: [30000, 80000], 4: [30000, 80000] },
    perRoom: true,
    roomsByBHK: { 1: 1, 2: 2, 3: 3, 4: 3 },
  },
  {
    id: 'tv-unit',
    name: 'TV Unit',
    icon: '📺',
    costByBHK: { 1: [15000, 50000], 2: [15000, 50000], 3: [15000, 50000], 4: [15000, 50000] },
  },
  {
    id: 'crockery',
    name: 'Crockery Unit',
    icon: '🍽️',
    costByBHK: { 1: [10000, 25000], 2: [10000, 25000], 3: [10000, 25000], 4: [10000, 25000] },
  },
  {
    id: 'shoe-rack',
    name: 'Shoe Rack',
    icon: '👟',
    costByBHK: { 1: [8000, 15000], 2: [8000, 15000], 3: [8000, 15000], 4: [8000, 15000] },
  },
  {
    id: 'false-ceiling',
    name: 'False Ceiling (per room)',
    icon: '💡',
    costByBHK: { 1: [50000, 150000], 2: [50000, 150000], 3: [50000, 150000], 4: [50000, 150000] },
    perRoom: true,
    roomsByBHK: { 1: 2, 2: 3, 3: 4, 4: 5 },
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: '🎨',
    costPerSqFt: { 1: [20, 60], 2: [20, 60], 3: [20, 60], 4: [20, 60] },
    areaByBHK: { 1: 500, 2: 900, 3: 1300, 4: 1700 },
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: '✨',
    costByBHK: { 1: [15000, 50000], 2: [15000, 50000], 3: [15000, 50000], 4: [15000, 50000] },
  },
  {
    id: 'flooring',
    name: 'Flooring',
    icon: '🪵',
    costPerSqFt: { 1: [60, 200], 2: [60, 200], 3: [60, 200], 4: [60, 200] },
    areaByBHK: { 1: 500, 2: 900, 3: 1300, 4: 1700 },
  },
] as const;

const TIPS = [
  'Opt for laminate flooring instead of hardwood — same look at 40% less cost',
  'Choose PVC kitchen cabinets over solid wood for better moisture resistance and lower price',
  'Use wall decals and textured paint instead of expensive wall panels',
  'Buy furniture during festive sales on e-commerce platforms for up to 50% discounts',
  'Consider pre-fabricated modular furniture — faster installation and 20-30% cheaper than custom',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatLakhs(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatLakhsFull(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Crore`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)} Lakh`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InteriorCostCalculator() {
  const { goBack } = useAcreFlowStore();

  const [bhk, setBhk] = useState<number>(2);
  const [budgetType, setBudgetType] = useState<BudgetType>('standard');
  const [animatedTotal, setAnimatedTotal] = useState(0);

  const costs = useMemo(() => {
    const multiplier = BUDGET_MULTIPLIER[budgetType];
    const items: {
      name: string;
      icon: string;
      min: number;
      max: number;
      avg: number;
    }[] = [];

    for (const item of COST_ITEMS) {
      const bhkKey = bhk as 1 | 2 | 3 | 4;
      let min = 0;
      let max = 0;

      if ('costByBHK' in item) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const range = (item as any).costByBHK[bhkKey] as [number, number];
        min = Math.round(range[0] * multiplier);
        max = Math.round(range[1] * multiplier);
      }

      if ('costPerSqFt' in item) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rateRange = (item as any).costPerSqFt[bhkKey] as [number, number];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const area = (item as any).areaByBHK[bhkKey] as number;
        min = Math.round(rateRange[0] * area * multiplier);
        max = Math.round(rateRange[1] * area * multiplier);
      }

      if ('perRoom' in item && (item as { perRoom?: boolean }).perRoom) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rooms = ((item as any).roomsByBHK as Record<number, number>)[bhkKey] || 1;
        min *= rooms;
        max *= rooms;
      }

      items.push({
        name: item.name,
        icon: item.icon,
        min,
        max,
        avg: Math.round((min + max) / 2),
      });
    }

    const totalMin = items.reduce((s, i) => s + i.min, 0);
    const totalMax = items.reduce((s, i) => s + i.max, 0);
    const totalAvg = Math.round((totalMin + totalMax) / 2);

    return { items, totalMin, totalMax, totalAvg };
  }, [bhk, budgetType]);

  // Simple animation when total changes
  useEffect(() => {
    const target = costs.totalAvg;
    const step = Math.max(1, Math.ceil(target / 30));
    let running = 0;
    const timer = setInterval(() => {
      running += step;
      if (running >= target) {
        running = target;
        clearInterval(timer);
      }
      setAnimatedTotal(running);
    }, 20);
    return () => clearInterval(timer);
  }, [costs.totalAvg]);

  // BHK comparison data
  const bhkComparison = useMemo(() => {
    const result: { bhk: number; avg: number }[] = [];
    for (const b of [1, 2, 3, 4] as const) {
      const m = BUDGET_MULTIPLIER[budgetType];
      let totalMin = 0;
      let totalMax = 0;
      for (const item of COST_ITEMS) {
        let min = 0;
        let max = 0;
        if ('costByBHK' in item) {
          const range = item.costByBHK[b] as [number, number];
          min = Math.round(range[0] * m);
          max = Math.round(range[1] * m);
        }
        if ('costPerSqFt' in item) {
          const rateRange = item.costPerSqFt[b] as [number, number];
          const area = item.areaByBHK[b] as number;
          min = Math.round(rateRange[0] * area * m);
          max = Math.round(rateRange[1] * area * m);
        }
        if ('perRoom' in item && item.perRoom) {
          const rooms = item.roomsByBHK[b] || 1;
          min *= rooms;
          max *= rooms;
        }
        totalMin += min;
        totalMax += max;
      }
      result.push({ bhk: b, avg: Math.round((totalMin + totalMax) / 2) });
    }
    return result;
  }, [budgetType]);

  const maxBHKAvg = Math.max(...bhkComparison.map((b) => b.avg));

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
            <Paintbrush className="h-6 w-6 text-royal dark:text-[#60A5FA]" />
            Interior Design Cost Calculator
          </h1>
          <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-0.5">
            Get accurate cost estimates for your dream home
          </p>
        </div>
      </div>

      {/* BHK Selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        {([1, 2, 3, 4] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBhk(b)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 border ${
              bhk === b
                ? 'bg-royal text-white border-royal shadow-md shadow-royal/20'
                : 'bg-white dark:bg-[#112240] text-slate-accent dark:text-[#94A3B8] border-border dark:border-[#1D3461] hover:border-royal/50'
            }`}
          >
            {b} BHK
          </button>
        ))}
      </div>

      {/* Budget Type Selector */}
      <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {([
            { key: 'budget' as BudgetType, label: 'Budget', emoji: '💡' },
            { key: 'standard' as BudgetType, label: 'Standard', emoji: '🏠' },
            { key: 'premium' as BudgetType, label: 'Premium', emoji: '✨' },
          ]).map((b) => (
            <button
              key={b.key}
              onClick={() => setBudgetType(b.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                budgetType === b.key
                  ? 'bg-royal text-white border-royal'
                  : 'bg-cream dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border-border dark:border-[#1D3461] hover:border-royal/50'
              }`}
            >
              <span>{b.emoji}</span>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Cost Breakdown Table ──────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden">
          <div className="px-6 py-4 border-b border-border dark:border-[#1D3461]">
            <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
              Cost Breakdown for {bhk} BHK ({budgetType.charAt(0).toUpperCase() + budgetType.slice(1)})
            </h2>
          </div>
          <div className="divide-y divide-border dark:divide-[#1D3461]">
            {costs.items.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-cream/50 dark:hover:bg-[#1D3461]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-navy dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-accent dark:text-[#94A3B8]">
                      {formatLakhs(item.min)} – {formatLakhs(item.max)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy dark:text-white">{formatLakhsFull(item.avg)}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Total row */}
          <div className="px-6 py-4 bg-royal/5 dark:bg-[#1D3461]/50 border-t border-royal/20 dark:border-[#60A5FA]/20">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-navy dark:text-white">Estimated Total Cost</span>
              <span className="text-lg font-bold text-royal dark:text-[#60A5FA]">
                {formatLakhsFull(animatedTotal)}
              </span>
            </div>
            <p className="text-xs text-slate-accent dark:text-[#94A3B8] mt-1">
              Range: {formatLakhsFull(costs.totalMin)} – {formatLakhsFull(costs.totalMax)}
            </p>
          </div>
        </div>

        {/* ─── Right Column ──────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Total Cost Card */}
          <div className="bg-navy dark:bg-[#112240] rounded-2xl p-6 text-white border border-transparent dark:border-[#1D3461]">
            <p className="text-sm text-white/60 mb-1">Total Interior Cost</p>
            <p className="text-3xl md:text-4xl font-bold text-white">{formatLakhsFull(animatedTotal)}</p>
            <p className="text-xs text-white/50 mt-2">{bhk} BHK &middot; {budgetType} quality</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-white/50">Starting From</p>
                <p className="text-base font-bold text-sky">{formatLakhs(costs.totalMin)}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-white/50">Going Up To</p>
                <p className="text-base font-bold text-sky">{formatLakhs(costs.totalMax)}</p>
              </div>
            </div>
          </div>

          {/* BHK Comparison Bar Chart */}
          <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
            <h3 className="text-sm font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Cost per BHK Comparison
            </h3>
            <div className="space-y-3">
              {bhkComparison.map((item) => (
                <div key={item.bhk} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-medium ${item.bhk === bhk ? 'text-royal dark:text-[#60A5FA]' : 'text-slate-accent dark:text-[#94A3B8]'}`}>
                      {item.bhk} BHK
                    </span>
                    <span className={`font-semibold ${item.bhk === bhk ? 'text-royal dark:text-[#60A5FA]' : 'text-navy dark:text-white'}`}>
                      {formatLakhs(item.avg)}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-cream dark:bg-[#1D3461] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.bhk === bhk
                          ? 'bg-royal dark:bg-[#60A5FA]'
                          : 'bg-sky dark:bg-[#1D3461]'
                      }`}
                      style={{ width: `${(item.avg / maxBHKAvg) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button className="w-full h-12 bg-royal hover:bg-royal-dark text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Get Free Design Consultation
            <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Tips Section */}
          <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
            <h3 className="text-sm font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
              <Lightbulb className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
              Money-Saving Tips
            </h3>
            <div className="space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-royal dark:text-[#60A5FA]" />
                  </span>
                  <p className="text-xs text-slate-accent dark:text-[#94A3B8] leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
