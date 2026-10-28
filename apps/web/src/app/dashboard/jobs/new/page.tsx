'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/field';
import { apiFetch } from '@/lib/api';
import type { Job } from '@/lib/types';

export default function NewJobPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('FULL_TIME');
  const [seniority, setSeniority] = useState('MID');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [isRemote, setIsRemote] = useState(true);
  const [status, setStatus] = useState('DRAFT');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login');
    else if (user.role !== 'EMPLOYER') router.replace('/dashboard');
  }, [user, loading, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const job = await apiFetch<Job>('/jobs', {
        method: 'POST',
        body: {
          title,
          description,
          location,
          type,
          seniority,
          salaryMin: salaryMin ? Number(salaryMin) : undefined,
          salaryMax: salaryMax ? Number(salaryMax) : undefined,
          isRemote,
          status,
        },
      });
      router.push(`/dashboard/jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-600">Cargando...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Nueva oferta</h1>
        <p className="mt-1 text-slate-600">Puedes guardarla como borrador o publicarla</p>
      </div>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            required
            minLength={20}
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
            </Select>
          </div>
          <div>
            <Label htmlFor="salaryMin">Salario mín (USD)</Label>
            <Input
              id="salaryMin"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="salaryMax">Salario máx (USD)</Label>
            <Input
              id="salaryMax"
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isRemote}
            onChange={(e) => setIsRemote(e.target.checked)}
          />
          Trabajo remoto
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Creando...' : 'Crear oferta'}
        </Button>
      </form>
    </div>
  );
}
