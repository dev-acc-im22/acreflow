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

export default function ServiceIcons() {
  const { setView } = useAcreFlowStore();

  const handleServiceClick = (label: string) => {
    setView('home');
  };

  return (
    <section className="py-12 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-2">
          Our Services
        </h2>
        <p className="text-slate-accent text-center mb-8">
          Everything you need for a seamless property experience
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.label}
                onClick={() => handleServiceClick(service.label)}
                className="bg-white rounded-xl border border-border p-5 flex flex-col items-center gap-3 text-center hover:shadow-md hover:border-royal/20 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-sky flex items-center justify-center text-royal">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-navy">
                  {service.label}
                </span>
                <span className="text-xs text-slate-accent leading-relaxed">
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
