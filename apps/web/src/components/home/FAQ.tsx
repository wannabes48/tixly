'use client';
import { useLocale } from "next-intl";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from '@/navigation';

const faqItems = [
  {
    question: 'How does Tixly work?',
    answer:
      'Tixly is a secondary ticket marketplace where verified sellers list World Cup 2026 tickets. Browse matches, select your seats, and complete your purchase — no account required.',
  },
  {
    question: 'Do I need to create an account to buy tickets?',
    answer:
      'No! Tixly supports guest checkout. Simply enter your email at checkout and your tickets will be delivered directly to your inbox.',
  },
  {
    question: 'Are the tickets guaranteed authentic?',
    answer:
      'Yes. Every ticket sold on Tixly is covered by our Tixly Protect™ guarantee. If a ticket is invalid, you receive a full refund or replacement.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All payments are processed securely via Stripe.',
  },
  {
    question: 'When will I receive my tickets?',
    answer:
      'Most tickets are delivered electronically to your email within minutes of purchase. Some physical tickets may ship closer to the event date.',
  },
  {
    question: 'Can I sell my tickets on Tixly?',
    answer:
      'Yes! If you have World Cup 2026 tickets to sell, create a seller account and list them on our marketplace. Competitive fees and fast payouts.',
  },
];

export function FAQ() {
  const locale = useLocale();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white/10 backdrop-blur-md py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-12 h-1 bg-brand-orange rounded-full mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-transparent hover:bg-brand-paleblue mb-3 overflow-hidden transition-colors duration-200"
            >
              <button
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-lg font-bold text-brand-navy pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-brand-orange flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-brand-mutedgrey leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-8 py-3 rounded-xl font-bold transition-colors duration-200 hover:bg-brand-orange"
          >
            See all FAQs →
          </Link>
        </div>
      </div>
    </section>
  );
}
