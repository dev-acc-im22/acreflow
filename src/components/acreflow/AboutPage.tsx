'use client';

import { useState, useEffect, useRef } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Target,
  Eye,
  Users,
  Building2,
  MapPin,
  IndianRupee,
  Heart,
  Lightbulb,
  Shield,
  Handshake,
  Linkedin,
  Twitter,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// ── Data ─────────────────────────────────────────────────────────────────

const teamMembers = [
  {
    name: 'Arjun Mehta',
    role: 'CEO & Co-Founder',
    initials: 'AM',
    gradient: 'from-blue-500 to-blue-700',
    bio: 'Former VP at PropTiger with 15+ years in real estate tech. IIT Bombay alumnus passionate about eliminating brokerage.',
  },
  {
    name: 'Sneha Iyer',
    role: 'CTO & Co-Founder',
    initials: 'SI',
    gradient: 'from-emerald-500 to-emerald-700',
    bio: 'Ex-Google engineer with expertise in AI/ML. Built scalable platforms at Flipkart and Swiggy before founding AcreFlow.',
  },
  {
    name: 'Rahul Kapoor',
    role: 'COO',
    initials: 'RK',
    gradient: 'from-amber-500 to-amber-700',
    bio: 'Operations veteran from Oyo Rooms. Expertise in scaling operations across 50+ cities with a focus on customer experience.',
  },
  {
    name: 'Priya Desai',
    role: 'VP of Growth',
    initials: 'PD',
    gradient: 'from-purple-500 to-purple-700',
    bio: 'Growth hacker from CRED. Specializes in user acquisition and retention strategies in the proptech space.',
  },
];

const values = [
  {
    icon: Lightbulb,
    title: 'Transparency',
    description:
      'Every listing, every price, every detail — we believe in complete transparency. No hidden charges, no misleading information.',
  },
  {
    icon: Shield,
    title: 'Trust',
    description:
      'Verified listings, verified owners, verified documents. We go the extra mile to ensure every transaction is trustworthy.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'From AI-powered property matching to virtual tours, we leverage cutting-edge technology to make property search effortless.',
  },
  {
    icon: Handshake,
    title: 'Customer First',
    description:
      'Our customers are at the heart of everything we do. 24/7 support, dedicated relationship managers, and a user-first approach.',
  },
];

const timeline = [
  {
    year: '2019',
    title: 'The Beginning',
    description: 'AcreFlow was founded in Chennai with a mission to eliminate brokerage from real estate transactions.',
  },
  {
    year: '2020',
    title: 'First 1,000 Listings',
    description: 'Reached our first milestone of 1,000 verified property listings across Chennai and Bangalore.',
  },
  {
    year: '2021',
    title: 'Expansion to 10 Cities',
    description: 'Expanded to Mumbai, Delhi, Hyderabad, and 6 more cities. Launched our rental agreement service.',
  },
  {
    year: '2022',
    title: '1 Lakh Users',
    description: 'Crossed 100,000 registered users and ₹10 Cr in brokerage savings for our customers.',
  },
  {
    year: '2023',
    title: 'Series B Funding',
    description: 'Raised Series B funding of $25M. Launched home loans, interior design, and legal assistance services.',
  },
  {
    year: '2024',
    title: 'Pan-India Presence',
    description: 'Now operational in 50+ cities with 10,000+ listings. Launched AI-powered property matching.',
  },
];

const statsData = [
  { label: 'Properties Listed', value: 10000, suffix: '+', icon: Building2 },
  { label: 'Cities', value: 50, suffix: '+', icon: MapPin },
  { label: 'Happy Users', value: 100000, suffix: '+', icon: Users },
  { label: 'Saved in Brokerage', value: 50, suffix: ' Cr+', prefix: '₹', icon: IndianRupee },
];

// ── Animated Stat Counter Component ──────────────────────────────────────

