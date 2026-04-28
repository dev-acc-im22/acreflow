'use client';

import { useState } from 'react';
import { FileText, Truck, Wrench, Scale, Home, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

interface ServiceDetail {
  description: string;
  price: string;
  features: string[];
}

const serviceDetails: ServiceDetail[] = [
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
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const handleServiceClick = (index: number) => {
    setSelectedService(index);
  };

  const activeService = selectedService !== null ? services[selectedService] : null;
  const activeDetail = selectedService !== null ? serviceDetails[selectedService] : null;

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
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <button
                key={service.label}
                onClick={() => handleServiceClick(index)}
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

        {/* Service Detail Dialog */}
        <Dialog
          open={selectedService !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedService(null);
          }}
        >
          {activeService && activeDetail && (
            <DialogContent className="max-w-lg mx-auto p-0 gap-0 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-royal to-sky" />

              <div className="p-6">
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 bg-sky rounded-xl flex items-center justify-center shrink-0">
                      {(() => {
                        const Icon = activeService.icon;
                        return <Icon className="w-7 h-7 text-royal" />;
                      })()}
                    </div>
                    <div>
                      <DialogTitle className="text-lg font-bold text-navy">
                        {activeService.label}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-slate-accent mt-0.5">
                        Professional service by AcreFlow partners
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {/* Description */}
                <p className="text-sm text-slate-accent leading-relaxed mt-4 mb-5">
                  {activeDetail.description}
                </p>

                {/* Features list */}
                <div className="bg-cream/60 rounded-xl p-4 mb-5">
                  <h4 className="text-sm font-semibold text-navy mb-3">What&apos;s included:</h4>
                  <ul className="space-y-2.5">
                    {activeDetail.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-accent">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="bg-sky/50 rounded-xl p-4 mb-6 text-center">
                  <p className="text-xs text-slate-accent mb-1">Starting at</p>
                  <p className="text-lg font-bold text-royal">{activeDetail.price}</p>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-royal hover:bg-royal-dark text-white h-11 rounded-xl font-semibold">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-11 rounded-xl font-semibold border-royal/30 text-navy hover:bg-sky"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
}
