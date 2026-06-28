'use client';

import React from 'react';
import { SessionNavBar } from '@/components/ui/sidebar';

export default function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-16">
      
      <SessionNavBar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto pl-14 transition-all duration-200">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
