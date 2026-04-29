'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CityStory {
  name: string;
  gradient: string;
  initials: string;
  properties: string;
  localities: string;
  darkGradient: string;
}

const cities: CityStory[] = [
  { name: 'Mumbai', gradient: 'from-blue-600 to-cyan-400', initials: 'MU', properties: '3,200+', localities: '180+', darkGradient: 'from-blue-800 to-cyan-600' },
  { name: 'Bangalore', gradient: 'from-emerald-500 to-teal-400', initials: 'BA', properties: '2,800+', localities: '150+', darkGradient: 'from-emerald-700 to-teal-600' },
  { name: 'Delhi', gradient: 'from-amber-500 to-orange-400', initials: 'DE', properties: '2,500+', localities: '120+', darkGradient: 'from-amber-700 to-orange-600' },
  { name: 'Chennai', gradient: 'from-navy to-royal', initials: 'CH', properties: '2,100+', localities: '95+', darkGradient: 'from-[#112240] to-[#2563EB]' },
  { name: 'Hyderabad', gradient: 'from-violet-600 to-purple-400', initials: 'HY', properties: '1,800+', localities: '85+', darkGradient: 'from-violet-800 to-purple-600' },
  { name: 'Pune', gradient: 'from-rose-500 to-pink-400', initials: 'PU', properties: '1,600+', localities: '75+', darkGradient: 'from-rose-700 to-pink-600' },
  { name: 'Kolkata', gradient: 'from-indigo-500 to-blue-400', initials: 'KO', properties: '1,200+', localities: '65+', darkGradient: 'from-indigo-700 to-blue-600' },
  { name: 'Jaipur', gradient: 'from-orange-500 to-amber-400', initials: 'JA', properties: '900+', localities: '50+', darkGradient: 'from-orange-700 to-amber-600' },
];

const STORY_DURATION = 3000;

export default function StoriesCarousel() {
  const { setSelectedCity, setView } = useAcreFlowStore();
  const [activeStory, setActiveStory] = useState<CityStory | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const closeStory = useCallback(() => {
    setActiveStory(null);
    setProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const openStory = useCallback((city: CityStory) => {
    setActiveStory(city);
    setProgress(0);
  }, []);

  // Auto-dismiss with progress bar
  useEffect(() => {
    if (!activeStory) return;

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        closeStory();
      }
    }, 30);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeStory, closeStory]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeStory) {
        closeStory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStory, closeStory]);

  const handleExploreCity = (cityName: string) => {
    setSelectedCity(cityName);
    setView('search');
    closeStory();
  };

  return (
    <>
      <section className="py-12 md:py-16 bg-white dark:bg-[#0A192F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
              Explore by City
            </h2>
            <p className="text-sm text-slate-accent dark:text-[#94A3B8] mt-1">
              Tap a city to discover trending properties
            </p>
          </div>

          {/* Scrollable stories */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => openStory(city)}
                className="flex flex-col items-center gap-2 flex-shrink-0 snap-start cursor-pointer group"
              >
                {/* Story circle with gradient ring */}
                <div className="relative w-[72px] h-[72px] md:w-[80px] md:h-[80px]">
                  {/* Gradient ring (Instagram-style) */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-royal via-blue-500 to-sky p-[3px] group-hover:p-[3.5px] transition-all">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#112240] p-[2px]">
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${city.gradient} dark:${city.darkGradient} flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg md:text-xl">
                          {city.initials}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* City name */}
                <span className="text-xs font-medium text-slate-accent dark:text-[#94A3B8] group-hover:text-navy dark:group-hover:text-white transition-colors whitespace-nowrap">
                  {city.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Story modal overlay */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70"
              onClick={closeStory}
            />

            {/* Story content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-[90vw] max-w-md h-[70vh] max-h-[600px] rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activeStory.gradient} dark:${activeStory.darkGradient}`} />

              {/* Subtle building pattern overlay */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="story-pattern" x="0" y="0" width="50" height="70" patternUnits="userSpaceOnUse">
                      <rect x="5" y="10" width="15" height="60" rx="1" fill="white" />
                      <rect x="25" y="20" width="12" height="50" rx="1" fill="white" />
                      <rect x="40" y="35" width="8" height="35" rx="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#story-pattern)" />
                </svg>
              </div>

              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 z-10 px-3 pt-3">
                <div className="h-[3px] bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={closeStory}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-5">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {activeStory.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-6 flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Discover your dream property
                  </p>

                  {/* Quick stats */}
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{activeStory.properties}</p>
                      <p className="text-xs text-white/70">Properties</p>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{activeStory.localities}</p>
                      <p className="text-xs text-white/70">Localities</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleExploreCity(activeStory.name)}
                    className="bg-white text-navy hover:bg-white/90 font-semibold px-6 py-5 rounded-xl shadow-lg w-full max-w-xs"
                  >
                    Explore Properties in {activeStory.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
