'use client'

import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UrgencyBanner() {
  return (
    <section className="py-3 bg-navy">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 overflow-hidden">
          <Zap size={18} className="text-amber-400 shrink-0" />
          <p className="text-sm text-white font-medium font-montserrat whitespace-nowrap">
            🎉 Limited Offer: Post your property FREE and get featured for 7
            days!
          </p>
          <Button className="bg-white text-navy rounded-lg px-4 h-8 text-xs font-bold font-montserrat hover:bg-gray-100 shrink-0">
            Post Now
          </Button>
        </div>
      </div>
    </section>
  )
}
