'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Turnstile } from '@marsidev/react-turnstile';
import { Lock } from 'lucide-react';

export function PaymentForm({ 
  total, 
  onSuccess, 
  onBack 
}: { 
  total: number, 
  onSuccess: () => void, 
  onBack: () => void 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !turnstileToken) {
      if (!turnstileToken) {
        setError('Please complete the security check.');
      }
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Verify turnstile token on our server
      const verifyRes = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setError('Security check failed. Please refresh and try again.');
        setIsProcessing(false);
        return;
      }
      
      // 2. Confirm payment with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // Required by some payment methods, but we handle redirect: 'if_required' below
        },
        redirect: 'if_required' // Prevents full page reload if not required (e.g., standard cards without 3DS)
      });

      if (stripeError) {
        setError(stripeError.message ?? 'An error occurred processing your payment.');
      } else {
        // Payment succeeded
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-8">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center mb-6 min-h-[65px]">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setError('Bot check failed. Please try again.')}
          options={{ theme: 'light' }}
        />
      </div>

      <div className="flex gap-3">
        <button 
          type="button" 
          onClick={onBack} 
          disabled={isProcessing} 
          className="px-5 py-3.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || !turnstileToken || isProcessing}
          className="flex-1 bg-brand-orange hover:bg-orange-600 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-bold text-lg transition-all duration-200 shadow-md shadow-orange-100 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <><Lock size={18} /> Pay ${total.toFixed(2)}</>
          )}
        </button>
      </div>
    </form>
  );
}
