'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'What is AcreFlow?',
    a: 'AcreFlow is India\'s premier no-brokerage real estate platform connecting property buyers, renters, and sellers directly. We eliminate middlemen to save you money.',
  },
  {
    q: 'How does zero brokerage work?',
    a: 'We connect buyers and sellers directly through our platform. Property owners list their properties for free, and buyers can contact them without paying any brokerage fees.',
  },
  {
    q: 'How are properties verified?',
    a: 'Every listing undergoes our multi-step verification: GPS-tagged photos, RERA ID validation, owner identity verification, and physical document checks.',
  },
  {
    q: 'Can I post my property for free?',
    a: 'Yes! Property listing is completely free on AcreFlow. Simply fill out our multi-step posting wizard with your property details and images.',
  },
  {
    q: 'How do I schedule a property visit?',
    a: "Click 'Contact Seller' on any property listing to connect directly with the owner. You can schedule a visit through our built-in scheduling feature.",
  },
  {
    q: 'What cities does AcreFlow operate in?',
    a: 'We currently operate in 10+ major Indian cities including Chennai, Mumbai, Delhi, Bangalore, Hyderabad, Pune, Kolkata, Ahmedabad, Jaipur, and Lucknow.',
  },
  {
    q: 'Is the EMI calculator accurate?',
    a: 'Our EMI calculator uses standard banking formulas with customizable interest rates and tenure. It provides accurate estimates to help you plan your finances.',
  },
  {
    q: 'How do I report a suspicious listing?',
    a: 'You can report any listing through our support team. We take verification seriously and promptly investigate all reports.',
  },
]

export default function FAQ() {
  return (
    <section className="py-16 bg-cream dark:bg-[#0A192F]">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-navy dark:text-white text-center font-montserrat">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm font-medium text-navy dark:text-white font-montserrat">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-accent dark:text-[#94A3B8] leading-relaxed font-montserrat">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
