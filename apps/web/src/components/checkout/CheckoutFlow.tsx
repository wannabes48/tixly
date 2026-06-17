'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ShieldCheck, Lock, CreditCard, CheckCircle2, ChevronDown,
  User, Mail, Phone, Globe, AlertCircle, Ticket, MapPin, Calendar, Download, DownloadCloud, Timer
} from 'lucide-react';
import { Link } from '@/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceReceipt } from './InvoiceReceipt';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from './PaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface TicketHolder { firstName: string; lastName: string }

interface BuyerDetails {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirm: string;
  dialCode: string;
  phone: string;
  country: string;
  createAccount: boolean;
  holders: TicketHolder[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICE_FEE_PCT = 0.10;
const PROTECTION_FEE_PCT = 0.08;

const getFlag = (cc: string) => String.fromCodePoint(...cc.toUpperCase().split('').map(c => c.charCodeAt(0) + 127397));

const DIAL_CODES = [
  { code: '+1',   flag: getFlag('US'), label: 'US/CA' },
  { code: '+44',  flag: getFlag('GB'), label: 'UK' },
  { code: '+49',  flag: getFlag('DE'), label: 'DE' },
  { code: '+33',  flag: getFlag('FR'), label: 'FR' },
  { code: '+34',  flag: getFlag('ES'), label: 'ES' },
  { code: '+39',  flag: getFlag('IT'), label: 'IT' },
  { code: '+31',  flag: getFlag('NL'), label: 'NL' },
  { code: '+55',  flag: getFlag('BR'), label: 'BR' },
  { code: '+54',  flag: getFlag('AR'), label: 'AR' },
  { code: '+52',  flag: getFlag('MX'), label: 'MX' },
  { code: '+81',  flag: getFlag('JP'), label: 'JP' },
  { code: '+82',  flag: getFlag('KR'), label: 'KR' },
  { code: '+966', flag: getFlag('SA'), label: 'SAU' },
  { code: '+212', flag: getFlag('MA'), label: 'MAR' },
  { code: '+234', flag: getFlag('NG'), label: 'NGA' },
  { code: '+221', flag: getFlag('SN'), label: 'SEN' },
  { code: '+27',  flag: getFlag('ZA'), label: 'ZAF' },
  { code: '+61',  flag: getFlag('AU'), label: 'AUS' },
  { code: '+64',  flag: getFlag('NZ'), label: 'NZL' },
  { code: '+91',  flag: getFlag('IN'), label: 'IND' },
  { code: '+86',  flag: getFlag('CN'), label: 'CHN' },
  { code: '+7',   flag: getFlag('RU'), label: 'RUS' },
  { code: '+380', flag: getFlag('UA'), label: 'UKR' },
  { code: '+48',  flag: getFlag('PL'), label: 'POL' },
  { code: '+46',  flag: getFlag('SE'), label: 'SWE' },
  { code: '+47',  flag: getFlag('NO'), label: 'NOR' },
  { code: '+45',  flag: getFlag('DK'), label: 'DNK' },
  { code: '+32',  flag: getFlag('BE'), label: 'BEL' },
  { code: '+41',  flag: getFlag('CH'), label: 'CHE' },
  { code: '+351', flag: getFlag('PT'), label: 'PRT' },
  { code: '+20',  flag: getFlag('EG'), label: 'EGY' },
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Mexico', 'Germany', 'France',
  'Spain', 'Italy', 'Netherlands', 'Portugal', 'Belgium', 'Switzerland',
  'Sweden', 'Norway', 'Denmark', 'Poland', 'Brazil', 'Argentina', 'Colombia',
  'Ecuador', 'Uruguay', 'Morocco', 'Nigeria', 'Senegal', 'South Africa',
  'Egypt', 'Japan', 'South Korea', 'Saudi Arabia', 'Australia', 'New Zealand',
  'India', 'China', 'Russia', 'Ukraine', 'Croatia', 'Denmark', 'Other',
];

const CATEGORY_LABELS: Record<string, string> = {
  CAT1: 'Category 1 – Premium Central',
  CAT2: 'Category 2 – Excellent View',
  CAT3: 'Category 3 – Behind Goal',
  CAT4: 'Category 4 – Budget',
  ACCESSIBILITY: 'Accessibility',
};

// ─── Step Progress Bar ────────────────────────────────────────────────────────

const STEPS: { key: Step; label: string }[] = [
  { key: 'QUANTITY', label: 'Tickets' },
  { key: 'DETAILS', label: 'Details' },
  { key: 'PROTECTION', label: 'Protection' },
  { key: 'PAYMENT', label: 'Payment' },
];

function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 mb-6">
      <div className="flex items-center">
        {STEPS.map((s, i) => {
          const done = current === 'CONFIRMATION' || i < idx;
          const active = i === idx && current !== 'CONFIRMATION';
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${done ? 'bg-green-500 text-white' : active ? 'bg-tixOrange text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-xs mt-1 font-semibold whitespace-nowrap
                  ${done ? 'text-green-600' : active ? 'text-tixOrange' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-4 bg-gray-200 rounded">
                  <div className={`h-full rounded transition-all duration-500 ${done ? 'bg-green-500 w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

function OrderSummary({
  listing, quantity, refundProtection,
}: {
  listing: ListingData;
  quantity: number;
  refundProtection: boolean;
}) {
  const subtotal = quantity * listing.pricePerTicket;
  const serviceFee = subtotal * SERVICE_FEE_PCT;
  const protectionFee = refundProtection ? subtotal * PROTECTION_FEE_PCT : 0;
  const total = subtotal + serviceFee + protectionFee;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
      <h3 className="text-lg font-bold text-tixNavy mb-5 flex items-center gap-2">
        <Ticket size={18} className="text-tixOrange" /> Order Summary
      </h3>

      {/* Match info */}
      <div className="mb-5 pb-5 border-b border-gray-100">
        <p className="font-bold text-tixNavy text-base leading-snug mb-1">{listing.matchName}</p>
        <p className="text-gray-500 text-sm flex items-center gap-1 mb-1">
          <Calendar size={13} /> {listing.dateStr}
        </p>
        <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
          <MapPin size={13} /> {listing.stadiumName}
        </p>
        <div className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2 text-sm">
          <span className="text-gray-600">{listing.section ? `Section ${listing.section}` : 'General'}{listing.row ? `, Row ${listing.row}` : ''}</span>
          <span className="text-tixOrange font-bold text-xs bg-orange-100 px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[listing.category] ? listing.category : listing.category}
          </span>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2.5 text-sm mb-5 pb-5 border-b border-gray-100">
        <div className="flex justify-between text-gray-600">
          <span>{quantity} × ticket{quantity > 1 ? 's' : ''} @ ${listing.pricePerTicket.toFixed(2)}</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            Booking fee <span className="text-xs text-gray-400">(10%)</span>
          </span>
          <span className="font-medium">${serviceFee.toFixed(2)}</span>
        </div>
        {refundProtection && (
          <div className="flex justify-between text-amber-600">
            <span>Refund Protection</span>
            <span className="font-medium">${protectionFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-green-600">
          <span>Delivery</span>
          <span className="font-semibold">Free</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <span className="font-bold text-tixNavy text-base">Total</span>
        <span className="text-2xl font-extrabold text-tixNavy">${total.toFixed(2)}</span>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2 text-xs text-gray-600 mb-3">
        <ShieldCheck size={15} className="text-green-600 flex-shrink-0 mt-0.5" />
        <span>Protected by <strong>Tixly Protect™</strong>. 100% money-back if tickets are not delivered.</span>
      </div>
      <p className="text-center text-xs text-gray-400">All prices in USD • No hidden fees</p>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />{error}
        </p>
      )}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full border ${err ? 'border-red-400 bg-red-50' : 'border-gray-200'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-tixOrange focus:border-transparent transition-colors placeholder-gray-400`;

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckoutFlow({ 
  listing, 
  initialData 
}: { 
  listing: ListingData, 
  initialData?: { qty: number, firstName: string, lastName: string, email: string } 
}) {
  const [step, setStep] = useState<Step>(initialData?.qty ? 'DETAILS' : 'QUANTITY');
  const [quantity, setQuantity] = useState(initialData?.qty || 1);
  const [refundProtection, setRefundProtection] = useState(true);
  const [orderRef] = useState(() => 'TIX-2026-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  const [buyer, setBuyer] = useState<BuyerDetails>({
    firstName: initialData?.firstName || '', 
    lastName: initialData?.lastName || '', 
    email: initialData?.email || '', 
    emailConfirm: initialData?.email || '',
    dialCode: '+1', phone: '', country: '', createAccount: false,
    holders: Array.from({ length: initialData?.qty || 1 }, () => ({ firstName: '', lastName: '' })),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BuyerDetails | string, string>>>({});
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  // 10-minute countdown timer
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (step === 'CONFIRMATION') return;
    
    if (timeLeft <= 0) {
      alert("Your reservation time has expired. Please try booking again.");
      window.history.back();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const subtotal = quantity * listing.pricePerTicket;
  const serviceFee = subtotal * SERVICE_FEE_PCT;
  const protectionFee = refundProtection ? subtotal * PROTECTION_FEE_PCT : 0;
  const total = subtotal + serviceFee + protectionFee;

  // Sync holders array length when quantity changes
  const updateQuantity = useCallback((q: number) => {
    setQuantity(q);
    setBuyer(prev => ({
      ...prev,
      holders: Array.from({ length: q }, (_, i) => prev.holders[i] ?? { firstName: '', lastName: '' }),
    }));
  }, []);

  const goTo = (s: Step) => {
    setStep(s);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.documentElement.scrollTo({ top: 0, behavior: 'auto' });
      document.body.scrollTo({ top: 0, behavior: 'auto' });
      const topEl = document.getElementById('checkout-top');
      if (topEl) topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // ── Validate Details form ──────────────────────────────────────────────────
  const validateDetails = (): boolean => {
    const errs: typeof errors = {};
    if (!buyer.firstName.trim()) errs.firstName = 'Required';
    if (!buyer.lastName.trim()) errs.lastName = 'Required';
    if (!buyer.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) errs.email = 'Enter a valid email';
    if (!buyer.emailConfirm.trim()) errs.emailConfirm = 'Required';
    else if (buyer.email !== buyer.emailConfirm) errs.emailConfirm = 'Emails do not match';
    if (!buyer.phone.trim()) errs.phone = 'Required';
    else if (!/^\d{6,15}$/.test(buyer.phone.replace(/[\s\-()]/g, ''))) errs.phone = 'Enter a valid phone number';
    if (!buyer.country) errs.country = 'Required';
    buyer.holders.forEach((h, i) => {
      if (!h.firstName.trim()) errs[`holder_${i}_first`] = 'Required';
      if (!h.lastName.trim()) errs[`holder_${i}_last`] = 'Required';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const ticketRef = useRef<HTMLDivElement>(null);

  const [homeTeamName, awayTeamName] = listing.matchName.split(' vs ');
  const mockMatch = {
    homeTeam: { name: homeTeamName?.trim() || 'Home', code: homeTeamName?.trim()?.substring(0, 2).toUpperCase() || 'XX' },
    awayTeam: { name: awayTeamName?.trim() || 'Away', code: awayTeamName?.trim()?.substring(0, 2).toUpperCase() || 'YY' },
    stadium: { name: listing.stadiumName, city: '' },
    date: new Date(listing.dateStr)
  };

  const downloadPDF = async () => {
    const element = ticketRef.current;
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Tixly_Invoice_${orderRef}.pdf`);
    } catch (e) {
      console.error("PDF generation failed", e);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) goTo('PROTECTION');
  };

  const handleProceedToPayment = async () => {
    setIsCreatingIntent(true);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, quantity, refundProtection, buyerInfo: buyer }),
      });
      const data = await res.json();
      if (res.ok) {
        setClientSecret(data.clientSecret);
        goTo('PAYMENT');
      } else {
        let errMessage = data.error || "Unknown error";
        alert("Payment initialization failed: " + errMessage);
      }
    } catch (e) {
      console.error("Failed to init payment:", e);
      alert("Network error. Please try again.");
    }
    setIsCreatingIntent(false);
  };

  const availableQuantities = Array.from(
    { length: Math.min(listing.quantityAvailable, 8) }, (_, i) => i + 1
  );

  return (
    <div id="checkout-top" className="flex flex-col lg:flex-row gap-8 items-start">
      {/* ── Main Panel ──────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[60%]">
        {step !== 'CONFIRMATION' && (
          <div className="bg-orange-50 border border-orange-200 text-tixOrange px-4 py-3 rounded-xl mb-6 flex items-center justify-between font-medium shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <Timer size={16} />
              Tickets reserved
            </div>
            <div className="font-mono font-bold text-lg tracking-wider">{formatTime(timeLeft)}</div>
          </div>
        )}

        {step !== 'CONFIRMATION' && <StepBar current={step} />}

        {/* ── STEP 1: Quantity ──────────────────────────────────────────────── */}
        {step === 'QUANTITY' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-tixNavy mb-2">Select Your Tickets</h2>
            <p className="text-gray-500 text-sm mb-8">Choose how many tickets you need. Prices update instantly.</p>

            {/* Quantity selector */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-0.5">Number of tickets</p>
                  <p className="text-xs text-gray-500">{listing.quantityAvailable} available</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => quantity > 1 && updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border-2 border-tixOrange text-tixOrange font-bold text-xl flex items-center justify-center disabled:opacity-30 hover:bg-tixOrange hover:text-white transition-colors"
                  >−</button>
                  <span className="w-10 text-center text-2xl font-extrabold text-tixNavy">{quantity}</span>
                  <button
                    onClick={() => quantity < Math.min(listing.quantityAvailable, 8) && updateQuantity(quantity + 1)}
                    disabled={quantity >= Math.min(listing.quantityAvailable, 8)}
                    className="w-10 h-10 rounded-full border-2 border-tixOrange text-tixOrange font-bold text-xl flex items-center justify-center disabled:opacity-30 hover:bg-tixOrange hover:text-white transition-colors"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Live price breakdown */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 mb-8 overflow-hidden">
              <div className="flex justify-between px-5 py-3 text-sm text-gray-600">
                <span>{quantity} × ${listing.pricePerTicket.toFixed(2)}/ticket</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-5 py-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">Booking fee <span className="text-xs bg-gray-200 text-gray-500 px-1.5 rounded-full">10%</span></span>
                <span className="font-semibold">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between px-5 py-3 text-sm text-green-600">
                <span>Delivery</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between px-5 py-4 bg-tixNavy text-white">
                <span className="font-bold">Estimated Total</span>
                <span className="text-xl font-extrabold">${(subtotal + serviceFee).toFixed(2)}</span>
              </div>
            </div>

            <div className="text-xs text-gray-400 flex items-start gap-2 mb-8">
              <ShieldCheck size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
              No hidden charges. The booking fee covers buyer protection and secure delivery. You will see the exact total before paying.
            </div>

            <button
              onClick={() => {
                const btn = document.getElementById('continue-btn');
                if (btn) btn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...';
                
                // Ensure scroll is visible on mobile by scrolling a bit higher
                setTimeout(() => {
                  goTo('DETAILS');
                  window.scrollTo({ top: 0, behavior: 'auto' });
                  document.documentElement.scrollTo({ top: 0, behavior: 'auto' });
                  document.body.scrollTo({ top: 0, behavior: 'auto' });
                }, 500);
              }}
              id="continue-btn"
              className="w-full bg-tixOrange hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-md shadow-orange-100 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 flex items-center justify-center"
            >
              Continue to Checkout →
            </button>
          </div>
        )}

        {/* ── STEP 2: Buyer Details ─────────────────────────────────────────── */}
        {step === 'DETAILS' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-tixNavy mb-1">Your Details</h2>
            <p className="text-gray-500 text-sm mb-8 flex items-center gap-1.5">
              <Lock size={13} className="text-green-600" />
              No account needed — we'll email your tickets directly.
            </p>

            <form onSubmit={handleDetailsSubmit} noValidate className="space-y-5">

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" error={errors.firstName} required>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" placeholder="John"
                      value={buyer.firstName}
                      onChange={e => setBuyer(p => ({ ...p, firstName: e.target.value }))}
                      className={`${inputCls(errors.firstName)} pl-9`}
                    />
                  </div>
                </Field>
                <Field label="Last Name" error={errors.lastName} required>
                  <input
                    type="text" placeholder="Smith"
                    value={buyer.lastName}
                    onChange={e => setBuyer(p => ({ ...p, lastName: e.target.value }))}
                    className={inputCls(errors.lastName)}
                  />
                </Field>
              </div>

              {/* Email */}
              <Field label="Email Address" error={errors.email} required>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email" placeholder="john.smith@example.com"
                    value={buyer.email}
                    onChange={e => setBuyer(p => ({ ...p, email: e.target.value }))}
                    className={`${inputCls(errors.email)} pl-9`}
                    autoComplete="email"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Your tickets will be sent here. Double-check it's correct.</p>
              </Field>

              {/* Confirm Email */}
              <Field label="Confirm Email Address" error={errors.emailConfirm} required>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email" placeholder="Repeat your email"
                    value={buyer.emailConfirm}
                    onChange={e => setBuyer(p => ({ ...p, emailConfirm: e.target.value }))}
                    className={`${inputCls(errors.emailConfirm)} pl-9`}
                    autoComplete="off"
                    onPaste={e => e.preventDefault()}
                  />
                </div>
              </Field>

              {/* Phone */}
              <Field label="Phone Number" error={errors.phone} required>
                <div className="flex gap-2">
                  <div className="relative">
                    <Select value={buyer.dialCode} onValueChange={val => setBuyer(p => ({ ...p, dialCode: val }))}>
                      <SelectTrigger className="w-[100px] bg-white border-gray-200 h-[46px] rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIAL_CODES.map(d => (
                          <SelectItem key={d.code + d.label} value={d.code}>
                            {d.flag} {d.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative flex-1">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel" placeholder="612 345 6789"
                      value={buyer.phone}
                      onChange={e => setBuyer(p => ({ ...p, phone: e.target.value }))}
                      className={`${inputCls(errors.phone)} pl-9`}
                    />
                  </div>
                </div>
              </Field>

              {/* Country */}
              <Field label="Country of Residence" error={errors.country} required>
                <div className="relative mt-1">
                  <Select value={buyer.country} onValueChange={val => setBuyer(p => ({ ...p, country: val }))}>
                    <SelectTrigger className={inputCls(errors.country)}>
                      <SelectValue placeholder="Select your country…" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <p className="mt-1 text-xs text-gray-400">Used for VAT/tax compliance only.</p>
              </Field>

              {/* Ticket Holder Details */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-base font-bold text-tixNavy mb-1">Ticket Holder Details</h3>
                <p className="text-xs text-gray-500 mb-5">
                  Stadium security requires the legal name of each attendee as it appears on their ID.
                </p>
                <div className="space-y-4">
                  {buyer.holders.map((holder, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-tixNavy flex items-center gap-1.5">
                          <Ticket size={13} className="text-tixOrange" />
                          Ticket #{i + 1}
                          {i === 0 && <span className="text-xs text-gray-400 font-normal ml-1 hidden sm:inline">(can be same as buyer)</span>}
                        </p>
                        {i === 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const h = [...buyer.holders];
                              h[0] = { ...h[0], firstName: buyer.firstName, lastName: buyer.lastName };
                              setBuyer(p => ({ ...p, holders: h }));
                            }}
                            className="text-xs font-bold text-tixNavy hover:text-tixNavy bg-blue-50 hover:bg-blue-100 transition-colors px-2 py-1 rounded-md flex items-center gap-1.5"
                          >
                            <User size={12} />
                            Use my details
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text" placeholder="First Name"
                            value={holder.firstName}
                            onChange={e => {
                              const h = [...buyer.holders];
                              h[i] = { ...h[i], firstName: e.target.value };
                              setBuyer(p => ({ ...p, holders: h }));
                            }}
                            className={inputCls(errors[`holder_${i}_first`])}
                          />
                          {errors[`holder_${i}_first`] && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={11} />Required</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text" placeholder="Last Name"
                            value={holder.lastName}
                            onChange={e => {
                              const h = [...buyer.holders];
                              h[i] = { ...h[i], lastName: e.target.value };
                              setBuyer(p => ({ ...p, holders: h }));
                            }}
                            className={inputCls(errors[`holder_${i}_last`])}
                          />
                          {errors[`holder_${i}_last`] && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={11} />Required</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional: Create Account */}
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                <input
                  type="checkbox"
                  checked={buyer.createAccount}
                  onChange={e => setBuyer(p => ({ ...p, createAccount: e.target.checked }))}
                  className="mt-0.5 accent-tixOrange"
                />
                <div>
                  <p className="text-sm font-semibold text-tixNavy">Create a Tixly account <span className="text-xs font-normal text-gray-500">(optional)</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">Track your order, contact the seller, and list tickets — all in one place.</p>
                </div>
              </label>

              {/* Nav buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => goTo('QUANTITY')}
                  className="px-5 py-3.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                  ← Back
                </button>
                <button type="submit"
                  className="flex-1 bg-tixOrange hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-md shadow-orange-100 hover:shadow-lg hover:-translate-y-0.5">
                  Continue to Protection →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: Refund Protection ─────────────────────────────────────── */}
        {step === 'PROTECTION' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-tixNavy mb-1">Protect Your Purchase</h2>
            <p className="text-gray-500 text-sm mb-8">Life is unpredictable. Be covered if you can't make the game.</p>

            {/* Yes — protected */}
            <div
              onClick={() => setRefundProtection(true)}
              className={`border-2 rounded-xl p-5 mb-4 cursor-pointer transition-all duration-200 ${refundProtection ? 'border-tixOrange bg-orange-50 shadow-md shadow-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/40'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${refundProtection ? 'border-tixOrange' : 'border-gray-300'}`}>
                  {refundProtection && <div className="w-2.5 h-2.5 bg-tixOrange rounded-full" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-tixNavy">Yes, Add Protection for +{(PROTECTION_FEE_PCT * 100).toFixed(0)}%</p>
                    <span className="font-bold text-tixOrange">${(subtotal * PROTECTION_FEE_PCT).toFixed(2)}</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />Cancel-for-any-reason coverage</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />Medical emergency cover</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />Travel disruption protection</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* No — unprotected */}
            <div
              onClick={() => setRefundProtection(false)}
              className={`border-2 rounded-xl p-5 mb-8 cursor-pointer transition-all duration-200 ${!refundProtection ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${!refundProtection ? 'border-gray-500' : 'border-gray-300'}`}>
                  {!refundProtection && <div className="w-2.5 h-2.5 bg-gray-500 rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-gray-700">No Thanks, Continue</p>
                  <p className="text-sm text-gray-500 mt-1">I understand all sales are final. No refunds under any circumstances.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => goTo('DETAILS')} className="px-5 py-3.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                ← Back
              </button>
              <button onClick={handleProceedToPayment} disabled={isCreatingIntent}
                className="flex-1 bg-tixOrange hover:bg-orange-600 disabled:bg-orange-400 text-white py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-md shadow-orange-100 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                {isCreatingIntent ? (
                  <><svg className="animate-spin h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Preparing Payment...</>
                ) : (
                  <><CreditCard size={18} /> Proceed to Payment →</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Payment ───────────────────────────────────────────────── */}
        {step === 'PAYMENT' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-tixNavy mb-6">Secure Payment</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Lock size={18} className="text-tixNavy flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-tixNavy text-sm">256-bit SSL Encrypted Checkout</p>
                <p className="text-xs text-gray-500 mt-0.5">Your payment is processed by Stripe. Tixly never stores your card details.</p>
              </div>
            </div>

            {/* Accepted payment methods */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">We accept</p>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map(m => (
                  <span key={m} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600">{m}</span>
                ))}
              </div>
            </div>

            {/* Buyer Details Summary Box */}
            <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Billing Details</p>
                <p className="text-sm font-bold text-tixNavy">{buyer.firstName} {buyer.lastName}</p>
                <p className="text-sm text-gray-600">{buyer.email}</p>
                <p className="text-sm text-gray-600">{buyer.dialCode} {buyer.phone}</p>
              </div>
              <button 
                onClick={() => goTo('DETAILS')} 
                className="text-tixOrange hover:text-orange-600 bg-orange-50 hover:bg-orange-100 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                Edit
              </button>
            </div>

            {clientSecret ? (
              stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <PaymentForm 
                    total={total} 
                    buyerName={`${buyer.firstName} ${buyer.lastName}`.trim()}
                    buyerEmail={buyer.email}
                    buyerPhone={`${buyer.dialCode} ${buyer.phone}`.trim()}
                    onSuccess={() => goTo('CONFIRMATION')} 
                    onBack={() => goTo('PROTECTION')} 
                  />
                </Elements>
              ) : (
                <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center font-medium border border-red-200">
                  <p>Stripe API Key is missing.</p>
                  <p className="text-sm mt-2">Please ensure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your .env and you have restarted the Next.js dev server.</p>
                </div>
              )
            ) : (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tixOrange"></div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 5: Confirmation ─────────────────────────────────────────── */}
        {step === 'CONFIRMATION' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={44} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-tixNavy mb-2">You're Going!</h2>
            <p className="text-gray-500 text-sm mb-1">Order confirmed for</p>
            <p className="text-lg font-bold text-tixNavy mb-4">{listing.matchName}</p>
            
            <div className="inline-block bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 mb-6 shadow-inner">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Order Reference</p>
              <p className="font-mono font-bold text-tixNavy text-2xl tracking-widest">{orderRef}</p>
            </div>

            {/* Order Summary Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-left mb-6 max-w-md mx-auto shadow-sm">
              <div className="flex justify-between border-b pb-2 mb-2">
                <span className="text-sm text-gray-500">Tickets</span>
                <span className="text-sm font-bold">{quantity}x {listing.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Paid</span>
                <span className="text-sm font-black text-tixOrange">${(listing.pricePerTicket * quantity * (refundProtection ? 1.18 : 1.10)).toFixed(2)}</span>
              </div>
            </div>

            {/* Email Message */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left mb-6 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <Mail className="text-tixNavy mt-0.5 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-tixNavy text-sm">Tickets are on the way</h3>
                  <p className="text-sm text-gray-600 mt-1">Your tickets will be emailed to <strong>{buyer.email || 'your email'}</strong> within 24–48 hours.</p>
                </div>
              </div>
            </div>

            {/* PDF Button */}
            <div className="mb-6 flex justify-center">
              <button 
                onClick={downloadPDF}
                className="inline-flex items-center justify-center gap-2 bg-tixNavy hover:bg-blue-900 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg w-full max-w-md"
              >
                <DownloadCloud size={20} /> Download Payment Invoice
              </button>
            </div>

            {/* Hidden Invoice Receipt for PDF */}
            <div className="absolute -left-[9999px]">
              <InvoiceReceipt 
                ref={ticketRef} 
                orderRef={orderRef}
                buyerName={buyer.holders[0]?.firstName ? `${buyer.holders[0].firstName} ${buyer.holders[0].lastName}` : 'Guest Buyer'}
                buyerEmail={buyer.email || 'guest@example.com'}
                matchName={listing.matchName}
                category={listing.category}
                quantity={quantity}
                pricePerTicket={listing.pricePerTicket}
                totalPaid={listing.pricePerTicket * quantity * (refundProtection ? 1.18 : 1.10)}
                date={listing.dateStr}
              />
            </div>

            {/* Soft Upsell */}
            {!buyer.createAccount && (
              <div className="mb-6 p-5 bg-orange-50 border border-orange-100 rounded-xl max-w-md mx-auto text-left">
                <div className="flex items-start gap-3">
                  <User className="text-tixOrange mt-0.5 shrink-0" size={20} />
                  <div>
                    <h3 className="font-bold text-tixNavy text-sm">Want to track this order?</h3>
                    <p className="text-xs text-gray-600 mt-1 mb-3">Create a free account using your email to easily manage your tickets.</p>
                    <a href="/api/auth/signin" className="inline-block text-center text-xs font-bold text-tixOrange bg-white border border-orange-200 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors">
                      Create Account
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
              <ShieldCheck size={16} className="text-green-500" />
              <span className="text-xs font-medium">This order is protected by <strong>Tixly Protect</strong></span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-gray-100">
              <Link href="/" className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[40%]">
        <OrderSummary listing={listing} quantity={quantity} refundProtection={refundProtection} />
      </div>
    </div>
  );
}
