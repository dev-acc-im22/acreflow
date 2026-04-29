'use client';

import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';

export default function WhatsAppButton() {
  const { currentView } = useAcreFlowStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(false);

  // Pulse animation via state cycling - hook before early return
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Only show on non-home views
  if (currentView === 'home') return null;

  const handleWhatsAppClick = () => {
    window.open(
      'https://wa.me/9118001234567?text=Hi! I\'m interested in AcreFlow properties.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed bottom-36 right-4 md:right-6 z-40 flex items-center gap-2">
      {/* Tooltip */}
      {showTooltip && (
        <div className="hidden md:block bg-navy dark:bg-[#112240] text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in-up">
          Chat on WhatsApp
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-navy dark:border-l-[#112240] border-y-4 border-y-transparent" />
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-[50px] h-[50px] rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <span
          className={`absolute inset-0 rounded-full bg-green-500 transition-opacity duration-[2000ms] ${
            pulsePhase ? 'opacity-40 scale-150' : 'opacity-0 scale-100'
          }`}
          style={{ pointerEvents: 'none' }}
        />

        <Phone className="w-5 h-5 relative z-10" />
      </button>
    </div>
  );
}
