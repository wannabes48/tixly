'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/navigation';
import { X, User, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Automatically assign ADMIN role if the email contains "admin" (for demo purposes)
    const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'SELLER';
    
    signIn('credentials', { 
      email, 
      role, 
      callbackUrl 
    });
  };

  return (
    <main className="min-h-screen bg-slate-900/60 flex items-center justify-center p-4">
      {/* Absolute overlay clicking which routes back to home */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => router.push('/')} 
      />

      <div className="relative z-10 w-full max-w-[850px] bg-white rounded-xl shadow-2xl flex overflow-hidden min-h-[600px] animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={() => router.push('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Left Panel - Brand Graphic */}
        <div className="hidden md:block w-[40%] bg-brand-navy relative overflow-hidden">
          {/* Abstract Geometric Shapes matching the reference style */}
          <div className="absolute top-[-10%] left-[-10%] w-[150%] h-[150%]">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-midblue/20 rotate-45 transform skew-x-12" />
            <div className="absolute top-2/3 left-1/3 w-24 h-24 bg-brand-orange/20 rotate-12 transform -skew-y-12" />
            <div className="absolute top-1/2 left-3/4 w-40 h-40 bg-white/5 -rotate-12 transform skew-x-12" />
            <div className="absolute top-[80%] left-[20%] w-16 h-16 bg-white/10 rotate-45" />
            <div className="absolute top-[15%] left-[60%] w-20 h-20 bg-brand-orange/10 -rotate-45" />
            
            {/* Some larger background color blocks to give the multi-tone effect */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-black/10 transform skew-x-[20deg] origin-top-right" />
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-brand-midblue/10 transform -skew-y-[10deg] origin-bottom-left" />
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full md:w-[60%] p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-[400px] mx-auto w-full">
            <h2 className="text-[28px] font-bold text-center text-brand-navy mb-8">
              Log In or Sign Up
            </h2>

            <div className="space-y-4">
              {/* Google Button */}
              <button 
                onClick={() => signIn('google', { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors bg-white rounded-md py-3.5 px-4"
              >
                {/* Google "G" logo */}
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-bold text-gray-700 text-[15px]">Continue with Google</span>
              </button>

              {/* Facebook Button */}
              <button className="w-full bg-[#1877F2] hover:bg-[#166fe5] transition-colors text-white font-bold py-3.5 px-4 rounded-md text-[15px]">
                Continue with Facebook
              </button>

              {/* Guest Order Tracking Button */}
              <button className="w-full bg-[#F5F6F8] hover:bg-[#EBECEE] transition-colors text-gray-800 font-bold py-3.5 px-4 rounded-md border border-gray-100 text-[15px]">
                Guest Order Tracking
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-8">
              <hr className="flex-1 border-gray-200" />
              <span className="mx-4 text-gray-400 text-sm font-medium">or</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Email Form */}
            <form className="space-y-4" onSubmit={handleEmailSignIn}>
              <div className="relative">
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  className="peer pe-10 border-gray-300 focus-visible:ring-brand-orange focus-visible:border-brand-orange h-[50px] rounded-md text-[15px]"
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-4 text-gray-400 peer-disabled:opacity-50">
                  <Mail size={20} strokeWidth={2} aria-hidden="true" />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-orange hover:bg-orange-600 transition-colors text-white font-bold py-3.5 px-4 rounded-md text-[15px]"
              >
                Continue
              </button>
            </form>

            {/* Disclaimer Footer */}
            <div className="mt-8 text-center">
              <p className="text-[11px] leading-relaxed text-gray-800 font-bold max-w-[320px] mx-auto">
                This site is protected by reCAPTCHA and the Google{' '}
                <Link href="/legal/privacy" className="underline decoration-gray-400 underline-offset-2">Privacy Policy</Link> and{' '}
                <Link href="/legal/terms" className="underline decoration-gray-400 underline-offset-2">Terms of Service</Link> apply.
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
