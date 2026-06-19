'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function GuestCheckoutForm({ listingId, qty, sessionId }: { listingId: string, qty: number, sessionId: string }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleContinue = () => {
    setIsTransitioning(true);
    const params = new URLSearchParams({
      qty: qty.toString(),
      fn: firstName,
      ln: lastName,
      em: email,
      sid: sessionId
    });
    router.push(`/checkout/${listingId}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
          <input 
            type="text" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isTransitioning}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-tixNavy disabled:opacity-50" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
          <input 
            type="text" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isTransitioning}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-tixNavy disabled:opacity-50" 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isTransitioning}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-tixNavy disabled:opacity-50" 
        />
        <p className="text-xs text-gray-400 mt-1">Your tickets will be transferred to this email.</p>
      </div>
      <button 
        onClick={handleContinue}
        disabled={!firstName || !lastName || !email || isTransitioning}
        className="w-full bg-tixOrange hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-3.5 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
      >
        {isTransitioning ? (
          <><svg className="animate-spin h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</>
        ) : (
          'Continue to Payment →'
        )}
      </button>
    </div>
  );
}
