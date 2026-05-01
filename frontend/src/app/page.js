'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex-1 flex items-center justify-center bg-bg-surface">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={40} className="text-brand-blue animate-spin" />
        <h1 className="text-xl font-semibold text-text-main">MirrorMint</h1>
      </div>
    </div>
  );
}
