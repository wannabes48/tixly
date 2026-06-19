'use client';

import React from 'react';
import { Link, usePathname } from '@/navigation';
import { LayoutDashboard, ShoppingCart, ListChecks, Users, Package, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Listings', href: '/admin/listings', icon: ListChecks },
    { name: 'Sellers', href: '/admin/sellers', icon: Users },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Users & Holds', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-16">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-brand-navy text-white shrink-0 shadow-xl z-10 md:sticky md:top-16 md:h-[calc(100vh-64px)] flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-black tracking-tight text-white/90">Admin Console</h2>
          <p className="text-brand-paleblue text-xs mt-1">Platform Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-brand-orange text-white font-bold shadow-md' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all text-red-400 hover:bg-white/10 hover:text-red-300 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
