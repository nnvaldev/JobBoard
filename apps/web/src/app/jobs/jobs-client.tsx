'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/field';
import { apiFetch } from '@/lib/api';
import type { PaginatedJobs } from '@/lib/types';

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<PaginatedJobs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [seniority, setSeniority] = useState(searchParams.get('seniority') || '');
  const [isRemote, setIsRemote] = useState(searchParams.get('isRemote') || '');
  const page = Number(searchParams.get('page') || '1');

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.get('q')) params.set('q', searchParams.get('q')!);
    if (searchParams.get('location')) params.set('location', searchParams.get('location')!);
    if (searchParams.get('type')) params.set('type', searchParams.get('type')!);
    if (searchParams.get('seniority')) params.set('seniority', searchParams.get('seniority')!);
    if (searchParams.get('isRemote')) params.set('isRemote', searchParams.get('isRemote')!);
    params.set('page', String(page));
    params.set('limit', '9');

    setLoading(true);
    setError('');
    apiFetch<PaginatedJobs>(`/jobs?${params.toString()}`, { auth: false })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [searchParams, page]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (seniority) params.set('seniority', seniority);
    if (isRemote) params.set('isRemote', isRemote);
    params.set('page', '1');
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm md:p-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold md:text-4xl">
          Ofertas de empleo
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
          Explora vacantes publicadas por empresas. Combina búsqueda por texto con
          filtros de ubicación, tipo de contrato, seniority y modalidad remota.
        </p>
      </div>

      <form
        onSubmit={applyFilters}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm md:grid-cols-6 md:p-6"
      >
        <div className="md:col-span-2">
          <Label htmlFor="q">Buscar</Label>
          <Input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="React, Nest, Full Stack..."
          />
        </div>
        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Buenos Aires, Remoto..."
          />
        </div>
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Todos</option>
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
            <option value="">Todos</option>
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid</option>
            <option value="SENIOR">Senior</option>
            <option value="LEAD">Lead</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="remote">Remoto</Label>
          <Select id="remote" value={isRemote} onChange={(e) => setIsRemote(e.target.value)}>
            <option value="">Todos</option>
            <option value="true">Solo remoto</option>
            <option value="false">Presencial</option>
          </Select>
        </div>
        <div className="md:col-span-6">
          <Button type="submit">Aplicar filtros</Button>
        </div>
      </form>

      {loading && <p className="text-slate-600">Cargando ofertas...</p>}
      {error && <p className="text-red-700">{error}</p>}
      {!loading && data && data.items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-600">
          No hay ofertas con esos filtros.
        </div>
      )}
      {!loading && data && data.items.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Página {data.meta.page} de {data.meta.totalPages} · {data.meta.total} resultados
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', String(page - 1));
                  router.push(`/jobs?${params.toString()}`);
                }}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={page >= data.meta.totalPages}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', String(page + 1));
                  router.push(`/jobs?${params.toString()}`);
                }}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
