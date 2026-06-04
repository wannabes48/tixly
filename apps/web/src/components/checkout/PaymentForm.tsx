'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Turnstile } from '@marsidev/react-turnstile';
import { Lock } from 'lucide-react';

export function PaymentForm({ 
  total, 
  buyerName,
  buyerEmail,
  buyerPhone,
  onSuccess, 
  onBack 
}: { 
  total: number,
  buyerName: string,
  buyerEmail: string,
  buyerPhone: string,
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
        let msg = stripeError.message ?? 'An error occurred processing your payment.';
        if (msg.toLowerCase().includes('test')) {
          msg = 'Your payment could not be processed at this time. Please try another card or contact support.';
        }
        setError(msg);
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
        <PaymentElement options={{ 
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              name: buyerName,
              email: buyerEmail,
              phone: buyerPhone,
            }
          }
        }} />
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex flex-col gap-3">
          <p>{error}</p>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 px-4 rounded-lg transition-colors w-fit text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
            Contact WhatsApp Support
          </a>
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
