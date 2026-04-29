'use client';

import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Truck,
  FileText,
  Landmark,
  Paintbrush,
  Scale,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const services = [
  {
    icon: Truck,
    title: 'Packers & Movers',
    price: 'Starting from ₹2,999',
    description:
      'Reliable and verified shifting services for a hassle-free move. Professional packing, loading, transportation, and unpacking.',
    color: 'from-blue-500 to-blue-600',
    features: [
      'Verified Partners',
      'Doorstep Pickup',
      'Insurance Coverage',
      'Real-time Tracking',
    ],
  },
  {
    icon: FileText,
    title: 'Rental Agreement',
    price: 'Starting from ₹599',
    description:
      'Get legally binding rental agreements drafted by experts. Includes e-stamp duty and doorstep delivery.',
    color: 'from-indigo-500 to-indigo-600',
    features: [
      'Legal Drafting',
      'E-Stamp Duty',
      'Doorstep Delivery',
      'Registered Agreement',
    ],
  },
  {
    icon: Landmark,
    title: 'Home Loans',
    price: 'From 8.5% Interest',
    description:
      'Compare and apply for the best home loan rates from 20+ partner banks with instant approval.',
    color: 'from-emerald-500 to-emerald-600',
    features: [
      '20+ Banks',
      'Instant Approval',
      'Doorstep Service',
      'Balance Transfer',
    ],
  },
  {
    icon: Paintbrush,
    title: 'Interior Design',
    price: 'Starting from ₹3 Lakh',
    description:
      'Transform your space with expert designers. End-to-end interior solutions with modular kitchen and wardrobe.',
    color: 'from-amber-500 to-amber-600',
    features: [
      'End-to-End Design',
      'Modular Kitchen',
      'Wardrobe Solutions',
      '10-Year Warranty',
    ],
  },
  {
    icon: Scale,
    title: 'Legal Assistance',
    price: 'Starting from ₹999',
    description:
      'Property law experts for documentation, title verification, and registration support.',
    color: 'from-red-500 to-red-600',
    features: [
      'Document Verification',
      'Property Due Diligence',
      'Sale Agreement',
      'Registration Support',
    ],
  },
  {
    icon: Wrench,
    title: 'Home Maintenance',
    price: 'Starting from ₹499',
    description:
      'Expert technicians for all home repair needs. Plumbing, electrical, painting, deep cleaning, and more.',
    color: 'from-violet-500 to-violet-600',
    features: [
      'Deep Cleaning',
      'Painting',
      'Plumbing',
      'Electrical Repair',
    ],
  },
];

export default function ServicesPage() {
  const { goBack, setView } = useAcreFlowStore();

  const handleGetStarted = (serviceName: string) => {
    toast.success(`We'll connect you with our ${serviceName} team shortly!`);
  };

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

      {/* Hero Banner */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-sky dark:bg-[#1D3461]/50 px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-royal dark:bg-[#60A5FA]" />
            <span className="text-sm font-medium text-royal dark:text-[#60A5FA]">
              Value-Added Services
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy dark:text-white mb-3">
            Our Services
          </h1>
          <p className="text-slate-accent dark:text-[#94A3B8] text-base md:text-lg max-w-2xl mx-auto">
            Everything you need for your property journey — from packing to painting, loans to legal
            assistance.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-white dark:bg-[#112240] rounded-2xl border border-border dark:border-[#1D3461] p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-1">
                    {service.title}
                  </h3>

                  {/* Price Badge */}
                  <div className="inline-block bg-sky/70 dark:bg-[#1D3461]/50 px-3 py-1 rounded-full mb-3">
                    <span className="text-sm font-semibold text-royal dark:text-[#60A5FA]">
                      {service.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2.5 text-sm text-slate-accent dark:text-[#94A3B8]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className="w-full bg-royal hover:bg-royal-dark text-white h-11 rounded-xl font-semibold transition-colors"
                    onClick={() => handleGetStarted(service.title)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Service CTA */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-navy to-royal rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 relative z-10">
              Need a Custom Service?
            </h3>
            <p className="text-white/70 text-sm md:text-base mb-6 max-w-xl mx-auto relative z-10">
              Can&apos;t find what you&apos;re looking for? Our team can help with any property-related service.
              Get in touch with us for a personalized solution.
            </p>
            <Button
              className="bg-white text-navy hover:bg-white/90 h-11 rounded-xl font-semibold px-8 relative z-10 transition-colors"
              onClick={() => setView('corporate')}
            >
              Contact Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
