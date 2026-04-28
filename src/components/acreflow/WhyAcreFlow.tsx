'use client';

import { Shield, CheckCircle2, TrendingUp, Award, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: CheckCircle2,
    title: 'Zero Brokerage',
    description:
      'Save lakhs on brokerage fees. We connect you directly with property owners.',
  },
  {
    icon: Shield,
    title: 'Verified Listings',
    description:
      'Every listing undergoes rigorous verification including GPS-tagged photos and RERA checks.',
  },
  {
    icon: Users,
    title: 'Direct Owner Connect',
    description:
      'No middlemen. Communicate directly with property owners and builders.',
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description:
      'Make informed decisions with AI-powered price trends and locality insights.',
  },
  {
    icon: Award,
    title: 'Secure Transactions',
    description:
      'End-to-end legal assistance and secure transaction documentation.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description:
      'Round-the-clock customer support to assist you at every step.',
  },
];

export default function WhyAcreFlow() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-2">
          Why Choose AcreFlow?
        </h2>
        <p className="text-slate-accent text-center mb-4 text-sm md:text-base">
          Experience real estate the way it should be — transparent, efficient, and completely broker-free.
        </p>

        {/* Intro paragraph */}
        <p className="max-w-2xl mx-auto text-center text-slate-accent mb-10 text-sm leading-relaxed">
          At AcreFlow, we believe finding your dream property should be simple and stress-free. That&apos;s why we&apos;ve built a platform that puts you first — no hidden fees, no middlemen, just direct connections between buyers and sellers.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-royal/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-sky flex items-center justify-center text-royal mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-accent leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
