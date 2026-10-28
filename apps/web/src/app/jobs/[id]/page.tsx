'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
  JOB_SENIORITY_LABELS,
  JOB_TYPE_LABELS,
  JobSeniority,
  JobType,
} from '@jobboard/shared';
import { MapPin, Wifi } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label, Textarea } from '@/components/ui/field';
import { apiFetch } from '@/lib/api';
import type { Job } from '@/lib/types';
import { formatSalary } from '@/lib/utils';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Job>(`/jobs/${id}`, { auth: false })
      .then(setJob)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push(`/login?next=/jobs/${id}`);
      return;
    }
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await apiFetch(`/jobs/${id}/applications`, {
        method: 'POST',
        body: { coverLetter },
      });
      setMessage('Postulación enviada correctamente');
      setCoverLetter('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al postular');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-slate-600">Cargando oferta...</p>;
  if (!job) return <p className="text-red-700">{error || 'Oferta no encontrada'}</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-teal-800">{job.company.name}</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
          {job.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>
            <MapPin className="mr-1 h-3 w-3" />
            {job.location}
          </Badge>
          {job.isRemote && (
            <Badge>
              <Wifi className="mr-1 h-3 w-3" />
              Remoto
            </Badge>
          )}
          <Badge>{JOB_TYPE_LABELS[job.type as JobType]}</Badge>
          <Badge>{JOB_SENIORITY_LABELS[job.seniority as JobSeniority]}</Badge>
        </div>
        <p className="mt-4 text-lg font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</p>
        <div className="prose prose-slate mt-6 max-w-none whitespace-pre-wrap text-slate-700">
          {job.description}
        </div>
        {job.company.description && (
          <div className="mt-8 rounded-xl bg-slate-50 p-4">
            <h2 className="font-semibold">Sobre la empresa</h2>
            <p className="mt-2 text-sm text-slate-600">{job.company.description}</p>
            {job.company.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-teal-800 hover:underline"
              >
                Sitio web
              </a>
            )}
          </div>
        )}
      </article>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">Postularse</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Cuéntale a la empresa por qué encajas en el rol. Una buena carta suele
          mencionar stack, experiencia relevante y disponibilidad.
        </p>
        {user?.role === 'EMPLOYER' ? (
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            Estás en una cuenta de empresa. Usa una cuenta de candidato para postularte.
          </p>
        ) : (
          <form onSubmit={apply} className="mt-5 space-y-3">
            <div>
              <Label htmlFor="cover">Carta de presentación</Label>
              <Textarea
                id="cover"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Hola, soy [nombre]. Tengo experiencia en... Me interesa este rol porque..."
              />
            </div>
            {message && <p className="text-sm text-emerald-700">{message}</p>}
            {error && <p className="text-sm text-red-700">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Enviando...' : user ? 'Enviar postulación' : 'Entrar para postular'}
            </Button>
          </form>
        )}
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Estados posibles:{' '}
          {Object.values(ApplicationStatus)
            .map((s) => APPLICATION_STATUS_LABELS[s])
            .join(', ')}
        </p>
      </aside>
    </div>
  );
}
