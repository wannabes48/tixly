import React from 'react';
import { Link } from '@/navigation';

export default function SellLandingPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Turn your extra tickets into <span className="text-brand-orange">cash</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-slate-300 max-w-3xl mx-auto font-light">
            Join thousands of fans selling tickets securely on Tixly. No hidden fees, instant payouts, and guaranteed buyer protection.
          </p>
          <a 
            href="/api/auth/signin?callbackUrl=/en/sell/list"
            className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold text-lg py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Start Selling Now
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-brand-navy mb-16">Why sell with Tixly?</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Benefit 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 text-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">100% Secure</h3>
              <p className="text-slate-600">
                Our platform ensures your tickets and money are safe. We handle the transfer securely.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Fast Payouts</h3>
              <p className="text-slate-600">
                Get paid straight to your bank account soon after the event takes place.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Maximum Reach</h3>
              <p className="text-slate-600">
                List your tickets once and reach thousands of verified football fans instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl bg-brand-navy rounded-[2rem] p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-orange rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to list your tickets?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto relative z-10">
            It takes less than 2 minutes to create a listing. Join the community and help other fans experience the magic of the World Cup.
          </p>
          <a 
            href="/api/auth/signin?callbackUrl=/en/sell/list"
            className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold text-lg py-4 px-10 rounded-2xl transition-all shadow-lg relative z-10"
          >
            Start Selling
          </a>
        </div>
      </section>
    </div>
  );
}
