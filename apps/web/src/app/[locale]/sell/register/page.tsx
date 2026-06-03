'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Landmark, UploadCloud, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from '@/navigation';

export default function SellRegisterPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleConnectStripe = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/connect', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to connect Stripe');
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 max-w-lg">
        <Card className="rounded-3xl border-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-brand-navy">Become a Verified Seller</CardTitle>
            <CardDescription className="text-base">
              Join thousands of fans safely selling their World Cup 2026 tickets on Tixly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Landmark className="w-5 h-5 text-brand-midblue mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-brand-navy">Secure Payouts</h4>
                  <p className="text-xs text-slate-500">Get paid directly to your bank account after the event.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-midblue mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-brand-navy">Fraud Protection</h4>
                  <p className="text-xs text-slate-500">We verify all buyers to protect you from chargebacks.</p>
                </div>
              </div>
            </div>
            <Button 
              className="w-full bg-brand-navy hover:bg-brand-midblue text-white rounded-xl py-6"
              onClick={() => signIn(undefined, { callbackUrl: '/en/sell/register' })}
            >
              Sign In to Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-navy mb-2">Seller Onboarding</h1>
        <p className="text-slate-600">Complete these final steps to activate your seller account.</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Account (Completed) */}
        <Card className="rounded-2xl border-green-100 bg-green-50/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy">Account Created</h3>
                <p className="text-sm text-slate-500">Signed in as {session?.user?.email}</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-bold">✓ Done</span>
          </CardContent>
        </Card>

        {/* Step 2: Stripe Connect */}
        <Card className="rounded-2xl border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange"></div>
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy text-lg mb-1">Verify Identity & Link Bank</h3>
                <p className="text-sm text-slate-600 max-w-md">
                  We use Stripe to verify your identity (KYC) and link your bank account to ensure you receive payouts securely.
                </p>
              </div>
            </div>
            <Button 
              className="shrink-0 rounded-xl bg-brand-orange hover:bg-orange-600 text-white shadow-md font-bold px-6"
              onClick={handleConnectStripe}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Set up Payouts
            </Button>
          </CardContent>
        </Card>

        <div className="text-center pt-8">
          <p className="text-sm text-slate-400 mb-4 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" /> By proceeding, you agree to our Seller Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
