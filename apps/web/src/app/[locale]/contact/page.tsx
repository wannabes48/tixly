import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-brand-navy mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have a question about your order, listing tickets, or navigating the platform? Our dedicated support team is here to help 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-2xl font-bold text-brand-navy mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</h4>
                    <p className="text-brand-navy font-medium text-lg">+1 (800) 555-TIXL</p>
                    <p className="text-sm text-slate-500 mt-1">Available 24/7 for urgent ticket issues</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-navy/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-navy" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</h4>
                    <p className="text-brand-navy font-medium text-lg">support@tixly.com</p>
                    <p className="text-sm text-slate-500 mt-1">We aim to respond within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Office</h4>
                    <p className="text-brand-navy font-medium text-lg">123 Stadium Way, Suite 400</p>
                    <p className="text-brand-navy font-medium text-lg">New York, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-navy/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-navy" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Hours</h4>
                    <p className="text-brand-navy font-medium text-lg">Always Open</p>
                    <p className="text-sm text-slate-500 mt-1">During the tournament, we operate around the clock.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
              <h2 className="text-3xl font-bold text-brand-navy mb-8">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-brand-navy">First Name</label>
                    <Input id="firstName" placeholder="Jane" className="h-12 bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-brand-navy">Last Name</label>
                    <Input id="lastName" placeholder="Doe" className="h-12 bg-slate-50 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-brand-navy">Email Address</label>
                  <Input id="email" type="email" placeholder="jane@example.com" className="h-12 bg-slate-50 border-slate-200" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="orderNumber" className="text-sm font-medium text-brand-navy">Order Number (Optional)</label>
                  <Input id="orderNumber" placeholder="e.g. TXL-12345678" className="h-12 bg-slate-50 border-slate-200" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-brand-navy">How can we help?</label>
                  <Textarea id="message" placeholder="Please provide as much detail as possible..." className="min-h-[160px] bg-slate-50 border-slate-200 resize-none" />
                </div>

                <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white h-14 text-lg font-semibold rounded-xl">
                  Send Message
                </Button>
                <p className="text-xs text-slate-500 text-center mt-4">
                  By submitting this form, you agree to our Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
