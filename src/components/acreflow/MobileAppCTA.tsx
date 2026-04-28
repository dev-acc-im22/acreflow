'use client';

import {
  Smartphone,
  QrCode,
  ArrowRight,
  Download,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MobileAppCTA() {
  return (
    <section className="py-16 bg-navy hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Side */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Find Properties On The Go
            </h2>
            <p className="text-base text-white/70 mt-3 max-w-md mx-auto md:mx-0">
              Download the AcreFlow app and get instant notifications for new
              listings, price drops, and exclusive deals.
            </p>

            {/* App Store Buttons */}
            <div className="mt-6 flex gap-4 justify-center md:justify-start">
              {/* Google Play Button */}
              <button className="bg-white dark:bg-[#112240] rounded-xl px-5 py-3 flex items-center gap-3 hover:bg-white/90 dark:hover:bg-[#1D3461] transition-colors">
                <div className="flex flex-col leading-tight">
                  <span className="text-xs text-slate-accent dark:text-[#94A3B8]">Get it on</span>
                  <span className="text-sm font-semibold text-navy dark:text-white">
                    Google Play
                  </span>
                </div>
                <Download className="w-6 h-6 text-navy dark:text-white" />
              </button>

              {/* App Store Button */}
              <button className="bg-white dark:bg-[#112240] rounded-xl px-5 py-3 flex items-center gap-3 hover:bg-white/90 dark:hover:bg-[#1D3461] transition-colors">
                <div className="flex flex-col leading-tight">
                  <span className="text-xs text-slate-accent dark:text-[#94A3B8]">Download on the</span>
                  <span className="text-sm font-semibold text-navy dark:text-white">
                    App Store
                  </span>
                </div>
                <Smartphone className="w-6 h-6 text-navy dark:text-white" />
              </button>
            </div>
          </div>

          {/* Right Side - Phone Mockup */}
          <div className="w-64 h-96 md:w-72 md:h-[420px] relative shrink-0">
            <div className="w-full h-full bg-white/10 dark:bg-white/5 rounded-[2rem] border border-white/20 dark:border-white/10 p-3">
              <div className="w-full h-full bg-sky dark:bg-[#1D3461] rounded-[1.5rem] flex flex-col items-center justify-center gap-4">
                <Building2 className="text-5xl text-royal dark:text-[#60A5FA]" />
                <span className="text-xl font-bold text-navy dark:text-white">AcreFlow</span>
                <QrCode className="text-3xl text-royal dark:text-[#60A5FA]" />
                <span className="text-xs text-slate-accent dark:text-[#94A3B8]">Scan to Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
