'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2 } from 'lucide-react';
import { Link } from '@/navigation';

type Step = 'QUANTITY' | 'DETAILS' | 'PROTECTION' | 'PAYMENT' | 'CONFIRMATION';

interface ListingData {
  id: string;
  pricePerTicket: number;
  quantityAvailable: number;
  section: string | null;
  row: string | null;
  category: string;
  matchName: string;
  dateStr: string;
  stadiumName: string;
}

export function CheckoutFlow({ listing }: { listing: ListingData }) {
  const [step, setStep] = useState<Step>('QUANTITY');
  const [quantity, setQuantity] = useState(1);
  const [refundProtection, setRefundProtection] = useState(true);
  
  const serviceFeePercent = 0.10;
  const subtotal = quantity * listing.pricePerTicket;
  const serviceFee = subtotal * serviceFeePercent;
  const protectionFee = refundProtection ? (subtotal * 0.08) : 0;
  const total = subtotal + serviceFee + protectionFee;

  const handleNext = (nextStep: Step) => {
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  const availableQuantities = Array.from({ length: Math.min(listing.quantityAvailable, 8) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Main Checkout Area */}
      <div className="w-full md:w-2/3">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between text-sm font-medium text-gray-500">
            <span className={step === 'QUANTITY' ? 'text-brand-orange' : 'text-green-600'}>1. Tickets</span>
            <div className="h-0.5 flex-1 bg-gray-200 mx-4">
              <div className={`h-full ${step !== 'QUANTITY' ? 'bg-green-500' : ''}`}></div>
            </div>
            <span className={step === 'DETAILS' ? 'text-brand-orange' : (step === 'PROTECTION' || step === 'PAYMENT' || step === 'CONFIRMATION' ? 'text-green-600' : '')}>2. Details</span>
            <div className="h-0.5 flex-1 bg-gray-200 mx-4">
              <div className={`h-full ${step === 'PROTECTION' || step === 'PAYMENT' || step === 'CONFIRMATION' ? 'bg-green-500' : ''}`}></div>
            </div>
            <span className={step === 'PAYMENT' || step === 'PROTECTION' ? 'text-brand-orange' : (step === 'CONFIRMATION' ? 'text-green-600' : '')}>3. Payment</span>
          </div>
        </div>

        {/* Steps */}
        {step === 'QUANTITY' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Select Quantity</h2>
            <div className="flex items-center justify-between p-4 border border-brand-orange rounded-lg mb-8 bg-orange-50">
              <span className="font-semibold text-brand-navy">Number of tickets:</span>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-brand-orange text-brand-navy rounded px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                {availableQuantities.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => handleNext('DETAILS')}
              className="w-full bg-brand-orange hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm"
            >
              Continue to details
            </button>
          </div>
        )}

        {step === 'DETAILS' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Guest Checkout</h2>
            <p className="text-gray-600 mb-8">No account needed. Just tell us where to send your tickets.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext('PROTECTION'); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-midblue focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-midblue focus:border-transparent" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input required type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-midblue focus:border-transparent" />
                <p className="text-xs text-gray-500 mt-2">We will send your mobile tickets to this email.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Email</label>
                <input required type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-midblue focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input required type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-midblue focus:border-transparent" />
              </div>

              {/* Ticket Holders Loop */}
              <div className="pt-6 border-t border-gray-200 mt-8">
                <h3 className="text-lg font-bold text-brand-navy mb-4">Ticket Holder Details</h3>
                <p className="text-sm text-gray-600 mb-6">Security requires the names of all attendees.</p>
                
                {Array.from({ length: quantity }).map((_, i) => (
                  <div key={i} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-brand-navy mb-4">Ticket #{i + 1}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input required placeholder="First Name" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                      <input required placeholder="Last Name" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => handleNext('QUANTITY')}
                  className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-brand-orange hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm"
                >
                  Continue to payment
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'PROTECTION' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-brand-navy mb-2">Protect your purchase</h2>
            <p className="text-gray-600 mb-8">Things happen. Be covered if you can't make it to the game.</p>
            
            <div 
              className={`border-2 rounded-xl p-6 mb-4 cursor-pointer transition-colors ${refundProtection ? 'border-brand-orange bg-orange-50' : 'border-gray-200 hover:border-brand-orange/50'}`}
              onClick={() => setRefundProtection(true)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${refundProtection ? 'border-brand-orange' : 'border-gray-300'}`}>
                    {refundProtection && <div className="w-3 h-3 bg-brand-orange rounded-full"></div>}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy text-lg">Yes, protect my tickets</h3>
                    <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
                      <li>100% refund for covered reasons (illness, travel delays, etc)</li>
                      <li>Hassle-free online claims process</li>
                      <li>Funds returned within 5 business days</li>
                    </ul>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-brand-navy block">${(subtotal * 0.08).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div 
              className={`border-2 rounded-xl p-6 mb-8 cursor-pointer transition-colors ${!refundProtection ? 'border-gray-500 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setRefundProtection(false)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${!refundProtection ? 'border-gray-500' : 'border-gray-300'}`}>
                  {!refundProtection && <div className="w-3 h-3 bg-gray-500 rounded-full"></div>}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">No, I will take the risk</h3>
                  <p className="text-sm text-gray-500 mt-1">I understand all sales are final and non-refundable.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => handleNext('DETAILS')}
                className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => handleNext('PAYMENT')}
                className="flex-1 bg-brand-orange hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm flex items-center justify-center"
              >
                <CreditCard className="mr-2" /> Proceed to payment
              </button>
            </div>
          </div>
        )}

        {step === 'PAYMENT' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Payment Method</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start">
              <Lock className="text-brand-midblue mt-1 mr-3 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-brand-midblue">Secure Checkout</h4>
                <p className="text-sm text-blue-800 mt-1">Your payment information is encrypted and securely processed by Stripe. Tixly does not store your credit card details.</p>
              </div>
            </div>
            
            {/* Stripe Element Placeholder */}
            <div className="border border-gray-300 rounded-lg p-8 mb-8 bg-gray-50 flex items-center justify-center h-48">
              <div className="text-center text-gray-500">
                <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">Stripe Payment Element goes here</p>
                <p className="text-sm">Requires API keys and server-side PaymentIntent creation</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => handleNext('PROTECTION')}
                className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => handleNext('CONFIRMATION')}
                className="flex-1 bg-brand-midblue hover:bg-blue-800 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-sm"
              >
                Pay ${total.toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {step === 'CONFIRMATION' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-extrabold text-brand-navy mb-2">Order Confirmed!</h2>
            <p className="text-xl text-gray-600 mb-8">Reference: <span className="font-mono font-bold text-brand-navy">TIX-2026-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></p>
            
            <div className="bg-gray-50 rounded-lg p-6 text-left mb-8 max-w-md mx-auto">
              <h3 className="font-bold text-gray-900 mb-4">What happens next?</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>We've sent a confirmation email to you.</li>
                <li>The seller will transfer the tickets to your email.</li>
                <li>You'll receive an email from the official ticketing app to claim them.</li>
              </ol>
            </div>
            
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Want to manage your tickets easily?</h3>
              <p className="text-gray-600 mb-6">Create a free account using your email to view order status, contact sellers, and list your own tickets.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/" className="px-8 py-3 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Return to Home
                </Link>
                <button className="bg-brand-navy hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="w-full md:w-1/3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
          <h3 className="text-xl font-bold text-brand-navy mb-6">Order Summary</h3>
          
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="font-bold text-lg mb-1">{listing.matchName}</div>
            <div className="text-gray-600 text-sm mb-4">{listing.dateStr} &bull; {listing.stadiumName}</div>
            
            <div className="flex justify-between items-center text-sm font-medium bg-gray-50 p-3 rounded">
              <span>{listing.section ? `Section ${listing.section}, ` : ''}{listing.row ? `Row ${listing.row}` : 'General Admission'}</span>
              <span className="text-brand-orange bg-orange-100 px-2 py-0.5 rounded">{listing.category}</span>
            </div>
          </div>

          <div className="space-y-3 text-gray-600 text-sm mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between">
              <span>Ticket Price ({quantity}x)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee (10%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            {refundProtection && (
              <div className="flex justify-between text-brand-orange">
                <span>Refund Protection</span>
                <span>${protectionFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-brand-navy">Total</span>
            <span className="text-2xl font-extrabold text-brand-navy">${total.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 mb-4 bg-green-50 p-3 rounded-lg border border-green-100">
            <ShieldCheck size={16} className="text-green-600 mr-2 flex-shrink-0" />
            <span>Includes Tixly Protect™ 100% Buyer Guarantee.</span>
          </div>
          
          <div className="text-center text-xs text-gray-400">
            All prices are in USD. By continuing, you agree to our Terms of Use and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
