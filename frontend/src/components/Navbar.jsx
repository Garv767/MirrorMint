'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-border-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-brand-blue p-1 rounded">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-lg text-text-main tracking-tight">MirrorMint</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className="px-3 py-1.5 rounded-md text-sm font-medium text-brand-blue bg-brand-blue/5 flex items-center gap-2"
            >
              <LayoutDashboard size={16} />
              Console
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-text-main leading-none">
              {user?.email.split('@')[0]}
            </span>
            <div className="flex items-center gap-1 mt-1">
              {user?.role === 'admin' ? (
                <span className="text-[10px] font-bold uppercase bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <ShieldCheck size={10} />
                  Administrator
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase bg-gray-100 text-text-secondary px-1.5 py-0.5 rounded">
                  Regular User
                </span>
              )}
            </div>
          </div>
          
          <div className="h-8 w-[1px] bg-border-light" />
          
          <button
            onClick={logout}
            className="p-2 text-text-secondary hover:text-brand-blue hover:bg-bg-surface rounded-full transition-all"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