function StatCounter({
  target,
  suffix,
  prefix,
  icon: Icon,
  label,
}: {
  target: number;
  suffix: string;
  prefix?: string;
  icon: typeof Building2;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let startTime: number;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-3xl md:text-4xl font-bold text-white mb-1">
        {prefix || ''}
        {count.toLocaleString('en-IN')}
        {suffix}
      </p>
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { goBack } = useAcreFlowStore();

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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-3">
            India&apos;s Largest{' '}
            <span className="text-royal dark:text-[#60A5FA]">No-Brokerage</span>
            <br className="hidden md:block" /> Property Platform
          </h1>
          <p className="text-slate-accent dark:text-[#94A3B8] text-base md:text-lg max-w-3xl mx-auto">
            Born in 2019 with a simple idea — make property transactions fair and transparent. Today,
            we serve millions of users across India with zero brokerage, verified listings, and
            end-to-end property services.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461] rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 rounded-xl bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-royal dark:text-[#60A5FA]" />
                </div>
                <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Our Mission</h3>
                <p className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed">
                  To democratize real estate in India by eliminating brokerage and making property
                  transactions transparent, efficient, and accessible to everyone. We aim to save
                  homebuyers and renters crores in unnecessary fees while providing the best
                  property search experience in the country.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461] rounded-2xl hover:shadow-lg transition-shadow">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 rounded-xl bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-royal dark:text-[#60A5FA]" />
                </div>
                <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Our Vision</h3>
                <p className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed">
                  To become the most trusted property platform in India — one where every listing is
                  verified, every transaction is transparent, and every customer feels confident in
                  their property decision. We envision a future where finding a home is as simple as
                  a swipe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-navy to-royal relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat) => (
              <StatCounter
                key={stat.label}
                target={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                icon={stat.icon}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center mb-2">
            Meet Our Leadership
          </h2>
          <p className="text-slate-accent dark:text-[#94A3B8] text-center mb-10">
            The team behind India&apos;s no-brokerage revolution
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="bg-white dark:bg-[#112240] border-border dark:border-[#1D3461] rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <CardContent className="p-6">
                  {/* Avatar */}
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <span className="text-xl font-bold text-white">{member.initials}</span>
                  </div>

                  <h3 className="text-base font-bold text-navy dark:text-white">{member.name}</h3>
                  <p className="text-sm text-royal dark:text-[#60A5FA] font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-accent dark:text-[#94A3B8] leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Social links */}
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      className="w-8 h-8 rounded-full bg-cream dark:bg-[#1D3461] flex items-center justify-center text-slate-accent dark:text-[#94A3B8] hover:text-royal dark:hover:text-[#60A5FA] hover:bg-sky dark:hover:bg-[#60A5FA]/10 transition-colors cursor-pointer"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="w-8 h-8 rounded-full bg-cream dark:bg-[#1D3461] flex items-center justify-center text-slate-accent dark:text-[#94A3B8] hover:text-royal dark:hover:text-[#60A5FA] hover:bg-sky dark:hover:bg-[#60A5FA]/10 transition-colors cursor-pointer"
                      aria-label={`${member.name} Twitter`}
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 md:py-12 bg-cream dark:bg-[#112240]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center mb-2">
            Our Values
          </h2>
          <p className="text-slate-accent dark:text-[#94A3B8] text-center mb-10">
            The principles that guide everything we do
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="bg-white dark:bg-[#0A192F] border-border dark:border-[#1D3461] rounded-2xl hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-sky dark:bg-[#1D3461] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-royal dark:text-[#60A5FA]" />
                    </div>
                    <h3 className="text-base font-bold text-navy dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center mb-2">
            Our Journey
          </h2>
          <p className="text-slate-accent dark:text-[#94A3B8] text-center mb-10">
            From a small startup to India&apos;s leading no-brokerage platform
          </p>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-royal/20 dark:bg-[#60A5FA]/20 md:-translate-x-px" />

            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={item.year} className="relative flex items-start gap-6">
                  {/* Left side (even items) or empty (odd on mobile) */}
                  <div
                    className={`hidden md:block md:w-1/2 ${
                      idx % 2 === 0 ? 'text-right pr-8' : 'order-2 pl-8'
                    }`}
                  >
                    <div className="inline-flex items-center gap-2 bg-sky dark:bg-[#1D3461]/50 px-3 py-1 rounded-full mb-2">
                      <span className="text-sm font-bold text-royal dark:text-[#60A5FA]">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-navy dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-royal dark:bg-[#60A5FA] flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Right side (odd items on desktop, always on mobile) */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      idx % 2 === 0 ? 'md:order-2 md:pl-8' : 'md:pr-8'
                    }`}
                  >
                    {/* Mobile-only year badge */}
                    <div className="md:hidden inline-flex items-center gap-2 bg-sky dark:bg-[#1D3461]/50 px-3 py-1 rounded-full mb-2">
                      <span className="text-sm font-bold text-royal dark:text-[#60A5FA]">
                        {item.year}
                      </span>
                    </div>
                    {/* Desktop odd items content */}
                    {idx % 2 !== 0 && (
                      <>
                        <h3 className="text-base font-bold text-navy dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed mt-1">
                          {item.description}
                        </p>
                      </>
                    )}
                    {/* Mobile even items content */}
                    {idx % 2 === 0 && (
                      <>
                        <h3 className="text-base font-bold text-navy dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed mt-1">
                          {item.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-8 md:py-12 bg-cream dark:bg-[#112240]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-navy to-royal rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Join Our Team</h3>
              <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto mb-6">
                We&apos;re always looking for passionate people who want to revolutionize real estate
                in India. Explore open positions and be part of the no-brokerage movement.
              </p>
              <Button
                className="bg-white text-navy hover:bg-white/90 h-11 rounded-xl font-semibold px-8 transition-colors"
                onClick={() => toast.info('Careers page coming soon!')}
              >
                View Open Positions
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
