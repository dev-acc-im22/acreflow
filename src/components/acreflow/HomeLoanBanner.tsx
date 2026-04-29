'use client';

import { useAcreFlowStore } from '@/lib/store';
import { Home, ArrowRight, Percent, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomeLoanBanner() {
  const { setView } = useAcreFlowStore();

  return (
    <section className="py-12 md:py-16 bg-sky-light dark:bg-[#0A192F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white dark:bg-[#112240] rounded-2xl border border-sky/30 dark:border-[#1D3461] p-6 md:p-10 overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky/20 to-transparent dark:from-[#1D3461]/30 dark:to-transparent rounded-bl-full pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Left side */}
            <div className="flex-1 flex items-start gap-4 md:gap-5">
              <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-royal/10 dark:bg-[#1D3461] flex items-center justify-center">
                <Home className="w-7 h-7 md:w-8 md:h-8 text-royal dark:text-[#60A5FA]" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy dark:text-white leading-tight">
                  Get Home Loan at{' '}
                  <span className="text-royal dark:text-[#60A5FA]">
                    Lowest Interest Rates
                  </span>
                </h2>
                <p className="text-sm md:text-base text-slate-accent dark:text-[#94A3B8] mt-2 max-w-lg leading-relaxed">
                  Compare rates from 20+ banks. Get instant approval with doorstep service.
                </p>

                {/* Features row */}
                <div className="flex flex-wrap items-center gap-4 mt-4 justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 text-xs text-slate-accent dark:text-[#94A3B8]">
                    <Shield className="w-3.5 h-3.5 text-royal dark:text-[#60A5FA]" />
                    <span>20+ Banks</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-accent dark:text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5 text-royal dark:text-[#60A5FA]" />
                    <span>Instant Approval</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-accent dark:text-[#94A3B8]">
                    <Home className="w-3.5 h-3.5 text-royal dark:text-[#60A5FA]" />
                    <span>Doorstep Service</span>
                  </div>
                </div>

                {/* Rate badge */}
                <div className="mt-4 flex justify-center md:justify-start">
                  <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 gap-1.5 px-3 py-1 text-sm font-semibold">
                    <Percent className="w-3.5 h-3.5" />
                    Starting from 8.5% interest rate
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right side - CTA */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
              <Button
                size="lg"
                onClick={() => setView('emi-calculator')}
                className="bg-royal dark:bg-[#1E40AF] hover:bg-blue-800 dark:hover:bg-[#1D3461] text-white font-semibold px-8 py-6 rounded-xl shadow-lg w-full md:w-auto"
              >
                Check Eligibility
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
