import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    question: "Are tickets guaranteed to be authentic?",
    answer: "Yes. Every transaction on Tixly is backed by our 100% Buyer Guarantee. We meticulously verify all sellers and use secure transfer methods to ensure the tickets you receive are authentic and valid for entry."
  },
  {
    question: "When will I receive my tickets?",
    answer: "Ticket delivery times vary depending on the seller and the tournament's official ticketing timeline. Most digital tickets are transferred within 48 hours of purchase, and all tickets are guaranteed to arrive in time for the match."
  },
  {
    question: "What happens if a match is cancelled or postponed?",
    answer: "If a match is cancelled and not rescheduled, you will receive a full refund. If a match is postponed, your tickets will automatically be valid for the new date. You can also choose to relist them on Tixly if you can no longer attend."
  },
  {
    question: "How do I sell my tickets on Tixly?",
    answer: "Simply create an account, click 'Sell', and follow the prompts to list your tickets. You'll need to provide ticket details and pricing. Once a buyer purchases your tickets, we'll guide you through the secure transfer process."
  },
  {
    question: "When do I get paid for tickets I sell?",
    answer: "To protect both buyers and sellers, payouts are processed 5-8 business days after the event has taken place. This ensures the buyer successfully attended the event using your tickets."
  },
  {
    question: "Can I transfer tickets directly to a friend?",
    answer: "Yes, once you receive the digital tickets in your official ticketing app, you can usually transfer them to anyone via their email address or phone number, depending on the tournament's ticketing platform rules."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-orange/10 mb-6">
            <MessageCircleQuestion className="w-10 h-10 text-brand-orange" />
          </div>
          <h1 className="text-5xl font-extrabold text-brand-navy mb-6 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-600">
            Everything you need to know about buying and selling World Cup 2026 tickets.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200 py-4">
                <AccordionTrigger className="text-left text-xl font-semibold text-brand-navy hover:text-brand-orange transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-lg text-slate-600 leading-relaxed pt-4 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg text-slate-600">
            Still have questions? We're here to help.
          </p>
          <a href="/contact" className="inline-block mt-4 text-brand-orange font-semibold text-lg hover:underline">
            Contact Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
