'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role === 'EMPLOYER') router.replace('/dashboard/jobs');
    else router.replace('/dashboard/applications');
  }, [user, loading, router]);

  return <p className="text-slate-600">Redirigiendo al panel...</p>;
}
