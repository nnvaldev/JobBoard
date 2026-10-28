'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JOB_STATUS_LABELS, JobStatus } from '@jobboard/shared';
import { Plus } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import type { Job } from '@/lib/types';

export default function EmployerJobsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'EMPLOYER') {
      router.replace('/dashboard');
      return;
    }
    apiFetch<Job[]>('/jobs/mine')
      .then(setJobs)
      .catch((e) => {
        if (e.message?.includes('compañía')) {
          setError('Primero crea el perfil de tu compañía.');
        } else {
          setError(e.message);
        }
      })
      .finally(() => setBusy(false));
  }, [user, loading, router]);

  if (loading || busy) return <p className="text-slate-600">Cargando ofertas...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Mis ofertas</h1>
          <p className="mt-1 text-slate-600">Crea, publica y revisa postulantes</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>
            <Plus className="h-4 w-4" />
            Nueva oferta
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          {error}{' '}
          <Link href="/dashboard/company" className="font-medium underline">
            Ir a compañía
          </Link>
        </div>
      )}

      {!error && jobs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-600">
          No tienes ofertas todavía.
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/dashboard/jobs/${job.id}`}
            className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">{job.title}</h2>
                <p className="text-sm text-slate-600">
                  {job.location} · {job._count?.applications ?? 0} postulaciones
                </p>
              </div>
              <Badge status={job.status}>
                {JOB_STATUS_LABELS[job.status as JobStatus]}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
