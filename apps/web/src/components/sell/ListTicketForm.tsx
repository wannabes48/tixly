'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CldUploadWidget } from 'next-cloudinary';
import { Loader2, UploadCloud, CheckCircle2, Ticket } from 'lucide-react';
import Image from 'next/image';

const schema = z.object({
  matchId: z.string().min(1, "Please select a match"),
  category: z.enum(["CAT1", "CAT2", "CAT3", "CAT4", "ACCESSIBILITY"]),
  section: z.string().optional(),
  row: z.string().optional(),
  quantity: z.number().min(1).max(10),
  pricePerTicket: z.number().min(50).max(10000),
  deliveryMethod: z.enum(["PDF_UPLOAD", "DELIVER_72H", "FIFA_APP"]),
  ticketFileUrl: z.string().optional(),
  notes: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export default function ListTicketForm({ matches }: { matches: any[] }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1, deliveryMethod: "DELIVER_72H", category: "CAT2" }
  });

  const price = watch('pricePerTicket') || 0;
  const deliveryMethod = watch('deliveryMethod');
  const ticketFileUrl = watch('ticketFileUrl');

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        router.push('/en/sell/dashboard');
      } else {
        alert(result.error || 'Something went wrong');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95">
            <h2 className="text-2xl font-bold text-brand-navy">1. Select Match</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Which match are you selling tickets for?</label>
              <Controller
                control={control}
                name="matchId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-14 bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select a match..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {matches.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          Match {m.matchNumber} : {m.homeTeam} vs {m.awayTeam} — {new Date(m.date).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.matchId && <p className="text-red-500 text-sm mt-1">{errors.matchId.message}</p>}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="button" onClick={() => setStep(2)} className="bg-brand-navy hover:bg-slate-800 text-white rounded-xl px-8 h-12">Next Step</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-brand-navy">2. Ticket Details & Pricing</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAT1">Category 1 (Premium)</SelectItem>
                        <SelectItem value="CAT2">Category 2</SelectItem>
                        <SelectItem value="CAT3">Category 3</SelectItem>
                        <SelectItem value="CAT4">Category 4</SelectItem>
                        <SelectItem value="ACCESSIBILITY">Accessibility</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                <Input type="number" {...register('quantity', { valueAsNumber: true })} className="bg-slate-50 border-slate-200" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Section / Block (Optional)</label>
                <Input {...register('section')} placeholder="e.g. 104" className="bg-slate-50 border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Row (Optional)</label>
                <Input {...register('row')} placeholder="e.g. 12" className="bg-slate-50 border-slate-200" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price per Ticket (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                <Input type="number" {...register('pricePerTicket', { valueAsNumber: true })} className="pl-8 bg-slate-50 border-slate-200 h-14 text-lg font-bold" />
              </div>
              <div className="mt-3 bg-brand-paleblue rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-brand-navy">You will receive (after 10% seller fee):</span>
                <span className="text-lg font-bold text-brand-navy">${(price * 0.9).toFixed(2)} / ticket</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-xl px-8 h-12">Back</Button>
              <Button type="button" onClick={() => setStep(3)} className="bg-brand-navy hover:bg-slate-800 text-white rounded-xl px-8 h-12">Next Step</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-brand-navy">3. Delivery Method</h2>
            
            <div className="space-y-3">
              {[
                { id: "DELIVER_72H", title: "Deliver Later", desc: "I will upload the ticket or transfer it within 72 hours of the event." },
                { id: "PDF_UPLOAD", title: "Upload PDF Now", desc: "Instant delivery. Buyers prefer this and your listing gets a boost." },
                { id: "FIFA_APP", title: "FIFA Ticketing App Transfer", desc: "I will transfer the tickets directly to the buyer's phone." }
              ].map(method => (
                <label key={method.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${deliveryMethod === method.id ? 'border-brand-orange bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" value={method.id} {...register("deliveryMethod")} className="mt-1 text-brand-orange focus:ring-brand-orange" />
                  <div className="ml-3">
                    <div className="font-bold text-brand-navy">{method.title}</div>
                    <div className="text-sm text-slate-500">{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {deliveryMethod === "PDF_UPLOAD" && (
              <div className="mt-6 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
                <CldUploadWidget 
                  uploadPreset="tixly_tickets" 
                  onSuccess={(result: any) => setValue("ticketFileUrl", result.info.secure_url)}
                >
                  {({ open }) => (
                    ticketFileUrl ? (
                      <div className="text-green-600 flex flex-col items-center">
                        <CheckCircle2 className="w-12 h-12 mb-2" />
                        <span className="font-bold">Ticket uploaded successfully!</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center cursor-pointer" onClick={() => open()}>
                        <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                        <span className="font-bold text-brand-navy">Click to upload your PDF tickets</span>
                        <span className="text-sm text-slate-500 mt-1">Files must be original PDFs downloaded from FIFA.</span>
                      </div>
                    )
                  )}
                </CldUploadWidget>
                {errors.ticketFileUrl && <p className="text-red-500 text-sm mt-2">{errors.ticketFileUrl.message}</p>}
              </div>
            )}

            <div className="flex justify-between pt-8 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="rounded-xl px-8 h-12" disabled={loading}>Back</Button>
              <Button type="submit" className="bg-brand-orange hover:bg-orange-600 text-white rounded-xl px-8 h-12 shadow-md" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Ticket className="w-5 h-5 mr-2" />}
                Publish Listing
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
