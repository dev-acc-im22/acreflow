'use client';

import { FileText, Truck, Wrench, Scale, Home, Star } from 'lucide-react';
import { useAcreFlowStore } from '@/lib/store';

const services = [
  {
    icon: FileText,
    label: 'Rent Agreements',
    description: 'Legal documentation for hassle-free rentals',
  },
  {
    icon: Truck,
    label: 'Packers & Movers',
    description: 'Reliable shifting services at best rates',
  },
  {
    icon: Wrench,
    label: 'Home Maintenance',
    description: 'Expert repairs and maintenance solutions',
  },
  {
    icon: Scale,
    label: 'Legal Assistance',
    description: 'Property law experts at your service',
  },
  {
    icon: Home,
    label: 'Home Loans',
    description: 'Compare and get the best loan rates',
  },
  {
    icon: Star,
    label: 'Interior Design',
    description: 'Transform your space with expert designers',
  },
];

export interface ServiceDetail {
  description: string;
  price: string;
  features: string[];
}

export const serviceDetails: ServiceDetail[] = [
  {
    description:
      'Get legally binding rental agreements drafted by experts. Starting at ₹999. Includes stamp duty registration, e-stamping, and doorstep delivery.',
    price: '₹999',
    features: [
      'Stamp duty registration included',
      'E-stamping & digital delivery',
      'Doorstep document delivery',
      'Expert legal review',
    ],
  },
  {
    description:
      'Reliable and verified moving services. Starting at ₹4,999. Includes packing, loading, transportation, and unpacking. Insurance available.',
    price: '₹4,999',
    features: [
      'Professional packing & loading',
      'Door-to-door transportation',
      'Unpacking & rearrangement',
      'Transit insurance available',
    ],
  },
  {
    description:
      'Expert technicians for all home repair needs. Starting at ₹299/visit. Plumbing, electrical, painting, cleaning, and more.',
    price: '₹299/visit',
    features: [
      'Plumbing & electrical repairs',
      'Painting & deep cleaning',
      'Same-day service available',
      'Background-verified technicians',
    ],
  },
  {
    description:
      'Property law experts for documentation and disputes. Starting at ₹2,999. Title verification, agreement drafting, and RERA consultation.',
    price: '₹2,999',
    features: [
      'Property title verification',
      'Agreement drafting & review',
      'RERA consultation & filing',
      'Dispute resolution support',
    ],
  },
  {
    description:
      'Compare and apply for the best home loan rates. We partner with 15+ banks. Get instant approval in 48 hours with zero processing fee.',
    price: 'Zero Processing Fee',
    features: [
      '15+ bank partners compared',
      'Instant approval in 48 hours',
      'Lowest interest rates guaranteed',
      'Dedicated loan advisor support',
    ],
  },
  {
    description:
      'Transform your space with expert designers. Starting at ₹49,999. 3D visualization, modular kitchen, complete home interiors.',
    price: '₹49,999',
    features: [
      '3D visualization & walkthrough',
      'Modular kitchen solutions',
      'Complete home interiors',
      '90-day delivery guarantee',
    ],
  },
];

export default function ServiceIcons() {
  const { setView } = useAcreFlowStore();

  return (
    <section className="py-8 sm:py-12 bg-cream dark:bg-[#0A192F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy dark:text-white text-center mb-2">
          Our Services
        </h2>
        <p className="text-sm sm:text-base text-slate-accent dark:text-[#94A3B8] text-center mb-6 sm:mb-8">
          Everything you need for a seamless property experience
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.label}
                onClick={() => setView('services')}
                className="bg-white dark:bg-[#112240] rounded-xl border border-border dark:border-[#1D3461] p-4 sm:p-5 flex flex-col items-center gap-2 sm:gap-3 text-center hover:shadow-md hover:border-royal/20 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sky dark:bg-[#1D3461] flex items-center justify-center text-royal dark:text-[#60A5FA]">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-navy dark:text-white">
                  {service.label}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-accent dark:text-[#94A3B8] leading-relaxed hidden sm:block">
                  {service.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
