'use client';

import { useState, useMemo } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Calculator,
  IndianRupee,
  Percent,
  Calendar,
  TrendingUp,
  Info,
  Home,
  PiggyBank,
  Banknote,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

function computeEMI(principal: number, annualRate: number, tenureYears: number) {
  const monthlyRate = annualRate / 12 / 100;
  const months = tenureYears * 12;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function computeAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureYears: number
): { month: number; principal: number; interest: number; balance: number }[] {
  const emi = computeEMI(principal, annualRate, tenureYears);
  const monthlyRate = annualRate / 12 / 100;
  const months = tenureYears * 12;
  const schedule: { month: number; principal: number; interest: number; balance: number }[] = [];
  let balance = principal;

  for (let m = 1; m <= months; m++) {
    const interestPart = balance * monthlyRate;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);
    schedule.push({
      month: m,
      principal: principalPart,
      interest: interestPart,
      balance,
    });
  }

  return schedule;
}

// ─── Input Field Sub-component ────────────────────────────────────────────────

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  min: number;
  max: number;
  step: number;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
}

function SliderField({
  label,
  icon,
  value,
  onChange,
  suffix,
  min,
  max,
  step,
  sliderMin,
  sliderMax,
  sliderStep,
}: FieldProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-navy flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="flex items-center gap-2">
        {suffix === '₹' && (
          <span className="text-sm text-slate-accent font-medium min-w-[20px]">₹</span>
        )}
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) {
              onChange(Math.min(max, Math.max(min, v)));
            }
          }}
          onBlur={() => {
            if (value < min) onChange(min);
            if (value > max) onChange(max);
          }}
          min={min}
          max={max}
          step={step}
          className="h-12 rounded-xl border-border focus:border-royal focus:ring-royal text-navy"
        />
        {suffix !== '₹' && (
          <span className="text-sm text-slate-accent font-medium min-w-[30px]">{suffix}</span>
        )}
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-accent">
        <span>{suffix === '₹' ? formatCompact(sliderMin) : `${sliderMin}${suffix}`}</span>
        <span>{suffix === '₹' ? formatCompact(sliderMax) : `${sliderMax}${suffix}`}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EMICalculator() {
  const { goBack } = useAcreFlowStore();

  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // Budget Calculator state
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000);
  const [existingEMIs, setExistingEMIs] = useState(0);
  const [downPayment, setDownPayment] = useState(1000000);
  const [budgetInterestRate, setBudgetInterestRate] = useState(8.5);
  const [budgetTenure, setBudgetTenure] = useState(20);

  // ─── EMI Calculations ─────────────────────────────────────────────────────

  const emiResults = useMemo(() => {
    const emi = computeEMI(loanAmount, interestRate, tenure);
    const totalPayment = emi * tenure * 12;
    const totalInterest = totalPayment - loanAmount;
    const principalPercent = (loanAmount / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    // Amortization schedule for yearly breakdowns
    const schedule = computeAmortizationSchedule(loanAmount, interestRate, tenure);
    const yearlyBreakdown = [1, 5, 10, tenure].map((year) => {
      const endMonth = year * 12;
      const relevantMonths = schedule.slice(0, endMonth);
      const cumPrincipal = relevantMonths.reduce((s, m) => s + m.principal, 0);
      const cumInterest = relevantMonths.reduce((s, m) => s + m.interest, 0);
      return { year, principal: cumPrincipal, interest: cumInterest };
    });

    return {
      emi,
      totalPayment,
      totalInterest,
      principalPercent,
      interestPercent,
      yearlyBreakdown,
    };
  }, [loanAmount, interestRate, tenure]);

  // ─── Budget Calculations ──────────────────────────────────────────────────

  const budgetResults = useMemo(() => {
    const availableForEMI = monthlyIncome - monthlyExpenses - existingEMIs;
    const maxEMI = availableForEMI * 0.4; // Don't exceed 40% of income for EMI

    if (maxEMI <= 0) {
      return {
        affordableProperty: downPayment,
        recommendedLoan: 0,
        monthlyEMI: 0,
        emiToIncomeRatio: 0,
        canAfford: false,
      };
    }

    // Calculate max loan from EMI
    const monthlyRate = budgetInterestRate / 12 / 100;
    const months = budgetTenure * 12;

    let maxLoan: number;
    if (monthlyRate === 0) {
      maxLoan = maxEMI * months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      maxLoan = (maxEMI * (factor - 1)) / (monthlyRate * factor);
    }

    // Also check if available income can support the full 40% ratio EMI
    const fullEMI = maxEMI;
    const affordableProperty = maxLoan + downPayment;

    // Use 40% ratio as the recommendation
    const ratio = budgetInterestRate / 12 / 100;
    const n = budgetTenure * 12;
    let recommendedLoan = maxLoan;

    if (ratio === 0) {
      recommendedLoan = fullEMI * n;
    } else {
      const f = Math.pow(1 + ratio, n);
      recommendedLoan = (fullEMI * (f - 1)) / (ratio * f);
    }

    const emiToIncomeRatio = fullEMI / monthlyIncome * 100;

    return {
      affordableProperty,
      recommendedLoan,
      monthlyEMI: fullEMI,
      emiToIncomeRatio,
      canAfford: affordableProperty > 0,
    };
  }, [monthlyIncome, monthlyExpenses, existingEMIs, downPayment, budgetInterestRate, budgetTenure]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="rounded-full hover:bg-cream"
        >
          <ArrowLeft className="h-5 w-5 text-navy" />
        </Button>
        <h1 className="text-xl font-bold text-navy flex items-center gap-2">
          <Calculator className="h-5 w-5 text-royal" />
          Calculators
        </h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="emi" className="w-full">
        <TabsList className="w-full bg-cream rounded-xl h-12 p-1">
          <TabsTrigger
            value="emi"
            className="flex-1 flex items-center gap-2 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-royal data-[state=active]:shadow-sm"
          >
            <IndianRupee className="h-4 w-4" />
            EMI Calculator
          </TabsTrigger>
          <TabsTrigger
            value="budget"
            className="flex-1 flex items-center gap-2 rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-royal data-[state=active]:shadow-sm"
          >
            <PiggyBank className="h-4 w-4" />
            Budget Calculator
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* EMI CALCULATOR TAB                                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="emi">
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Left Column – Input Form */}
            <div className="bg-white rounded-2xl border p-6 space-y-6">
              <h2 className="text-lg font-semibold text-navy flex items-center gap-2">
                <Banknote className="h-5 w-5 text-royal" />
                Loan Details
              </h2>

              <SliderField
                label="Loan Amount"
                icon={<IndianRupee className="h-4 w-4 text-royal" />}
                value={loanAmount}
                onChange={setLoanAmount}
                suffix="₹"
                min={100000}
                max={100000000}
                step={100000}
                sliderMin={0}
                sliderMax={50000000}
                sliderStep={100000}
              />

              <SliderField
                label="Interest Rate"
                icon={<Percent className="h-4 w-4 text-royal" />}
                value={interestRate}
                onChange={setInterestRate}
                suffix="%"
                min={1}
                max={30}
                step={0.1}
                sliderMin={1}
                sliderMax={30}
                sliderStep={0.1}
              />

              <SliderField
                label="Loan Tenure"
                icon={<Calendar className="h-4 w-4 text-royal" />}
                value={tenure}
                onChange={setTenure}
                suffix="Years"
                min={1}
                max={30}
                step={1}
                sliderMin={1}
                sliderMax={30}
                sliderStep={1}
              />
            </div>

            {/* Right Column – Results */}
            <div className="bg-navy text-white rounded-2xl p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-white/80 flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5" />
                EMI Breakdown
              </h2>

              {/* Monthly EMI */}
              <div className="text-center mb-6">
                <p className="text-sm text-white/60 mb-1">Monthly EMI</p>
                <p className="text-4xl font-bold text-white">
                  {formatCurrencyFull(emiResults.emi)}
                </p>
              </div>

              <Separator className="bg-white/10 mb-6" />

              {/* Breakdown bars */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-white/70">Principal Component</span>
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(loanAmount)} ({emiResults.principalPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-royal-light rounded-full transition-all duration-500"
                      style={{ width: `${emiResults.principalPercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-white/70">Interest Component</span>
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(emiResults.totalInterest)} ({emiResults.interestPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky rounded-full transition-all duration-500"
                      style={{ width: `${emiResults.interestPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Total Payment */}
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Total Payment</span>
                  <span className="text-lg font-bold text-white">
                    {formatCurrency(emiResults.totalPayment)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-white/50">
                    Principal ({formatCurrency(loanAmount)}) + Interest ({formatCurrency(emiResults.totalInterest)})
                  </span>
                </div>
              </div>

              {/* Amortization hint card */}
              <div className="bg-navy-light rounded-xl p-4 mt-auto">
                <h3 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-sky" />
                  Your EMI Breakdown
                </h3>
                <div className="space-y-2">
                  {emiResults.yearlyBreakdown.map((item) => (
                    <div key={item.year} className="flex items-center justify-between text-xs">
                      <span className="text-white/60">Year {item.year}</span>
                      <span className="text-white/80">
                        {formatCurrency(item.principal)} principal + {formatCurrency(item.interest)} interest
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BUDGET CALCULATOR TAB                                               */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="budget">
          <div className="mt-6">
            <Card className="bg-white rounded-2xl border p-6">
              <CardHeader className="p-0 pb-4 mb-4">
                <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-royal" />
                  Your Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <SliderField
                  label="Monthly Income"
                  icon={<Banknote className="h-4 w-4 text-royal" />}
                  value={monthlyIncome}
                  onChange={setMonthlyIncome}
                  suffix="₹"
                  min={10000}
                  max={10000000}
                  step={5000}
                  sliderMin={10000}
                  sliderMax={5000000}
                  sliderStep={5000}
                />

                <SliderField
                  label="Monthly Expenses"
                  icon={<Home className="h-4 w-4 text-royal" />}
                  value={monthlyExpenses}
                  onChange={setMonthlyExpenses}
                  suffix="₹"
                  min={0}
                  max={5000000}
                  step={5000}
                  sliderMin={0}
                  sliderMax={3000000}
                  sliderStep={5000}
                />

                <SliderField
                  label="Existing EMIs"
                  icon={<Calendar className="h-4 w-4 text-royal" />}
                  value={existingEMIs}
                  onChange={setExistingEMIs}
                  suffix="₹"
                  min={0}
                  max={5000000}
                  step={1000}
                  sliderMin={0}
                  sliderMax={1000000}
                  sliderStep={1000}
                />

                <SliderField
                  label="Down Payment Available"
                  icon={<IndianRupee className="h-4 w-4 text-royal" />}
                  value={downPayment}
                  onChange={setDownPayment}
                  suffix="₹"
                  min={0}
                  max={50000000}
                  step={50000}
                  sliderMin={0}
                  sliderMax={10000000}
                  sliderStep={50000}
                />

                <SliderField
                  label="Interest Rate"
                  icon={<Percent className="h-4 w-4 text-royal" />}
                  value={budgetInterestRate}
                  onChange={setBudgetInterestRate}
                  suffix="%"
                  min={1}
                  max={30}
                  step={0.1}
                  sliderMin={1}
                  sliderMax={30}
                  sliderStep={0.1}
                />

                <SliderField
                  label="Loan Tenure"
                  icon={<Calendar className="h-4 w-4 text-royal" />}
                  value={budgetTenure}
                  onChange={setBudgetTenure}
                  suffix="Years"
                  min={1}
                  max={30}
                  step={1}
                  sliderMin={1}
                  sliderMax={30}
                  sliderStep={1}
                />
              </CardContent>
            </Card>

            {/* Budget Results */}
            <div className="bg-cream rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-navy flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-royal" />
                Affordability Analysis
              </h3>

              {budgetResults.canAfford ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-accent mb-1">Affordable Property Value</p>
                    <p className="text-3xl font-bold text-royal">
                      {formatCurrencyFull(budgetResults.affordableProperty)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                      <p className="text-xs text-slate-accent mb-1">Recommended Loan Amount</p>
                      <p className="text-xl font-semibold text-navy">
                        {formatCurrency(budgetResults.recommendedLoan)}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                      <p className="text-xs text-slate-accent mb-1">Monthly EMI</p>
                      <p className="text-xl font-semibold text-navy">
                        {formatCurrencyFull(budgetResults.monthlyEMI)}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                      <p className="text-xs text-slate-accent mb-1">EMI to Income Ratio</p>
                      <p
                        className={`text-xl font-semibold ${
                          budgetResults.emiToIncomeRatio < 30
                            ? 'text-success'
                            : budgetResults.emiToIncomeRatio <= 40
                              ? 'text-warning'
                              : 'text-danger'
                        }`}
                      >
                        {budgetResults.emiToIncomeRatio.toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-accent mt-1">
                        {budgetResults.emiToIncomeRatio < 30
                          ? 'Healthy ratio'
                          : budgetResults.emiToIncomeRatio <= 40
                            ? 'Moderate – manage carefully'
                            : 'High – consider reducing'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-accent text-sm">
                    Your current expenses and existing EMIs leave insufficient room for a new home loan.
                  </p>
                  <p className="text-slate-accent text-sm mt-1">
                    Try reducing expenses or increasing income to see affordability.
                  </p>
                </div>
              )}

              {/* Tips Card */}
              <div className="bg-white rounded-xl border p-4 mt-4">
                <h4 className="text-sm font-semibold text-navy flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4 text-royal" />
                  Tips
                </h4>
                <ul className="space-y-2">
                  <li className="text-xs text-slate-accent flex items-start gap-2">
                    <span className="text-royal font-bold mt-0.5">•</span>
                    Keep EMI under 30% of monthly income for comfortable repayment
                  </li>
                  <li className="text-xs text-slate-accent flex items-start gap-2">
                    <span className="text-royal font-bold mt-0.5">•</span>
                    Consider saving 20-25% of property value as down payment
                  </li>
                  <li className="text-xs text-slate-accent flex items-start gap-2">
                    <span className="text-royal font-bold mt-0.5">•</span>
                    A longer tenure reduces EMI but increases total interest paid
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
