'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
  JOB_STATUS_LABELS,
  JobStatus,
} from '@jobboard/shared';
import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/field';
import { apiFetch } from '@/lib/api';
import type { Application, Job } from '@/lib/types';

export default function ManageJobPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('FULL_TIME');
  const [seniority, setSeniority] = useState('MID');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [status, setStatus] = useState('DRAFT');

  async function load() {
    const [jobData, appData] = await Promise.all([
      apiFetch<Job>(`/jobs/${id}/manage`),
      apiFetch<Application[]>(`/jobs/${id}/applications`),
    ]);
    setJob(jobData);
    setApps(appData);
    setTitle(jobData.title);
    setDescription(jobData.description);
    setLocation(jobData.location);
    setType(jobData.type);
    setSeniority(jobData.seniority);
    setSalaryMin(jobData.salaryMin?.toString() || '');
    setSalaryMax(jobData.salaryMax?.toString() || '');
    setIsRemote(jobData.isRemote);
    setStatus(jobData.status);
  }

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
    load()
      .catch((e) => setError(e.message))
      .finally(() => setBusy(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router, id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await apiFetch(`/jobs/${id}`, {
        method: 'PATCH',
        body: {
          title,
          description,
          location,
          type,
          seniority,
          salaryMin: salaryMin ? Number(salaryMin) : null,
          salaryMax: salaryMax ? Number(salaryMax) : null,
          isRemote,
          status,
        },
      });
      setMessage('Oferta actualizada');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function updateAppStatus(appId: string, nextStatus: string) {
    try {
      await apiFetch(`/applications/${appId}/status`, {
        method: 'PATCH',
        body: { status: nextStatus },
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado');
    }
  }

  async function removeJob() {
    if (!confirm('¿Eliminar esta oferta?')) return;
    await apiFetch(`/jobs/${id}`, { method: 'DELETE' });
    router.push('/dashboard/jobs');
  }

  if (loading || busy) return <p className="text-slate-600">Cargando oferta...</p>;
  if (!job) return <p className="text-red-700">{error || 'Oferta no encontrada'}</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">{job.title}</h1>
          <div className="mt-2">
            <Badge status={job.status}>
              {JOB_STATUS_LABELS[job.status as JobStatus]}
            </Badge>
          </div>
        </div>
        <Button variant="danger" onClick={removeJob}>
          Eliminar
        </Button>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="font-semibold">Editar oferta</h2>
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="FULL_TIME">Tiempo completo</option>
              <option value="PART_TIME">Medio tiempo</option>
              <option value="CONTRACT">Contrato</option>
              <option value="INTERNSHIP">Pasantía</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="seniority">Seniority</Label>
            <Select
              id="seniority"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
            >
              <option value="JUNIOR">Junior</option>
              <option value="MID">Mid</option>
              <option value="SENIOR">Senior</option>
              <option value="LEAD">Lead</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicada</option>
              <option value="CLOSED">Cerrada</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="salaryMin">Salario mín</Label>
            <Input
              id="salaryMin"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="salaryMax">Salario máx</Label>
            <Input
              id="salaryMax"
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isRemote}
            onChange={(e) => setIsRemote(e.target.checked)}
          />
          Remoto
        </label>
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Postulantes ({apps.length})
        </h2>
        {apps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-slate-600">
            Todavía no hay postulaciones.
          </div>
        ) : (
          apps.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{app.candidate?.name}</p>
                  <p className="text-sm text-slate-600">{app.candidate?.email}</p>
                </div>
                <Badge status={app.status}>
                  {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
                </Badge>
              </div>
              {app.coverLetter && (
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  {app.coverLetter}
                </p>
              )}
              <div className="mt-3">
                <Label htmlFor={`status-${app.id}`}>Cambiar estado</Label>
                <Select
                  id={`status-${app.id}`}
                  value={app.status}
                  onChange={(e) => updateAppStatus(app.id, e.target.value)}
                >
                  {Object.values(ApplicationStatus).map((s) => (
                    <option key={s} value={s}>
                      {APPLICATION_STATUS_LABELS[s]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
