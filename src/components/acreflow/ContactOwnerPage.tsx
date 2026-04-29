'use client';

import { useState } from 'react';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  MapPin,
  Building2,
  User,
  Phone,
  MessageSquare,
  CalendarCheck,
  PhoneCall,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export default function ContactOwnerPage() {
  const { selectedProperty, goBack, setView } = useAcreFlowStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill message when property changes
  useState(() => {
    if (selectedProperty) {
      setMessage(`Hi, I'm interested in ${selectedProperty.title}. I would like to know more details about this property. Please contact me at your earliest convenience.`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your inquiry has been sent! Opening call...');

      if (selectedProperty?.ownerPhone) {
        window.open('tel:' + selectedProperty.ownerPhone, '_self');
      } else {
        toast.success('Owner details will be shared shortly via SMS/Email');
      }
    }, 800);
  };

  if (!selectedProperty) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A192F] flex flex-col">
        <div className="sticky top-0 z-30 bg-white dark:bg-[#112240] border-b dark:border-[#1D3461] shadow-sm">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-slate-accent dark:text-[#94A3B8] hover:text-navy dark:hover:text-white"
              onClick={goBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-base sm:text-lg font-bold text-navy dark:text-white">
              Contact Owner
            </h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="text-center py-16">
            <Home className="w-12 h-12 text-slate-300 dark:text-[#334155] mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-navy dark:text-white mb-2">
              No property selected
            </h2>
            <p className="text-sm sm:text-base text-slate-accent dark:text-[#94A3B8]">
              Please select a property to contact the owner.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A192F] flex flex-col">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-[#112240] border-b dark:border-[#1D3461] shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-slate-accent dark:text-[#94A3B8] hover:text-navy dark:hover:text-white"
            onClick={goBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-navy dark:text-white truncate">
              Contact Owner
            </h1>
            <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8] truncate">
              {selectedProperty.ownerName}
            </p>
          </div>
          <PhoneCall className="w-5 h-5 text-royal dark:text-[#60A5FA] shrink-0" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
          {/* Property Summary Card */}
          <Card className="rounded-xl border border-border dark:border-[#1D3461] bg-cream/50 dark:bg-[#112240] p-4 sm:p-5">
            <div className="flex gap-3 sm:gap-4">
              {selectedProperty.images[0] ? (
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-sky dark:bg-[#1D3461] flex items-center justify-center shrink-0">
                  <Building2 className="w-8 h-8 text-royal dark:text-[#60A5FA]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-navy dark:text-white line-clamp-2">
                  {selectedProperty.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8] flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">{selectedProperty.locality}, {selectedProperty.city}</span>
                </p>
                <p className="text-base sm:text-lg font-bold text-royal dark:text-[#60A5FA] mt-2">
                  {formatPrice(selectedProperty.price)}
                  {selectedProperty.category === 'rent' && (
                    <span className="text-xs sm:text-sm font-normal text-slate-accent dark:text-[#94A3B8]">/month</span>
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-navy dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-royal dark:text-[#60A5FA]" />
                Your Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-cream/50 dark:bg-[#1D3461]/50 border-border dark:border-[#1D3461] focus:border-royal dark:focus:border-[#60A5FA] text-sm sm:text-base h-11 sm:h-12 rounded-xl"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-navy dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-royal dark:text-[#60A5FA]" />
                Phone Number
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                type="tel"
                className="bg-cream/50 dark:bg-[#1D3461]/50 border-border dark:border-[#1D3461] focus:border-royal dark:focus:border-[#60A5FA] text-sm sm:text-base h-11 sm:h-12 rounded-xl"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium text-navy dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-royal dark:text-[#60A5FA]" />
                Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message to the owner..."
                rows={5}
                className="bg-cream/50 dark:bg-[#1D3461]/50 border-border dark:border-[#1D3461] focus:border-royal dark:focus:border-[#60A5FA] text-sm sm:text-base rounded-xl resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 sm:h-14 bg-royal hover:bg-royal-dark text-white rounded-xl text-sm sm:text-base font-semibold cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {isSubmitting ? 'Sending...' : 'Get Owner Details'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-border dark:bg-[#1D3461]" />
            <span className="text-xs sm:text-sm text-slate-accent dark:text-[#94A3B8]">or</span>
            <div className="flex-1 h-px bg-border dark:bg-[#1D3461]" />
          </div>

          {/* Schedule Visit Button */}
          <Button
            variant="outline"
            onClick={() => setView('schedule-visit')}
            className="w-full h-12 sm:h-14 border-royal/30 dark:border-[#60A5FA]/30 text-royal dark:text-[#60A5FA] hover:bg-royal/5 dark:hover:bg-[#60A5FA]/10 rounded-xl text-sm sm:text-base font-semibold cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Schedule a Visit
          </Button>
        </div>
      </div>
    </div>
  );
}
