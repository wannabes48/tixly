'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';

interface Props {
  stadiumName: string;
  seatingChartUrl?: string | null;
}

export default function StadiumChartModal({ stadiumName, seatingChartUrl }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="block w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-brand-navy text-sm font-bold text-center transition-colors mb-3 border border-gray-200"
        >
          View Stadium Layout
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-brand-navy">{stadiumName} Seating Chart</DialogTitle>
          <DialogDescription className="hidden">View the interactive seating chart for {stadiumName}</DialogDescription>
        </DialogHeader>
        <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden">
          {seatingChartUrl ? (
            <Image 
              src={seatingChartUrl} 
              alt={`${stadiumName} seating chart`} 
              fill 
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          ) : (
            <div className="text-center p-6">
              <p className="text-brand-midblue font-bold mb-2">Interactive Seating Chart goes here</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Once you upload the high-resolution stadium charts to Cloudinary, they will appear here dynamically.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
