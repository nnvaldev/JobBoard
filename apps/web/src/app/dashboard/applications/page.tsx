'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
} from '@jobboard/shared';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import type { Application } from '@/lib/types';

export default function ApplicationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Application[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'CANDIDATE') {
      router.replace('/dashboard');
      return;
    }
    apiFetch<Application[]>('/applications/me')
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setBusy(false));
  }, [user, loading, router]);

  if (loading || busy) return <p className="text-slate-600">Cargando postulaciones...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Mis postulaciones</h1>
        <p className="mt-1 text-slate-600">Seguimiento del estado de cada aplicación</p>
      </div>
      {error && <p className="text-red-700">{error}</p>}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
          <p className="text-slate-600">Aún no te postulaste a ninguna oferta.</p>
          <Link href="/jobs" className="mt-3 inline-block text-teal-800 hover:underline">
            Ver ofertas
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/jobs/${app.job?.id}`}
                    className="font-[family-name:var(--font-display)] text-xl hover:text-teal-800"
                  >
                    {app.job?.title}
                  </Link>
                  <p className="text-sm text-slate-600">{app.job?.company.name}</p>
                </div>
                <Badge status={app.status}>
                  {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Enviada el{' '}
                {format(new Date(app.createdAt), "d 'de' MMMM yyyy", { locale: es })}
              </p>
              {app.coverLetter && (
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  {app.coverLetter}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
