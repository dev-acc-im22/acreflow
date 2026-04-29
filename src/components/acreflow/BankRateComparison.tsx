'use client';

import { useState, useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Building,
  Star,
  ArrowUpDown,
  Calculator,
  IndianRupee,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ─── Constants ────────────────────────────────────────────────────────────────

interface BankData {
  name: string;
  shortName: string;
  interestRateMin: number;
  interestRateMax: number;
  processingFee: number;
  maxTenure: number;
  maxAmount: string;
  rating: number;
}

const BANKS: BankData[] = [
  { name: 'State Bank of India', shortName: 'SBI', interestRateMin: 8.5, interestRateMax: 9.15, processingFee: 0.35, maxTenure: 30, maxAmount: 'No limit', rating: 4.2 },
  { name: 'HDFC Bank', shortName: 'HDFC', interestRateMin: 8.7, interestRateMax: 9.4, processingFee: 0.5, maxTenure: 30, maxAmount: 'No limit', rating: 4.4 },
  { name: 'ICICI Bank', shortName: 'ICICI', interestRateMin: 8.75, interestRateMax: 9.5, processingFee: 0.5, maxTenure: 30, maxAmount: 'No limit', rating: 4.3 },
  { name: 'Axis Bank', shortName: 'Axis', interestRateMin: 8.8, interestRateMax: 9.55, processingFee: 1.0, maxTenure: 30, maxAmount: '₹5 Cr', rating: 4.1 },
  { name: 'Kotak Mahindra Bank', shortName: 'Kotak', interestRateMin: 8.85, interestRateMax: 9.6, processingFee: 0.5, maxTenure: 25, maxAmount: '₹5 Cr', rating: 4.0 },
  { name: 'Punjab National Bank', shortName: 'PNB', interestRateMin: 8.5, interestRateMax: 9.3, processingFee: 0.35, maxTenure: 30, maxAmount: 'No limit', rating: 3.9 },
  { name: 'Bank of Baroda', shortName: 'BOB', interestRateMin: 8.5, interestRateMax: 9.35, processingFee: 0.35, maxTenure: 30, maxAmount: 'No limit', rating: 3.8 },
  { name: 'Union Bank of India', shortName: 'Union Bank', interestRateMin: 8.6, interestRateMax: 9.4, processingFee: 0.35, maxTenure: 30, maxAmount: 'No limit', rating: 3.7 },
  { name: 'Canara Bank', shortName: 'Canara', interestRateMin: 8.65, interestRateMax: 9.45, processingFee: 0.5, maxTenure: 30, maxAmount: '₹3 Cr', rating: 3.6 },
  { name: 'Bank of India', shortName: 'BOI', interestRateMin: 8.6, interestRateMax: 9.4, processingFee: 0.35, maxTenure: 30, maxAmount: 'No limit', rating: 3.5 },
  { name: 'Indian Bank', shortName: 'Indian Bank', interestRateMin: 8.55, interestRateMax: 9.3, processingFee: 0.23, maxTenure: 30, maxAmount: 'No limit', rating: 3.6 },
  { name: 'LIC Housing Finance', shortName: 'LIC Housing', interestRateMin: 8.5, interestRateMax: 9.3, processingFee: 0.5, maxTenure: 30, maxAmount: 'No limit', rating: 4.0 },
];

const LOAN_AMOUNT = 5000000;
const LOAN_TENURE = 20;

const TIPS = [
  'Maintain a CIBIL score of 750+ to get the lowest interest rates from banks',
  'Compare at least 3-4 banks before finalizing — processing fees and rates vary significantly',
  'A higher down payment (20-25%) reduces EMI burden and may qualify you for lower rates',
  'Public sector banks generally offer lower rates but private banks have faster processing',
  'Fixed-rate loans provide stability but floating rates are usually 0.5-1% cheaper',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeEMI(principal: number, annualRate: number, tenureYears: number): number {
  const monthlyRate = annualRate / 12 / 100;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-gray-200 dark:fill-[#334155] text-gray-200 dark:text-[#334155]'
          }`}
        />
      ))}
      <span className="text-xs text-slate-accent dark:text-[#94A3B8] ml-1 font-medium">{rating}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BankRateComparison() {
  const { goBack, setView } = useAcreFlowStore();

  const [sortBy, setSortBy] = useState<'rate' | 'fee' | 'rating'>('rate');

  const sortedBanks = useMemo(() => {
    const sorted = [...BANKS];
    if (sortBy === 'rate') {
      sorted.sort((a, b) => a.interestRateMin - b.interestRateMin);
    } else if (sortBy === 'fee') {
      sorted.sort((a, b) => a.processingFee - b.processingFee);
    } else {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [sortBy]);

  const top3Banks = sortedBanks.slice(0, 3);

  const emiComparisons = useMemo(() => {
    return top3Banks.map((bank) => {
      const avgRate = (bank.interestRateMin + bank.interestRateMax) / 2;
      const emi = computeEMI(LOAN_AMOUNT, avgRate, LOAN_TENURE);
      const totalPayment = emi * LOAN_TENURE * 12;
      const totalInterest = totalPayment - LOAN_AMOUNT;
      return {
        ...bank,
        emi,
        totalInterest,
        totalPayment,
        avgRate,
      };
    });
  }, [top3Banks]);

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
            <Building className="h-6 w-6 text-royal dark:text-[#60A5FA]" />
            Compare Home Loan Interest Rates
          </h1>
          <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-0.5">
            Find the best rate from {BANKS.length}+ banks
          </p>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-navy dark:text-white flex items-center gap-1.5">
            <ArrowUpDown className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
            Sort by:
          </span>
          {([
            { key: 'rate' as const, label: 'Interest Rate' },
            { key: 'fee' as const, label: 'Processing Fee' },
            { key: 'rating' as const, label: 'Rating' },
          ]).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                sortBy === opt.key
                  ? 'bg-royal text-white border-royal'
                  : 'bg-cream dark:bg-[#1D3461] text-slate-accent dark:text-[#94A3B8] border-border dark:border-[#1D3461] hover:border-royal/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Comparison Table ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] overflow-hidden mb-6">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream dark:bg-[#1D3461] border-b border-border dark:border-[#1D3461]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-navy dark:text-white uppercase tracking-wider">Bank Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy dark:text-white uppercase tracking-wider">Interest Rate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy dark:text-white uppercase tracking-wider">Processing Fee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy dark:text-white uppercase tracking-wider">Max Tenure</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy dark:text-white uppercase tracking-wider">Max Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy dark:text-white uppercase tracking-wider">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-navy dark:text-white uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#1D3461]">
              {sortedBanks.map((bank, i) => (
                <tr
                  key={bank.shortName}
                  className={`hover:bg-cream/50 dark:hover:bg-[#1D3461]/30 transition-colors ${
                    i < 3 ? 'bg-royal/[0.02] dark:bg-[#60A5FA]/[0.02]' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center flex-shrink-0">
                        <Building className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy dark:text-white">{bank.name}</p>
                        <p className="text-xs text-slate-accent dark:text-[#94A3B8]">{bank.shortName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-royal dark:text-[#60A5FA]">
                      {bank.interestRateMin}% – {bank.interestRateMax}%
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-navy dark:text-white">{bank.processingFee}%</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-navy dark:text-white">{bank.maxTenure} years</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-navy dark:text-white">{bank.maxAmount}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StarRating rating={bank.rating} />
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-medium border-royal text-royal dark:border-[#60A5FA] dark:text-[#60A5FA] hover:bg-royal hover:text-white dark:hover:bg-[#60A5FA] dark:hover:text-white rounded-lg"
                      onClick={() => setView('emi-calculator')}
                    >
                      Calculate EMI
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border dark:divide-[#1D3461]">
          {sortedBanks.map((bank, i) => (
            <div key={bank.shortName} className={`p-4 ${i < 3 ? 'bg-royal/[0.02] dark:bg-[#60A5FA]/[0.02]' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center">
                    <Building className="h-4 w-4 text-royal dark:text-[#60A5FA]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy dark:text-white">{bank.name}</p>
                    <StarRating rating={bank.rating} />
                  </div>
                </div>
                {i < 3 && (
                  <Badge className="bg-royal text-white text-[10px] dark:bg-[#60A5FA]">#{i + 1}</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-cream dark:bg-[#1D3461] rounded-lg p-2">
                  <p className="text-[10px] text-slate-accent dark:text-[#94A3B8]">Interest Rate</p>
                  <p className="text-sm font-bold text-royal dark:text-[#60A5FA]">{bank.interestRateMin}% – {bank.interestRateMax}%</p>
                </div>
                <div className="bg-cream dark:bg-[#1D3461] rounded-lg p-2">
                  <p className="text-[10px] text-slate-accent dark:text-[#94A3B8]">Processing Fee</p>
                  <p className="text-sm font-medium text-navy dark:text-white">{bank.processingFee}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-accent dark:text-[#94A3B8]">
                <span>Max: {bank.maxTenure}yr &middot; {bank.maxAmount}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px] font-medium border-royal text-royal dark:border-[#60A5FA] dark:text-[#60A5FA] rounded-lg"
                  onClick={() => setView('emi-calculator')}
                >
                  Calculate EMI
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── EMI Comparison Section ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6 mb-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2 mb-1">
          <IndianRupee className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
          EMI Comparison
        </h2>
        <p className="text-sm text-slate-accent dark:text-[#94A3B8] mb-5">
          For ₹50 Lakh loan at {LOAN_TENURE} year tenure (at avg. rate)
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {emiComparisons.map((bank, i) => (
            <div
              key={bank.shortName}
              className={`rounded-xl border p-4 ${
                i === 0
                  ? 'bg-royal/5 dark:bg-[#60A5FA]/5 border-royal/20 dark:border-[#60A5FA]/20'
                  : 'bg-cream dark:bg-[#1D3461] border-border dark:border-[#1D3461]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-navy dark:text-white">{bank.shortName}</p>
                {i === 0 && (
                  <Badge className="bg-royal text-white text-[10px] dark:bg-[#60A5FA]">Best Rate</Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-royal dark:text-[#60A5FA] mb-1">
                {formatCurrencyFull(bank.emi)}
              </p>
              <p className="text-xs text-slate-accent dark:text-[#94A3B8]">Monthly EMI</p>
              <Separator className="my-3 bg-border dark:bg-[#1D3461]" />
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-accent dark:text-[#94A3B8]">Interest Rate</span>
                  <span className="text-navy dark:text-white font-medium">{bank.avgRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-accent dark:text-[#94A3B8]">Total Interest</span>
                  <span className="text-navy dark:text-white font-medium">
                    ₹{(bank.totalInterest / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-accent dark:text-[#94A3B8]">Total Payment</span>
                  <span className="text-navy dark:text-white font-medium">
                    ₹{(bank.totalPayment / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tips Section ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6">
        <h2 className="text-lg font-semibold text-navy dark:text-white flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
          Factors Affecting Your Home Loan Rate
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-royal text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
